import React from 'react';

const Footer = () => (
  <footer className="w-full bg-white border-t border-gray-200 py-4 mt-8 text-center text-xs text-gray-500">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-2 md:mb-0">
        &copy; {new Date().getFullYear()} Taaza Meat. All rights reserved.
      </div>
      <div className="flex items-center space-x-4">
        <a href="#" className="hover:text-red-700 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-red-700 transition-colors">Terms</a>
      </div>
    </div>
  </footer>
);

export default Footer; 