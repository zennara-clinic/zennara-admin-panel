import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DocumentIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PrinterIcon,
  EyeIcon,
  CurrencyIcon,
  PhoneIcon,
  MailIcon,
  DoctorIcon,
  LocationIcon
} from './Icons';
import { getPatientById, generateTreatmentHistory } from '../data/mockData';

export default function PatientRecordDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Get patient data from unified source
  const patient = getPatientById(id) || getPatientById('PAT000001');
  const treatmentHistory = generateTreatmentHistory(id || 'PAT000001');

  const beforeAfterPhotos = [
    {
      id: 1,
      treatment: 'HydraFacial',
      date: 'Oct 15, 2025',
      beforeUrl: 'https://i.pravatar.cc/300?img=12',
      afterUrl: 'https://i.pravatar.cc/300?img=13',
      notes: '30 days post-treatment'
    },
    {
      id: 2,
      treatment: 'Chemical Peel',
      date: 'Sep 10, 2025',
      beforeUrl: 'https://i.pravatar.cc/300?img=14',
      afterUrl: 'https://i.pravatar.cc/300?img=15',
      notes: 'Significant improvement'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'treatments', label: 'Treatment History' },
    { id: 'photos', label: 'Before/After Photos' },
    { id: 'prescriptions', label: 'Prescriptions' }
  ];

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <button
            onClick={() => navigate('/patients/records')}
            className="text-base font-semibold text-gray-500 hover:text-zennara-green mb-4 flex items-center space-x-2 transition-colors"
          >
            <span>←</span>
            <span>Back to Medical Records</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Medical Record</h1>
          <p className="text-base text-gray-500">Complete medical history for {patient.name}</p>
        </div>
        <button className="px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 transition-all flex items-center space-x-2">
          <PrinterIcon className="w-5 h-5" />
          <span>Print Records</span>
        </button>
      </div>

      {/* Patient Info Card */}
      <div className="bg-gradient-to-r from-zennara-green to-emerald-600 rounded-3xl p-10 text-white mb-12 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <img
              src={patient.image}
              alt={patient.name}
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl"
            />
            <div>
              <h2 className="text-3xl font-bold mb-2">{patient.name}</h2>
              <p className="text-base opacity-90 mb-2">{patient.age} {patient.gender === 'Female' ? 'F' : 'M'} | {patient.memberType}</p>
              <div className="flex items-center space-x-6 text-base opacity-90">
                <span className="flex items-center space-x-2">
                  <PhoneIcon className="w-5 h-5" />
                  <span>{patient.phone}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <MailIcon className="w-5 h-5" />
                  <span>{patient.email}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <DocumentIcon className="w-5 h-5" />
                  <span>{patient.id}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="bg-white/20 backdrop-blur rounded-3xl px-8 py-6 text-center">
              <p className="text-sm opacity-75 mb-2">Total Visits</p>
              <p className="text-3xl font-bold">{patient.totalVisits}</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-3xl px-8 py-6 text-center">
              <p className="text-sm opacity-75 mb-2">Total Spent</p>
              <p className="text-3xl font-bold">₹{patient.totalSpent.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-3xl px-8 py-6 text-center">
              <p className="text-sm opacity-75 mb-2">Last Visit</p>
              <p className="text-base font-bold">{patient.lastVisit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 mb-10 flex space-x-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-lg scale-105'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Treatments</span>
                  <span className="font-bold text-gray-900 text-xl">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Active Prescriptions</span>
                  <span className="font-bold text-gray-900 text-xl">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Documents</span>
                  <span className="font-bold text-gray-900 text-xl">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Spent</span>
                  <span className="font-bold text-zennara-green text-xl">{patient.totalSpent}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Allergies</h3>
              <div className="space-y-3">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <p className="font-bold text-red-900 mb-1">🔴 Penicillin</p>
                  <p className="text-sm text-red-700">Severe - Rash, swelling</p>
                </div>
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
                  <p className="font-bold text-orange-900 mb-1">🟠 Sulfa Drugs</p>
                  <p className="text-sm text-orange-700">Moderate - Hives</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Medical Conditions</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  <span className="text-base text-gray-700">Diabetes Type 2 (Controlled)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  <span className="text-base text-gray-700">Hypothyroidism (Stable)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <XCircleIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-base text-gray-500">No other conditions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {treatmentHistory.map((treatment) => (
                <div key={treatment.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                  <div className="flex items-center space-x-6">
                    <CalendarIcon className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{treatment.treatment}</p>
                      <p className="text-base text-gray-500">{treatment.date} • {treatment.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zennara-green text-xl">{treatment.cost}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">{treatment.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Treatment History Tab */}
      {activeTab === 'treatments' && (
        <div className="space-y-6">
          {treatmentHistory.map((treatment) => (
            <div key={treatment.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{treatment.treatment}</h3>
                  <div className="flex items-center space-x-6 text-base text-gray-600">
                    <span className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5" />
                      <span>{treatment.date}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <DoctorIcon className="w-5 h-5" />
                      <span>{treatment.doctor}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <LocationIcon className="w-5 h-5" />
                      <span>{treatment.location}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-zennara-green mb-2">{treatment.cost}</p>
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-bold">{treatment.status}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-base font-bold text-gray-700 mb-2">Doctor's Notes:</p>
                <p className="text-gray-900 text-base">{treatment.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Before/After Photos Tab */}
      {activeTab === 'photos' && (
        <div className="space-y-8">
          {beforeAfterPhotos.map((photoSet) => (
            <div key={photoSet.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{photoSet.treatment}</h3>
              <p className="text-base text-gray-500 mb-6 flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>{photoSet.date} • {photoSet.notes}</span>
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-base font-bold text-gray-700 mb-3">BEFORE</p>
                  <img src={photoSet.beforeUrl} alt="Before" className="w-full rounded-3xl border-2 border-gray-200 shadow-sm" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-700 mb-3">AFTER</p>
                  <img src={photoSet.afterUrl} alt="After" className="w-full rounded-3xl border-2 border-gray-200 shadow-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
          <DocumentIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Prescriptions</h3>
          <p className="text-gray-600 text-lg">Prescription history will appear here</p>
        </div>
      )}
    </div>
  );
}
