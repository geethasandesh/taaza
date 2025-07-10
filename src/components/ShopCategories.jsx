import React from 'react';

const ShopCategories = ({ categories }) => (
  <div className="w-full">
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
      {categories.map((cat, idx) => (
        <div key={cat.name} className="flex flex-col items-center group cursor-pointer">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-red-700 shadow-sm bg-white flex items-center justify-center mb-2 transition-all">
            <img
              src={cat.image}
              alt={cat.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </div>
          <span className="text-xs md:text-sm text-gray-700 text-center font-medium group-hover:text-red-700 transition-colors">
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default ShopCategories; 