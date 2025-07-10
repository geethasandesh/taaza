import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

const Checkout = ({ onNavigateToCart, onNavigateToSuccess, onNavigate, activeTab, cartCount, query, setQuery, onAdminClick }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    // For now, we'll just simulate a successful order
    clearCart();
    onNavigateToSuccess();
  };

  const isFormValid = formData.name.trim() && formData.phone.trim();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header
        activeTab={activeTab}
        onNavigate={onNavigate}
        cartCount={cartCount}
        query={query}
        setQuery={setQuery}
        onAdminClick={onAdminClick}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div>
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Customer Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 text-lg font-medium rounded-lg transition-colors duration-200 ${
                    isFormValid
                      ? 'bg-red-700 hover:bg-red-800 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Place Order
                </button>
              </form>
            </div>

            {/* Payment Information */}
            <div className="card p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Payment</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">
                  Payment will be collected at the store when you pick up your order.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  We accept cash, cards, and digital payments.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-red-700">₹{getTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Information */}
            <div className="card p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Store Information</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Address:</strong> 123 Meat Street, Food District, City - 123456</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Hours:</strong> 9:00 AM - 9:00 PM (Daily)</p>
                <p className="text-red-700 font-medium mt-3">
                  Please collect your order within 30 minutes of placing it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 