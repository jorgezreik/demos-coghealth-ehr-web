import { Patient } from '../../types';
import { Badge } from '../ui';
import { AlertTriangle, Phone, Mail, Calendar, User } from 'lucide-react';

interface PatientBannerProps {
  patient: Patient;
  onClose?: () => void;
}

export default function PatientBanner({ patient }: PatientBannerProps) {
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.lastName}, {patient.firstName}
                  {patient.middleName && ` ${patient.middleName.charAt(0)}.`}
                </h1>
                {patient.deceased && (
                  <Badge variant="danger">Deceased</Badge>
                )}
                {!patient.active && !patient.deceased && (
                  <Badge variant="warning">Inactive</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span className="font-medium">MRN: {patient.mrn}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} yo)
                </div>
                <span>•</span>
                <span>{patient.gender}</span>
              </div>
              
              <div className="flex items-center space-x-4 mt-2 text-sm">
                {patient.phoneMobile && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-1" />
                    {patient.phoneMobile}
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-1" />
                    {patient.email}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Allergies">
              <AlertTriangle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
