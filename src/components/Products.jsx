import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  ChevronDownIcon,
  EyeIcon,
  StarIcon,
  PackageIcon,
  ChartIcon,
  ExclamationIcon,
  CheckCircleIcon
} from './Icons';
import { products, productCategories, productStats, getLowStockProducts } from '../data/productsData';
import { designTokens } from '../design-system/tokens';

export default function Products() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStockFilter = !showLowStock || product.stock <= product.lowStockThreshold;
    return matchesCategory && matchesSearch && matchesStockFilter;
  });

  const getStockStatus = (product) => {
    if (product.stock <= product.lowStockThreshold / 2) {
      return { status: 'Critical', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' };
    } else if (product.stock <= product.lowStockThreshold) {
      return { status: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-300' };
    }
    return { status: 'In Stock', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' };
  };

  return (
    <div className="min-h-screen p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-base text-gray-500">Manage inventory, stock levels, and product catalog</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/products/inventory')}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
          >
            <PackageIcon className="w-5 h-5" />
            <span>Inventory</span>
          </button>
          <button
            onClick={() => navigate('/products/orders')}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
          >
            <ChartIcon className="w-5 h-5" />
            <span>Purchase Orders</span>
          </button>
          <button
            onClick={() => navigate('/products/add')}
            className={`flex items-center space-x-2 px-6 py-3 ${designTokens.gradients.components.primary} text-white rounded-2xl font-bold hover:shadow-lg transition-all`}
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Products', value: productStats.totalProducts, icon: PackageIcon, color: 'blue' },
          { title: 'Total Stock', value: productStats.totalStock, icon: CheckCircleIcon, color: 'green' },
          { title: 'Low Stock Items', value: productStats.lowStockCount, icon: ExclamationIcon, color: 'yellow' },
          { title: 'Inventory Value', value: `₹${(productStats.totalValue / 100000).toFixed(1)}L`, icon: ChartIcon, color: 'purple' }
        ].map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-7 h-7 text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2 font-medium">{stat.title}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Filter Products</h3>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-200 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="w-4 h-4 text-yellow-600"
              />
              <span className="text-sm font-bold text-yellow-700">Low Stock Only</span>
            </label>
            <button className="px-4 py-2 text-sm font-semibold text-zennara-green hover:bg-zennara-green hover:text-white rounded-xl transition-all border-2 border-zennara-green">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-3 mb-6 overflow-x-auto pb-2">
          {productCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products by name, brand, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          return (
            <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Product Image */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.bestSeller && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold flex items-center space-x-1">
                    <StarIcon className="w-3 h-3" />
                    <span>BEST SELLER</span>
                  </span>
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 ${stockStatus.bg} border-2 ${stockStatus.border} rounded-full`}>
                  <span className={`text-xs font-bold ${stockStatus.color}`}>{stockStatus.status}</span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                {/* Brand */}
                <p className="text-xs text-gray-500 font-semibold mb-2">{product.brand}</p>
                
                {/* Product Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Rating & Stock */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-900 text-sm">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">Stock</p>
                    <p className={`font-bold text-sm ${product.stock <= product.lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock} units
                    </p>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-2xl font-bold text-zennara-green">₹{product.price}</p>
                    {product.originalPrice > product.price && (
                      <p className="text-sm text-gray-400 line-through">₹{product.originalPrice}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-bold text-sm transition-all flex items-center space-x-1"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </div>

                {/* SKU */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">SKU: <span className="font-bold text-gray-700">{product.sku}</span></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
