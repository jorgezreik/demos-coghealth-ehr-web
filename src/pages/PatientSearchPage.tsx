import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientSearch } from '../components/patient';
import { Patient } from '../types';

export default function PatientSearchPage() {
  const navigate = useNavigate();

  const handleSelectPatient = (patient: Patient) => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Search</h1>
        <p className="text-gray-500">Find and access patient records</p>
      </div>
      
      <PatientSearch onSelectPatient={handleSelectPatient} />
    </div>
  );
}
