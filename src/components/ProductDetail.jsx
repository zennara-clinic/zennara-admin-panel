import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  StarIcon,
  CheckCircleIcon,
  ExclamationIcon,
  PackageIcon,
  ChartIcon,
  RefreshIcon,
  ClockIcon,
  EyeIcon,
  CrownIcon,
  ShoppingBagIcon
} from './Icons';
import { getProductById, getSupplierByName } from '../data/productsData';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = getProductById(id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</p>
          <button
            onClick={() => navigate('/products/list')}
            className="text-zennara-green font-semibold hover:underline"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const supplier = getSupplierByName(product.supplier);
  const stockPercentage = (product.stock / (product.lowStockThreshold * 3)) * 100;
  const needsReorder = product.stock <= product.reorderPoint;

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-base text-gray-500">{product.brand}</p>
          </div>
          <button
            onClick={() => navigate(`/products/edit/${product.id}`)}
            className="px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            Edit Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-1 rounded-2xl overflow-hidden border-4 transition-all ${
                    selectedImage === idx ? 'border-zennara-green' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-gradient-to-r from-zennara-green to-emerald-600 rounded-3xl p-8 text-white">
            <p className="text-base opacity-75 mb-2">Current Price</p>
            <p className="text-5xl font-bold mb-4">₹{product.price}</p>
            {product.originalPrice > product.price && (
              <div className="flex items-center space-x-3">
                <p className="text-xl line-through opacity-75">₹{product.originalPrice}</p>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                  Save ₹{product.originalPrice - product.price}
                </span>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StarIcon className="w-6 h-6 text-yellow-500" />
                <span className="text-3xl font-bold text-gray-900">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>
              {product.bestSeller && (
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold text-sm">
                  🏆 Best Seller
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Stock</span>
                <span className={`text-2xl font-bold ${
                  product.stock <= product.lowStockThreshold / 2 ? 'text-red-600' :
                  product.stock <= product.lowStockThreshold ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {product.stock} units
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    product.stock <= product.lowStockThreshold / 2 ? 'bg-red-500' :
                    product.stock <= product.lowStockThreshold ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Low Stock Threshold</p>
                  <p className="font-bold text-gray-900">{product.lowStockThreshold} units</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Reorder Point</p>
                  <p className="font-bold text-gray-900">{product.reorderPoint} units</p>
                </div>
              </div>
              {needsReorder && (
                <button
                  onClick={() => navigate('/products/orders/new')}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <RefreshIcon className="w-5 h-5" />
                  <span>Create Purchase Order</span>
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, idx) => (
                <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Description */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h3>
          <div className="space-y-3">
            {[
              { label: 'SKU', value: product.sku },
              { label: 'Barcode', value: product.barcode },
              { label: 'Category', value: product.category },
              { label: 'Weight/Size', value: product.weight },
              { label: 'Batch Number', value: product.batchNumber },
              { label: 'Expiry Date', value: product.expiryDate }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="font-bold text-gray-900 text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Supplier</h3>
          {supplier ? (
            <div className="space-y-3">
              <div>
                <p className="font-bold text-gray-900 text-lg">{supplier.name}</p>
                <p className="text-sm text-gray-600">{supplier.contact}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Phone</span>
                  <span className="font-semibold text-gray-900 text-sm">{supplier.phone}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="font-semibold text-gray-900 text-sm">{supplier.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-900 text-sm">{supplier.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Delivery</span>
                  <span className="font-bold text-gray-900 text-sm">{supplier.deliveryTime}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/products/orders/new')}
                className="w-full mt-4 px-6 py-3 bg-zennara-green text-white rounded-2xl font-bold hover:shadow-lg transition-all"
              >
                Order from Supplier
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{product.supplier}</p>
          )}
        </div>
      </div>
    </div>
  );
}
