import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  DollarSign, 
  Calendar,
  FileText,
  CheckCircle,
  Save
} from 'lucide-react';
import SearchableProductDropdown from '../components/SearchableProductDropdown';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export default function AddInventory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formulations, setFormulations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    inventoryName: '',
    inventoryCategory: 'Retail products',
    code: '',
    batchMaintenance: 'Non Batchable',
    batchNo: '',
    batchExpiryDate: '',
    qohBatchWise: 0,
    qohAllBatches: 0,
    batchTaxName: '',
    batchBuyingPrice: '',
    batchAfterTaxBuyingPrice: '',
    batchSellingPrice: '',
    batchAfterTaxSellingPrice: '',
    batchType: 'FIFO',
    gstPercentage: 18,
    inventoryBuyingPrice: '',
    inventoryAfterTaxBuyingPrice: '',
    inventorySellingPrice: '',
    inventoryAfterTaxSellingPrice: '',
    vendorName: '',
    reOrderLevel: 0,
    targetLevel: 0,
    formulation: '',
    packName: '',
    packSize: 1,
    hasGenerics: 'No',
    hasProtocol: 'No',
    commissionRate: '0.00',
    orgName: ''
  });

  useEffect(() => {
    fetchFormulations();
    fetchVendors();
    fetchOrganizations();
  }, []);

  const fetchFormulations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/formulations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        const formulations = response.data.data.map(f => f.name || f).sort();
        setFormulations(formulations);
      }
    } catch (error) {
      console.error('Error fetching formulations:', error);
      setFormulations(['Serum', 'Cream', 'Face Wash', 'Hydrafacial Consumable']);
    }
  };

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/vendors`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        const vendors = response.data.data.map(v => v.name).filter(Boolean).sort();
        setVendors(vendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors(['Super Drug Company', 'Spectra Medical']);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/brands`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        const orgs = response.data.data.map(b => b.name || b.OrgName || b).sort();
        setOrganizations(orgs);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setOrganizations(['Zennara Clinic - Jubliee Hills']);
    }
  };

  // Handle product selection and auto-fill fields
  const handleProductSelect = (product) => {
    if (product && typeof product === 'object') {
      console.log('Selected product:', product);
      console.log('Product code:', product.code);
      setFormData(prev => ({
        ...prev,
        inventoryName: product.name || '',
        code: product.code || '',
        formulation: product.formulation || '',
        orgName: product.brand || product.OrgName || '',
        qohAllBatches: product.stock || 0,
        gstPercentage: product.gstPercentage || 18,
        inventoryBuyingPrice: product.buyingPrice || product.price || '',
        inventoryAfterTaxBuyingPrice: product.buyingPrice ? calculateAfterTax(product.buyingPrice, product.gstPercentage || 18) : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, inventoryName: product || '' }));
    }
  };

  // Calculate after-tax price
  const calculateAfterTax = (price, gstPercent) => {
    const priceNum = parseFloat(price) || 0;
    const gst = parseFloat(gstPercent) || 0;
    return (priceNum * (1 + gst / 100)).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Legacy function - now uses gstPercentage from formData
  const calculateAfterTaxPrice = (basePrice, taxRate) => {
    return calculateAfterTax(basePrice, formData.gstPercentage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      
      await axios.post(`${API_URL}/admin/inventory`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/inventory');
      }, 2000);

    } catch (error) {
      console.error('Error creating inventory:', error);
      setError(error.response?.data?.message || 'Failed to create inventory item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 p-4 md:p-8">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/inventory')}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Inventory</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Add Inventory Item
              </h1>
              <p className="text-gray-600 font-medium">Create a new inventory item with batch details</p>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-8 right-8 z-50 animate-slide-in-right">
            <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden backdrop-blur-xl">
              <div className="flex items-center gap-4 p-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 mb-1">Success!</h3>
                  <p className="text-sm font-medium text-gray-600">Inventory item created successfully</p>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="fixed top-8 right-8 z-50 animate-slide-in-right">
            <div className="bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden backdrop-blur-xl">
              <div className="flex items-center gap-4 p-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 mb-1">Error</h3>
                  <p className="text-sm font-medium text-gray-600">{error}</p>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-600">Item details and categorization</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name - Searchable Dropdown */}
              <div className="md:col-span-2">
                <SearchableProductDropdown
                  value={formData.inventoryName}
                  onChange={handleProductSelect}
                  required={false}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="inventoryCategory"
                  value={formData.inventoryCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="Retail products">Retail products</option>
                  <option value="Consumables">Consumables</option>
                </select>
              </div>

              {/* Formulation */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Formulation *
                </label>
                <select
                  name="formulation"
                  value={formData.formulation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="">Select Formulation</option>
                  {formulations.map(formulation => (
                    <option key={formulation} value={formulation}>{formulation}</option>
                  ))}
                </select>
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium font-mono"
                  placeholder="Item code"
                />
                {formData.code ? (
                  <p className="mt-1 text-xs text-emerald-600 font-semibold">
                    ✓ Product code: {formData.code}
                  </p>
                ) : formData.inventoryName ? (
                  <p className="mt-1 text-xs text-amber-600 font-semibold">
                    ⚠ This product doesn't have a code. You can add one manually or add it to the product first.
                  </p>
                ) : null}
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Organization *
                </label>
                <select
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="">Select Organization</option>
                  {organizations.map(org => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Batch Information - Will continue in next part */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Batch Information</h2>
                <p className="text-sm text-gray-600">Batch maintenance and expiry details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Batch Maintenance */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Batch Maintenance *
                </label>
                <select
                  name="batchMaintenance"
                  value={formData.batchMaintenance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="Non Batchable">Non Batchable</option>
                  <option value="Batchable">Batchable</option>
                </select>
              </div>

              {/* Batch Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Batch Type *
                </label>
                <select
                  name="batchType"
                  value={formData.batchType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="FIFO">FIFO</option>
                  <option value="ByExpiry">By Expiry</option>
                </select>
              </div>

              {formData.batchMaintenance === 'Batchable' && (
                <>
                  {/* Batch No */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Batch No.
                    </label>
                    <input
                      type="text"
                      name="batchNo"
                      value={formData.batchNo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 font-medium"
                      placeholder="Batch number"
                    />
                  </div>

                  {/* Batch Expiry Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Batch Expiry Date
                    </label>
                    <input
                      type="date"
                      name="batchExpiryDate"
                      value={formData.batchExpiryDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 font-medium"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stock Management */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Stock Management</h2>
                <p className="text-sm text-gray-600">Quantity and inventory levels</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QOH All Batches */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Quantity on Hand (Total) *
                </label>
                <input
                  type="number"
                  name="qohAllBatches"
                  value={formData.qohAllBatches}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-gray-900 font-medium"
                  placeholder="0"
                />
              </div>

              {formData.batchMaintenance === 'Batchable' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    QOH - Batch Wise
                  </label>
                  <input
                    type="number"
                    name="qohBatchWise"
                    value={formData.qohBatchWise}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-gray-900 font-medium"
                    placeholder="0"
                  />
                </div>
              )}

              {/* Reorder Level */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reorder Level (Qty)
                </label>
                <input
                  type="number"
                  name="reOrderLevel"
                  value={formData.reOrderLevel}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-gray-900 font-medium"
                  placeholder="0"
                />
              </div>

              {/* Target Level */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Target Level (Qty)
                </label>
                <input
                  type="number"
                  name="targetLevel"
                  value={formData.targetLevel}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-gray-900 font-medium"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Pricing Information</h2>
                <p className="text-sm text-gray-600">Buying and selling prices with tax</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GST Percentage */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  GST Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="gstPercentage"
                    value={formData.gstPercentage}
                    onChange={(e) => {
                      handleChange(e);
                      // Recalculate after-tax prices when GST changes
                      if (formData.inventoryBuyingPrice) {
                        const afterTaxBuying = calculateAfterTax(formData.inventoryBuyingPrice, e.target.value);
                        setFormData(prev => ({ ...prev, inventoryAfterTaxBuyingPrice: afterTaxBuying }));
                      }
                      if (formData.inventorySellingPrice) {
                        const afterTaxSelling = calculateAfterTax(formData.inventorySellingPrice, e.target.value);
                        setFormData(prev => ({ ...prev, inventoryAfterTaxSellingPrice: afterTaxSelling }));
                      }
                    }}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium"
                    placeholder="18"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                </div>
              </div>

              {/* Inventory Buying Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Buying Price (Before Tax) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    name="inventoryBuyingPrice"
                    value={formData.inventoryBuyingPrice}
                    onChange={(e) => {
                      handleChange(e);
                      const afterTax = calculateAfterTax(e.target.value, formData.gstPercentage);
                      setFormData(prev => ({
                        ...prev,
                        inventoryAfterTaxBuyingPrice: afterTax
                      }));
                    }}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Inventory After Tax Buying Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Buying Price (After Tax)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="text"
                    name="inventoryAfterTaxBuyingPrice"
                    value={formData.inventoryAfterTaxBuyingPrice || '0.00'}
                    readOnly
                    className="w-full pl-8 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-900 font-medium cursor-not-allowed"
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>

              {/* Inventory Selling Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Selling Price (Before Tax) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    name="inventorySellingPrice"
                    value={formData.inventorySellingPrice}
                    onChange={(e) => {
                      handleChange(e);
                      const afterTax = calculateAfterTax(e.target.value, formData.gstPercentage);
                      setFormData(prev => ({
                        ...prev,
                        inventoryAfterTaxSellingPrice: afterTax
                      }));
                    }}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Inventory After Tax Selling Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Selling Price (After Tax)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="text"
                    name="inventoryAfterTaxSellingPrice"
                    value={formData.inventoryAfterTaxSellingPrice || '0.00'}
                    readOnly
                    className="w-full pl-8 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-900 font-medium cursor-not-allowed"
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>

              {/* Batch Pricing if Batchable */}
              {formData.batchMaintenance === 'Batchable' && (
                <>
                  <div className="md:col-span-2 border-t-2 border-gray-200 pt-6 mt-2">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Batch-Specific Pricing</h3>
                  </div>

                  {/* Batch pricing uses same GST as main pricing */}
                  <div className="md:col-span-2">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                      <p className="text-sm text-purple-900 font-semibold">
                        Batch pricing uses same GST rate ({formData.gstPercentage}%) as main pricing
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Batch Buying Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input
                        type="number"
                        name="batchBuyingPrice"
                        value={formData.batchBuyingPrice}
                        onChange={(e) => {
                          handleChange(e);
                          const afterTax = calculateAfterTax(e.target.value, formData.gstPercentage);
                          setFormData(prev => ({
                            ...prev,
                            batchAfterTaxBuyingPrice: afterTax
                          }));
                        }}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Batch Selling Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input
                        type="number"
                        name="batchSellingPrice"
                        value={formData.batchSellingPrice}
                        onChange={(e) => {
                          handleChange(e);
                          const afterTax = calculateAfterTax(e.target.value, formData.gstPercentage);
                          setFormData(prev => ({
                            ...prev,
                            batchAfterTaxSellingPrice: afterTax
                          }));
                        }}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Vendor & Additional Information */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Additional Details</h2>
                <p className="text-sm text-gray-600">Vendor and miscellaneous information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Vendor Name *
                </label>
                <select
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>

              {/* Pack Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Pack Name
                </label>
                <input
                  type="text"
                  name="packName"
                  value={formData.packName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 font-medium"
                  placeholder="Pack name"
                />
              </div>

              {/* Pack Size */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Pack Size
                </label>
                <input
                  type="number"
                  name="packSize"
                  value={formData.packSize}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 font-medium"
                  placeholder="1"
                />
              </div>

              {/* Commission Rate */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Commission Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="commissionRate"
                    value={formData.commissionRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 pr-10 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 font-medium"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                </div>
              </div>

              {/* Has Generics */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Has Generics
                </label>
                <select
                  name="hasGenerics"
                  value={formData.hasGenerics}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {/* Has Protocol */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Has Protocol
                </label>
                <select
                  name="hasProtocol"
                  value={formData.hasProtocol}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-gray-900 font-medium"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-gradient-to-t from-blue-50 to-transparent pt-6 pb-4 -mx-4 px-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/inventory')}
                  disabled={loading}
                  className="px-8 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Create Inventory Item</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
