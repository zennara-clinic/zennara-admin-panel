import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  XCircle,
  Flame,
  Clock,
  IndianRupee,
  Calendar,
  RotateCw,
  Truck,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { getInventoryAnalytics } from '../../services/analyticsService';

export default function InventoryAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getInventoryAnalytics();
      setData(response.data);
    } catch (err) {
      console.error('Error fetching inventory analytics:', err);
      setError('Failed to load inventory analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-zennara-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-sm border border-gray-200">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button onClick={fetchAnalytics} className="px-6 py-2.5 bg-zennara-green text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { summary, lowStockAlerts, outOfStockItems, fastMovingProducts, slowMovingInventory, inventoryValue, expiryAlerts, reorderPointStatus, vendorPerformance, productProfitMargins, inventoryTurnoverRatio } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">📦 Inventory & Product Insights</h1>
          <p className="text-base text-gray-600">Comprehensive inventory management and analytics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center ring-1 ring-green-100 mb-5">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Total Inventory Value</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">₹{summary.totalValue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">{summary.totalItems} items</p>
          </div>
          
          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center ring-1 ring-orange-100 mb-5">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Low Stock Alerts</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">{summary.lowStockCount}</p>
            <p className="text-sm text-gray-600">Critical items</p>
          </div>

          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center ring-1 ring-red-100 mb-5">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Out of Stock</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">{summary.outOfStockCount}</p>
            <p className="text-sm text-gray-600">Items unavailable</p>
          </div>

          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ring-1 ring-blue-100 mb-5">
              <RotateCw className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Reorder Needed</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">{summary.reorderNeededCount}</p>
            <p className="text-sm text-gray-600">Below threshold</p>
          </div>

          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center ring-1 ring-purple-100 mb-5">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Expiring in 30 Days</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">{summary.expiringIn30Days}</p>
            <p className="text-sm text-gray-600">Near expiry</p>
          </div>

          <div className="group bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center ring-1 ring-indigo-100 mb-5">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Turnover Ratio</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">{inventoryTurnoverRatio}x</p>
            <p className="text-sm text-gray-600">Times per period</p>
          </div>
        </div>

        {/* Remaining sections with condensed code... */}
        {/* Add remaining visualizations here */}
      </div>
    </div>
  );
}
