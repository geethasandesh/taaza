import React from 'react';
import { categoriesConfig, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

const Search = ({ onNavigate, activeTab, cartCount, query, setQuery, onNavigateToCategoryPage, onProductClick, onAdminClick }) => {
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  // Flatten all subcategories (excluding 'all') from all categories
  const allSubcategories = categoriesConfig.flatMap(cat =>
    (cat.subcategories || []).filter(sub => sub.key !== 'all').map(sub => ({
      ...sub,
      parent: cat.name,
      parentKey: cat.key
    }))
  );

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
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Section Search Bar (mobile only) */}
        <div className="mb-4 md:hidden">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
            placeholder="Search for any delicious product..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search for products"
          />
        </div>
        {/* Categories or Results */}
        {query.trim() === '' ? (
          <>
            <div className="mb-2">
              <div className="font-semibold text-base text-gray-800">All Subcategories</div>
              <div className="text-xs text-gray-500">Explore all available subcategories</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {allSubcategories.map((sub) => (
                <button
                  key={sub.key + '-' + sub.parentKey}
                  className="flex flex-col items-center focus:outline-none"
                  onClick={() => onNavigateToCategoryPage && onNavigateToCategoryPage(sub.parentKey, sub.key)}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 mb-1">
                    <img src={sub.image} alt={sub.name} className="object-cover w-full h-full" />
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium leading-tight">
                    {sub.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 font-semibold text-base text-gray-800">Search Results</div>
            {filteredProducts.length === 0 ? (
              <div className="text-gray-500 text-sm">No products found.</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={() => {}} onCardClick={onProductClick} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search; 