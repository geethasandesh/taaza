import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/firebaseService';

const initialProductRow = {
  name: '',
  mrp: '',
  sp: '',
  qty: 1,
  discount: 0,
  weight: '',
  amount: 0,
  total: 0,
};

function Billing() {
  const [bills, setBills] = useState([{ id: 1, products: [], customer: null }]);
  const [activeBill, setActiveBill] = useState(0);
  const [productRow, setProductRow] = useState({ ...initialProductRow });
  const [search, setSearch] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [offerDiscount, setOfferDiscount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const currentBill = bills[activeBill];

  // Calculate totals
  const totalQty = currentBill.products.reduce((sum, p) => sum + Number(p.qty), 0);
  const totalAmount = currentBill.products.reduce((sum, p) => sum + Number(p.total), 0);
  const totalDiscount = currentBill.products.reduce((sum, p) => sum + Number(p.discount || 0), 0);

  // Calculate payment summary
  const paymentTotalDiscount = totalDiscount + Number(additionalDiscount || 0) + Number(offerDiscount || 0);
  const subTotal = totalAmount;
  const amountPayable = subTotal - paymentTotalDiscount;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Client-side search on SEARCH button click
  const handleSearch = () => {
    if (!search.trim()) return;
    const results = allProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSuggestions(results);
    setShowSuggestions(true);
  };

  // Helper to compute amount and total for the product row
  const computeAmount = (row) => {
    const sp = Number(row.sp) || 0;
    const qty = Number(row.qty) || 1;
    const weight = Number(row.weight) || 1;
    return sp * qty * weight;
  };
  const computeTotal = (row) => {
    const amount = computeAmount(row);
    const discount = Number(row.discount) || 0;
    return amount - discount;
  };

  // Handlers
  const handleAddProduct = () => {
    if (!productRow.name || !productRow.sp || !productRow.qty) return;
    const amount = Number(productRow.sp) * Number(productRow.qty);
    const total = amount - Number(productRow.discount || 0);
    const newProduct = { ...productRow, amount, total };
    const updatedProducts = [...currentBill.products, newProduct];
    updateBill({ ...currentBill, products: updatedProducts });
    setProductRow({ ...initialProductRow });
  };

  const handleRemoveProduct = (idx) => {
    const updatedProducts = currentBill.products.filter((_, i) => i !== idx);
    updateBill({ ...currentBill, products: updatedProducts });
  };

  const updateBill = (updatedBill) => {
    setBills(bills.map((b, i) => (i === activeBill ? updatedBill : b)));
  };

  const handleSuggestionClick = (product) => {
    setSelectedProduct(product);
    setProductRow({
      ...initialProductRow,
      name: product.name,
      mrp: product.originalPrice || product.price,
      sp: product.price,
      qty: 1,
      discount: 0,
      weight: product.weight || '',
      amount: product.price,
      total: product.price,
    });
    setSearch(product.name);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Bill Tabs */}
      <div className="flex items-center border-b bg-white px-4 py-2">
        {bills.map((bill, idx) => (
          <button
            key={bill.id}
            className={`px-4 py-2 rounded-t-md border-b-2 font-semibold mr-2 ${activeBill === idx ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600'}`}
            onClick={() => setActiveBill(idx)}
          >
            Bill {bill.id}
          </button>
        ))}
        <button
          className="px-3 py-2 rounded-md bg-blue-600 text-white font-bold ml-2"
          onClick={() => setBills([...bills, { id: bills.length + 1, products: [], customer: null }])}
        >
          +
        </button>
      </div>

      {/* Main Billing Section */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left: Billing */}
        <div className="flex-1 p-6">
          {/* Product Search/Add */}
          <div className="flex items-center gap-2 mb-4 relative">
            <input
              type="text"
              placeholder="Search by Barcode/Product Name/Brand"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold" onClick={handleSearch}>SEARCH</button>
            {showSuggestions && (
              <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded shadow z-10 max-h-60 overflow-y-auto">
                {filteredSuggestions.map((p) => (
                  <div
                    key={p.id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleSuggestionClick(p)}
                  >
                    {p.name} <span className="text-xs text-gray-400">({p.category})</span>
                  </div>
                ))}
                {filteredSuggestions.length === 0 && (
                  <div className="px-4 py-2 text-gray-400">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* Product Entry Row */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 bg-blue-50 p-3 rounded-lg mb-2 items-center">
            {/* Header labels */}
            <div className="md:col-span-2 text-xs font-semibold text-gray-700">Product Name</div>
            <div className="text-xs font-semibold text-gray-700">S.P (₹)</div>
            <div className="text-xs font-semibold text-gray-700">Qty</div>
            <div className="text-xs font-semibold text-gray-700">Discount (₹)</div>
            <div className="text-xs font-semibold text-gray-700">Weight</div>
            <div className="flex flex-col items-end">
              <div className="text-xs font-semibold text-gray-700">Amount (₹)</div>
              <div className="text-xs font-semibold text-gray-700">Total (₹)</div>
            </div>
            <div className="hidden md:block"></div>
            {/* Input row */}
            <input
              className="md:col-span-2 px-2 py-1 border rounded w-full"
              placeholder="Product Name"
              value={productRow.name}
              onChange={e => setProductRow({ ...productRow, name: e.target.value })}
            />
            <input
              className="px-2 py-1 border rounded w-full"
              placeholder="S.P (₹)"
              type="number"
              value={productRow.sp}
              onChange={e => setProductRow({ ...productRow, sp: e.target.value })}
            />
            <input
              className="px-2 py-1 border rounded w-full"
              placeholder="Qty"
              type="number"
              value={productRow.qty}
              onChange={e => setProductRow({ ...productRow, qty: e.target.value })}
            />
            <input
              className="px-2 py-1 border rounded w-full"
              placeholder="Discount (₹)"
              type="number"
              value={productRow.discount}
              onChange={e => setProductRow({ ...productRow, discount: e.target.value })}
            />
            <input
              className="px-2 py-1 border rounded w-full"
              placeholder="Weight"
              value={productRow.weight}
              onChange={e => setProductRow({ ...productRow, weight: e.target.value })}
            />
            {/* Show computed amount and total */}
            <div className="flex flex-col items-end w-full">
              <div className="font-bold">{computeAmount(productRow).toFixed(2)}</div>
              <div className="font-bold">{computeTotal(productRow).toFixed(2)}</div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="px-3 py-1 bg-gray-200 rounded w-full md:w-auto" onClick={() => setProductRow({ ...initialProductRow })}>CANCEL</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded w-full md:w-auto" onClick={handleAddProduct}>UPDATE</button>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Product Name</th>
                  <th className="px-4 py-2 text-left">MRP (₹)</th>
                  <th className="px-4 py-2 text-left">S.P (₹)</th>
                  <th className="px-4 py-2 text-left">Qty</th>
                  <th className="px-4 py-2 text-left">Total (₹)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentBill.products.map((p, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.mrp}</td>
                    <td className="px-4 py-2">{p.sp}</td>
                    <td className="px-4 py-2">{p.qty}</td>
                    <td className="px-4 py-2">{p.total}</td>
                    <td className="px-2 py-2">
                      <button onClick={() => handleRemoveProduct(idx)} className="text-red-600 hover:text-red-800">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-gray-600">ITEM(S)/QTY <span className="font-bold">{currentBill.products.length}/{totalQty}</span></div>
            <div className="text-xs text-gray-600">TOTAL DISCOUNT <span className="font-bold">₹ {totalDiscount.toFixed(2)}</span></div>
            <div className="text-lg font-bold text-blue-700">TOTAL AMOUNT ₹ {totalAmount.toFixed(2)}</div>
          </div>
          {/* Show selected product below total discount */}
          {selectedProduct && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-6">
              <div>
                <div className="font-bold text-lg">{selectedProduct.name}</div>
                <div className="text-sm text-gray-600">Category: {selectedProduct.category}</div>
                <div className="text-sm text-gray-600">Price: ₹{selectedProduct.price}</div>
                <div className="text-sm text-gray-600">Weight: {selectedProduct.weight}</div>
              </div>
              <button
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
                onClick={() => {
                  handleAddProduct();
                  setSelectedProduct(null);
                }}
              >
                Add to Bill
              </button>
            </div>
          )}
        </div>

        {/* Right: Customer & Quick Items */}
        <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Add Customer</h2>
            <input className="w-full px-3 py-2 border rounded mb-2" placeholder="Customer Name" />
            <input className="w-full px-3 py-2 border rounded" placeholder="Phone Number" />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button className="bg-gray-100 rounded-lg py-2 font-semibold">Keypad</button>
            <button className="bg-gray-100 rounded-lg py-2 font-semibold">Suggestions</button>
            <button className="bg-gray-100 rounded-lg py-2 font-semibold">Quick Items</button>
            <button className="bg-gray-100 rounded-lg py-2 font-semibold">Custom Item</button>
          </div>
          <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg text-lg mt-auto" onClick={() => setShowPaymentModal(true)}>PAY</button>
        </div>
      </div>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden">
            {/* Left: Billing Details */}
            <div className="flex-1 p-6 border-r border-gray-200">
              <h2 className="text-xl font-bold mb-4">Billing Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Total Sales</span><span>₹ {subTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Discount</span><span>₹ {totalDiscount.toFixed(2)}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">Additional Discount</span>
                  <input type="number" value={additionalDiscount} onChange={e => setAdditionalDiscount(e.target.value)} className="w-20 px-2 py-1 border rounded text-right" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600">Offer Discount</span>
                  <input type="number" value={offerDiscount} onChange={e => setOfferDiscount(e.target.value)} className="w-20 px-2 py-1 border rounded text-right" />
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2"><span>Sub Total</span><span>₹ {subTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-blue-700 font-bold"><span>Amount Payable</span><span>₹ {amountPayable.toFixed(2)}</span></div>
                <div className="flex justify-between border-t pt-2 mt-2"><span>Pending Amount</span><span>₹ {amountPayable.toFixed(2)}</span></div>
              </div>
            </div>
            {/* Right: Payment Methods */}
            <div className="flex-1 p-6 flex flex-col">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Cash', icon: '🤲' },
                  { label: 'Card', icon: '💳' },
                  { label: 'Paytm', icon: '🅿️' },
                  { label: 'WhatsApp Pay', icon: '🟢' },
                  { label: 'Bhim', icon: '💸' },
                  { label: 'Google Pay', icon: '🟦' },
                  { label: 'PhonePe', icon: '🟪' },
                  { label: 'BharatPe', icon: '🇮🇳' },
                  { label: 'Amazon Pe', icon: '🅰️' },
                  { label: 'UPI', icon: '🏦' },
                  { label: 'PayswiffUPI', icon: '🏦' },
                ].map(pm => (
                  <button
                    key={pm.label}
                    className={`flex flex-col items-center justify-center border rounded-lg py-3 px-2 font-semibold text-sm transition ${selectedPayment === pm.label ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                    onClick={() => setSelectedPayment(pm.label)}
                  >
                    <span className="text-2xl mb-1">{pm.icon}</span>
                    {pm.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg text-lg" onClick={() => setShowPaymentModal(false)}>CANCEL</button>
                <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg text-lg">COMPLETE WITHOUT PRINT</button>
                <button className="flex-1 py-3 bg-blue-700 text-white font-bold rounded-lg text-lg">COMPLETE WITH PRINT</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;
