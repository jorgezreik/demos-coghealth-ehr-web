import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  AlertTriangle, 
  Flag,
  Calendar,
  Phone,
  FileText,
  Activity,
  Heart,
  Pill,
  ChevronRight,
  ChevronDown,
  Download,
  Plus,
  Star,
  AlertCircle,
  Stethoscope,
  Printer,
  RefreshCw,
  X,
  Folder,
  FolderOpen
} from 'lucide-react';
import { AlertDialog } from '../components/ui/Modal';
import { PrintDialog } from '../components/ui/PrintDialog';
import { PrescriptionDialog } from '../components/ui/PrescriptionDialog';
import { OrderDialog } from '../components/ui/OrderDialog';

interface PatientListItem {
  id: number;
  mrn: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  dob: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  ssn?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  pcp: string;
  pcpId: string;
  insurance: string;
  insuranceId: string;
  insuranceType: 'COMMERCIAL' | 'MEDICARE' | 'MEDICAID' | 'SELF_PAY';
  lastVisit?: string;
  nextAppt?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DECEASED';
  alerts: string[];
  flags: ('FALL_RISK' | 'ALLERGY' | 'ISOLATION' | 'DNR' | 'VIP' | 'DIFFICULT_IV')[];
  balance: number;
  openEncounters: number;
  recentLabs: boolean;
  recentImaging: boolean;
  location: string;
}

const mockPatients: PatientListItem[] = [
  {
    id: 1, mrn: 'MRN-00123456', lastName: 'SMITH', firstName: 'JOHN', middleName: 'ROBERT',
    dob: '1965-03-15', age: 59, gender: 'M', ssn: '***-**-4567',
    phone: '(555) 123-4567', address: '123 Main St', city: 'Springfield', state: 'IL', zip: '62701',
    pcp: 'Williams, Mark MD', pcpId: 'PCP001', insurance: 'Blue Cross PPO', insuranceId: 'BCB123456789', insuranceType: 'COMMERCIAL',
    lastVisit: '2024-01-15', nextAppt: '2024-01-22 09:30', status: 'ACTIVE', location: 'Main Clinic',
    alerts: ['Diabetes - uncontrolled', 'HTN Stage 2'], flags: ['FALL_RISK', 'ALLERGY'],
    balance: 125.00, openEncounters: 1, recentLabs: true, recentImaging: false
  },
  {
    id: 2, mrn: 'MRN-00123457', lastName: 'JOHNSON', firstName: 'SARAH', middleName: 'ANN',
    dob: '1978-07-22', age: 46, gender: 'F', ssn: '***-**-8901',
    phone: '(555) 234-5678', address: '456 Oak Ave', city: 'Springfield', state: 'IL', zip: '62702',
    pcp: 'Chen, Lisa MD', pcpId: 'PCP002', insurance: 'Aetna HMO', insuranceId: 'AET987654321', insuranceType: 'COMMERCIAL',
    lastVisit: '2024-01-18', nextAppt: '2024-01-22 10:00', status: 'ACTIVE', location: 'Main Clinic',
    alerts: ['Pregnancy - 28 weeks'], flags: ['VIP'],
    balance: 0, openEncounters: 0, recentLabs: true, recentImaging: true
  },
  {
    id: 3, mrn: 'MRN-00123458', lastName: 'WILLIAMS', firstName: 'MICHAEL', middleName: 'JAMES',
    dob: '1952-11-08', age: 72, gender: 'M', ssn: '***-**-2345',
    phone: '(555) 345-6789', address: '789 Elm St', city: 'Springfield', state: 'IL', zip: '62703',
    pcp: 'Patel, Raj MD', pcpId: 'PCP003', insurance: 'Medicare', insuranceId: 'MED456789012', insuranceType: 'MEDICARE',
    lastVisit: '2024-01-10', status: 'ACTIVE', location: 'East Campus',
    alerts: ['CHF - NYHA Class III', 'CKD Stage 4', 'A-fib on anticoag'], flags: ['FALL_RISK', 'DNR', 'DIFFICULT_IV'],
    balance: 45.50, openEncounters: 2, recentLabs: true, recentImaging: false
  },
  {
    id: 4, mrn: 'MRN-00123459', lastName: 'BROWN', firstName: 'EMILY', middleName: 'ROSE',
    dob: '1989-04-30', age: 35, gender: 'F', ssn: '***-**-6789',
    phone: '(555) 456-7890', address: '321 Pine Rd', city: 'Springfield', state: 'IL', zip: '62704',
    pcp: 'Williams, Mark MD', pcpId: 'PCP001', insurance: 'United Healthcare', insuranceId: 'UHC111222333', insuranceType: 'COMMERCIAL',
    lastVisit: '2024-01-12', nextAppt: '2024-01-22 11:30', status: 'ACTIVE', location: 'Main Clinic',
    alerts: [], flags: ['ALLERGY'],
    balance: 0, openEncounters: 0, recentLabs: false, recentImaging: false
  },
  {
    id: 5, mrn: 'MRN-00123460', lastName: 'DAVIS', firstName: 'ROBERT', middleName: 'LEE',
    dob: '1945-08-20', age: 79, gender: 'M', ssn: '***-**-0123',
    phone: '(555) 567-8901', address: '654 Maple Dr', city: 'Springfield', state: 'IL', zip: '62705',
    pcp: 'Chen, Lisa MD', pcpId: 'PCP002', insurance: 'Medicare Advantage', insuranceId: 'MAD333444555', insuranceType: 'MEDICARE',
    lastVisit: '2024-01-08', status: 'ACTIVE', location: 'West Wing',
    alerts: ['COPD - severe', 'CAD s/p CABG', 'Dementia - moderate'], flags: ['FALL_RISK', 'DNR'],
    balance: 230.00, openEncounters: 1, recentLabs: true, recentImaging: true
  },
  {
    id: 6, mrn: 'MRN-00123461', lastName: 'MARTINEZ', firstName: 'MARIA', middleName: 'ELENA',
    dob: '1970-12-05', age: 54, gender: 'F', ssn: '***-**-4567',
    phone: '(555) 678-9012', address: '987 Cedar Ln', city: 'Springfield', state: 'IL', zip: '62706',
    pcp: 'Patel, Raj MD', pcpId: 'PCP003', insurance: 'Medicaid', insuranceId: 'MCD666777888', insuranceType: 'MEDICAID',
    lastVisit: '2024-01-16', nextAppt: '2024-01-23 14:00', status: 'ACTIVE', location: 'Main Clinic',
    alerts: ['Lupus - active flare', 'Chronic pain syndrome'], flags: ['ALLERGY', 'DIFFICULT_IV'],
    balance: 0, openEncounters: 1, recentLabs: true, recentImaging: false
  },
  {
    id: 7, mrn: 'MRN-00123462', lastName: 'ANDERSON', firstName: 'JAMES', middleName: 'WILLIAM',
    dob: '1958-06-18', age: 66, gender: 'M', ssn: '***-**-8901',
    phone: '(555) 789-0123', address: '147 Birch Ave', city: 'Springfield', state: 'IL', zip: '62707',
    pcp: 'Williams, Mark MD', pcpId: 'PCP001', insurance: 'Cigna PPO', insuranceId: 'CIG999000111', insuranceType: 'COMMERCIAL',
    lastVisit: '2024-01-05', status: 'ACTIVE', location: 'East Campus',
    alerts: ['Prostate CA - on surveillance', 'BPH'], flags: [],
    balance: 75.00, openEncounters: 0, recentLabs: false, recentImaging: true
  },
  {
    id: 8, mrn: 'MRN-00123463', lastName: 'TAYLOR', firstName: 'PATRICIA', middleName: 'LYNN',
    dob: '1982-09-25', age: 42, gender: 'F', ssn: '***-**-2345',
    phone: '(555) 890-1234', address: '258 Walnut St', city: 'Springfield', state: 'IL', zip: '62708',
    pcp: 'Chen, Lisa MD', pcpId: 'PCP002', insurance: 'Blue Cross HMO', insuranceId: 'BCH222333444', insuranceType: 'COMMERCIAL',
    lastVisit: '2024-01-17', nextAppt: '2024-01-22 15:00', status: 'ACTIVE', location: 'Main Clinic',
    alerts: ['Migraine - chronic', 'Anxiety disorder'], flags: [],
    balance: 50.00, openEncounters: 0, recentLabs: false, recentImaging: false
  },
  {
    id: 9, mrn: 'MRN-00123464', lastName: 'THOMAS', firstName: 'WILLIAM', middleName: 'HENRY',
    dob: '1940-02-14', age: 84, gender: 'M', ssn: '***-**-6789',
    phone: '(555) 901-2345', address: '369 Spruce Ct', city: 'Springfield', state: 'IL', zip: '62709',
    pcp: 'Patel, Raj MD', pcpId: 'PCP003', insurance: 'Medicare', insuranceId: 'MED555666777', insuranceType: 'MEDICARE',
    lastVisit: '2024-01-14', status: 'ACTIVE', location: 'West Wing',
    alerts: ['Parkinson disease', 'Recurrent UTIs', 'Osteoporosis'], flags: ['FALL_RISK', 'DNR', 'ISOLATION'],
    balance: 0, openEncounters: 1, recentLabs: true, recentImaging: false
  },
  {
    id: 10, mrn: 'MRN-00123465', lastName: 'JACKSON', firstName: 'JENNIFER', middleName: 'MARIE',
    dob: '1995-01-30', age: 29, gender: 'F', ssn: '***-**-0123',
    phone: '(555) 012-3456', address: '741 Ash Blvd', city: 'Springfield', state: 'IL', zip: '62710',
    pcp: 'Williams, Mark MD', pcpId: 'PCP001', insurance: 'Aetna PPO', insuranceId: 'AET888999000', insuranceType: 'COMMERCIAL',
    lastVisit: '2024-01-19', nextAppt: '2024-01-24 09:00', status: 'ACTIVE', location: 'Main Clinic',
    alerts: ['Asthma - moderate persistent'], flags: ['ALLERGY'],
    balance: 0, openEncounters: 0, recentLabs: false, recentImaging: false
  },
  {
    id: 11, mrn: 'MRN-00098765', lastName: 'WILSON', firstName: 'CHARLES', middleName: 'EDWARD',
    dob: '1955-05-10', age: 69, gender: 'M', ssn: '***-**-1111',
    phone: '(555) 111-2222', address: '852 Oak Hill Rd', city: 'Springfield', state: 'IL', zip: '62711',
    pcp: 'Chen, Lisa MD', pcpId: 'PCP002', insurance: 'Medicare', insuranceId: 'MED111222333', insuranceType: 'MEDICARE',
    lastVisit: '2024-01-11', status: 'ACTIVE', location: 'East Campus',
    alerts: ['Type 2 DM - controlled', 'Hyperlipidemia', 'Gout'], flags: [],
    balance: 180.00, openEncounters: 0, recentLabs: true, recentImaging: false
  },
  {
    id: 12, mrn: 'MRN-00098766', lastName: 'MOORE', firstName: 'LINDA', middleName: 'SUE',
    dob: '1968-11-22', age: 56, gender: 'F', ssn: '***-**-2222',
    phone: '(555) 222-3333', address: '963 Valley View', city: 'Springfield', state: 'IL', zip: '62712',
    pcp: 'Patel, Raj MD', pcpId: 'PCP003', insurance: 'United Healthcare', insuranceId: 'UHC444555666', insuranceType: 'COMMERCIAL',
    lastVisit: '2024-01-09', nextAppt: '2024-01-25 10:30', status: 'ACTIVE', location: 'Main Clinic',
    alerts: ['Hypothyroidism', 'Fibromyalgia'], flags: ['ALLERGY'],
    balance: 0, openEncounters: 0, recentLabs: true, recentImaging: false
  },
];

const flagConfig: Record<string, { label: string; color: string; bg: string }> = {
  FALL_RISK: { label: 'Fall Risk', color: 'text-orange-800', bg: 'bg-orange-200' },
  ALLERGY: { label: 'Allergy', color: 'text-red-800', bg: 'bg-red-200' },
  ISOLATION: { label: 'Isolation', color: 'text-purple-800', bg: 'bg-purple-200' },
  DNR: { label: 'DNR/DNI', color: 'text-gray-800', bg: 'bg-gray-300' },
  VIP: { label: 'VIP', color: 'text-amber-800', bg: 'bg-amber-200' },
  DIFFICULT_IV: { label: 'Diff IV', color: 'text-blue-800', bg: 'bg-blue-200' },
};

interface FilterState {
  status: string[];
  gender: string[];
  insuranceType: string[];
  pcp: string[];
  location: string[];
  hasBalance: boolean | null;
  hasOpenEncounters: boolean | null;
  hasAlerts: boolean | null;
  flags: string[];
}

export default function PatientSearchPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PatientListItem[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<PatientListItem | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    quickFilters: true,
    status: true,
    demographics: false,
    insurance: false,
    provider: false,
    location: false,
    flags: false,
  });
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    gender: [],
    insuranceType: [],
    pcp: [],
    location: [],
    hasBalance: null,
    hasOpenEncounters: null,
    hasAlerts: null,
    flags: [],
  });
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showRxDialog, setShowRxDialog] = useState(false);
  const [showLabDialog, setShowLabDialog] = useState(false);
  const [showAlert, setShowAlert] = useState<{ title: string; message: string; type: 'success' | 'info' } | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    let results = mockPatients;
    
    if (term) {
      results = results.filter(p =>
        p.lastName.toLowerCase().includes(term) ||
        p.firstName.toLowerCase().includes(term) ||
        p.mrn.toLowerCase().includes(term) ||
        p.phone.includes(term) ||
        p.dob.includes(term)
      );
    }

    if (filters.status.length > 0) {
      results = results.filter(p => filters.status.includes(p.status));
    }
    if (filters.gender.length > 0) {
      results = results.filter(p => filters.gender.includes(p.gender));
    }
    if (filters.insuranceType.length > 0) {
      results = results.filter(p => filters.insuranceType.includes(p.insuranceType));
    }
    if (filters.pcp.length > 0) {
      results = results.filter(p => filters.pcp.includes(p.pcpId));
    }
    if (filters.location.length > 0) {
      results = results.filter(p => filters.location.includes(p.location));
    }
    if (filters.hasBalance === true) {
      results = results.filter(p => p.balance > 0);
    } else if (filters.hasBalance === false) {
      results = results.filter(p => p.balance === 0);
    }
    if (filters.hasOpenEncounters === true) {
      results = results.filter(p => p.openEncounters > 0);
    }
    if (filters.hasAlerts === true) {
      results = results.filter(p => p.alerts.length > 0);
    }
    if (filters.flags.length > 0) {
      results = results.filter(p => filters.flags.some(f => p.flags.includes(f as any)));
    }

    setSearchResults(results);
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const arr = prev[category] as string[];
      const newArr = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [category]: newArr };
    });
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      gender: [],
      insuranceType: [],
      pcp: [],
      location: [],
      hasBalance: null,
      hasOpenEncounters: null,
      hasAlerts: null,
      flags: [],
    });
    setSearchResults(mockPatients);
  };

  const handleSelectPatient = (patient: PatientListItem) => {
    setSelectedPatient(patient);
  };

  const handleOpenChart = (patientId: number) => {
    navigate(`/patients/${patientId}`);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    const [date, time] = dateStr.split(' ');
    return `${formatDate(date)} ${time}`;
  };

  const activeFilterCount = filters.status.length + filters.gender.length + filters.insuranceType.length + 
    filters.pcp.length + filters.location.length + filters.flags.length +
    (filters.hasBalance !== null ? 1 : 0) + (filters.hasOpenEncounters !== null ? 1 : 0) + (filters.hasAlerts !== null ? 1 : 0);

  return (
    <div className="h-full flex flex-col" style={{ background: '#d4d0c8' }}>
      {/* Toolbar */}
      <div className="ehr-toolbar flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button className="ehr-toolbar-button flex items-center" onClick={() => { setSearchResults(mockPatients); setShowAlert({ title: 'Refreshed', message: 'Patient list has been refreshed.', type: 'info' }); }}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </button>
          <span className="text-gray-400">|</span>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowAlert({ title: 'New Patient', message: 'Patient registration form would open here.', type: 'info' })}>
            <Plus className="w-3.5 h-3.5 mr-1" /> New Patient
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowPrintDialog(true)}>
            <Printer className="w-3.5 h-3.5 mr-1" /> Print List
          </button>
          <button className="ehr-toolbar-button flex items-center" onClick={() => setShowAlert({ title: 'Export', message: `Exported ${searchResults.length} patient(s) to CSV.`, type: 'success' })}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Search:</span>
          <input
            type="text"
            placeholder="Name, MRN, DOB, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="ehr-input w-48"
          />
          <button onClick={handleSearch} className="ehr-button ehr-button-primary flex items-center">
            <Search className="w-3 h-3 mr-1" /> Find
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Panel */}
        <div className="w-52 flex flex-col border-r border-gray-500" style={{ background: '#ece9d8' }}>
          <div className="ehr-header text-xs flex items-center justify-between">
            <span>Filter Patients</span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-white/80 hover:text-white flex items-center text-[10px]">
                <X className="w-3 h-3 mr-0.5" /> Clear ({activeFilterCount})
              </button>
            )}
          </div>
          <div className="flex-1 overflow-auto p-1">
            {/* Quick Filters */}
            <div className="mb-1">
              <button 
                onClick={() => toggleSection('quickFilters')}
                className="w-full flex items-center text-left px-1 py-0.5 hover:bg-gray-200 font-semibold text-gray-700"
              >
                {expandedSections.quickFilters ? <FolderOpen className="w-3.5 h-3.5 mr-1 text-amber-600" /> : <Folder className="w-3.5 h-3.5 mr-1 text-amber-600" />}
                Quick Filters
              </button>
              {expandedSections.quickFilters && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  <label className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                    <input 
                      type="checkbox" 
                      className="ehr-checkbox"
                      checked={filters.hasOpenEncounters === true}
                      onChange={() => setFilters(prev => ({ ...prev, hasOpenEncounters: prev.hasOpenEncounters === true ? null : true }))}
                    />
                    <span className="ehr-label">Open Encounters</span>
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                    <input 
                      type="checkbox" 
                      className="ehr-checkbox"
                      checked={filters.hasBalance === true}
                      onChange={() => setFilters(prev => ({ ...prev, hasBalance: prev.hasBalance === true ? null : true }))}
                    />
                    <span className="ehr-label">Outstanding Balance</span>
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                    <input 
                      type="checkbox" 
                      className="ehr-checkbox"
                      checked={filters.hasAlerts === true}
                      onChange={() => setFilters(prev => ({ ...prev, hasAlerts: prev.hasAlerts === true ? null : true }))}
                    />
                    <span className="ehr-label">Has Clinical Alerts</span>
                  </label>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mb-1">
              <button 
                onClick={() => toggleSection('status')}
                className="w-full flex items-center text-left px-1 py-0.5 hover:bg-gray-200 font-semibold text-gray-700"
              >
                {expandedSections.status ? <ChevronDown className="w-3.5 h-3.5 mr-1" /> : <ChevronRight className="w-3.5 h-3.5 mr-1" />}
                Patient Status
              </button>
              {expandedSections.status && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  {['ACTIVE', 'INACTIVE', 'DECEASED'].map(status => (
                    <label key={status} className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                      <input 
                        type="checkbox" 
                        className="ehr-checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => toggleFilter('status', status)}
                      />
                      <span className="ehr-label">{status}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Demographics */}
            <div className="mb-1">
              <button 
                onClick={() => toggleSection('demographics')}
                className="w-full flex items-center text-left px-1 py-0.5 hover:bg-gray-200 font-semibold text-gray-700"
              >
                {expandedSections.demographics ? <ChevronDown className="w-3.5 h-3.5 mr-1" /> : <ChevronRight className="w-3.5 h-3.5 mr-1" />}
                Demographics
              </button>
              {expandedSections.demographics && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  <div className="text-[10px] text-gray-500 px-1">Gender:</div>
                  {[{ v: 'M', l: 'Male' }, { v: 'F', l: 'Female' }, { v: 'O', l: 'Other' }].map(g => (
                    <label key={g.v} className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                      <input 
                        type="checkbox" 
                        className="ehr-checkbox"
                        checked={filters.gender.includes(g.v)}
                        onChange={() => toggleFilter('gender', g.v)}
                      />
                      <span className="ehr-label">{g.l}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Insurance */}
            <div className="mb-1">
              <button 
                onClick={() => toggleSection('insurance')}
                className="w-full flex items-center text-left px-1 py-0.5 hover:bg-gray-200 font-semibold text-gray-700"
              >
                {expandedSections.insurance ? <ChevronDown className="w-3.5 h-3.5 mr-1" /> : <ChevronRight className="w-3.5 h-3.5 mr-1" />}
                Insurance Type
              </button>
              {expandedSections.insurance && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  {[{ v: 'COMMERCIAL', l: 'Commercial' }, { v: 'MEDICARE', l: 'Medicare' }, { v: 'MEDICAID', l: 'Medicaid' }, { v: 'SELF_PAY', l: 'Self Pay' }].map(ins => (
                    <label key={ins.v} className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                      <input 
                        type="checkbox" 
                        className="ehr-checkbox"
                        checked={filters.insuranceType.includes(ins.v)}
                        onChange={() => toggleFilter('insuranceType', ins.v)}
                      />
                      <span className="ehr-label">{ins.l}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Provider */}
            <div className="mb-1">
              <button 
                onClick={() => toggleSection('provider')}
                className="w-full flex items-center text-left px-1 py-0.5 hover:bg-gray-200 font-semibold text-gray-700"
              >
                {expandedSections.provider ? <ChevronDown className="w-3.5 h-3.5 mr-1" /> : <ChevronRight className="w-3.5 h-3.5 mr-1" />}
                Primary Care Provider
              </button>
              {expandedSections.provider && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  {[{ id: 'PCP001', name: 'Williams, Mark MD' }, { id: 'PCP002', name: 'Chen, Lisa MD' }, { id: 'PCP003', name: 'Patel, Raj MD' }].map(pcp => (
                    <label key={pcp.id} className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                      <input 
                        type="checkbox" 
                        className="ehr-checkbox"
                        checked={filters.pcp.includes(pcp.id)}
                        onChange={() => toggleFilter('pcp', pcp.id)}
                      />
                      <span className="ehr-label truncate">{pcp.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="mb-1">
              <button 
                onClick={() => toggleSection('location')}
                className="w-full flex items-center text-left px-1 py-0.5 hover:bg-gray-200 font-semibold text-gray-700"
              >
                {expandedSections.location ? <ChevronDown className="w-3.5 h-3.5 mr-1" /> : <ChevronRight className="w-3.5 h-3.5 mr-1" />}
                Location
              </button>
              {expandedSections.location && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  {['Main Clinic', 'East Campus', 'West Wing'].map(loc => (
                    <label key={loc} className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                      <input 
                        type="checkbox" 
                        className="ehr-checkbox"
                        checked={filters.location.includes(loc)}
                        onChange={() => toggleFilter('location', loc)}
                      />
                      <span className="ehr-label">{loc}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Flags */}
            <div className="mb-1">
              <button 
                onClick={() => toggleSection('flags')}
                className="w-full flex items-center text-left px-1 py-0.5 hover:bg-gray-200 font-semibold text-gray-700"
              >
                {expandedSections.flags ? <ChevronDown className="w-3.5 h-3.5 mr-1" /> : <ChevronRight className="w-3.5 h-3.5 mr-1" />}
                Patient Flags
              </button>
              {expandedSections.flags && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  {Object.entries(flagConfig).map(([key, cfg]) => (
                    <label key={key} className="flex items-center cursor-pointer hover:bg-gray-200 px-1">
                      <input 
                        type="checkbox" 
                        className="ehr-checkbox"
                        checked={filters.flags.includes(key)}
                        onChange={() => toggleFilter('flags', key)}
                      />
                      <span className={`ehr-label px-1 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-gray-400 p-1">
            <button onClick={handleSearch} className="ehr-button ehr-button-primary w-full">Apply Filters</button>
          </div>
        </div>

        {/* Patient List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="ehr-subheader flex items-center justify-between">
            <span>Patient List - {searchResults.length} record(s) found</span>
            <span className="text-gray-500">Double-click to open chart</span>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0">
                <tr>
                  <th className="px-1 py-1 text-left w-16">Flags</th>
                  <th className="px-1 py-1 text-left">MRN</th>
                  <th className="px-1 py-1 text-left">Patient Name</th>
                  <th className="px-1 py-1 text-left">DOB</th>
                  <th className="px-1 py-1 text-left w-8">Sex</th>
                  <th className="px-1 py-1 text-left">Phone</th>
                  <th className="px-1 py-1 text-left">PCP</th>
                  <th className="px-1 py-1 text-left">Insurance</th>
                  <th className="px-1 py-1 text-left">Last Visit</th>
                  <th className="px-1 py-1 text-left">Next Appt</th>
                  <th className="px-1 py-1 text-right">Balance</th>
                  <th className="px-1 py-1 text-center w-12">Info</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((patient, idx) => {
                  const isSelected = selectedPatient?.id === patient.id;
                  return (
                    <tr
                      key={patient.id}
                      onClick={() => handleSelectPatient(patient)}
                      onDoubleClick={() => handleOpenChart(patient.id)}
                      className={`cursor-pointer ${isSelected ? 'ehr-grid-row selected' : `ehr-grid-row ${idx % 2 === 0 ? '' : ''}`}`}
                      style={isSelected ? { background: '#316ac5', color: 'white' } : idx % 2 === 1 ? { background: '#f0f4f8' } : {}}
                    >
                      <td className="px-1 py-0.5">
                        <div className="flex items-center space-x-0.5">
                          {patient.flags.slice(0, 3).map((flag) => (
                            <span
                              key={flag}
                              className={`px-0.5 py-0 rounded text-[9px] font-medium ${isSelected ? 'bg-white/30 text-white' : `${flagConfig[flag].bg} ${flagConfig[flag].color}`}`}
                              title={flagConfig[flag].label}
                            >
                              {flag === 'FALL_RISK' && <AlertTriangle className="w-2.5 h-2.5 inline" />}
                              {flag === 'ALLERGY' && <AlertCircle className="w-2.5 h-2.5 inline" />}
                              {flag === 'DNR' && 'DNR'}
                              {flag === 'VIP' && <Star className="w-2.5 h-2.5 inline" />}
                              {flag === 'ISOLATION' && <Flag className="w-2.5 h-2.5 inline" />}
                              {flag === 'DIFFICULT_IV' && 'IV'}
                            </span>
                          ))}
                          {patient.flags.length > 3 && <span className="text-[9px]">+{patient.flags.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-1 py-0.5 font-mono">{patient.mrn}</td>
                      <td className="px-1 py-0.5 font-semibold">
                        {patient.lastName}, {patient.firstName} {patient.middleName ? patient.middleName.charAt(0) + '.' : ''}
                      </td>
                      <td className="px-1 py-0.5">{formatDate(patient.dob)} ({patient.age}y)</td>
                      <td className="px-1 py-0.5">{patient.gender}</td>
                      <td className="px-1 py-0.5">{patient.phone}</td>
                      <td className="px-1 py-0.5 truncate max-w-[100px]">{patient.pcp}</td>
                      <td className="px-1 py-0.5 truncate max-w-[100px]">{patient.insurance}</td>
                      <td className="px-1 py-0.5">{patient.lastVisit ? formatDate(patient.lastVisit) : '-'}</td>
                      <td className="px-1 py-0.5">{patient.nextAppt ? formatDateTime(patient.nextAppt) : '-'}</td>
                      <td className="px-1 py-0.5 text-right">
                        {patient.balance > 0 ? (
                          <span className={isSelected ? 'text-yellow-200' : 'text-red-700'}>${patient.balance.toFixed(2)}</span>
                        ) : (
                          <span className={isSelected ? 'text-green-200' : 'text-green-700'}>$0.00</span>
                        )}
                      </td>
                      <td className="px-1 py-0.5">
                        <div className="flex items-center justify-center space-x-0.5">
                          {patient.openEncounters > 0 && (
                            <span className={`px-0.5 rounded text-[9px] ${isSelected ? 'bg-white/30' : 'bg-amber-200 text-amber-800'}`} title="Open encounters">
                              {patient.openEncounters}E
                            </span>
                          )}
                          {patient.recentLabs && (
                            <span title="Recent labs"><Activity className={`w-3 h-3 ${isSelected ? 'text-purple-200' : 'text-purple-600'}`} /></span>
                          )}
                          {patient.recentImaging && (
                            <span title="Recent imaging"><FileText className={`w-3 h-3 ${isSelected ? 'text-blue-200' : 'text-blue-600'}`} /></span>
                          )}
                          {patient.alerts.length > 0 && (
                            <span title={patient.alerts.join(', ')}><AlertTriangle className={`w-3 h-3 ${isSelected ? 'text-red-200' : 'text-red-600'}`} /></span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No patients found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* Patient Detail Panel */}
        {selectedPatient && (
          <div className="w-72 flex flex-col border-l border-gray-500" style={{ background: '#f5f5f5' }}>
            <div className="ehr-header text-xs flex items-center justify-between">
              <span>Patient Details</span>
              <button onClick={() => setSelectedPatient(null)} className="text-white/80 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {/* Patient Header */}
              <div className="p-2 border-b border-gray-400" style={{ background: '#e8e8e8' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: '#6699cc' }}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{selectedPatient.lastName}, {selectedPatient.firstName}</div>
                    <div className="text-[10px] text-gray-600">{selectedPatient.mrn} | {selectedPatient.age}y {selectedPatient.gender}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenChart(selectedPatient.id)}
                  className="ehr-button ehr-button-primary w-full mt-2 flex items-center justify-center"
                >
                  Open Chart <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              </div>

              <div className="p-2 space-y-2">
                {/* Flags & Alerts */}
                {(selectedPatient.flags.length > 0 || selectedPatient.alerts.length > 0) && (
                  <fieldset className="ehr-fieldset">
                    <legend>Flags & Alerts</legend>
                    {selectedPatient.flags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {selectedPatient.flags.map((flag) => (
                          <span key={flag} className={`px-1 py-0.5 rounded text-[10px] font-medium ${flagConfig[flag].bg} ${flagConfig[flag].color}`}>
                            {flagConfig[flag].label}
                          </span>
                        ))}
                      </div>
                    )}
                    {selectedPatient.alerts.length > 0 && (
                      <div className="ehr-alert-critical p-1 rounded text-[10px]">
                        {selectedPatient.alerts.map((alert, i) => (
                          <div key={i} className="flex items-start space-x-1">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{alert}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </fieldset>
                )}

                {/* Demographics */}
                <fieldset className="ehr-fieldset">
                  <legend>Demographics</legend>
                  <table className="w-full text-[10px]">
                    <tbody>
                      <tr><td className="text-gray-500 pr-2">DOB:</td><td>{formatDate(selectedPatient.dob)}</td></tr>
                      <tr><td className="text-gray-500 pr-2">Age/Sex:</td><td>{selectedPatient.age} years / {selectedPatient.gender === 'M' ? 'Male' : selectedPatient.gender === 'F' ? 'Female' : 'Other'}</td></tr>
                      <tr><td className="text-gray-500 pr-2">SSN:</td><td>{selectedPatient.ssn}</td></tr>
                      <tr><td className="text-gray-500 pr-2">Phone:</td><td>{selectedPatient.phone}</td></tr>
                      <tr><td className="text-gray-500 pr-2 align-top">Address:</td><td>{selectedPatient.address}<br/>{selectedPatient.city}, {selectedPatient.state} {selectedPatient.zip}</td></tr>
                    </tbody>
                  </table>
                </fieldset>

                {/* Care Team */}
                <fieldset className="ehr-fieldset">
                  <legend>Care Team</legend>
                  <table className="w-full text-[10px]">
                    <tbody>
                      <tr><td className="text-gray-500 pr-2">PCP:</td><td>{selectedPatient.pcp}</td></tr>
                      <tr><td className="text-gray-500 pr-2">Location:</td><td>{selectedPatient.location}</td></tr>
                    </tbody>
                  </table>
                </fieldset>

                {/* Insurance */}
                <fieldset className="ehr-fieldset">
                  <legend>Insurance</legend>
                  <table className="w-full text-[10px]">
                    <tbody>
                      <tr><td className="text-gray-500 pr-2">Plan:</td><td>{selectedPatient.insurance}</td></tr>
                      <tr><td className="text-gray-500 pr-2">ID:</td><td className="font-mono">{selectedPatient.insuranceId}</td></tr>
                      <tr><td className="text-gray-500 pr-2">Type:</td><td>{selectedPatient.insuranceType}</td></tr>
                    </tbody>
                  </table>
                </fieldset>

                {/* Visit Info */}
                <fieldset className="ehr-fieldset">
                  <legend>Visit Information</legend>
                  <table className="w-full text-[10px]">
                    <tbody>
                      <tr><td className="text-gray-500 pr-2">Last Visit:</td><td>{selectedPatient.lastVisit ? formatDate(selectedPatient.lastVisit) : 'N/A'}</td></tr>
                      <tr><td className="text-gray-500 pr-2">Next Appt:</td><td>{selectedPatient.nextAppt ? formatDateTime(selectedPatient.nextAppt) : 'None'}</td></tr>
                      <tr><td className="text-gray-500 pr-2">Open Enc:</td><td className={selectedPatient.openEncounters > 0 ? 'text-amber-700 font-semibold' : ''}>{selectedPatient.openEncounters}</td></tr>
                      <tr><td className="text-gray-500 pr-2">Balance:</td><td className={selectedPatient.balance > 0 ? 'text-red-700 font-semibold' : 'text-green-700'}>${selectedPatient.balance.toFixed(2)}</td></tr>
                    </tbody>
                  </table>
                </fieldset>

                {/* Quick Actions */}
                <fieldset className="ehr-fieldset">
                  <legend>Quick Actions</legend>
                  <div className="grid grid-cols-3 gap-1">
                    <button className="ehr-button flex flex-col items-center py-1" onClick={() => navigate('/schedule')}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Schedule</span>
                    </button>
                    <button className="ehr-button flex flex-col items-center py-1" onClick={() => setShowAlert({ title: 'Call Patient', message: `Initiating call to ${selectedPatient.phone}...`, type: 'info' })}>
                      <Phone className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Call</span>
                    </button>
                    <button className="ehr-button flex flex-col items-center py-1" onClick={() => setShowRxDialog(true)}>
                      <Pill className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Rx</span>
                    </button>
                    <button className="ehr-button flex flex-col items-center py-1" onClick={() => setShowLabDialog(true)}>
                      <Activity className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Labs</span>
                    </button>
                    <button className="ehr-button flex flex-col items-center py-1" onClick={() => setShowAlert({ title: 'Record Vitals', message: 'Vitals entry form would open here.', type: 'info' })}>
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Vitals</span>
                    </button>
                    <button className="ehr-button flex flex-col items-center py-1" onClick={() => setShowAlert({ title: 'New Note', message: 'Clinical note editor would open here.', type: 'info' })}>
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span className="text-[9px]">Note</span>
                    </button>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="ehr-status-bar flex items-center justify-between">
        <span>Ready | {searchResults.length} patient(s) | {activeFilterCount > 0 ? `${activeFilterCount} filter(s) active` : 'No filters'}</span>
        <span>Last refreshed: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Dialogs */}
      <PrintDialog
        isOpen={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        onPrint={(options) => {
          console.log('Print options:', options);
          setShowPrintDialog(false);
          setShowAlert({ title: 'Print Sent', message: `Patient list sent to printer (${options.action}).`, type: 'success' });
        }}
        title="Print Patient List"
        documentName={`Patient List (${searchResults.length} patients)`}
      />

      {selectedPatient && (
        <>
          <PrescriptionDialog
            isOpen={showRxDialog}
            onClose={() => setShowRxDialog(false)}
            patientName={`${selectedPatient.lastName}, ${selectedPatient.firstName}`}
            patientMrn={selectedPatient.mrn}
            patientAllergies={selectedPatient.flags.includes('ALLERGY') ? ['See chart for details'] : []}
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
            patientName={`${selectedPatient.lastName}, ${selectedPatient.firstName}`}
            patientMrn={selectedPatient.mrn}
            onSubmit={(orders) => {
              console.log('Lab order:', orders);
              setShowLabDialog(false);
              setShowAlert({ title: 'Lab Order Placed', message: `${orders.length} test(s) ordered for ${selectedPatient.lastName}, ${selectedPatient.firstName}.`, type: 'success' });
            }}
          />
        </>
      )}

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
