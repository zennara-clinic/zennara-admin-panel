import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PackageIcon,
  ChartIcon,
  ExclamationIcon,
  RefreshIcon,
  UploadIcon
} from './Icons';
import { fullInventory as inventoryItems, inventoryCategories, getInventoryStats, getLowStockItems, getCriticalStockItems } from '../data/fullInventoryData';
import BatchImportInventory from './BatchImportInventory';

export default function InventoryManagement() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBatchImport, setShowBatchImport] = useState(false);

  const getFilteredItems = () => {
    let filtered = inventoryItems;

    // Filter by tab
    if (selectedTab === 'low-stock') {
      filtered = getLowStockItems(20);
    } else if (selectedTab === 'critical') {
      filtered = getCriticalStockItems();
    } else if (selectedTab === 'expiring') {
      filtered = inventoryItems.filter(item => item.batchExpiryDate && item.qohBatchWise > 0);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.inventoryCategory.toLowerCase().includes(selectedCategory));
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.inventoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();
  const inventoryStats = getInventoryStats();

  const getStockStatusColor = (qoh, reorderLevel) => {
    if (qoh === 0) return 'text-red-600';
    if (reorderLevel > 0 && qoh <= reorderLevel) return 'text-orange-600';
    if (qoh <= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStockStatusBadge = (qoh, reorderLevel) => {
    if (qoh === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-700 border-red-300' };
    if (reorderLevel > 0 && qoh <= reorderLevel) return { text: 'Critical', color: 'bg-orange-100 text-orange-700 border-orange-300' };
    if (qoh <= 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-700 border-green-300' };
  };

  const handleImportComplete = (importedData) => {
    console.log('Imported data:', importedData);
    setShowBatchImport(false);
    // Here you would typically update the inventory data
    // For now, we'll just close the modal
  };

  return (
    <div className="min-h-screen p-10 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-500 text-base">Complete batch-level inventory tracking and management</p>
        </div>
        <button
          onClick={() => setShowBatchImport(true)}
          className="px-6 py-3 bg-gradient-to-r from-zennara-green to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <UploadIcon className="w-5 h-5" />
          <span>Batch Import</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Items', value: inventoryStats.totalItems, color: 'blue', icon: PackageIcon },
          { title: 'Low Stock', value: inventoryStats.lowStockItems, color: 'yellow', icon: ExclamationIcon },
          { title: 'Critical Stock', value: inventoryStats.criticalItems, color: 'red', icon: ExclamationIcon },
          { title: 'Total Value', value: `₹${(inventoryStats.totalValue / 100000).toFixed(1)}L`, color: 'green', icon: ChartIcon }
        ].map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <IconComponent className={`w-10 h-10 text-${stat.color}-600`} />
              </div>
              <p className="text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'low-stock', label: 'Low Stock' },
            { id: 'critical', label: 'Critical' },
            { id: 'expiring', label: 'Expiring Soon' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-5 py-2.5 rounded-2xl font-bold transition-all ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Filter & Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">CATEGORY</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-zennara-green transition-all"
            >
              {inventoryCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">SEARCH</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, batch, or vendor..."
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green transition-all"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Product</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Batch No</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Expiry</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">QOH</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Buying Price</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Selling Price</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Tax</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Vendor</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatusBadge(item.qohAllBatches, item.reorderLevel);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.inventoryName}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'}
                          />
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.inventoryName}</p>
                          <p className="text-xs text-gray-500">{item.formulation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                        {item.inventoryCategory}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-gray-900 text-sm">{item.batchNo || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{item.batchExpiryDate || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-lg font-bold ${getStockStatusColor(item.qohAllBatches, item.reorderLevel)}`}>
                        {item.qohAllBatches}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-xl font-bold text-xs border-2 ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">₹{item.inventoryBuyingPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">₹{item.inventoryAfterTaxBuyingPrice.toFixed(2)} (inc.)</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-bold text-zennara-green text-sm">₹{item.inventorySellingPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">₹{item.inventoryAfterTaxSellingPrice.toFixed(2)} (inc.)</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-700">{item.inventoryTax}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{item.vendorName}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-bold text-xs transition-all">
                          View
                        </button>
                        {item.qohAllBatches <= item.reorderLevel && (
                          <button className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-bold text-xs transition-all flex items-center space-x-1">
                            <RefreshIcon className="w-3 h-3" />
                            <span>Reorder</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <PackageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No inventory items found.</p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-6 border border-gray-200">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Items Displayed</p>
            <p className="text-2xl font-bold text-gray-900">{filteredItems.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Stock (QOH)</p>
            <p className="text-2xl font-bold text-gray-900">{filteredItems.reduce((sum, item) => sum + item.qohAllBatches, 0)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Inventory Value</p>
            <p className="text-2xl font-bold text-zennara-green">
              ₹{filteredItems.reduce((sum, item) => sum + (item.inventoryAfterTaxSellingPrice * item.qohAllBatches), 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Needs Reorder</p>
            <p className="text-2xl font-bold text-orange-600">
              {filteredItems.filter(item => item.reorderLevel > 0 && item.qohAllBatches <= item.reorderLevel).length}
            </p>
          </div>
        </div>
      </div>

      {/* Batch Import Modal */}
      {showBatchImport && (
        <BatchImportInventory
          onImportComplete={handleImportComplete}
          onClose={() => setShowBatchImport(false)}
        />
      )}
    </div>
  );
}
