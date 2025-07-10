import React, { useState, useEffect } from 'react';
import { 
  MdTrendingUp, 
  MdTrendingDown, 
  MdShoppingCart,
  MdAttachMoney,
  MdPeople,
  MdInventory
} from 'react-icons/md';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    productGrowth: 0
  });

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    // Mock data - replace with Firebase calls
    setAnalytics({
      totalRevenue: 45230,
      totalOrders: 156,
      totalCustomers: 89,
      totalProducts: 24,
      revenueGrowth: 12.5,
      orderGrowth: 8.3,
      customerGrowth: 15.2,
      productGrowth: -2.1
    });

    setTopProducts([
      { name: 'Fresh Chicken Breast', sales: 45, revenue: 8100 },
      { name: 'Chicken Thighs', sales: 38, revenue: 6080 },
      { name: 'Mutton Curry Cut', sales: 32, revenue: 20800 },
      { name: 'Farm Fresh Eggs', sales: 28, revenue: 3360 },
      { name: 'Chicken Masala', sales: 25, revenue: 1125 }
    ]);

    setRecentOrders([
      { id: '1', customer: 'John Doe', amount: 450, date: '2024-01-15' },
      { id: '2', customer: 'Jane Smith', amount: 320, date: '2024-01-14' },
      { id: '3', customer: 'Mike Johnson', amount: 780, date: '2024-01-13' },
      { id: '4', customer: 'Sarah Wilson', amount: 290, date: '2024-01-12' },
      { id: '5', customer: 'David Brown', amount: 540, date: '2024-01-11' }
    ]);

    setRevenueData([
      { month: 'Jan', revenue: 12000 },
      { month: 'Feb', revenue: 15000 },
      { month: 'Mar', revenue: 18000 },
      { month: 'Apr', revenue: 22000 },
      { month: 'May', revenue: 25000 },
      { month: 'Jun', revenue: 28000 }
    ]);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, growth, isCurrency = false }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {isCurrency ? `₹${value.toLocaleString()}` : value.toLocaleString()}
          </p>
          <div className="flex items-center mt-2">
            {growth >= 0 ? (
              <MdTrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <MdTrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? '+' : ''}{growth}% from last month
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your business performance and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={analytics.totalRevenue}
          icon={MdAttachMoney}
          color="bg-green-500"
          growth={analytics.revenueGrowth}
          isCurrency={true}
        />
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders}
          icon={MdShoppingCart}
          color="bg-blue-500"
          growth={analytics.orderGrowth}
        />
        <StatCard
          title="Total Customers"
          value={analytics.totalCustomers}
          icon={MdPeople}
          color="bg-purple-500"
          growth={analytics.customerGrowth}
        />
        <StatCard
          title="Total Products"
          value={analytics.totalProducts}
          icon={MdInventory}
          color="bg-orange-500"
          growth={analytics.productGrowth}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="space-y-4">
            {revenueData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{data.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(data.revenue / 30000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">₹{data.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
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
                    <p className="text-sm text-gray-500">Order #{order.id} • {formatDate(order.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-yellow-600">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Processing</span>
              <span className="text-sm font-medium text-blue-600">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-green-600">134</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chicken</span>
              <span className="text-sm font-medium text-gray-900">₹18,200</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mutton</span>
              <span className="text-sm font-medium text-gray-900">₹20,800</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Eggs</span>
              <span className="text-sm font-medium text-gray-900">₹3,360</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Customers</span>
              <span className="text-sm font-medium text-green-600">+15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Repeat Orders</span>
              <span className="text-sm font-medium text-blue-600">67%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Order Value</span>
              <span className="text-sm font-medium text-gray-900">₹290</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 