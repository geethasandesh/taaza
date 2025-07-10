import React from 'react';
import { 
  MdDashboard, 
  MdInventory, 
  MdCategory, 
  MdShoppingCart, 
  MdAnalytics,
  MdSettings,
  MdLogout,
  MdReceipt
} from 'react-icons/md';

const AdminSidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'billing', label: 'Billing', icon: MdReceipt },
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
    { id: 'products', label: 'Products', icon: MdInventory },
    { id: 'categories', label: 'Categories', icon: MdCategory },
    { id: 'orders', label: 'Orders', icon: MdShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: MdAnalytics },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Taaza Admin</h1>
        <p className="text-sm text-gray-600 mt-1">Management Panel</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-2 transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <button className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
          <MdSettings className="w-5 h-5 mr-3 text-gray-500" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 