import React, { useState, useEffect } from 'react';
import { 
  MdShoppingCart, 
  MdInventory, 
  MdTrendingUp, 
  MdPeople,
  MdAttachMoney,
  MdLocalShipping,
  MdCheckCircle,
  MdSchedule
} from 'react-icons/md';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual Firebase calls
    setStats({
      totalOrders: 156,
      totalRevenue: 45230,
      totalProducts: 24,
      pendingOrders: 12,
      completedOrders: 134,
      totalCustomers: 89
    });

    setRecentOrders([
      {
        id: '1',
        customer: 'John Doe',
        items: 3,
        total: 450,
        status: 'pending',
        date: '2024-01-15'
      },
      {
        id: '2',
        customer: 'Jane Smith',
        items: 2,
        total: 320,
        status: 'completed',
        date: '2024-01-14'
      },
      {
        id: '3',
        customer: 'Mike Johnson',
        items: 5,
        total: 780,
        status: 'processing',
        date: '2024-01-13'
      }
    ]);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={MdShoppingCart}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={MdAttachMoney}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={MdInventory}
          color="bg-purple-500"
          change={-2}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={MdPeople}
          color="bg-orange-500"
          change={15}
        />
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <MdSchedule className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalOrders - stats.pendingOrders - stats.completedOrders}</p>
            </div>
            <MdLocalShipping className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
            </div>
            <MdCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MdShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">Order #{order.id} • {order.items} items</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">₹{order.total}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 