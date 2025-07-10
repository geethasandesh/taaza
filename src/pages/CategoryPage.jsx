import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';

const CategoryPage = ({ category, products, onNavigateToSubcategory, initialSubcategory = 'all', onNavigate, activeTab, cartCount, query, setQuery, onProductClick, onAdminClick }) => {
  const [activeSub, setActiveSub] = useState(initialSubcategory);
  const { addToCart } = useCart();

  useEffect(() => {
    setActiveSub(initialSubcategory);
  }, [initialSubcategory]);

  // Debug log
  useEffect(() => {
    console.log('CategoryPage initialSubcategory:', initialSubcategory, 'activeSub:', activeSub);
  }, [initialSubcategory, activeSub]);

  const handleSubcategoryClick = (subKey) => {
    setActiveSub(subKey);
    if (onNavigateToSubcategory) onNavigateToSubcategory(category.key, subKey);
  };

  const filteredProducts = activeSub === 'all'
    ? products.filter(p => p.category === category.key)
    : products.filter(p => p.category === category.key && p.subcategory === activeSub);

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
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pb-20">
        {/* Banner */}
        <div className="w-full h-16 bg-pink-100 flex items-center justify-center text-pink-800 text-sm font-semibold rounded-lg mt-4 mb-4">
          Tested & inspected by safety experts
        </div>
        {/* Subcategory Tab Bar */}
        <div className="overflow-x-auto px-2 py-3 bg-white border-b border-gray-100 shadow-sm rounded-lg mb-6">
          <div className="flex space-x-3 min-w-max">
            {category.subcategories.map((sub) => (
              <button
                key={sub.key}
                onClick={() => handleSubcategoryClick(sub.key)}
                className={`flex flex-col items-center min-w-[72px] px-2 focus:outline-none group`}
              >
                <div className={`w-14 h-14 rounded-full overflow-hidden border-2 mb-1 bg-white shadow-sm transition-all duration-200 ${activeSub === sub.key ? 'border-red-700 scale-105 ring-2 ring-red-100' : 'border-gray-200 group-hover:border-red-400'}`}>
                  <img src={sub.image} alt={sub.name} className="object-cover w-full h-full" />
                </div>
                <span className={`text-xs text-center leading-tight font-medium transition-colors duration-200 ${activeSub === sub.key ? 'text-red-700' : 'text-gray-700 group-hover:text-red-700'}`}>{sub.name}</span>
                <div className="h-2 flex items-center justify-center mt-1">
                  {activeSub === sub.key && <div className="h-1 w-8 bg-red-700 rounded-full shadow-md transition-all duration-200" />}
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Product List */}
        <div className="px-0 md:px-2">
          <div className="text-xs text-gray-500 mb-2">{filteredProducts.length} items available</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} onCardClick={onProductClick} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 