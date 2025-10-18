import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
  PrinterIcon,
  EyeIcon,
  BellIcon,
  ChevronDownIcon,
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  StarIcon
} from './Icons';

export default function PatientFormView() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    reason: true,
    medical: true,
    medications: true,
    allergies: true,
    lifestyle: false,
    skin: false,
    womensHealth: false,
    consents: false,
    admin: false,
    history: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formData = {
    id: 'FORM_001234',
    patient: {
      name: 'Khushnoor',
      age: 28,
      gender: 'Female',
      dob: 'May 15, 1997',
      memberType: 'Premium Member',
      occupation: 'Software Engineer',
      maritalStatus: 'Single',
      phone: '9014325546',
      email: 'thekhushnoor@gmail.com',
      address: 'Jubilee Hills, Hyderabad',
      image: 'https://i.pravatar.cc/150?img=12'
    },
    appointment: {
      treatment: 'HydraFacial',
      date: 'Oct 16, 10:00 AM',
      doctor: 'Dr. Rickson Pereira'
    },
    status: {
      submitted: true,
      reviewed: true,
      submittedDate: 'Oct 15, 2025 2:45 PM',
      reviewedDate: 'Oct 16, 2025 9:30 AM'
    }
  };

  const SectionHeader = ({ title, status, isExpanded, onClick, critical }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${
        critical 
          ? 'bg-red-50 border-2 border-red-200 hover:bg-red-100'
          : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center space-x-3">
        <ChevronDownIcon className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {status && (
          <span className="text-sm font-semibold text-gray-600">{status}</span>
        )}
      </div>
      {critical && (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-xl font-bold text-xs">CRITICAL</span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen p-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <button
            onClick={() => navigate('/patients/forms')}
            className="text-sm font-semibold text-gray-500 hover:text-zennara-green mb-3 flex items-center space-x-2 transition-colors"
          >
            <span>←</span>
            <span>Back to Forms</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Medical Form</h1>
          <p className="text-gray-500 text-base">Form ID: {formData.id}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-5 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 transition-all flex items-center space-x-2">
            <PrinterIcon className="w-5 h-5" />
            <span>Print</span>
          </button>
          <button
            onClick={() => navigate('/patients/forms')}
            className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-gray-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="bg-gradient-to-r from-zennara-green to-emerald-600 rounded-3xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <img
              src={formData.patient.image}
              alt={formData.patient.name}
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold mb-2">{formData.patient.name}</h2>
              <p className="text-lg opacity-90">{formData.patient.age}F | {formData.patient.memberType}</p>
              <p className="text-base opacity-90 mt-1">{formData.appointment.treatment} | {formData.appointment.date}</p>
              <p className="text-base opacity-90">Assigned to: {formData.appointment.doctor}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircleIcon className="w-6 h-6" />
              <span className="font-bold">Submitted</span>
            </div>
            <div className="flex items-center space-x-2">
              <EyeIcon className="w-6 h-6" />
              <span className="font-bold">Reviewed by Doctor</span>
            </div>
            <p className="text-sm opacity-75 mt-2">Submitted: {formData.status.submittedDate}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Personal Information"
            status="✅"
            isExpanded={expandedSections.personal}
            onClick={() => toggleSection('personal')}
          />
          {expandedSections.personal && (
            <div className="mt-6 grid grid-cols-2 gap-6 pl-6">
              <div><span className="text-gray-600 font-medium">Full Name:</span> <span className="font-semibold text-gray-900">{formData.patient.name}</span></div>
              <div><span className="text-gray-600 font-medium">Age / DOB:</span> <span className="font-semibold text-gray-900">{formData.patient.age} | {formData.patient.dob}</span></div>
              <div><span className="text-gray-600 font-medium">Gender:</span> <span className="font-semibold text-gray-900">{formData.patient.gender}</span></div>
              <div><span className="text-gray-600 font-medium">Occupation:</span> <span className="font-semibold text-gray-900">{formData.patient.occupation}</span></div>
              <div><span className="text-gray-600 font-medium">Marital Status:</span> <span className="font-semibold text-gray-900">{formData.patient.maritalStatus}</span></div>
              <div><span className="text-gray-600 font-medium">Contact:</span> <span className="font-semibold text-gray-900">{formData.patient.phone}</span></div>
              <div className="col-span-2"><span className="text-gray-600 font-medium">Email:</span> <span className="font-semibold text-gray-900">{formData.patient.email}</span></div>
              <div className="col-span-2"><span className="text-gray-600 font-medium">Address:</span> <span className="font-semibold text-gray-900">{formData.patient.address}</span></div>
              <div className="col-span-2 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
                <p className="font-bold text-gray-900 mb-1">⚠️ Emergency Contact</p>
                <p className="text-sm text-gray-600">Not provided - Admin should request this information</p>
              </div>
            </div>
          )}
        </div>

        {/* Reason for Visit */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Reason for Visit"
            status="✅"
            isExpanded={expandedSections.reason}
            onClick={() => toggleSection('reason')}
          />
          {expandedSections.reason && (
            <div className="mt-6 space-y-4 pl-6">
              <div><span className="text-gray-600 font-medium">Primary Concern:</span> <span className="font-semibold text-gray-900">Pigmentation</span></div>
              <div><span className="text-gray-600 font-medium">Duration:</span> <span className="font-semibold text-gray-900">6 months</span></div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-600 font-medium mb-2">Patient Details:</p>
                <p className="text-gray-900">"Dark spots on cheeks and forehead, especially after sun exposure"</p>
              </div>
              <div><span className="text-gray-600 font-medium">Previous Treatments:</span> <span className="font-semibold text-gray-900">Vitamin C serum (3 months)</span></div>
              <div><span className="text-gray-600 font-medium">Expected Outcome:</span> <span className="font-semibold text-gray-900">Clear, even skin tone</span></div>
            </div>
          )}
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Medical History"
            status="⚠️ IMPORTANT"
            isExpanded={expandedSections.medical}
            onClick={() => toggleSection('medical')}
            critical
          />
          {expandedSections.medical && (
            <div className="mt-6 space-y-4 pl-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                <p className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-red-600" />
                  <span>Diabetes - Type 2 (Controlled)</span>
                </p>
                <p className="text-sm text-gray-700">Medication: Metformin 500mg - 2x daily</p>
                <p className="text-sm text-gray-700">Last HbA1c: 6.2% (Good control)</p>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <p className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                  <span>Thyroid Disorder - Hypothyroid</span>
                </p>
                <p className="text-sm text-gray-700">Medication: Thyronorm 50mcg - Once daily</p>
                <p className="text-sm text-gray-700">Last TSH: 3.5 (Normal range)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2"><XCircleIcon className="w-5 h-5 text-gray-400" /> <span>Hypertension: No</span></div>
                <div className="flex items-center space-x-2"><XCircleIcon className="w-5 h-5 text-gray-400" /> <span>PCOD/PCOS: No</span></div>
                <div className="flex items-center space-x-2"><XCircleIcon className="w-5 h-5 text-gray-400" /> <span>Heart Conditions: No</span></div>
                <div className="flex items-center space-x-2"><XCircleIcon className="w-5 h-5 text-gray-400" /> <span>Liver/Kidney Issues: No</span></div>
                <div className="flex items-center space-x-2"><XCircleIcon className="w-5 h-5 text-gray-400" /> <span>Autoimmune Disorders: No</span></div>
                <div className="flex items-center space-x-2"><XCircleIcon className="w-5 h-5 text-gray-400" /> <span>Cancer History: No</span></div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mt-4">
                <p className="font-bold text-gray-900 mb-2">📌 Doctor's Note (Added by Dr. Rickson):</p>
                <p className="text-gray-700">"Monitor blood sugar before treatment. Thyroid stable - proceed with treatment."</p>
              </div>
            </div>
          )}
        </div>

        {/* Current Medications */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Current Medications"
            status="💊 3 Medications"
            isExpanded={expandedSections.medications}
            onClick={() => toggleSection('medications')}
          />
          {expandedSections.medications && (
            <div className="mt-6 space-y-4 pl-6">
              {[
                { name: 'Metformin 500mg', dosage: 'Twice daily (Morning & Evening)', purpose: 'Diabetes management' },
                { name: 'Thyronorm 50mcg', dosage: 'Once daily (Morning, empty stomach)', purpose: 'Hypothyroidism' },
                { name: 'Vitamin D3 60,000 IU', dosage: 'Once weekly', purpose: 'Vitamin D deficiency' }
              ].map((med, idx) => (
                <div key={idx} className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4">
                  <p className="font-bold text-gray-900 mb-2">{idx + 1}. {med.name}</p>
                  <p className="text-sm text-gray-700">Dosage: {med.dosage}</p>
                  <p className="text-sm text-gray-700">Purpose: {med.purpose}</p>
                </div>
              ))}
              <button className="w-full py-3 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-2xl font-bold text-yellow-700 transition-all">
                ⚠️ Run Drug Interaction Check
              </button>
            </div>
          )}
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Allergies"
            status="🔴 CRITICAL - 2 Drug Allergies"
            isExpanded={expandedSections.allergies}
            onClick={() => toggleSection('allergies')}
            critical
          />
          {expandedSections.allergies && (
            <div className="mt-6 space-y-4 pl-6">
              <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4">
                <p className="font-bold text-red-900 mb-3">DRUG ALLERGIES:</p>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-3">
                    <p className="font-bold text-gray-900">🔴 Penicillin</p>
                    <p className="text-sm text-gray-700">Reaction: Severe rash, swelling</p>
                    <p className="text-sm text-gray-700">Severity: <span className="font-bold text-red-600">HIGH</span></p>
                    <p className="text-sm text-gray-700">Last Reaction: 2020</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="font-bold text-gray-900">🔴 Sulfa Drugs</p>
                    <p className="text-sm text-gray-700">Reaction: Hives, itching</p>
                    <p className="text-sm text-gray-700">Severity: <span className="font-bold text-orange-600">MODERATE</span></p>
                    <p className="text-sm text-gray-700">Last Reaction: 2021</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="font-semibold text-gray-900">FOOD ALLERGIES: None reported</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="font-semibold text-gray-900 mb-2">SKIN PRODUCT REACTIONS:</p>
                <p className="text-sm text-gray-700">• Retinol - Initial irritation (resolved)</p>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
                <p className="font-bold text-gray-900">⚠️ ALERT:</p>
                <p className="text-sm text-gray-700">These allergies will auto-flag during prescription creation</p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Notes & Actions */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Admin Notes & Actions"
            isExpanded={expandedSections.admin}
            onClick={() => toggleSection('admin')}
          />
          {expandedSections.admin && (
            <div className="mt-6 space-y-4 pl-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 font-medium">Form Completeness:</span> 
                  <span className="font-semibold text-gray-900 inline-flex items-center space-x-1 ml-2">
                    <StarIcon className="w-4 h-4 text-yellow-600" />
                    <StarIcon className="w-4 h-4 text-yellow-600" />
                    <StarIcon className="w-4 h-4 text-yellow-600" />
                    <StarIcon className="w-4 h-4 text-yellow-600" />
                    <StarIcon className="w-4 h-4 text-yellow-600" />
                    <span className="ml-1">(100%)</span>
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Review Status:</span> 
                  <span className="font-semibold text-green-600 inline-flex items-center space-x-1 ml-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Reviewed by Dr. Rickson</span>
                  </span>
                </div>
                <div className="col-span-2"><span className="text-gray-600 font-medium">Reviewed On:</span> <span className="font-semibold text-gray-900">{formData.status.reviewedDate}</span></div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Admin Notes:</label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zennara-green"
                  rows={4}
                  placeholder="Add admin comments..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-gray-600 font-medium">Follow-up Required:</span> <span className="font-semibold text-gray-900">❌ No</span></div>
                <div><span className="text-gray-600 font-medium">Additional Tests Needed:</span> <span className="font-semibold text-gray-900">❌ No</span></div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <button className="py-3 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-2xl font-bold text-green-700 transition-all">
                  ✅ Mark as Reviewed
                </button>
                <button className="py-3 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-2xl font-bold text-gray-700 transition-all">
                  🔒 Lock Form
                </button>
                <button className="py-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-2xl font-bold text-blue-700 transition-all flex items-center justify-center space-x-2">
                  <MailIcon className="w-5 h-5" />
                  <span>Request Update</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form History & Audit Trail */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <SectionHeader
            title="Form History & Audit Trail"
            isExpanded={expandedSections.history}
            onClick={() => toggleSection('history')}
          />
          {expandedSections.history && (
            <div className="mt-6 pl-6">
              <div className="space-y-3">
                {[
                  { time: 'Oct 16, 9:30 AM', action: 'Reviewed by Dr. Rickson', color: 'green' },
                  { time: 'Oct 15, 2:45 PM', action: 'Form submitted by patient', color: 'blue' },
                  { time: 'Oct 15, 2:30 PM', action: 'Section 8 completed', color: 'gray' },
                  { time: 'Oct 15, 2:25 PM', action: 'Section 7 completed', color: 'gray' },
                  { time: 'Oct 15, 2:20 PM', action: 'Auto-saved (Draft)', color: 'yellow' },
                  { time: 'Oct 15, 2:10 PM', action: 'Patient started form', color: 'purple' },
                  { time: 'Oct 15, 2:08 PM', action: 'Form link sent via SMS', color: 'blue' },
                  { time: 'Oct 15, 2:05 PM', action: 'Form created for appointment', color: 'green' }
                ].map((entry, idx) => (
                  <div key={idx} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-${entry.color}-500`}></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{entry.action}</p>
                      <p className="text-xs text-gray-500">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all">
                View Full Audit Log
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
