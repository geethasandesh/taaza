import React from 'react';

const SectionHeading = ({ title, subtitle, showViewAll = false, onViewAll }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {subtitle && (
          <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {showViewAll && (
        <button
          onClick={onViewAll}
          className="text-red-700 hover:text-red-800 text-sm font-medium"
        >
          View All
        </button>
      )}
    </div>
  );
};

export default SectionHeading; 