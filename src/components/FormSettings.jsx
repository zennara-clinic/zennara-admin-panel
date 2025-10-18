import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentIcon,
  SettingsIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  EyeIcon
} from './Icons';

export default function FormSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sections');

  const formSections = [
    { id: 1, name: 'Personal Information', required: true, enabled: true, order: 1, fields: 8 },
    { id: 2, name: 'Reason for Visit', required: true, enabled: true, order: 2, fields: 5 },
    { id: 3, name: 'Medical History', required: true, enabled: true, order: 3, fields: 15 },
    { id: 4, name: 'Current Medications', required: true, enabled: true, order: 4, fields: 3 },
    { id: 5, name: 'Allergies', required: true, enabled: true, order: 5, fields: 4 },
    { id: 6, name: 'Lifestyle Factors', required: false, enabled: true, order: 6, fields: 8 },
    { id: 7, name: 'Skin Assessment', required: false, enabled: true, order: 7, fields: 6 },
    { id: 8, name: "Women's Health", required: false, enabled: true, order: 8, fields: 7 },
    { id: 9, name: 'Consents & Agreements', required: true, enabled: true, order: 9, fields: 4 }
  ];

  const formTemplates = [
    { id: 1, name: 'General Consultation Form', type: 'Default', sections: 9, usage: 234, status: 'Active' },
    { id: 2, name: 'First Visit Form', type: 'New Patient', sections: 9, usage: 89, status: 'Active' },
    { id: 3, name: 'Follow-up Form', type: 'Return Patient', sections: 5, usage: 156, status: 'Active' },
    { id: 4, name: 'Procedure Consent Form', type: 'Treatment', sections: 3, usage: 78, status: 'Active' }
  ];

  const notificationSettings = [
    { id: 1, event: 'Form Submitted', sms: true, email: true, inApp: true },
    { id: 2, event: 'Form Incomplete (24hrs)', sms: true, email: false, inApp: true },
    { id: 3, event: 'Form Reviewed', sms: false, email: true, inApp: true },
    { id: 4, event: 'Form Updated', sms: false, email: false, inApp: true }
  ];

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Form Template Settings</h1>
          <p className="text-gray-500 text-base">Configure and manage patient medical forms</p>
        </div>
        <button
          onClick={() => navigate('/patients/forms')}
          className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-gray-700 transition-all"
        >
          Close
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 mb-8 inline-flex space-x-2">
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
            activeTab === 'sections'
              ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Form Sections
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
            activeTab === 'templates'
              ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
            activeTab === 'notifications'
              ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
            activeTab === 'general'
              ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          General Settings
        </button>
      </div>

      {/* Form Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">Configure which sections appear in patient forms</p>
            <button className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
              <PlusIcon className="w-5 h-5" />
              <span>Add New Section</span>
            </button>
          </div>

          <div className="space-y-4">
            {formSections.map((section) => (
              <div key={section.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                      {section.order}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{section.name}</h3>
                        {section.required && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-xl text-xs font-bold">REQUIRED</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{section.fields} fields</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={section.enabled} className="sr-only peer" readOnly />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zennara-green"></div>
                      </label>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-sm transition-all">
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-semibold text-sm transition-all flex items-center space-x-2">
                      <EyeIcon className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">Manage form templates for different appointment types</p>
            <button className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
              <PlusIcon className="w-5 h-5" />
              <span>Create Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
                    <DocumentIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-xl text-xs font-bold">
                    {template.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.type}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Sections</p>
                    <p className="text-lg font-bold text-gray-900">{template.sections}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Usage</p>
                    <p className="text-lg font-bold text-gray-900">{template.usage}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-sm transition-all">
                    Edit
                  </button>
                  <button className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-semibold text-sm transition-all">
                    Duplicate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <p className="text-gray-600 mb-6">Configure notification preferences for form events</p>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Triggers</h3>
            <div className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <p className="font-semibold text-gray-900">{setting.event}</p>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={setting.sms} className="w-5 h-5 text-zennara-green rounded" readOnly />
                      <span className="text-sm font-medium text-gray-700">SMS</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={setting.email} className="w-5 h-5 text-zennara-green rounded" readOnly />
                      <span className="text-sm font-medium text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={setting.inApp} className="w-5 h-5 text-zennara-green rounded" readOnly />
                      <span className="text-sm font-medium text-gray-700">In-App</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">General Form Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Auto-save Interval</label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green">
                  <option>Every 30 seconds</option>
                  <option>Every 1 minute</option>
                  <option>Every 2 minutes</option>
                  <option>Every 5 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Form Expiry</label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-zennara-green">
                  <option>24 hours</option>
                  <option>48 hours</option>
                  <option>7 days</option>
                  <option>Never expire</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-900">Require Digital Signature</p>
                  <p className="text-sm text-gray-600">Patient must sign forms digitally</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" readOnly />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zennara-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-900">Send SMS Reminders</p>
                  <p className="text-sm text-gray-600">Remind patients about incomplete forms</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" readOnly />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zennara-green"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-gray-700 transition-all">
              Cancel
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
