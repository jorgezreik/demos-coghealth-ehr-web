import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PatientBanner } from '../components/patient';
import { 
  FileText, 
  Pill, 
  AlertTriangle, 
  Activity, 
  Calendar,
  Stethoscope,
  RefreshCw,
  Printer,
  Plus,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FlaskConical,
  Heart,
  ClipboardList,
  MessageSquare,
  Phone
} from 'lucide-react';
import type { Patient } from '../types';
import { AlertDialog } from '../components/ui/Modal';
import { PrintDialog } from '../components/ui/PrintDialog';
import { PrescriptionDialog } from '../components/ui/PrescriptionDialog';
import { OrderDialog } from '../components/ui/OrderDialog';
import { logPatientAccess } from '../services/auditService';

const mockPatient: Patient = {
  id: 1,
  mrn: 'MRN001234',
  firstName: 'John',
  middleName: 'Robert',
  lastName: 'Smith',
  dateOfBirth: '1965-03-15',
  gender: 'MALE',
  maritalStatus: 'MARRIED',
  phoneMobile: '(555) 123-4567',
  phoneHome: '(555) 987-6543',
  email: 'john.smith@email.com',
  address: {
    street1: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
  },
  preferredLanguage: 'English',
  active: true,
};

const mockProblems = [
  { id: 1, name: 'Type 2 Diabetes Mellitus', icd10: 'E11.9', status: 'Active', onset: '2018-05-12', priority: 'high' },
  { id: 2, name: 'Essential Hypertension', icd10: 'I10', status: 'Active', onset: '2015-08-20', priority: 'high' },
  { id: 3, name: 'Hyperlipidemia', icd10: 'E78.5', status: 'Active', onset: '2017-03-15', priority: 'medium' },
  { id: 4, name: 'Obesity', icd10: 'E66.9', status: 'Active', onset: '2016-01-10', priority: 'medium' },
  { id: 5, name: 'GERD', icd10: 'K21.0', status: 'Resolved', onset: '2020-03-15', priority: 'low' },
];

const mockMedications = [
  { id: 1, name: 'Metformin HCl ER', dose: '500mg', sig: 'Take 1 tablet by mouth twice daily with meals', status: 'Active', refills: '2/3' },
  { id: 2, name: 'Lisinopril', dose: '10mg', sig: 'Take 1 tablet by mouth once daily in the morning', status: 'Active', refills: '4/5' },
  { id: 3, name: 'Atorvastatin', dose: '20mg', sig: 'Take 1 tablet by mouth at bedtime', status: 'Active', refills: '5/5' },
  { id: 4, name: 'Omeprazole', dose: '20mg', sig: 'Take 1 capsule by mouth once daily before breakfast', status: 'Active', refills: '1/2' },
];

const mockAllergies = [
  { id: 1, allergen: 'Penicillin', reaction: 'Rash, Hives', severity: 'Moderate', type: 'Drug' },
  { id: 2, allergen: 'Sulfa Drugs', reaction: 'Anaphylaxis', severity: 'Severe', type: 'Drug' },
  { id: 3, allergen: 'Shellfish', reaction: 'Hives, Swelling', severity: 'Moderate', type: 'Food' },
];

const mockEncounters = [
  { id: 1, date: '2024-01-10', type: 'Office Visit', provider: 'Dr. Anderson', reason: 'Diabetes follow-up', status: 'Completed' },
  { id: 2, date: '2023-11-15', type: 'Lab Only', provider: 'Lab', reason: 'HbA1c, Lipid Panel', status: 'Completed' },
  { id: 3, date: '2023-09-22', type: 'Office Visit', provider: 'Dr. Anderson', reason: 'Annual Physical', status: 'Completed' },
  { id: 4, date: '2023-06-05', type: 'Telehealth', provider: 'Dr. Anderson', reason: 'Medication review', status: 'Completed' },
];

const mockVitals = {
  date: '2024-01-10',
  bp: '138/88',
  hr: 78,
  temp: 98.4,
  weight: 198,
  height: 70,
  bmi: 28.4,
  spo2: 97,
};

const mockLabs = [
  { id: 1, name: 'HbA1c', value: '7.8%', date: '2024-01-10', status: 'High', ref: '< 7.0%' },
  { id: 2, name: 'eGFR', value: '72', date: '2024-01-10', status: 'Normal', ref: '> 60' },
  { id: 3, name: 'LDL Cholesterol', value: '118', date: '2024-01-10', status: 'High', ref: '< 100' },
  { id: 4, name: 'Creatinine', value: '1.1', date: '2024-01-10', status: 'Normal', ref: '0.7-1.3' },
];

type TabId = 'summary' | 'encounters' | 'medications' | 'problems' | 'allergies' | 'results';

export default function PatientChartPage() {
  const { id: _patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({
    problems: true,
    meds: true,
    allergies: true,
    vitals: true,
    labs: true,
    encounters: true,
  });
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showRxDialog, setShowRxDialog] = useState(false);
  const [showLabDialog, setShowLabDialog] = useState(false);
  const [showAlert, setShowAlert] = useState<{ title: string; message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (mockPatient.id && mockPatient.mrn) {
      logPatientAccess(
        mockPatient.id.toString(),
        mockPatient.mrn,
        `${mockPatient.lastName}, ${mockPatient.firstName}`
      );
    }
  }, []);

  const togglePanel = (panel: string) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const tabs = [
    { id: 'summary' as TabId, label: 'Summary', icon: FileText },
    { id: 'encounters' as TabId, label: 'Encounters', icon: Calendar },
    { id: 'medications' as TabId, label: 'Medications', icon: Pill },
    { id: 'problems' as TabId, label: 'Problems', icon: Stethoscope },
    { id: 'allergies' as TabId, label: 'Allergies', icon: AlertTriangle },
    { id: 'results' as TabId, label: 'Results', icon: Activity },
  ];

  return (
    <div className="h-full flex flex-col" style={{ background: '#d4d0c8' }}>
      <PatientBanner patient={mockPatient} allergies={mockAllergies} />
      
      {/* Toolbar */}
      <div className="ehr-toolbar flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowAlert({ title: 'Refreshed', message: 'Patient chart has been refreshed.', type: 'info' })}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </button>
          <span className="text-gray-400">|</span>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowPrintDialog(true)}>
            <Printer className="w-3.5 h-3.5 mr-1" /> Print
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowAlert({ title: 'New Note', message: 'Clinical note editor would open here.', type: 'info' })}>
            <Plus className="w-3.5 h-3.5 mr-1" /> New Note
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowRxDialog(true)}>
            <Pill className="w-3.5 h-3.5 mr-1" /> e-Prescribe
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowLabDialog(true)}>
            <FlaskConical className="w-3.5 h-3.5 mr-1" /> Order Labs
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowAlert({ title: 'Message', message: 'Patient messaging portal would open here.', type: 'info' })}>
            <MessageSquare className="w-3.5 h-3.5 mr-1" /> Message
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowAlert({ title: 'Call Patient', message: `Initiating call to ${mockPatient.phoneMobile}...`, type: 'info' })}>
            <Phone className="w-3.5 h-3.5 mr-1" /> Call
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="ehr-subheader flex items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`ehr-tab flex items-center ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon className="w-3 h-3 mr-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-2">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-3 gap-2">
            {/* Left Column */}
            <div className="col-span-2 space-y-2">
              {/* Problems */}
              <div className="ehr-panel">
                <div 
                  className="ehr-header flex items-center justify-between cursor-pointer"
                  onClick={() => togglePanel('problems')}
                >
                  <div className="flex items-center">
                    {expandedPanels.problems ? <FolderOpen className="w-3 h-3 mr-1" /> : <Folder className="w-3 h-3 mr-1" />}
                    <Stethoscope className="w-3 h-3 mr-1" /> Active Problems ({mockProblems.filter(p => p.status === 'Active').length})
                  </div>
                  {expandedPanels.problems ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
                {expandedPanels.problems && (
                  <div className="bg-white">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 text-left">Problem</th>
                          <th className="px-2 py-1 text-left w-20">ICD-10</th>
                          <th className="px-2 py-1 text-left w-24">Onset</th>
                          <th className="px-2 py-1 text-left w-16">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockProblems.map((problem, idx) => (
                          <tr key={problem.id} className={idx % 2 === 1 ? 'bg-gray-50' : ''}>
                            <td className="px-2 py-1">
                              <span className={`inline-block w-2 h-2 mr-1 border border-gray-500 ${problem.priority === 'high' ? 'bg-gray-400' : problem.priority === 'medium' ? 'bg-gray-300' : 'bg-gray-200'}`} />
                              {problem.name}
                            </td>
                            <td className="px-2 py-1 font-mono text-[10px]">{problem.icd10}</td>
                            <td className="px-2 py-1">{problem.onset}</td>
                            <td className="px-2 py-1">
                              <span className={`px-1 py-0.5 text-[9px] border border-gray-400 ${problem.status === 'Active' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'}`}>
                                {problem.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Medications */}
              <div className="ehr-panel">
                <div 
                  className="ehr-header flex items-center justify-between cursor-pointer"
                  onClick={() => togglePanel('meds')}
                >
                  <div className="flex items-center">
                    {expandedPanels.meds ? <FolderOpen className="w-3 h-3 mr-1" /> : <Folder className="w-3 h-3 mr-1" />}
                    <Pill className="w-3 h-3 mr-1" /> Active Medications ({mockMedications.length})
                  </div>
                  {expandedPanels.meds ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
                {expandedPanels.meds && (
                  <div className="bg-white">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 text-left">Medication</th>
                          <th className="px-2 py-1 text-left">Sig</th>
                          <th className="px-2 py-1 text-left w-16">Refills</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockMedications.map((med, idx) => (
                          <tr key={med.id} className={idx % 2 === 1 ? 'bg-gray-50' : ''}>
                            <td className="px-2 py-1 font-semibold">{med.name} {med.dose}</td>
                            <td className="px-2 py-1 text-gray-600">{med.sig}</td>
                            <td className="px-2 py-1">{med.refills}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Encounters */}
              <div className="ehr-panel">
                <div 
                  className="ehr-header flex items-center justify-between cursor-pointer"
                  onClick={() => togglePanel('encounters')}
                >
                  <div className="flex items-center">
                    {expandedPanels.encounters ? <FolderOpen className="w-3 h-3 mr-1" /> : <Folder className="w-3 h-3 mr-1" />}
                    <Calendar className="w-3 h-3 mr-1" /> Recent Encounters
                  </div>
                  {expandedPanels.encounters ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
                {expandedPanels.encounters && (
                  <div className="bg-white">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 text-left w-24">Date</th>
                          <th className="px-2 py-1 text-left w-24">Type</th>
                          <th className="px-2 py-1 text-left">Reason</th>
                          <th className="px-2 py-1 text-left w-28">Provider</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockEncounters.map((enc, idx) => (
                          <tr key={enc.id} className={`cursor-pointer hover:bg-blue-50 ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                            <td className="px-2 py-1">{enc.date}</td>
                            <td className="px-2 py-1">{enc.type}</td>
                            <td className="px-2 py-1">{enc.reason}</td>
                            <td className="px-2 py-1">{enc.provider}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              {/* Allergies */}
              <div className="ehr-panel">
                <div 
                  className="flex items-center justify-between cursor-pointer px-2 py-1"
                  style={{ background: '#cc0000', color: 'white' }}
                  onClick={() => togglePanel('allergies')}
                >
                  <div className="flex items-center text-[11px]">
                    {expandedPanels.allergies ? <FolderOpen className="w-3 h-3 mr-1" /> : <Folder className="w-3 h-3 mr-1" />}
                    <AlertTriangle className="w-3 h-3 mr-1" /> Allergies ({mockAllergies.length})
                  </div>
                  {expandedPanels.allergies ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
                {expandedPanels.allergies && (
                  <div className="bg-red-50">
                    {mockAllergies.map((allergy, idx) => (
                      <div key={allergy.id} className={`px-2 py-1.5 text-[11px] ${idx > 0 ? 'border-t border-red-200' : ''}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-red-900">{allergy.allergen}</span>
                          <span className={`px-1 py-0.5 text-[9px] border border-gray-500 ${allergy.severity === 'Severe' ? 'bg-gray-300 text-gray-800 font-bold' : 'bg-gray-200 text-gray-700'}`}>
                            {allergy.severity}
                          </span>
                        </div>
                        <div className="text-red-700 text-[10px]">{allergy.reaction}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vitals */}
              <div className="ehr-panel">
                <div 
                  className="ehr-header flex items-center justify-between cursor-pointer"
                  onClick={() => togglePanel('vitals')}
                >
                  <div className="flex items-center">
                    {expandedPanels.vitals ? <FolderOpen className="w-3 h-3 mr-1" /> : <Folder className="w-3 h-3 mr-1" />}
                    <Heart className="w-3 h-3 mr-1" /> Vitals ({mockVitals.date})
                  </div>
                  {expandedPanels.vitals ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
                {expandedPanels.vitals && (
                  <div className="bg-white p-2">
                    <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                      <div className="p-1.5 bg-gray-100 border border-gray-300">
                        <div className="text-gray-500">BP</div>
                        <div className={`font-semibold ${parseInt(mockVitals.bp) > 140 ? 'text-gray-800' : ''}`}>{mockVitals.bp}</div>
                      </div>
                      <div className="p-1.5 bg-gray-100 border border-gray-300">
                        <div className="text-gray-500">HR</div>
                        <div className="font-semibold">{mockVitals.hr}</div>
                      </div>
                      <div className="p-1.5 bg-gray-100 border border-gray-300">
                        <div className="text-gray-500">Temp</div>
                        <div className="font-semibold">{mockVitals.temp}°F</div>
                      </div>
                      <div className="p-1.5 bg-gray-100 border border-gray-300">
                        <div className="text-gray-500">SpO2</div>
                        <div className="font-semibold">{mockVitals.spo2}%</div>
                      </div>
                      <div className="p-1.5 bg-gray-100 border border-gray-300">
                        <div className="text-gray-500">Weight</div>
                        <div className="font-semibold">{mockVitals.weight} lbs</div>
                      </div>
                      <div className="p-1.5 bg-gray-100 border border-gray-300">
                        <div className="text-gray-500">BMI</div>
                        <div className={`font-semibold ${mockVitals.bmi > 25 ? 'text-gray-800' : ''}`}>{mockVitals.bmi}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Labs */}
              <div className="ehr-panel">
                <div 
                  className="ehr-header flex items-center justify-between cursor-pointer"
                  onClick={() => togglePanel('labs')}
                >
                  <div className="flex items-center">
                    {expandedPanels.labs ? <FolderOpen className="w-3 h-3 mr-1" /> : <Folder className="w-3 h-3 mr-1" />}
                    <FlaskConical className="w-3 h-3 mr-1" /> Recent Labs
                  </div>
                  {expandedPanels.labs ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
                {expandedPanels.labs && (
                  <div className="bg-white">
                    {mockLabs.map((lab, idx) => (
                      <div key={lab.id} className={`flex items-center justify-between px-2 py-1 text-[10px] ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        <span>{lab.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${lab.status === 'High' ? 'text-red-600' : ''}`}>{lab.value}</span>
                          <span className="text-gray-400">{lab.ref}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <fieldset className="ehr-fieldset">
                <legend>Quick Actions</legend>
                <div className="grid grid-cols-2 gap-1">
                  <button className="ehr-button flex flex-col items-center py-1.5 text-[9px]" onClick={() => setShowAlert({ title: 'New Note', message: 'Clinical note editor would open here.', type: 'info' })}>
                    <ClipboardList className="w-3.5 h-3.5" />
                    New Note
                  </button>
                  <button className="ehr-button flex flex-col items-center py-1.5 text-[9px]" onClick={() => setShowRxDialog(true)}>
                    <Pill className="w-3.5 h-3.5" />
                    Rx
                  </button>
                  <button className="ehr-button flex flex-col items-center py-1.5 text-[9px]" onClick={() => setShowLabDialog(true)}>
                    <FlaskConical className="w-3.5 h-3.5" />
                    Labs
                  </button>
                  <button className="ehr-button flex flex-col items-center py-1.5 text-[9px]" onClick={() => navigate('/schedule')}>
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule
                  </button>
                </div>
              </fieldset>
            </div>
          </div>
        )}

        {activeTab !== 'summary' && (
          <div className="bg-white border border-gray-400 p-4 text-center text-gray-500">
            <p className="text-[11px]">{tabs.find(t => t.id === activeTab)?.label} view - Coming soon</p>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="ehr-status-bar flex items-center justify-between">
        <span>Patient Chart | {mockPatient.lastName}, {mockPatient.firstName} | {mockPatient.mrn}</span>
        <span>Last updated: {new Date().toLocaleString()}</span>
      </div>

      {/* Dialogs */}
      <PrintDialog
        isOpen={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        onPrint={(options) => {
          console.log('Print options:', options);
          setShowPrintDialog(false);
          setShowAlert({ title: 'Print Sent', message: `Patient chart sent to printer (${options.action}).`, type: 'success' });
        }}
        title="Print Patient Chart"
        documentName={`Chart - ${mockPatient.lastName}, ${mockPatient.firstName}`}
      />

      <PrescriptionDialog
        isOpen={showRxDialog}
        onClose={() => setShowRxDialog(false)}
        patientName={`${mockPatient.lastName}, ${mockPatient.firstName}`}
        patientMrn={mockPatient.mrn}
        patientAllergies={mockAllergies.map(a => a.allergen)}
        onSubmit={(rx) => {
          console.log('New Rx:', rx);
          setShowRxDialog(false);
          setShowAlert({ title: 'Prescription Sent', message: `${rx.medication} ${rx.strength} sent to ${rx.pharmacy}.`, type: 'success' });
        }}
      />

      <OrderDialog
        isOpen={showLabDialog}
        onClose={() => setShowLabDialog(false)}
        type="lab"
        patientName={`${mockPatient.lastName}, ${mockPatient.firstName}`}
        patientMrn={mockPatient.mrn}
        onSubmit={(orders) => {
          console.log('Lab order:', orders);
          setShowLabDialog(false);
          setShowAlert({ title: 'Lab Order Placed', message: `${orders.length} test(s) ordered for ${mockPatient.lastName}, ${mockPatient.firstName}.`, type: 'success' });
        }}
      />

      {showAlert && (
        <AlertDialog
          isOpen={true}
          onClose={() => setShowAlert(null)}
          title={showAlert.title}
          message={showAlert.message}
          type={showAlert.type}
        />
      )}
    </div>
  );
}
