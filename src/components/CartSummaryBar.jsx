import React from 'react';
import { MdShoppingBasket } from 'react-icons/md';

const CartSummaryBar = ({ itemCount, totalPrice, onCheckout }) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed left-0 right-0 bottom-0 z-40 flex justify-center pointer-events-none">
      <div className="flex items-center justify-between bg-white shadow-lg rounded-2xl border border-gray-200 px-6 py-3 mb-20 md:mb-4 w-[95vw] max-w-md pointer-events-auto">
        <div className="flex-1 flex flex-col">
          <span className="font-semibold text-red-700 text-base">
            {itemCount} Item{itemCount > 1 ? 's' : ''} | ₹ {totalPrice}/-
          </span>
        </div>
        <button
          className="ml-4 flex items-center text-red-700 font-semibold hover:underline focus:outline-none"
          onClick={onCheckout}
        >
          Cart &rarr;
        </button>
        <div className="ml-4 bg-red-50 rounded-full p-2 flex items-center justify-center">
          <MdShoppingBasket size={28} className="text-red-700" />
        </div>
      </div>
    </div>
  );
};

export default CartSummaryBar; 