import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/firebaseService';
import { addDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const initialProductRow = {
  name: '',
  qty: 1,
  amount: 0,
  weight: '',
  total: 0,
  pricePerKg: 0,
};

function Billing() {
  const [currentBill, setCurrentBill] = useState({ id: 1, products: [], customer: null });
  const [productRow, setProductRow] = useState({ ...initialProductRow });
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('Cash');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [orderPaid, setOrderPaid] = useState(null);
  const [confirmPay, setConfirmPay] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [quickItems, setQuickItems] = useState([]);
  const [showKeypad, setShowKeypad] = useState(false);
  const [quickItemAdded, setQuickItemAdded] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [keypadStandalone, setKeypadStandalone] = useState(false);
  const [standaloneKeypadValue, setStandaloneKeypadValue] = useState('');
  const [keypadType, setKeypadType] = useState('numeric');

  // Calculate totals
  const totalQty = currentBill.products.reduce((sum, p) => sum + Number(p.qty), 0);
  const totalAmount = currentBill.products.reduce((sum, p) => sum + Number(p.total), 0);
  const subTotal = totalAmount;
  const amountPayable = subTotal;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log('Fetched products:', data);
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch quick items from Firestore
  useEffect(() => {
    const fetchQuickItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'quickitems'));
        setQuickItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching quick items:', err);
      }
    };
    fetchQuickItems();
  }, []);

  // Auto-close keypad on physical keyboard input
  useEffect(() => {
    if (!showKeypad || keypadStandalone) return;
    function handleKeydown(e) {
      // Ignore if the event is triggered by the virtual keypad (e.isTrusted is always true, but we can check target)
      // We'll close the keypad for any key press except Tab (to allow navigation)
      if (e.key !== 'Tab') {
        setShowKeypad(false);
        setActiveInput(null);
        setKeypadStandalone(false);
      }
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [showKeypad, keypadStandalone]);

  // Client-side search on SEARCH button click
  const handleSearch = () => {
    if (!search.trim()) return;
    console.log('Searching for:', search);
    console.log('Available products:', allProducts);
    const results = allProducts.filter(p =>
      p.name && p.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log('Search results:', results);
    console.log('Sample product structure:', results[0]);
    setFilteredSuggestions(results);
    setShowSuggestions(true);
  };

  // Helper to compute total for the product row
  const computeTotal = (row) => {
    const qty = Number(row.qty) || 1;
    const amount = Number(row.amount) || 0;
    return amount * qty;
  };

  // Handlers
  const handleAddProduct = () => {
    if (!productRow.name || !productRow.amount || !productRow.qty) return;
    const total = Number(productRow.amount) * Number(productRow.qty);
    const newProduct = { ...productRow, total };
    const updatedProducts = [...currentBill.products, newProduct];
    setCurrentBill({ ...currentBill, products: updatedProducts });
    setProductRow({ ...initialProductRow });
  };

  const handleRemoveProduct = (idx) => {
    const updatedProducts = currentBill.products.filter((_, i) => i !== idx);
    setCurrentBill({ ...currentBill, products: updatedProducts });
  };

  const handleSuggestionClick = (product) => {
    const pricePerKg = product.pricePerKg || product.price || 0;
    setSelectedProduct(product);
    setProductRow({
      ...initialProductRow,
      name: product.name,
      qty: 1,
      pricePerKg: pricePerKg,
      amount: pricePerKg, // default to 1kg
      weight: 1,
      total: pricePerKg * 1,
    });
    setSearch(product.name);
    setShowSuggestions(false);
  };

  // Payment handler (now called after confirmation)
  const handlePay = (withReceipt) => {
    setConfirmPay({ withReceipt });
  };

  // Actually process payment after confirmation
  const processPayment = async (withReceipt) => {
    setConfirmPay(null);
    setProcessing(true);
    setTimeout(async () => {
      // Simulate order ID and details
      const orderId = 'ORD' + Math.floor(Math.random() * 1000000);
      const orderData = {
        orderId,
        products: currentBill.products,
        total: amountPayable,
        paymentMethod: selectedPayment,
        withReceipt,
        createdAt: new Date(),
      };
      setOrderPaid(orderData);
      // Store in Firestore
      try {
        await addDoc(collection(db, 'orders'), orderData);
      } catch (err) {
        console.error('Error saving order to Firestore:', err);
      }
      setProcessing(false);
    }, 1500);
  };

  // Add current productRow to quick items
  const handleAddToQuickItems = async () => {
    if (!productRow.name || !productRow.pricePerKg) return;
    try {
      await addDoc(collection(db, 'quickitems'), {
        name: productRow.name,
        pricePerKg: productRow.pricePerKg,
        category: selectedProduct?.category || '',
      });
      // Optionally refetch quick items
      const snapshot = await getDocs(collection(db, 'quickitems'));
      setQuickItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error adding to quick items:', err);
    }
  };

  // Add quick item to bill
  const handleAddQuickItemToBill = (item) => {
    setProductRow({
      ...initialProductRow,
      name: item.name,
      qty: 1,
      pricePerKg: item.pricePerKg,
      amount: item.pricePerKg,
      weight: 1,
      total: item.pricePerKg * 1,
    });
    setShowSuggestions(false);
  };

  // Delete a quick item from Firestore and update state
  const deleteQuickItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'quickitems', id));
      setQuickItems((prev) => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting quick item:', err);
    }
  };

  // Numeric Keypad component
  function Keypad({ onInput, onBackspace, onDone, displayValue }) {
    const keys = [
      ['7', '8', '9'],
      ['4', '5', '6'],
      ['1', '2', '3'],
      ['0', '.', '⌫']
    ];
    return (
      <div className="w-full flex flex-col items-center gap-2">
        <div className="mb-2 w-full text-center text-2xl font-mono bg-white border rounded py-2">{displayValue || ' '}</div>
        {keys.map((row, i) => (
          <div key={i} className="flex gap-2 w-full">
            {row.map((key) => (
              <button
                key={key}
                className="flex-1 py-3 bg-gray-200 rounded-lg text-xl font-semibold hover:bg-blue-200 transition"
                onClick={() => {
                  if (key === '⌫') onBackspace();
                  else onInput(key);
                }}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <button className="w-full py-3 mt-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700" onClick={onDone}>Done</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:flex-1 flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex-shrink-0">
            <div className="flex gap-3">
              <div className="flex-1 relative">
            <input
              type="text"
                  placeholder="Search products by name or barcode..."
              value={search}
                  onChange={e => {
                    const value = e.target.value;
                    setSearch(value);
                    if (value.trim()) {
                      const results = allProducts.filter(p =>
                        p.name && p.name.toLowerCase().includes(value.toLowerCase())
                      );
                      setFilteredSuggestions(results);
                      setShowSuggestions(true);
                    } else {
                      setShowSuggestions(false);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => {
                    if (search.trim()) {
                      setShowSuggestions(true);
                    }
                    setShowKeypad(true); setActiveInput('search'); setKeypadType('qwerty'); setKeypadStandalone(false);
                  }}
                />
            {showSuggestions && (
                  <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredSuggestions.map((p) => (
                  <div
                    key={p.id}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(p)}
                  >
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-gray-500">₹{p.pricePerKg || p.price} per kg • {p.category}</div>
                  </div>
                ))}
                {filteredSuggestions.length === 0 && (
                      <div className="px-4 py-3 text-gray-500">No products found</div>
                    )}
                  </div>
                )}
              </div>
              <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          {/* Product Entry */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex-shrink-0">
            <h3 className="text-lg font-semibold mb-4">Add Product</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                  value={productRow.name}
                  onFocus={() => { setShowKeypad(true); setActiveInput('name'); setKeypadType('qwerty'); setKeypadStandalone(false); }}
                  onChange={e => setProductRow({ ...productRow, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-r border-gray-300"
                    onClick={() => {
                      const newQty = Math.max(1, Number(productRow.qty) - 1);
                      setProductRow({ ...productRow, qty: newQty });
                    }}
                  >
                    -
                  </button>
            <input
                    className="w-16 text-center px-2 py-2 border-none focus:ring-0 focus:outline-none bg-transparent"
              type="number"
              value={productRow.qty}
                    readOnly
                    min="1"
                    onFocus={() => { setShowKeypad(true); setActiveInput('qty'); setKeypadType('numeric'); setKeypadStandalone(false); }}
                  />
                  <button
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-l border-gray-300"
                    onClick={() => {
                      const newQty = Number(productRow.qty) + 1;
                      setProductRow({ ...productRow, qty: newQty });
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
              type="number"
                  value={productRow.amount}
                  onFocus={() => { setShowKeypad(true); setActiveInput('amount'); setKeypadType('numeric'); setKeypadStandalone(false); }}
                  readOnly={showKeypad && activeInput === 'amount'}
                  onChange={e => {
                    const amount = Number(e.target.value) || 0;
                    const pricePerKg = Number(productRow.pricePerKg) || 0;
                    const weight = pricePerKg ? (amount / pricePerKg) : 0;
                    setProductRow({ ...productRow, amount: e.target.value, weight: weight ? weight.toFixed(2) : '' });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Weight in kg"
                  type="number"
              value={productRow.weight}
                  onFocus={() => { setShowKeypad(true); setActiveInput('weight'); setKeypadType('numeric'); setKeypadStandalone(false); }}
                  readOnly={showKeypad && activeInput === 'weight'}
                  onChange={e => {
                    const weight = Number(e.target.value) || 0;
                    const pricePerKg = Number(productRow.pricePerKg) || 0;
                    const amount = pricePerKg ? (weight * pricePerKg) : 0;
                    setProductRow({ ...productRow, weight: e.target.value, amount: amount ? amount.toFixed(2) : '' });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Auto calculated"
                  type="number"
                  value={computeTotal(productRow)}
                  readOnly
                />
              </div>
            </div>
            {/* Buttons row: Add to Quick Items, Clear, Update */}
            <div className="flex items-center justify-end mt-4 gap-2">
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                onClick={async () => {
                  await handleAddToQuickItems();
                  setQuickItemAdded(true);
                  setTimeout(() => setQuickItemAdded(false), 1200);
                }}
                disabled={!productRow.name || !productRow.pricePerKg}
              >
                Add to Quick Items
              </button>
              {quickItemAdded && <span className="text-green-600 text-sm animate-bounce">✔ Added!</span>}
              <button 
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setProductRow({ ...initialProductRow })}
              >
                Clear
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleAddProduct}
              >
                Update
              </button>
            </div>
          </div>

          {/* Selected Product Display */}
          {selectedProduct && (
            <></>
          )}

          {/* Products List */}
          <div className="bg-white rounded-lg shadow-sm border flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold">Products ({currentBill.products.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[320px] text-sm sm:text-base">
              {currentBill.products.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No products added yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {currentBill.products.map((product, idx) => (
                    <div key={idx} className="px-2 sm:px-4 py-2 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          ₹{product.sp} × {product.qty} = ₹{product.total}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">₹{product.total}</span>
                        <button 
                          onClick={() => handleRemoveProduct(idx)}
                          className="text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-200 rounded-full p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* After the products list, add the Bill Summary heading and horizontal summary */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2 text-gray-800">Bill Summary</h3>
            <div className="w-full flex flex-wrap items-center justify-between gap-2 sm:gap-4 bg-blue-50 border border-blue-200 rounded-lg px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-base">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Items</span>
                <span className="font-bold text-lg">{currentBill.products.length}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Quantity</span>
                <span className="font-bold text-lg">{totalQty}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Subtotal</span>
                <span className="font-bold text-lg">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Total Weight</span>
                <span className="font-bold text-lg">{currentBill.products.reduce((sum, p) => sum + Number(p.weight || 0), 0)} kg</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Total</span>
                <span className="font-bold text-2xl text-blue-700">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white border-l border-gray-200 flex flex-col mt-4 md:mt-0">
          {/* Quick Actions (at top of sidebar) */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button className={`px-4 py-2 rounded-lg font-medium ${showKeypad && keypadStandalone ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => { setShowKeypad(true); setKeypadStandalone(true); setActiveInput(null); }}>
                Keypad
              </button>
              <button className={`px-4 py-2 rounded-lg font-medium ${!showKeypad ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => { setShowKeypad(false); setKeypadStandalone(false); setActiveInput(null); }}>
                Quick Items
              </button>
            </div>
            {/* Show Keypad or Quick Items */}
            {showKeypad && (activeInput || keypadStandalone) ? (
              keypadType === 'qwerty' ? (
                <Keypad
                  value={activeInput === 'name' ? productRow.name : search}
                  onInput={(val) => {
                    if (activeInput === 'name') {
                      setProductRow(prev => ({ ...prev, name: (prev.name || '') + val }));
                    } else if (activeInput === 'search') {
                      setSearch(prev => prev + val);
                    }
                  }}
                  onBackspace={() => {
                    if (activeInput === 'name') {
                      setProductRow(prev => ({ ...prev, name: prev.name.slice(0, -1) }));
                    } else if (activeInput === 'search') {
                      setSearch(prev => prev.slice(0, -1));
                    }
                  }}
                  onSpace={() => {
                    if (activeInput === 'name') {
                      setProductRow(prev => ({ ...prev, name: (prev.name || '') + ' ' }));
                    } else if (activeInput === 'search') {
                      setSearch(prev => prev + ' ');
                    }
                  }}
                  onDone={() => { setShowKeypad(false); setActiveInput(null); setKeypadStandalone(false); }}
                />
              ) : (
                <Keypad
                  value={keypadStandalone ? standaloneKeypadValue : productRow[activeInput]}
                  onInput={(val) => {
                    if (keypadStandalone) {
                      let newVal = String(standaloneKeypadValue || '');
                      if (val === '.' && newVal.includes('.')) return;
                      if (val === '.' && newVal === '') newVal = '0.';
                      else if (val === '⌫') newVal = newVal.slice(0, -1);
                      else newVal += val;
                      setStandaloneKeypadValue(newVal);
                    } else if (activeInput === 'qty') {
                      let newVal = String(productRow.qty || '');
                      if (val === '.') return;
                      newVal = newVal === '0' ? val : newVal + val;
                      setProductRow({ ...productRow, qty: Math.max(1, Number(newVal)) });
                    } else if (activeInput === 'weight') {
                      let newVal = String(productRow.weight || '');
                      if (val === '.' && newVal.includes('.')) return;
                      if (val === '.' && newVal === '') newVal = '0.';
                      else newVal += val;
                      // Update amount based on pricePerKg
                      const pricePerKg = Number(productRow.pricePerKg) || 0;
                      const weightNum = Number(newVal) || 0;
                      const amount = pricePerKg ? (weightNum * pricePerKg).toFixed(2) : '';
                      setProductRow({ ...productRow, weight: newVal, amount });
                    } else if (activeInput === 'amount') {
                      let newVal = String(productRow.amount || '');
                      if (val === '.' && newVal.includes('.')) return;
                      if (val === '.' && newVal === '') newVal = '0.';
                      else newVal += val;
                      // Update weight based on pricePerKg
                      const pricePerKg = Number(productRow.pricePerKg) || 0;
                      const amountNum = Number(newVal) || 0;
                      const weight = pricePerKg ? (amountNum / pricePerKg).toFixed(2) : '';
                      setProductRow({ ...productRow, amount: newVal, weight });
                    }
                  }}
                  onBackspace={() => {
                    if (keypadStandalone) {
                      let newVal = String(standaloneKeypadValue || '');
                      newVal = newVal.slice(0, -1);
                      setStandaloneKeypadValue(newVal);
                    } else if (activeInput === 'qty') {
                      let newVal = String(productRow.qty || '');
                      newVal = newVal.slice(0, -1);
                      setProductRow({ ...productRow, qty: Math.max(1, Number(newVal)) });
                    } else if (activeInput === 'weight') {
                      let newVal = String(productRow.weight || '');
                      newVal = newVal.slice(0, -1);
                      // Update amount based on pricePerKg
                      const pricePerKg = Number(productRow.pricePerKg) || 0;
                      const weightNum = Number(newVal) || 0;
                      const amount = pricePerKg ? (weightNum * pricePerKg).toFixed(2) : '';
                      setProductRow({ ...productRow, weight: newVal, amount });
                    } else if (activeInput === 'amount') {
                      let newVal = String(productRow.amount || '');
                      newVal = newVal.slice(0, -1);
                      // Update weight based on pricePerKg
                      const pricePerKg = Number(productRow.pricePerKg) || 0;
                      const amountNum = Number(newVal) || 0;
                      const weight = pricePerKg ? (amountNum / pricePerKg).toFixed(2) : '';
                      setProductRow({ ...productRow, amount: newVal, weight });
                    }
                  }}
                  onDone={() => { setShowKeypad(false); setActiveInput(null); setKeypadStandalone(false); setStandaloneKeypadValue(''); }}
                  displayValue={keypadStandalone ? standaloneKeypadValue : productRow[activeInput]}
                />
              )
            ) : (
              <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-60 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-700">Quick Items</div>
                </div>
                {quickItems.length === 0 && <div className="text-gray-500 text-center">No quick items yet</div>}
                {quickItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b last:border-b-0 py-2 hover:bg-blue-100 rounded group">
                    <div className="flex-1 cursor-pointer" onClick={() => handleAddQuickItemToBill(item)}>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">₹{item.pricePerKg} per kg</div>
                    </div>
                    <button
                      className="ml-2 text-red-500 hover:text-white hover:bg-red-500 opacity-70 group-hover:opacity-100 transition-colors duration-200 rounded-full p-1"
                      title="Delete"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await deleteQuickItem(item.id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Spacer to push payment to bottom */}
          <div className="flex-1" />
          {/* Payment method selection and pay buttons fixed at bottom */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex gap-4 mb-4">
              <button
                className={`flex-1 py-2 rounded-lg font-semibold border ${selectedPayment === 'Cash' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                onClick={() => setSelectedPayment('Cash')}
              >
                Cash
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-semibold border ${selectedPayment === 'Online' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                onClick={() => setSelectedPayment('Online')}
              >
                Online
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePay(false)}
                disabled={currentBill.products.length === 0}
              >
                Pay (No Receipt)
              </button>
              <button
                className="flex-1 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePay(true)}
                disabled={currentBill.products.length === 0}
              >
                Pay & Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Confirmation Popup */}
      {confirmPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full mx-4 flex flex-col items-center">
            <div className="text-xl font-bold mb-2">Confirm Payment</div>
            <div className="mb-4 text-center">Are you sure you want to pay <span className="font-semibold text-blue-700">₹{amountPayable.toFixed(2)}</span> by <span className="font-semibold text-blue-700">{selectedPayment}</span>?</div>
            <div className="flex gap-4 mt-2">
              <button
                className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 font-semibold"
                onClick={() => setConfirmPay(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                onClick={() => processPayment(confirmPay.withReceipt)}
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Payment Processing Spinner */}
      {processing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <div className="text-lg font-semibold text-blue-700">Processing Payment…</div>
          </div>
        </div>
      )}
      {/* Centered Order Paid Popup */}
      {orderPaid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 flex flex-col gap-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-green-600 text-4xl">✔️</span>
              <span className="text-2xl font-bold text-green-700">Order Paid</span>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Order Info */}
              <div className="flex-1 min-w-[220px] space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-500 font-medium">Order ID:</span>
                  <span className="font-mono text-base font-bold text-blue-700">{orderPaid.orderId}</span>
      </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Payment:</span>
                  <span className="font-semibold text-blue-700">{orderPaid.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Receipt:</span>
                  <span className="font-semibold">{orderPaid.withReceipt ? 'Printed' : 'Not Printed'}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2 mt-2">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-2xl font-extrabold text-green-700">₹{orderPaid.total.toFixed(2)}</span>
                </div>
              </div>
              {/* Right: Product Table */}
              <div className="flex-1 min-w-[220px]">
                <div className="font-semibold text-gray-700 mb-2">Products</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 text-left">Name</th>
                        <th className="px-2 py-1 text-center">Qty</th>
                        <th className="px-2 py-1 text-center">Weight</th>
                        <th className="px-2 py-1 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderPaid.products.map((p, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                          <td className="px-2 py-1 font-medium">{p.name}</td>
                          <td className="px-2 py-1 text-center">{p.qty}</td>
                          <td className="px-2 py-1 text-center">{p.weight}kg</td>
                          <td className="px-2 py-1 text-right">₹{p.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
              </div>
            </div>
            <button
              className="mt-2 px-8 py-2 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition block mx-auto"
              onClick={() => {
                setOrderPaid(null);
                // Clear current bill's products and reset product form
                setCurrentBill({ ...currentBill, products: [] });
                setProductRow({ ...initialProductRow });
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;

