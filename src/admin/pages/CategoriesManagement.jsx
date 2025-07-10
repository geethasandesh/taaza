import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdSearch,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    image: '',
    subcategories: []
  });

  useEffect(() => {
    // Mock data - replace with Firebase call
    setCategories([
      {
        id: 1,
        name: 'Chicken',
        key: 'chicken',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
        subcategories: [
          { key: 'curry-cuts', name: 'Curry Cuts' },
          { key: 'boneless-mince', name: 'Boneless & Mince' },
          { key: 'speciality-cuts', name: 'Speciality Cuts' }
        ],
        productCount: 8
      },
      {
        id: 2,
        name: 'Mutton',
        key: 'mutton',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
        subcategories: [
          { key: 'curry-cuts', name: 'Curry Cuts' },
          { key: 'mince', name: 'Mince' },
          { key: 'biryani-cut', name: 'Biryani Cut' }
        ],
        productCount: 6
      }
    ]);
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      // Update category
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...formData, id: c.id } : c));
    } else {
      // Add new category
      const newCategory = {
        id: Date.now(),
        ...formData,
        productCount: 0
      };
      setCategories([...categories, newCategory]);
    }
    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      key: '',
      image: '',
      subcategories: []
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData(category);
    setShowAddModal(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Manage product categories and subcategories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <MdAdd className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <MdEdit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                >
                  <MdDelete className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <span className="text-sm text-gray-500">{category.productCount} products</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">Key: {category.key}</p>
              
              <div className="border-t border-gray-200 pt-3">
                <button
                  onClick={() => toggleExpanded(category.id)}
                  className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  <span>Subcategories ({category.subcategories.length})</span>
                  {expandedCategories.has(category.id) ? (
                    <MdExpandLess className="w-4 h-4" />
                  ) : (
                    <MdExpandMore className="w-4 h-4" />
                  )}
                </button>
                
                {expandedCategories.has(category.id) && (
                  <div className="mt-3 space-y-2">
                    {category.subcategories.map((subcategory, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{subcategory.name}</span>
                        <span className="text-xs text-gray-500">{subcategory.key}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Key</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({...formData, key: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., chicken"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    setFormData({
                      name: '',
                      key: '',
                      image: '',
                      subcategories: []
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingCategory ? 'Update' : 'Add'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement; 