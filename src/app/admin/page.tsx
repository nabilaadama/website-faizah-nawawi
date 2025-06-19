"use client";

import React, { useState, useEffect } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { ShoppingBag, Users, Package, Calendar, DollarSign, Clock,} from 'lucide-react';
import { db } from '@/lib/firebase/firebase-config'; 
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  subtotal: number;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  items: OrderItem[];
  paymentStatus: "payment_verification" | "unpaid" | "paid" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  stock: number;
  categoryId: string;
  categoryName?: string;
  featured: boolean;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string | null;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

interface Booking {
  id: string;
  userId?: string;
  name: string;
  email: string;
  whatsapp: string;
  appointmentDate: Date;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName?: string;
  rating: number;
  comment?: string;
  status: "pending" | "approved";
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardData {
  products: Product[];
  orders: Order[];
  users: User[];
  bookings: Booking[];
  reviews: Review[];
  categories: Category[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData>({
    products: [],
    orders: [],
    users: [],
    bookings: [],
    reviews: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firestore data fetching functions
  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                    data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                    data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt || Date.now())
        };
      }) as Product[];
      
      
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  };

  const fetchOrders = async (): Promise<Order[]> => {
    try {

      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                    data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                    data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt || Date.now())
        };
      }) as Order[];
      
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
   
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                    data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                    data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt || Date.now())
        };
      }) as User[];
      
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  };

  const fetchBookings = async (): Promise<Booking[]> => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const snapshot = await getDocs(bookingsRef);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          appointmentDate: data.appointmentDate?.toDate ? data.appointmentDate.toDate() : 
                          data.appointmentDate instanceof Date ? data.appointmentDate : new Date(data.appointmentDate || Date.now()),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                    data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                    data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt || Date.now())
        };
      }) as Booking[];
      
    } catch (err) {
      console.error('Error fetching bookings:', err);
      throw err;
    }
  };

  const fetchReviews = async (): Promise<Review[]> => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const snapshot = await getDocs(reviewsRef);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                    data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                    data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt || Date.now())
        };
      }) as Review[];
      
    } catch (err) {
      console.error('Error fetching reviews:', err);
      throw err;
    }
  };

  const fetchCategories = async (): Promise<Category[]> => {
    try {
      
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                    data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                    data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt || Date.now())
        };
      }) as Category[];
      

    } catch (err) {
      console.error('Error fetching categories:', err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [products, orders, users, bookings, reviews, categories] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchUsers(),
          fetchBookings(),
          fetchReviews(),
          fetchCategories()
        ]);

        setData({
          products,
          orders,
          users,
          bookings,
          reviews,
          categories
        });
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate dashboard metrics
  const totalProducts = data.products.length;
  const totalOrders = data.orders.length;
  const totalUsers = data.users.filter(u => u.role === 'customer').length;
  const totalBookings = data.bookings.filter(b => b.status === 'pending').length;
  
  
  const totalRevenue = data.orders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  const averageRating = data.reviews.length > 0 
    ? data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length 
    : 0;

  const lowStockProducts = data.products.filter(p => p.stock < 5).length;
  const pendingOrders = data.orders.filter(o => o.status === 'pending').length;

  const generateMonthlyData = () => {
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        orders: 0,
        revenue: 0
      };
    });

    data.orders.forEach(order => {
      const orderMonth = order.createdAt.getMonth();
      const orderYear = order.createdAt.getFullYear();
      const currentYear = new Date().getFullYear();
      
      if (orderYear === currentYear) {
        const monthIndex = monthlyData.findIndex(m => {
          const testDate = new Date();
          testDate.setMonth(orderMonth);
          return m.month === testDate.toLocaleDateString('en-US', { month: 'short' });
        });
        
        if (monthIndex !== -1) {
          monthlyData[monthIndex].orders += 1;
          if (order.paymentStatus === 'paid') {
            monthlyData[monthIndex].revenue += order.totalAmount;
          }
        }
      }
    });

    return monthlyData;
  };

  // Chart data
  const monthlyOrdersData = generateMonthlyData();

  const orderStatusData = [
    { name: 'Delivered', value: data.orders.filter(o => o.status === 'delivered').length, color: '#10B981' },
    { name: 'Shipped', value: data.orders.filter(o => o.status === 'shipped').length, color: '#3B82F6' },
    { name: 'Processing', value: data.orders.filter(o => o.status === 'processing').length, color: '#F59E0B' },
    { name: 'Pending', value: data.orders.filter(o => o.status === 'pending').length, color: '#EF4444' },
    { name: 'Cancelled', value: data.orders.filter(o => o.status === 'cancelled').length, color: '#6B7280' }
  ].filter(item => item.value > 0);

  // Generate category distribution from products
  const generateCategoryData = () => {
    const categoryCount = data.categories.map(category => ({
      name: category.name,
      value: data.products.filter(p => p.categoryName === category.name).length,
      color: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981'][data.categories.indexOf(category) % 4]
    })).filter(item => item.value > 0);

    const total = categoryCount.reduce((sum, item) => sum + item.value, 0);
    return categoryCount.map(item => ({
      ...item,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
    }));
  };

  const categoryData = generateCategoryData();

  type StatCardProps = {
    title: string;
    value: React.ReactNode;
    icon: React.ElementType;
    trend?: { positive: boolean; value: string };
    color?: string;
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {trend && (
            <p className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'} mt-1`}>
              {trend.positive ? '↗️' : '↘️'} {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 bg-${color}-50 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5C4033] mb-2">Dashboard</h1>
          <p className="text-[#5C4033]">Faizah Nawawi's Website Management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={ShoppingBag}
            color="green"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            color="purple"
          />
          <StatCard
            title="Active Customers"
            value={totalUsers}
            icon={Users}
            color="pink"
          />
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">Low Stock Alert</span>
            </div>
            <p className="text-orange-700 text-sm mt-1">{lowStockProducts} products need restocking</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">Pending Orders</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">{pendingOrders} orders awaiting processing</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Upcoming Appointments</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">{totalBookings} bookings this week</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Orders & Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Orders & Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(Number(value)) : value,
                  name === 'orders' ? 'Orders' : 'Revenue'
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="Orders" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">No products found</p>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {data.orders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {data.orders.length === 0 && (
                <p className="text-gray-500 text-center py-4">No orders found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;