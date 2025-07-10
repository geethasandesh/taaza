import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdSearch,
  MdVisibility,
  MdVisibilityOff
} from 'react-icons/md';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../services/firebaseService';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    originalPrice: '',
    discount: '',
    weight: '',
    image: '',
    description: '',
    status: 'active',
  });
  const [imageFile, setImageFile] = useState(null);
  const [customCategory, setCustomCategory] = useState('');

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Helper to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageBase64 = formData.image;
    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile);
    }
    const productData = {
      ...formData,
      image: imageBase64,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      discount: formData.discount ? Number(formData.discount) : undefined,
      status: formData.status || 'active',
    };
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      const data = await getProducts();
      setProducts(data);
      setShowAddModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        subcategory: '',
        price: '',
        originalPrice: '',
        discount: '',
        weight: '',
        image: '',
        description: '',
        status: 'active',
      });
      setImageFile(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowAddModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <MdAdd className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Categories</option>
            <option value="chicken">Chicken</option>
            <option value="mutton">Mutton</option>
            <option value="eggs">Eggs</option>
            <option value="masalas">Masalas</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Products ({filteredProducts.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.weight}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                    <div className="text-sm text-gray-500 capitalize">{product.subcategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">₹{product.originalPrice}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" required />
              </div>
              {/* Category & Subcategory */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category === customCategory && customCategory ? 'other' : formData.category}
                    onChange={e => {
                      if (e.target.value === 'other') {
                        setFormData({ ...formData, category: customCategory });
                      } else {
                        setFormData({ ...formData, category: e.target.value });
                        setCustomCategory('');
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="chicken">Chicken</option>
                    <option value="mutton">Mutton</option>
                    <option value="eggs">Eggs</option>
                    <option value="masalas">Masalas</option>
                    <option value="other">Other</option>
                  </select>
                  {formData.category === customCategory && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      onBlur={() => setFormData({ ...formData, category: customCategory })}
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      placeholder="Enter new category"
                      required
                    />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subcategory</label>
                  <input type="text" value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" placeholder="e.g., boneless-mince" />
                </div>
              </div>
              {/* Price, Original Price, Discount */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price</label>
                  <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" placeholder="Optional" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discount (%)</label>
                  <input type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" placeholder="Optional" />
                </div>
              </div>
              {/* Weight with unit selector */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Weight</label>
                  <input type="number" value={formData.weight.replace(/[^0-9.]/g, '')} onChange={e => setFormData({...formData, weight: e.target.value.replace(/[^0-9.]/g, '')})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" placeholder="e.g., 500" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
                  <select value={formData.unit || 'g'} onChange={e => setFormData({...formData, unit: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm">
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
              {/* Image Upload or URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={async e => {
                  setImageFile(e.target.files[0]);
                  if (e.target.files[0]) {
                    const base64 = await fileToBase64(e.target.files[0]);
                    setFormData({...formData, image: base64});
                  }
                }} className="mb-2" />
                <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" placeholder="Or paste image URL or base64" />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 rounded-lg max-h-24 object-contain border" />
                )}
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" rows={2} placeholder="Product description..." />
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select value={formData.status || 'active'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      category: '',
                      subcategory: '',
                      price: '',
                      originalPrice: '',
                      discount: '',
                      weight: '',
                      image: '',
                      description: '',
                      status: 'active',
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
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement; 