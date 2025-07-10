import React from 'react';
import { MdNotifications, MdAccountCircle, MdLogout } from 'react-icons/md';

const AdminHeader = ({ admin, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <MdNotifications className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Admin Profile */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <MdAccountCircle className="w-8 h-8 text-gray-600" />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {admin?.email || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <MdLogout className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 