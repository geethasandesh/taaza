import React from 'react';
import { MdHome, MdCategory, MdShoppingCart } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'home', label: 'Home', icon: <MdHome size={22} /> },
  { id: 'categories', label: 'Categories', icon: <MdCategory size={22} /> },
];

const Header = ({ activeTab = 'home', onNavigate, cartCount, query, setQuery }) => {
  const navigate = useNavigate();
  // Determine if we are on the search page
  const isSearchPage = activeTab === 'search';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Left: Logo/Title (clickable) */}
        <button
          className="flex items-center space-x-2 min-w-0 focus:outline-none group"
          onClick={() => onNavigate && onNavigate('home')}
          aria-label="Go to home page"
          style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
        >
          <span className="text-2xl hidden md:inline group-hover:scale-110 transition-transform">🥩</span>
          <h1 className="text-xl md:text-2xl font-bold text-red-700 tracking-tight truncate group-hover:underline">
            Taaza Meat
          </h1>
        </button>
        {/* Center: Search Bar (desktop only) */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <input
            type="text"
            className="w-[340px] max-w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white cursor-pointer"
            placeholder="Search for any delicious product"
            value={isSearchPage && typeof query === 'string' ? query : ''}
            readOnly={!isSearchPage}
            onClick={() => {
              if (!isSearchPage && onNavigate) onNavigate('search');
            }}
            onChange={isSearchPage && setQuery ? (e) => setQuery(e.target.value) : undefined}
            tabIndex={0}
            aria-label="Search for products"
            style={{ minWidth: 200 }}
          />
        </div>
        {/* Right: Navigation and Cart */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-150 font-medium text-sm border border-transparent
                ${activeTab === item.id ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' : 'text-gray-700 hover:text-red-700 hover:bg-gray-100'}`}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          {/* Cart Icon */}
          {typeof cartCount === 'number' && (
            <button
              onClick={() => onNavigate && onNavigate('cart')}
              className={`relative flex items-center px-3 py-2 rounded-lg transition-colors duration-150 font-medium text-sm border border-transparent text-gray-700 hover:text-red-700 hover:bg-gray-100`}
              aria-label="Cart"
            >
              <MdShoppingCart size={22} />
              <span className="hidden md:inline ml-1">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          {/* Admin Button */}
          <button
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            onClick={() => navigate('/login')}
          >
            Admin
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header; 