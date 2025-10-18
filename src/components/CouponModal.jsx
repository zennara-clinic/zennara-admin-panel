import { X, Tag, Search, Package, Globe, Check, Calendar, Percent, DollarSign } from 'lucide-react';
import { useState } from 'react';
import AppleDatePicker from './AppleDatePicker';

const CouponModal = ({ 
  showModal, 
  editingCoupon, 
  formData, 
  setFormData, 
  products, 
  handleSubmit, 
  closeModal, 
  generateCode 
}) => {
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productScope, setProductScope] = useState('all'); // 'all' or 'specific'
  
  if (!showModal) return null;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.formulation?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-orange-50/80 to-red-50/80 p-8 border-b border-gray-100/50 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <p className="text-gray-600 font-medium">
                {editingCoupon ? 'Update coupon details and settings' : 'Create a new discount coupon for customers'}
              </p>
            </div>
          </div>
          <button 
            onClick={closeModal} 
            className="p-3 hover:bg-white/50 rounded-2xl transition-all duration-200 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Coupon Code *</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="flex-1 px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-bold uppercase shadow-sm"
                  placeholder="SUMMER2024"
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Discount Type *</label>
              <div className="relative">
                <select
                  required
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="appearance-none w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm pr-12 cursor-pointer"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Discount Value *</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  max={formData.discountType === 'percentage' ? 100 : undefined}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                  className="w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm pr-16"
                  placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {formData.discountType === 'percentage' ? (
                    <Percent className="w-5 h-5 text-purple-500" />
                  ) : (
                    <span className="text-green-600 font-bold">₹</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Minimum Order Value (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: parseFloat(e.target.value) })}
                className="w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm"
                placeholder="0"
              />
            </div>

            {formData.discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Maximum Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxDiscount || ''}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm"
                  placeholder="No limit"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Total Usage Limit</label>
              <input
                type="number"
                min="0"
                value={formData.usageLimit || ''}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm"
                placeholder="Unlimited"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Per User Limit</label>
              <input
                type="number"
                min="0"
                value={formData.perUserLimit || ''}
                onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm"
                placeholder="Unlimited"
              />
            </div>

            <div>
              <AppleDatePicker
                label="Valid From"
                value={formData.validFrom}
                onChange={(date) => setFormData({ ...formData, validFrom: date })}
                placeholder="Select start date"
                required
              />
            </div>

            <div>
              <AppleDatePicker
                label="Valid Until"
                value={formData.validUntil}
                onChange={(date) => setFormData({ ...formData, validUntil: date })}
                placeholder="Select end date"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 font-medium shadow-sm resize-none"
              placeholder="Enter coupon description"
            />
          </div>

          {/* Product Scope Selection */}
          <div className="space-y-6">
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
              Product Scope
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Apply to All Products */}
              <div 
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  productScope === 'all' 
                    ? 'border-orange-500 bg-orange-50/50 shadow-lg' 
                    : 'border-gray-200 bg-white/50 hover:border-orange-300'
                }`}
                onClick={() => {
                  setProductScope('all');
                  setFormData({ ...formData, applicableProducts: [] });
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    productScope === 'all' 
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">All Products</h3>
                    <p className="text-sm text-gray-600">Apply coupon to entire catalog</p>
                  </div>
                </div>
                {productScope === 'all' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Select Specific Products */}
              <div 
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  productScope === 'specific' 
                    ? 'border-orange-500 bg-orange-50/50 shadow-lg' 
                    : 'border-gray-200 bg-white/50 hover:border-orange-300'
                }`}
                onClick={() => setProductScope('specific')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    productScope === 'specific' 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Specific Products</h3>
                    <p className="text-sm text-gray-600">Choose individual products</p>
                  </div>
                </div>
                {productScope === 'specific' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Selection Interface */}
            {productScope === 'specific' && (
              <div className="mt-6 p-6 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-2xl border border-purple-200/50">
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products by name or category..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium shadow-sm"
                    />
                  </div>

                  {/* Product List */}
                  <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No products found</p>
                      </div>
                    ) : (
                      filteredProducts.map(product => (
                        <div
                          key={product._id}
                          className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                            formData.applicableProducts.includes(product._id)
                              ? 'bg-purple-100/70 border-2 border-purple-300'
                              : 'bg-white/70 border-2 border-transparent hover:bg-purple-50/50'
                          }`}
                          onClick={() => {
                            const isSelected = formData.applicableProducts.includes(product._id);
                            const newProducts = isSelected
                              ? formData.applicableProducts.filter(id => id !== product._id)
                              : [...formData.applicableProducts, product._id];
                            setFormData({ ...formData, applicableProducts: newProducts });
                          }}
                        >
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                            formData.applicableProducts.includes(product._id)
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.applicableProducts.includes(product._id) && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{product.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="px-2 py-1 bg-gray-100 rounded-lg font-medium">
                                {product.formulation}
                              </span>
                              <span className="font-bold text-green-600">₹{product.price}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Selected Count */}
                  {formData.applicableProducts.length > 0 && (
                    <div className="flex items-center justify-between p-4 bg-purple-100/50 rounded-xl">
                      <span className="font-bold text-purple-900">
                        {formData.applicableProducts.length} product(s) selected
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, applicableProducts: [] })}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-8 p-6 bg-gray-50/50 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-6 h-6 text-orange-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="isActive" className="text-lg font-bold text-gray-900 cursor-pointer">
                  Active Coupon
                </label>
                <p className="text-sm text-gray-600 font-medium">
                  Enable this coupon for customer use
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-6 h-6 text-orange-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="isPublic" className="text-lg font-bold text-gray-900 cursor-pointer">
                  Public Coupon
                </label>
                <p className="text-sm text-gray-600 font-medium">
                  Make coupon visible to all customers
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
              className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
