import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFilterList, 
  MdLocalShipping,
  MdCheckCircle,
  MdSchedule,
  MdCancel
} from 'react-icons/md';
import { onSnapshot, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import * as XLSX from 'xlsx';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterType, setFilterType] = useState('today'); // 'today', 'week', 'month', 'custom'
  const [customRange, setCustomRange] = useState({ from: '', to: '' });
  const [summaryModal, setSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    // Real-time Firestore listener
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: data.orderId || doc.id,
          customer: data.customer || '',
          email: data.email || '',
          phone: data.phone || '',
          items: data.products || data.items || [],
          total: data.total || 0,
          status: data.status || 'pending',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date()),
          address: data.address || '',
          paymentMethod: data.paymentMethod || '',
        };
      });
      setOrders(fetchedOrders);
    });
    return () => unsubscribe();
  }, []);

  // Helper to get start/end of today, week, month
  function getDateRange(type) {
    const now = new Date();
    let start, end;
    if (type === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (type === 'week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
      start = new Date(now.setDate(diff));
      start.setHours(0,0,0,0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23,59,59,999);
    } else if (type === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (type === 'custom') {
      start = customRange.from ? new Date(customRange.from + 'T00:00:00') : null;
      end = customRange.to ? new Date(customRange.to + 'T23:59:59') : null;
    }
    return { start, end };
  }

  // Filtering logic
  const { start: filterStart, end: filterEnd } = getDateRange(filterType);
  const filteredOrders = orders.filter(order => {
    // Date filter
    let inRange = true;
    if (filterStart && filterEnd) {
      const orderDate = new Date(order.createdAt);
      inRange = orderDate >= filterStart && orderDate <= filterEnd;
    }
    // Search filter
    const matchesSearch =
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase()));
    return inRange && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Aggregate summary by product name (and category if present)
  function getSummary(orders) {
    const summary = {};
    let overallTotal = 0;
    let overallQty = 0;
    let overallWeight = 0;
    let overallOrders = new Set();
    let overallCash = 0;
    let overallOnline = 0;
    orders.forEach(order => {
      const orderId = order.id;
      const paymentMethod = (order.paymentMethod || '').trim().toLowerCase();
      console.log('Order:', orderId, 'Payment:', paymentMethod, 'Products:', order.items);
      (order.items || []).forEach(item => {
        const key = item.name || 'Unknown';
        const category = item.category || '';
        const qty = Number(item.qty) || 1;
        const total = Number(item.total) || 0;
        const weight = Number(item.weight) || 0;
        const pricePerKg = Number(item.pricePerKg) || null;
        if (!summary[key]) {
          summary[key] = {
            name: key,
            category,
            qty: 0,
            total: 0,
            weight: 0,
            pricePerKgSum: 0,
            pricePerKgCount: 0,
            orderIds: new Set(),
            cash: 0,
            online: 0,
          };
        }
        summary[key].qty += qty;
        summary[key].total += total;
        summary[key].weight += weight;
        if (pricePerKg) {
          summary[key].pricePerKgSum += pricePerKg;
          summary[key].pricePerKgCount += 1;
        }
        summary[key].orderIds.add(orderId);
        if (paymentMethod === 'cash') {
          summary[key].cash += total;
          overallCash += total;
        } else if (paymentMethod === 'online') {
          summary[key].online += total;
          overallOnline += total;
        }
        overallTotal += total;
        overallQty += qty;
        overallWeight += weight;
        overallOrders.add(orderId);
      });
    });
    const summaryArr = Object.values(summary).map(row => ({
      ...row,
      avgPricePerKg: row.pricePerKgCount ? (row.pricePerKgSum / row.pricePerKgCount).toFixed(2) : '-',
      orderCount: row.orderIds.size,
    }));
    return {
      summary: summaryArr,
      overallTotal,
      overallQty,
      overallWeight,
      overallOrderCount: overallOrders.size,
      overallCash,
      overallOnline,
    };
  }

  // Export to Excel
  function exportSummaryToExcel() {
    const { summary, overallTotal, overallQty, overallWeight, overallOrderCount, overallCash, overallOnline } = getSummary(filteredOrders);
    const wsData = [
      ['Product', 'Category', 'Total Quantity', 'Total Weight', 'Avg Price/Kg', 'Revenue (Cash)', 'Revenue (Online)', 'Revenue (All)', 'Order Count'],
      ...summary.map(row => [row.name, row.category, row.qty, row.weight || '-', row.avgPricePerKg, row.cash, row.online, row.total, row.orderCount]),
      ['Overall', '', overallQty, overallWeight || '-', '', overallCash, overallOnline, overallTotal, overallOrderCount]
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    XLSX.writeFile(wb, 'order_summary.xlsx');
  }

  // Show summary modal
  function showSummaryModal() {
    const { summary, overallTotal, overallQty, overallWeight, overallOrderCount, overallCash, overallOnline } = getSummary(filteredOrders);
    setSummaryData({ summary, overallTotal, overallQty, overallWeight, overallOrderCount, overallCash, overallOnline });
    setSummaryModal(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-2">Manage and track customer orders</p>
      </div>

      {/* Export/View Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          onClick={showSummaryModal}
        >
          View Summary
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          onClick={exportSummaryToExcel}
        >
          Export Excel
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-4 md:gap-0">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Quick Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterType}
              onChange={e => {
                setFilterType(e.target.value);
                if (e.target.value !== 'custom') setCustomRange({ from: '', to: '' });
              }}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {/* Custom Date Range */}
          {filterType === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-2 py-2"
                value={customRange.from}
                onChange={e => setCustomRange(r => ({ ...r, from: e.target.value }))}
                max={customRange.to || undefined}
              />
              <span>to</span>
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-2 py-2"
                value={customRange.to}
                onChange={e => setCustomRange(r => ({ ...r, to: e.target.value }))}
                min={customRange.from || undefined}
              />
            </div>
          )}
          {filterType === 'custom' && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!customRange.from || !customRange.to}
            >
              Search
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Orders ({filteredOrders.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.items.length} items</div>
                      <div className="text-sm text-gray-500">
                        {order.items.map(item => item.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{order.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                        onClick={() => setDeleteConfirm(order)}
                        className="text-red-600 hover:text-red-900 p-1"
                          >
                        Delete
                          </button>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-red-700">Delete Order</h3>
            <p className="mb-4">Are you sure you want to delete order <span className="font-mono">#{deleteConfirm.id}</span>?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
                    <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={async () => {
                  await deleteDoc(doc(db, 'orders', deleteConfirm.id));
                  setDeleteConfirm(null);
                    }}
              >
                Delete
                  </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {summaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Order Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1 text-left">Product</th>
                    <th className="px-2 py-1 text-left">Category</th>
                    <th className="px-2 py-1 text-center">Total Quantity</th>
                    <th className="px-2 py-1 text-center">Total Weight</th>
                    <th className="px-2 py-1 text-center">Avg Price/Kg</th>
                    <th className="px-2 py-1 text-right">Revenue (Cash)</th>
                    <th className="px-2 py-1 text-right">Revenue (Online)</th>
                    <th className="px-2 py-1 text-right">Total Revenue</th>
                    <th className="px-2 py-1 text-center">Order Count</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.summary && summaryData.summary.map((row, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="px-2 py-1">{row.name}</td>
                      <td className="px-2 py-1">{row.category}</td>
                      <td className="px-2 py-1 text-center">{row.qty}</td>
                      <td className="px-2 py-1 text-center">{row.weight || '-'}</td>
                      <td className="px-2 py-1 text-center">{row.avgPricePerKg}</td>
                      <td className="px-2 py-1 text-right">₹{row.cash}</td>
                      <td className="px-2 py-1 text-right">₹{row.online}</td>
                      <td className="px-2 py-1 text-right">₹{row.total}</td>
                      <td className="px-2 py-1 text-center">{row.orderCount}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-blue-50">
                    <td>Overall</td>
                    <td></td>
                    <td className="px-2 py-1 text-center">{summaryData.overallQty}</td>
                    <td className="px-2 py-1 text-center">{summaryData.overallWeight || '-'}</td>
                    <td></td>
                    <td className="px-2 py-1 text-right">₹{summaryData.overallCash}</td>
                    <td className="px-2 py-1 text-right">₹{summaryData.overallOnline}</td>
                    <td className="px-2 py-1 text-right">₹{summaryData.overallTotal}</td>
                    <td className="px-2 py-1 text-center">{summaryData.overallOrderCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setSummaryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement; 