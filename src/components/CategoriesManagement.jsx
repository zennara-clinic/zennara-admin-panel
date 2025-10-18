import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  DocumentIcon,
  XCircleIcon,
  CheckCircleIcon,
  SettingsIcon
} from './Icons';

export default function CategoriesManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: 1, name: 'Skin', count: 78, active: true, order: 1 },
    { id: 2, name: 'Hair', count: 45, active: true, order: 2 },
    { id: 3, name: 'Facials', count: 52, active: true, order: 3 },
    { id: 4, name: 'Aesthetics', count: 67, active: true, order: 4 },
    { id: 5, name: 'Peels', count: 35, active: true, order: 5 },
    { id: 6, name: 'Laser', count: 28, active: true, order: 6 },
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          name: newCategory,
          count: 0,
          active: true,
          order: categories.length + 1
        }
      ]);
      setNewCategory('');
      setShowAddForm(false);
    }
  };

  const handleToggleActive = (id) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, active: !cat.active } : cat
    ));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="min-h-screen p-10 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <button
            onClick={() => navigate('/consultations/services')}
            className="text-base font-semibold text-gray-500 hover:text-zennara-green mb-3 flex items-center space-x-2 transition-colors"
          >
            <span>←</span>
            <span>Back to Services</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Categories Management</h1>
          <p className="text-base text-gray-500">Organize and manage service categories</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zennara-green to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-600 font-semibold mb-2">Total Categories</p>
          <p className="text-4xl font-bold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-600 font-semibold mb-2">Active</p>
          <p className="text-4xl font-bold text-green-600">{categories.filter(c => c.active).length}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-600 font-semibold mb-2">Total Services</p>
          <p className="text-4xl font-bold text-blue-600">{categories.reduce((sum, c) => sum + c.count, 0)}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-600 font-semibold mb-2">Inactive</p>
          <p className="text-4xl font-bold text-red-600">{categories.filter(c => !c.active).length}</p>
        </div>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-zennara-green/10 to-emerald-50/50 rounded-3xl p-8 border-2 border-zennara-green/20 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name (e.g., Injectables, Body Treatments)"
              className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zennara-green focus:border-zennara-green transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="px-8 py-4 bg-zennara-green hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCategory('');
              }}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900">All Categories</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zennara-green to-emerald-600 flex items-center justify-center">
                    <DocumentIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">{category.count}</span> services • Order: {category.order}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Active Status */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-gray-600">Status:</span>
                    {category.active ? (
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-bold text-sm">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold text-sm">
                        INACTIVE
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(category.id)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        category.active
                          ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
                          : 'bg-green-50 hover:bg-green-100 text-green-700'
                      }`}
                    >
                      {category.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-sm transition-all">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-sm transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
