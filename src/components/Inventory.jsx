import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PackageIcon,
  ExclamationIcon,
  ChartIcon,
  CheckCircleIcon,
  RefreshIcon,
  BellIcon
} from './Icons';
import { products, getLowStockProducts, getCriticalStockProducts, suppliers } from '../data/productsData';

export default function Inventory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  const lowStockProducts = getLowStockProducts();
  const criticalStockProducts = getCriticalStockProducts();

  const displayProducts = activeTab === 'low-stock' ? lowStockProducts : 
                         activeTab === 'critical' ? criticalStockProducts : 
                         products;

  const getStockBarWidth = (stock, threshold) => {
    const percentage = (stock / (threshold * 3)) * 100;
    return Math.min(Math.max(percentage, 5), 100);
  };

  const getStockBarColor = (stock, threshold) => {
    if (stock <= threshold / 2) return 'bg-red-500';
    if (stock <= threshold) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => navigate('/products/list')}
          className="text-base font-semibold text-gray-500 hover:text-zennara-green mb-4 flex items-center space-x-2 transition-colors"
        >
          <span>←</span>
          <span>Back to Products</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-base text-gray-500">Monitor stock levels and manage reorder points</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Items', value: products.length, icon: PackageIcon, color: 'blue' },
          { title: 'Low Stock Alerts', value: lowStockProducts.length, icon: ExclamationIcon, color: 'yellow' },
          { title: 'Critical Stock', value: criticalStockProducts.length, icon: BellIcon, color: 'red' },
          { title: 'Reorder Needed', value: products.filter(p => p.stock <= p.reorderPoint).length, icon: RefreshIcon, color: 'orange' }
        ].map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center`}>
                  <IconComponent className={`w-7 h-7 text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 mb-8 inline-flex space-x-2">
        {[
          { id: 'all', label: 'All Products', count: products.length },
          { id: 'low-stock', label: 'Low Stock', count: lowStockProducts.length },
          { id: 'critical', label: 'Critical', count: criticalStockProducts.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Current Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Stock Level</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Reorder Point</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Supplier</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayProducts.map((product) => {
                const stockPercentage = (product.stock / product.lowStockThreshold) * 100;
                const needsReorder = product.stock <= product.reorderPoint;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-700 text-sm">{product.sku}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${
                          product.stock <= product.lowStockThreshold / 2 ? 'text-red-600' :
                          product.stock <= product.lowStockThreshold ? 'text-yellow-600' :
                          'text-gray-900'
                        }`}>
                          {product.stock}
                        </p>
                        <p className="text-xs text-gray-500">units</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full">
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStockBarColor(product.stock, product.lowStockThreshold)} transition-all`}
                            style={{ width: `${getStockBarWidth(product.stock, product.lowStockThreshold)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.stock <= product.lowStockThreshold / 2 ? 'Critical' :
                           product.stock <= product.lowStockThreshold ? 'Low' : 'Good'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <p className="font-bold text-gray-900">{product.reorderPoint}</p>
                        {needsReorder && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold mt-1">
                            <RefreshIcon className="w-3 h-3" />
                            <span>Reorder</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700">{product.supplier}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl text-xs font-bold transition-all"
                        >
                          View
                        </button>
                        {needsReorder && (
                          <button
                            onClick={() => navigate('/products/orders/new')}
                            className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl text-xs font-bold transition-all"
                          >
                            Order
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
      </div>
    </div>
  );
}
