import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

export default function SearchableProductDropdown({ value, onChange, required = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query (search by name or code)
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.code && product.code.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (product) => {
    onChange(product); // Pass entire product object instead of just name
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange('');
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Product Name {required && '*'}
      </label>
      
      {/* Selected Value / Dropdown Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 font-medium cursor-pointer flex items-center justify-between hover:border-blue-400"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || 'Select a product'}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or code..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Product List */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchQuery ? 'No products found' : 'No products available'}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleSelect(product)}
                  className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                    value === product.name ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                        {product.code && (
                          <>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-mono font-semibold">
                              {product.code}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span>{product.formulation}</span>
                        <span>•</span>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                    {value === product.name && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredProducts.length > 0 && (
            <div className="p-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
