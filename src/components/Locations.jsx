import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import BeautifulTimePicker from './BeautifulTimePicker';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const API_URL = `${API_BASE_URL}/api`;

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const Locations = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    address: {
      line1: '',
      line2: '',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: ''
    },
    contact: {
      phone: [''],
      email: ''
    },
    operatingHours: DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: { isOpen: true, openTime: '10:00', closeTime: '19:00' }
    }), {}),
    slotDuration: 30,
    isActive: true,
    description: '',
    amenities: []
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_URL}/branches?activeOnly=false`);
      if (response.data.success) {
        setBranches(response.data.data);
      }
    } catch (error) {
      showSnackbar('Failed to fetch branches', 'error');
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (branch = null) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address,
        contact: branch.contact,
        operatingHours: branch.operatingHours,
        slotDuration: branch.slotDuration,
        isActive: branch.isActive,
        description: branch.description || '',
        amenities: branch.amenities || []
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: '',
        address: {
          line1: '',
          line2: '',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: ''
        },
        contact: {
          phone: [''],
          email: ''
        },
        operatingHours: DAYS_OF_WEEK.reduce((acc, day) => ({
          ...acc,
          [day]: { isOpen: true, openTime: '10:00', closeTime: '19:00' }
        }), {}),
        slotDuration: 30,
        isActive: true,
        description: '',
        amenities: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBranch(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingBranch) {
        const response = await axios.put(
          `${API_URL}/branches/${editingBranch._id}`,
          formData,
          config
        );
        if (response.data.success) {
          showSnackbar('Branch updated successfully', 'success');
        }
      } else {
        const response = await axios.post(
          `${API_URL}/branches`,
          formData,
          config
        );
        if (response.data.success) {
          showSnackbar('Branch created successfully', 'success');
        }
      }

      fetchBranches();
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to save branch', 'error');
      console.error('Error saving branch:', error);
    }
  };

  const handleToggleStatus = async (branchId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.patch(
        `${API_URL}/branches/${branchId}/toggle-status`,
        {},
        config
      );

      if (response.data.success) {
        showSnackbar(response.data.message, 'success');
        fetchBranches();
      }
    } catch (error) {
      showSnackbar('Failed to toggle branch status', 'error');
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (branchId) => {
    if (window.confirm('Are you sure you want to deactivate this branch?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.delete(
          `${API_URL}/branches/${branchId}`,
          config
        );

        if (response.data.success) {
          showSnackbar('Branch deactivated successfully', 'success');
          fetchBranches();
        }
      } catch (error) {
        showSnackbar('Failed to deactivate branch', 'error');
        console.error('Error deleting branch:', error);
      }
    }
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.contact.phone];
    newPhones[index] = value;
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        phone: newPhones
      }
    });
  };

  const addPhoneField = () => {
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        phone: [...formData.contact.phone, '']
      }
    });
  };

  const removePhoneField = (index) => {
    const newPhones = formData.contact.phone.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        phone: newPhones
      }
    });
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [day]: {
          ...formData.operatingHours[day],
          [field]: value
        }
      }
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8 md:p-12">
      {/* Apple-inspired Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-2 tracking-tight">
              Branch Locations
            </h1>
            <p className="text-base text-gray-500">
              Manage all Zennara branch locations, timings, and contact information
            </p>
          </div>
          <button
            onClick={() => handleOpenDialog()}
            className="group px-6 py-3 bg-gradient-to-br from-zennara-green to-emerald-600 hover:from-emerald-600 hover:to-zennara-green text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-zennara-green/30 hover:shadow-xl hover:shadow-zennara-green/40 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Branch</span>
          </button>
        </div>

        {/* Beautiful Apple-inspired Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch._id}
              className={`group relative bg-white rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] ${
                branch.isActive
                  ? 'shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 border border-gray-100'
                  : 'border-2 border-dashed border-gray-300 opacity-70 hover:opacity-90'
              }`}
            >
              {/* Elegant Status Badge */}
              <div className="absolute top-6 right-6">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
                    branch.isActive
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                      : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                  }`}
                >
                  {branch.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Branch Name with Icon */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-zennara-green/10 to-emerald-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-zennara-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {branch.name}
                </h3>
              </div>

              {/* Info Section with Beautiful Spacing */}
              <div className="space-y-4 mb-6">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {branch.address.line1}, {branch.address.line2 && `${branch.address.line2}, `}
                    {branch.address.city} - {branch.address.pincode}
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">
                    {branch.contact.phone.map(p => `+91 ${p}`).join(' / ')}
                  </p>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    {branch.contact.email}
                  </p>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">
                    {formatTime(branch.operatingHours.monday.openTime)} - {formatTime(branch.operatingHours.monday.closeTime)}
                  </p>
                </div>
              </div>

              {/* Elegant Divider */}
              <div className="border-t border-gray-100 my-6"></div>

              {/* Apple-style Action Buttons */}
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleToggleStatus(branch._id)}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    branch.isActive
                      ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                  title={branch.isActive ? 'Deactivate' : 'Activate'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleOpenDialog(branch)}
                  className="p-2.5 bg-zennara-green/10 text-zennara-green hover:bg-zennara-green/20 rounded-xl transition-all duration-300"
                  title="Edit Branch"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(branch._id)}
                  className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300"
                  title="Delete Branch"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {editingBranch ? 'Edit Branch' : 'Add New Branch'}
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
                    placeholder="Enter branch name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all resize-none"
                    placeholder="Brief description of the branch"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    value={formData.address.line1}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line1: e.target.value }})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
                    placeholder="Street address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={formData.address.line2}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line2: e.target.value }})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
                    placeholder="Apartment, suite, etc."
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value }})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value }})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      value={formData.address.pincode}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value }})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Contact Information</h3>
              <div className="space-y-4">
                {formData.contact.phone.map((phone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone {index + 1} *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
                        placeholder="10-digit phone number"
                        required
                      />
                    </div>
                    {formData.contact.phone.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhoneField(index)}
                        className="mt-8 p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPhoneField}
                  className="flex items-center space-x-2 text-sm font-semibold text-zennara-green hover:text-emerald-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Phone Number</span>
                </button>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value }})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
                    placeholder="branch@zennara.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Operating Hours</h3>
              <div className="space-y-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.operatingHours[day].isOpen}
                            onChange={(e) => handleOperatingHoursChange(day, 'isOpen', e.target.checked)}
                            className="w-6 h-6 rounded-lg border-2 border-gray-300 text-zennara-green focus:ring-2 focus:ring-zennara-green/30 focus:border-zennara-green cursor-pointer transition-all checked:bg-zennara-green checked:border-zennara-green appearance-none"
                          />
                          {formData.operatingHours[day].isOpen && (
                            <svg className="absolute inset-0 w-6 h-6 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 capitalize group-hover:text-zennara-green transition-colors">{day}</span>
                      </label>
                      {formData.operatingHours[day].isOpen && (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                          {formatTime(formData.operatingHours[day].openTime)} - {formatTime(formData.operatingHours[day].closeTime)}
                        </span>
                      )}
                    </div>
                    {formData.operatingHours[day].isOpen && (
                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                        <BeautifulTimePicker
                          label="Open Time"
                          value={formatTime(formData.operatingHours[day].openTime)}
                          onChange={(time) => {
                            // Convert from "10:00 AM" to "10:00" format
                            const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
                            if (match) {
                              let hour = parseInt(match[1]);
                              const minute = match[2];
                              const period = match[3].toUpperCase();
                              
                              if (period === 'PM' && hour !== 12) hour += 12;
                              if (period === 'AM' && hour === 12) hour = 0;
                              
                              const timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;
                              handleOperatingHoursChange(day, 'openTime', timeStr);
                            }
                          }}
                        />
                        <BeautifulTimePicker
                          label="Close Time"
                          value={formatTime(formData.operatingHours[day].closeTime)}
                          onChange={(time) => {
                            // Convert from "10:00 AM" to "10:00" format
                            const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
                            if (match) {
                              let hour = parseInt(match[1]);
                              const minute = match[2];
                              const period = match[3].toUpperCase();
                              
                              if (period === 'PM' && hour !== 12) hour += 12;
                              if (period === 'AM' && hour === 12) hour = 0;
                              
                              const timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;
                              handleOperatingHoursChange(day, 'closeTime', timeStr);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Slot Configuration & Status */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Slot Duration</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minutes *</label>
                  <input
                    type="number"
                    value={formData.slotDuration}
                    onChange={(e) => setFormData({ ...formData, slotDuration: parseInt(e.target.value) })}
                    min={15}
                    max={120}
                    step={15}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-zennara-green focus:border-zennara-green outline-none transition-all"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">Set between 15-120 minutes</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Branch Status</h3>
                <label className="flex items-center space-x-4 cursor-pointer bg-white border-2 border-gray-100 p-5 rounded-2xl hover:border-gray-200 hover:shadow-md transition-all duration-300 group">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-6 h-6 rounded-lg border-2 border-gray-300 text-zennara-green focus:ring-2 focus:ring-zennara-green/30 focus:border-zennara-green cursor-pointer transition-all checked:bg-zennara-green checked:border-zennara-green appearance-none"
                    />
                    {formData.isActive && (
                      <svg className="absolute inset-0 w-6 h-6 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-zennara-green transition-colors">Active Branch</div>
                    <div className="text-xs text-gray-600 mt-0.5">Visible to customers in the app</div>
                  </div>
                  {formData.isActive && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">Active</span>
                  )}
                </label>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ p: 0 }}>
          <div className="w-full px-8 py-6 border-t border-gray-100 flex items-center justify-end space-x-3 bg-gray-50">
            <button
              onClick={handleCloseDialog}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-br from-zennara-green to-emerald-600 hover:from-emerald-600 hover:to-zennara-green text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              {editingBranch ? 'Update Branch' : 'Create Branch'}
            </button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Locations;
