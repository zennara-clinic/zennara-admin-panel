import { useNavigate, useParams } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  DoctorIcon,
  UsersIcon,
  PhoneIcon,
  MailIcon,
  DocumentIcon,
  CurrencyIcon,
  CheckCircleIcon,
  RefreshIcon,
  XCircleIcon,
  BellIcon,
  ChatIcon,
  PrinterIcon,
  ChevronDownIcon
} from './Icons';

export default function AppointmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Sample data - in real app, fetch based on ID
  const appointment = {
    id: 'ZEN2025001234',
    status: 'Confirmed',
    bookedOn: 'Oct 15, 2025 2:30 PM',
    treatment: {
      name: 'HydraFacial',
      category: 'Facials',
      price: '₹8,850',
      duration: '60 minutes',
      doctor: 'Dr. Rickson Pereira'
    },
    patient: {
      name: 'Khushnoor',
      phone: '9014325546',
      email: 'thekhushnoor@gmail.com',
      memberType: 'Premium Zen Member',
      image: 'https://i.pravatar.cc/150?img=12',
      formCompleted: true,
      formDate: 'Oct 15, 2:45 PM',
      allergies: ['Penicillin (Severe)', 'Sulfa drugs'],
      medications: ['Metformin', 'Thyronorm']
    },
    booking: {
      date: 'Wednesday, Oct 16, 2025',
      time: '10:00 AM',
      location: 'Jubilee Hills',
      slots: [
        { time: '10:00 AM', selected: true },
        { time: '11:00 AM', selected: false },
        { time: '2:00 PM', selected: false }
      ]
    },
    checkIn: {
      opensAt: '9:45 AM',
      status: 'Not checked in'
    },
    payment: {
      amount: '₹8,850',
      status: 'Pending',
      method: '-'
    },
    activityLog: [
      { time: 'Oct 15, 2:45 PM', action: 'Medical form submitted' },
      { time: 'Oct 15, 2:35 PM', action: 'Reminder sent to patient' },
      { time: 'Oct 15, 2:30 PM', action: 'Appointment confirmed by admin' },
      { time: 'Oct 15, 2:28 PM', action: 'Booking created' }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rescheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Progress':
        return 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse';
      case 'Completed':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'No Show':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Cancelled':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <button
            onClick={() => navigate('/appointments')}
            className="text-sm font-semibold text-gray-500 hover:text-zennara-green mb-3 flex items-center space-x-2 transition-colors"
          >
            <span>←</span>
            <span>Back to Appointments</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Appointment Details</h1>
          <p className="text-gray-500 text-base">Complete information for booking {appointment.id}</p>
        </div>
        <button
          onClick={() => navigate('/appointments')}
          className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-gray-700 transition-all"
        >
          Close
        </button>
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className={`px-5 py-2.5 rounded-2xl font-bold text-sm uppercase border-2 ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Booking ID</p>
              <p className="text-lg font-bold text-gray-900">{appointment.id}</p>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Booked on</p>
              <p className="text-lg font-bold text-gray-900">{appointment.bookedOn}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Treatment Information */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Treatment Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Treatment</span>
                <span className="text-gray-900 font-bold text-lg">{appointment.treatment.name}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Category</span>
                <span className="text-gray-900 font-semibold">{appointment.treatment.category}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Price</span>
                <span className="text-zennara-green font-bold text-lg">{appointment.treatment.price}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Duration</span>
                <span className="text-gray-900 font-semibold">~{appointment.treatment.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Assigned Doctor</span>
                <span className="text-gray-900 font-semibold">{appointment.treatment.doctor}</span>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Details</h3>
            
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
              <img
                src={appointment.patient.image}
                alt={appointment.patient.name}
                className="w-20 h-20 rounded-2xl border-2 border-gray-200"
              />
              <div>
                <h4 className="text-xl font-bold text-gray-900">{appointment.patient.name}</h4>
                <p className="text-sm text-purple-600 font-semibold">{appointment.patient.memberType}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Phone</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-semibold">{appointment.patient.phone}</span>
                  <button className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <PhoneIcon className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <ChatIcon className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Email</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-semibold">{appointment.patient.email}</span>
                  <button className="p-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <MailIcon className="w-4 h-4 text-purple-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Medical Form */}
            <div className="bg-green-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-gray-900">Medical Form Completed</span>
                </div>
                <span className="text-sm text-gray-600">{appointment.patient.formDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-xl font-semibold text-sm transition-colors border border-gray-200">
                  View Form
                </button>
                <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-xl font-semibold text-sm transition-colors border border-gray-200">
                  Download PDF
                </button>
              </div>
            </div>

            {/* Allergies & Medications */}
            <div className="space-y-3">
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                <p className="font-bold text-gray-900 mb-2 flex items-center space-x-2">
                  <span className="text-red-600">⚠</span>
                  <span>Allergies</span>
                </p>
                <p className="text-sm text-gray-700">{appointment.patient.allergies.join(', ')}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <p className="font-bold text-gray-900 mb-2">Current Medications</p>
                <p className="text-sm text-gray-700">{appointment.patient.medications.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Check-in Status */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Check-In Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Check-in opens at</span>
                <span className="text-gray-900 font-semibold">{appointment.checkIn.opensAt} (15 min before)</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="text-gray-900 font-semibold">{appointment.checkIn.status}</span>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all">
                Mark as Checked In
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Booking Details */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Preferred Date</span>
                <span className="text-gray-900 font-semibold">{appointment.booking.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Confirmed Time</span>
                <span className="text-gray-900 font-bold text-lg">{appointment.booking.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Location</span>
                <span className="text-gray-900 font-semibold">{appointment.booking.location}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Time Preferences</p>
              <div className="space-y-2">
                {appointment.booking.slots.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border-2 flex items-center justify-between ${
                      slot.selected
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className="font-semibold text-gray-900">Slot {index + 1}: {slot.time}</span>
                    {slot.selected && (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Status</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Amount</span>
                <span className="text-zennara-green font-bold text-2xl">{appointment.payment.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="px-4 py-1.5 rounded-xl bg-yellow-100 text-yellow-700 font-bold text-sm">
                  {appointment.payment.status}
                </span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Payment Method</span>
                <span className="text-gray-900 font-semibold">{appointment.payment.method}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-zennara-green text-white rounded-2xl font-bold hover:bg-zennara-green/90 transition-all">
                Record Payment
              </button>
              <button className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all">
                Generate Invoice
              </button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Log</h3>
            <div className="space-y-3 mb-4">
              {appointment.activityLog.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-zennara-green mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all">
              View Full History
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button className="flex flex-col items-center space-y-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-all">
            <CheckCircleIcon className="w-6 h-6 text-purple-600" />
            <span className="font-semibold text-sm text-gray-900">Start Treatment</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-all">
            <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
            <span className="font-semibold text-sm text-gray-900">Complete & Rate</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 bg-red-50 hover:bg-red-100 rounded-2xl transition-all">
            <XCircleIcon className="w-6 h-6 text-red-600" />
            <span className="font-semibold text-sm text-gray-900">Mark No-Show</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all">
            <RefreshIcon className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-sm text-gray-900">Reschedule</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center space-y-2 p-4 bg-pink-50 hover:bg-pink-100 rounded-2xl transition-all">
            <XCircleIcon className="w-6 h-6 text-pink-600" />
            <span className="font-semibold text-sm text-gray-900">Cancel</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-2xl transition-all">
            <BellIcon className="w-6 h-6 text-yellow-600" />
            <span className="font-semibold text-sm text-gray-900">Send Reminder</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 rounded-2xl transition-all">
            <ChatIcon className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-sm text-gray-900">Send Message</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
            <PrinterIcon className="w-6 h-6 text-gray-600" />
            <span className="font-semibold text-sm text-gray-900">Print Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
}
