import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Beaker, TrendingUp, AlertCircle } from 'lucide-react';
import api, { API_BASE_URL } from '../config/api';

const Formulations = () => {
  const [formulations, setFormulations] = useState([]);
  const [filteredFormulations, setFilteredFormulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingFormulation, setEditingFormulation] = useState(null);
  const [statistics, setStatistics] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchFormulations();
    fetchStatistics();
  }, []);

  useEffect(() => {
    filterFormulations();
  }, [formulations, searchTerm, filterActive]);

  const fetchFormulations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/formulations');
      if (response.data.success) {
        setFormulations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching formulations:', error);
      alert('Failed to fetch formulations');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/admin/formulations/statistics');
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const filterFormulations = () => {
    let filtered = [...formulations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(formulation =>
        formulation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formulation.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Active filter
    if (filterActive !== 'all') {
      filtered = filtered.filter(formulation => 
        filterActive === 'active' ? formulation.isActive : !formulation.isActive
      );
    }

    setFilteredFormulations(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFormulation) {
        const response = await api.put(`/admin/formulations/${editingFormulation._id}`, formData);
        if (response.data.success) {
          alert('Formulation updated successfully');
          fetchFormulations();
          fetchStatistics();
          closeModal();
        }
      } else {
        const response = await api.post('/admin/formulations', formData);
        if (response.data.success) {
          alert('Formulation created successfully');
          fetchFormulations();
          fetchStatistics();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving formulation:', error);
      alert(error.response?.data?.message || 'Failed to save formulation');
    }
  };

  const handleEdit = (formulation) => {
    setEditingFormulation(formulation);
    setFormData({
      name: formulation.name,
      description: formulation.description || '',
      isActive: formulation.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name, productsCount) => {
    if (productsCount > 0) {
      alert(`Cannot delete formulation "${name}". ${productsCount} product(s) are using this formulation.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete formulation "${name}"?`)) {
      try {
        const response = await api.delete(`/admin/formulations/${id}`);
        if (response.data.success) {
          alert('Formulation deleted successfully');
          fetchFormulations();
          fetchStatistics();
        }
      } catch (error) {
        console.error('Error deleting formulation:', error);
        alert(error.response?.data?.message || 'Failed to delete formulation');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFormulation(null);
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zennara-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Formulation Management
            </h1>
            <p className="text-gray-600 font-medium">Manage product formulations and types</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Total Formulations</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{statistics.total}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>All registered formulations</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Beaker className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Active Formulations</p>
                <p className="text-4xl font-black text-emerald-600 mb-1">{statistics.active}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Currently active</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Inactive Formulations</p>
                <p className="text-4xl font-black text-gray-400 mb-1">{statistics.inactive}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Temporarily disabled</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search formulations by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 font-medium shadow-sm"
            />
          </div>

          {/* Filters and Actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="appearance-none px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium shadow-sm pr-12 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <Plus className="w-3 h-3" />
              </div>
              <span>Add New Formulation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulations Table */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
              <tr>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Formulation
                </th>
                <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {filteredFormulations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Beaker className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900 mb-1">No formulations found</p>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFormulations.map((formulation) => (
                  <tr key={formulation._id} className="hover:bg-white/50 transition-all duration-200 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                          <Beaker className="w-7 h-7 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg mb-1">{formulation.name}</p>
                          <p className="text-sm text-gray-500 font-medium">
                            Created {new Date(formulation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-gray-700 font-medium leading-relaxed max-w-xs">
                        {formulation.description || <span className="text-gray-400 italic">No description</span>}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-bold shadow-sm">
                        <Beaker className="w-4 h-4" />
                        <span>{formulation.productsCount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold shadow-sm ${
                        formulation.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          formulation.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                        }`}></div>
                        <span>{formulation.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(formulation)}
                          className="p-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Edit Formulation"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(formulation._id, formulation.name, formulation.productsCount)}
                          className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Delete Formulation"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80 p-8 border-b border-gray-100/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Beaker className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {editingFormulation ? 'Edit Formulation' : 'Add New Formulation'}
                  </h2>
                  <p className="text-gray-600 font-medium">
                    {editingFormulation ? 'Update formulation information' : 'Create a new formulation type'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    Formulation Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium shadow-sm"
                    placeholder="Enter formulation name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium shadow-sm resize-none"
                    placeholder="Enter formulation description"
                  />
                </div>

                <div className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-2xl">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-6 h-6 text-purple-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="isActive" className="text-lg font-bold text-gray-900 cursor-pointer">
                      Active Formulation
                    </label>
                    <p className="text-sm text-gray-600 font-medium">
                      Enable this formulation for use in products
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100/50">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  {editingFormulation ? 'Update Formulation' : 'Create Formulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Formulations;
