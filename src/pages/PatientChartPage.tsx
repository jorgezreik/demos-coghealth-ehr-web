import { useParams } from 'react-router-dom';
import { PatientBanner } from '../components/patient';
import { Card, CardHeader, Badge } from '../components/ui';
import { 
  FileText, 
  Pill, 
  AlertTriangle, 
  Activity, 
  Calendar,
  Stethoscope
} from 'lucide-react';
import { Patient } from '../types';

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
  { id: 1, name: 'Type 2 Diabetes Mellitus', icd10: 'E11.9', status: 'Active', onset: '2018-05-12' },
  { id: 2, name: 'Essential Hypertension', icd10: 'I10', status: 'Active', onset: '2015-08-20' },
  { id: 3, name: 'Hyperlipidemia', icd10: 'E78.5', status: 'Active', onset: '2017-03-15' },
];

const mockMedications = [
  { id: 1, name: 'Metformin 500mg', sig: 'Take 1 tablet by mouth twice daily', status: 'Active' },
  { id: 2, name: 'Lisinopril 10mg', sig: 'Take 1 tablet by mouth once daily', status: 'Active' },
  { id: 3, name: 'Atorvastatin 20mg', sig: 'Take 1 tablet by mouth at bedtime', status: 'Active' },
];

const mockAllergies = [
  { id: 1, allergen: 'Penicillin', reaction: 'Rash, Hives', severity: 'Moderate' },
  { id: 2, allergen: 'Sulfa Drugs', reaction: 'Anaphylaxis', severity: 'Severe' },
];

const mockEncounters = [
  { id: 1, date: '2024-01-10', type: 'Office Visit', provider: 'Dr. Anderson', reason: 'Diabetes follow-up' },
  { id: 2, date: '2023-11-15', type: 'Lab Only', provider: 'Lab', reason: 'HbA1c, Lipid Panel' },
  { id: 3, date: '2023-09-22', type: 'Office Visit', provider: 'Dr. Anderson', reason: 'Annual Physical' },
];

export default function PatientChartPage() {
  const { id } = useParams();

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'encounters', label: 'Encounters', icon: Calendar },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'problems', label: 'Problems', icon: Stethoscope },
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
    { id: 'results', label: 'Results', icon: Activity },
  ];

  return (
    <div>
      <PatientBanner patient={mockPatient} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`flex items-center px-1 py-4 border-b-2 text-sm font-medium transition-colors ${
                    tab.id === 'summary'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader title="Active Problems" subtitle={`${mockProblems.length} conditions`} />
              <div className="space-y-3">
                {mockProblems.map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{problem.name}</p>
                      <p className="text-sm text-gray-500">ICD-10: {problem.icd10} • Onset: {problem.onset}</p>
                    </div>
                    <Badge variant="info">{problem.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Recent Encounters" subtitle="Last 3 visits" />
              <div className="space-y-3">
                {mockEncounters.map((encounter) => (
                  <div key={encounter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{encounter.type}</p>
                      <p className="text-sm text-gray-500">{encounter.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{encounter.date}</p>
                      <p className="text-sm text-gray-500">{encounter.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Allergies" />
              <div className="space-y-3">
                {mockAllergies.map((allergy) => (
                  <div key={allergy.id} className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-red-900">{allergy.allergen}</p>
                      <Badge variant={allergy.severity === 'Severe' ? 'danger' : 'warning'} size="sm">
                        {allergy.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{allergy.reaction}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Active Medications" subtitle={`${mockMedications.length} medications`} />
              <div className="space-y-3">
                {mockMedications.map((med) => (
                  <div key={med.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{med.sig}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
