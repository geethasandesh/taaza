import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

const Cart = ({ onNavigateToHome, onNavigateToCheckout, onNavigate, activeTab, cartCount, query, setQuery, onAdminClick }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [updatingId, setUpdatingId] = useState(null);
  const [lastChanged, setLastChanged] = useState({});

  const handleQuantityChange = async (productId, newQuantity) => {
    setUpdatingId(productId);
    setLastChanged((prev) => ({ ...prev, [productId]: Date.now() }));
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
    setTimeout(() => setUpdatingId(null), 200); // Simulate async and allow animation
  };

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
      {items.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious meat products to get started!</p>
            <button
              onClick={onNavigateToHome}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="card p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.weight}</p>
                    <p className="text-red-700 font-bold">₹{item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className={`w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-base font-bold transition-transform duration-150 ${updatingId === item.id ? 'scale-90' : ''}`}
                      aria-label="Decrease quantity"
                      disabled={updatingId === item.id || item.quantity === 1}
                    >
                      -
                    </button>
                    <span className={`w-6 text-center font-medium text-sm transition-transform duration-150 ${lastChanged[item.id] ? 'scale-110' : ''}`}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className={`w-7 h-7 bg-red-700 hover:bg-red-800 text-white rounded-full flex items-center justify-center text-base font-bold transition-transform duration-150 ${updatingId === item.id ? 'scale-110' : ''}`}
                      aria-label="Increase quantity"
                      disabled={updatingId === item.id}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} items)</span>
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

            <button
              onClick={onNavigateToCheckout}
              className="w-full btn-primary py-3 text-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 