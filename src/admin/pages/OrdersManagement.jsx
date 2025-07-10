import React, { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdFilterList, 
  MdVisibility,
  MdLocalShipping,
  MdCheckCircle,
  MdSchedule,
  MdCancel
} from 'react-icons/md';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Mock data - replace with Firebase call
    setOrders([
      {
        id: '1',
        customer: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        items: [
          { name: 'Fresh Chicken Breast', quantity: 2, price: 180 },
          { name: 'Chicken Thighs', quantity: 1, price: 160 }
        ],
        total: 520,
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        address: '123 Main St, City, State 12345'
      },
      {
        id: '2',
        customer: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        items: [
          { name: 'Mutton Curry Cut', quantity: 1, price: 650 }
        ],
        total: 650,
        status: 'processing',
        createdAt: '2024-01-14T15:45:00Z',
        address: '456 Oak Ave, City, State 12345'
      },
      {
        id: '3',
        customer: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+91 9876543212',
        items: [
          { name: 'Farm Fresh Eggs', quantity: 2, price: 120 },
          { name: 'Chicken Masala', quantity: 1, price: 45 }
        ],
        total: 285,
        status: 'completed',
        createdAt: '2024-01-13T09:15:00Z',
        address: '789 Pine St, City, State 12345'
      }
    ]);
    setLoading(false);
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return MdSchedule;
      case 'processing': return MdLocalShipping;
      case 'completed': return MdCheckCircle;
      case 'cancelled': return MdCancel;
      default: return MdSchedule;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-2">Manage and track customer orders</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by customer or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
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
                      <div className="flex items-center">
                        <StatusIcon className="w-4 h-4 mr-2" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <MdVisibility className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="text-green-600 hover:text-green-900 p-1"
                          >
                            <MdLocalShipping className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="text-green-600 hover:text-green-900 p-1"
                          >
                            <MdCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Details #{selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{selectedOrder.customer}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2">{selectedOrder.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2">{selectedOrder.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-600">Address:</span>
                  <p className="ml-2">{selectedOrder.address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">₹{item.price}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-lg font-bold text-gray-900">Total: ₹{selectedOrder.total}</span>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="mt-3 flex space-x-2">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'processing');
                        setSelectedOrder({...selectedOrder, status: 'processing'});
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Mark as Processing
                    </button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'completed');
                        setSelectedOrder({...selectedOrder, status: 'completed'});
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Mark as Completed
                    </button>
                  )}
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'cancelled');
                      setSelectedOrder({...selectedOrder, status: 'cancelled'});
                    }}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement; 