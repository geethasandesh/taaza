import React from 'react';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';

const ProductDetail = ({ product, onNavigate, activeTab, cartCount, query, setQuery, onBack, onAdminClick }) => {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

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
      <div className="fixed inset-0 z-50 flex items-start justify-center min-h-screen">
        {/* Blurred Overlay */}
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-40" aria-hidden="true"></div>
        <div className="relative z-50 w-full max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-4 flex items-center text-gray-500 hover:text-red-700 text-sm font-medium focus:outline-none"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full md:w-64 h-56 object-cover rounded-lg border"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-red-700 font-bold text-xl">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 text-base line-through">₹{product.originalPrice}</span>
                  )}
                  {product.discount && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">{product.discount}% OFF</span>
                  )}
                </div>
                <div className="text-gray-600 text-sm mb-2">{product.weight}</div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                  <div><span className="font-medium">No. of pieces:</span> {product.pieces || '-'}</div>
                  <div><span className="font-medium">Serves:</span> {product.serves || '-'}</div>
                  <div><span className="font-medium">Protein:</span> {product.protein || '-'}g</div>
                  <div><span className="font-medium">Carbs:</span> {product.carbs || '-'}g</div>
                  {/* Add more nutrition/details as needed */}
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                {quantity === 0 ? (
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-red-700 hover:bg-red-800 text-white text-base px-6 py-2 rounded-full transition-colors duration-200 font-semibold shadow-sm"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        if (quantity === 1) removeFromCart(product.id);
                        else updateQuantity(product.id, quantity - 1);
                      }}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-lg font-bold"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-base">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-8 h-8 bg-red-700 hover:bg-red-800 text-white rounded-full flex items-center justify-center text-lg font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 