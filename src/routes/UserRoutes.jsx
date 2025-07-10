import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Home from '../pages/Home';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import Footer from '../components/Footer';
import BottomNavBar from '../components/BottomNavBar';
import Categories from '../pages/Categories';
import Search from '../pages/Search';
import CategoryPage from '../pages/CategoryPage';
import CartSummaryBar from '../components/CartSummaryBar';
import { categoriesConfig, products } from '../data/products';
import ProductDetail from '../pages/ProductDetail';

const UserRoutes = ({ onAdminClick }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [categoryKey, setCategoryKey] = useState(null);
  const [subcategoryKey, setSubcategoryKey] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { getTotalItems, getTotalPrice } = useCart();

  const navigateToHome = () => setCurrentPage('home');
  const navigateToCart = () => setCurrentPage('cart');
  const navigateToCheckout = () => setCurrentPage('checkout');
  const navigateToSuccess = () => setCurrentPage('success');
  const navigateToCategories = () => setCurrentPage('categories');
  const navigateToSearch = () => setCurrentPage('search');
  const navigateToCategoryPage = (key, subKey = 'all') => {
    setCategoryKey(key);
    setSubcategoryKey(subKey);
    setCurrentPage('category');
  };
  const navigateToProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentPage('productDetail');
  };
  const handleHeaderNavigate = (tab) => {
    if (tab === 'home') navigateToHome();
    else if (tab === 'categories') navigateToCategories();
    else if (tab === 'search') navigateToSearch();
    else if (tab === 'cart') navigateToCart();
  };
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigateToCart={navigateToCart} onNavigateToCategory={navigateToCategoryPage} onNavigate={handleHeaderNavigate} activeTab="home" cartCount={getTotalItems()} query={searchQuery} setQuery={setSearchQuery} onProductClick={navigateToProductDetail} onAdminClick={onAdminClick} />;
      case 'cart':
        return <Cart onNavigateToHome={navigateToHome} onNavigateToCheckout={navigateToCheckout} onNavigate={handleHeaderNavigate} activeTab="cart" cartCount={getTotalItems()} query={searchQuery} setQuery={setSearchQuery} onAdminClick={onAdminClick} />;
      case 'checkout':
        return <Checkout onNavigateToCart={navigateToCart} onNavigateToSuccess={navigateToSuccess} onNavigate={handleHeaderNavigate} activeTab="checkout" cartCount={getTotalItems()} query={searchQuery} setQuery={setSearchQuery} onAdminClick={onAdminClick} />;
      case 'success':
        return <OrderSuccess onNavigateToHome={navigateToHome} onNavigate={handleHeaderNavigate} activeTab="home" cartCount={getTotalItems()} query={searchQuery} setQuery={setSearchQuery} onAdminClick={onAdminClick} />;
      case 'categories':
        return <Categories onNavigateToCategory={navigateToCategoryPage} onNavigate={handleHeaderNavigate} activeTab="categories" cartCount={getTotalItems()} query={searchQuery} setQuery={setSearchQuery} onAdminClick={onAdminClick} />;
      case 'search':
        return (
          <Search
            onNavigate={handleHeaderNavigate}
            activeTab="search"
            cartCount={getTotalItems()}
            query={searchQuery}
            setQuery={setSearchQuery}
            onNavigateToCategoryPage={navigateToCategoryPage}
            onProductClick={navigateToProductDetail}
            onAdminClick={onAdminClick}
          />
        );
      case 'category': {
        const cat = categoriesConfig.find(c => c.key === categoryKey);
        if (!cat) return <div className="p-8 text-center text-gray-500">Category not found.</div>;
        return <CategoryPage category={cat} products={products} initialSubcategory={subcategoryKey} onNavigateToSubcategory={navigateToCategoryPage} onNavigate={handleHeaderNavigate} activeTab="categories" cartCount={getTotalItems()} query={searchQuery} setQuery={setSearchQuery} onProductClick={navigateToProductDetail} onAdminClick={onAdminClick} />;
      }
      case 'productDetail':
        return (
          <ProductDetail
            product={selectedProduct}
            onNavigate={handleHeaderNavigate}
            activeTab="home"
            cartCount={getTotalItems()}
            query={searchQuery}
            setQuery={setSearchQuery}
            onBack={() => setCurrentPage('home')}
            onAdminClick={onAdminClick}
          />
        );
      default:
        return <Home onNavigateToCart={navigateToCart} onNavigateToCategory={navigateToCategoryPage} onNavigate={handleHeaderNavigate} activeTab="home" cartCount={getTotalItems()} query={searchQuery} setQuery={setSearchQuery} onProductClick={navigateToProductDetail} onAdminClick={onAdminClick} />;
    }
  };
  const getActiveTab = () => {
    switch (currentPage) {
      case 'home': return 'home';
      case 'categories': return 'categories';
      case 'search': return 'search';
      case 'cart': return 'home';
      case 'checkout': return 'home';
      case 'success': return 'home';
      case 'category': return 'home';
      case 'productDetail': return 'home';
      default: return 'home';
    }
  };
  const showCartSummaryBar = !['cart', 'checkout', 'success'].includes(currentPage);
  return (
    <div className="App min-h-screen flex flex-col">
      <div className="flex-1 pb-16 md:pb-0">
        {renderPage()}
        {showCartSummaryBar && (
          <CartSummaryBar
            itemCount={getTotalItems()}
            totalPrice={getTotalPrice()}
            onCheckout={navigateToCheckout}
          />
        )}
      </div>
      <Footer />
      <BottomNavBar
        activeTab={getActiveTab()}
        onTabChange={(tab) => {
          if (tab === 'home') navigateToHome();
          else if (tab === 'categories') navigateToCategories();
          else if (tab === 'search') navigateToSearch();
        }}
      />
    </div>
  );
};

export default UserRoutes; 