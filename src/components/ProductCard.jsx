import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAddToCart, onCardClick }) => {
  const { items, updateQuantity, addToCart, removeFromCart } = useCart();
  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Handler to prevent click bubbling from buttons
  const stopPropagation = (e) => e.stopPropagation();

  const isUnavailable = product.status === 'out-of-stock' || product.status === 'inactive';

  return (
    <div
      className={`card p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer relative ${isUnavailable ? 'opacity-60 grayscale pointer-events-none' : ''}`}
      onClick={() => onCardClick && onCardClick(product)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name}`}
    >
      <div className="relative mb-3">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-32 object-cover rounded-lg"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            {product.discount}% OFF
          </span>
        )}
        {isUnavailable && (
          <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
            {product.status === 'out-of-stock' ? 'Out of Stock' : 'Inactive'}
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
        <p className="text-gray-600 text-xs">{product.weight}{product.unit ? ` ${product.unit}` : ''}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-red-700 font-bold">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-sm line-through">₹{product.originalPrice}</span>
            )}
          </div>
          {!isUnavailable && (quantity === 0 ? (
            <button
              onClick={(e) => { stopPropagation(e); onAddToCart ? onAddToCart(product) : addToCart(product); }}
              className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1 rounded-full transition-colors duration-200"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center space-x-2" onClick={stopPropagation}>
              <button
                onClick={(e) => { stopPropagation(e); if (quantity === 1) removeFromCart(product.id); else updateQuantity(product.id, quantity - 1); }}
                className="w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-base font-bold"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-6 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={(e) => { stopPropagation(e); updateQuantity(product.id, quantity + 1); }}
                className="w-7 h-7 bg-red-700 hover:bg-red-800 text-white rounded-full flex items-center justify-center text-base font-bold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 