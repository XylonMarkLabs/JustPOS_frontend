import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import MetricCard from '../Components/MetricCard';
import {
  Group as UsersIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  Paid as RevenueIcon,
  TrendingUp as GrowthIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import ApiCall from '../Services/ApiCall';
import RecentOrders from './RecentOrders';

const AdminDashboard = () => {
  const theme = useTheme();
  const [recentOrders, setRecentOrders] = useState([]);
  const [userActivity, setUserActivity] = useState([]);

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    activeUsers: 0,
    dailyOrders: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [users, orders, products] = await Promise.all([
          ApiCall.user.getUsers(),
          ApiCall.order.getorders(),
          ApiCall.product.getAll()
        ]);

        // Set recent orders (last 10 orders)
        const sortedOrders = [...orders].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentOrders(sortedOrders);

        // Calculate user activity data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const userActivityData = last7Days.map(date => {
          const targetDate = new Date(date);
          const dayOrders = orders.filter(order => {
            try {
              if (!order.createdAt) return false;
              const orderDate = new Date(order.createdAt);
              // Check if the date is valid
              if (isNaN(orderDate.getTime())) return false;
              
              const orderDateStr = orderDate.toISOString().split('T')[0];
              return orderDateStr === date;
            } catch (err) {
              console.warn('Invalid date found in order:', order);
              return false;
            }
          });
          
          const activeUsers = new Set(
            dayOrders
              .filter(order => order.userId)
              .map(order => order.userId)
          ).size;
          const transactions = dayOrders.length;
          const revenue = dayOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

          return {
            date: targetDate.toLocaleDateString('en-US', { weekday: 'short' }),
            activeUsers,
            transactions,
            revenue
          };
        });

        setUserActivity(userActivityData);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

        // Calculate total revenue and daily orders
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const dailyOrders = orders.filter(order => 
          new Date(order.createdAt).getTime() >= today.getTime()
        ).length;

        // Calculate active users (users who placed orders in last 30 days)
        const recentOrderUserIds = new Set(
          orders
            .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
            .map(order => order.userId)
        );
        const activeUsers = recentOrderUserIds.size;

        // Calculate monthly growth (compare with previous month)
        const lastMonthRevenue = orders
          .filter(order => 
            new Date(order.createdAt) >= thirtyDaysAgo && 
            new Date(order.createdAt) < today
          )
          .reduce((sum, order) => sum + order.total, 0);

        const monthlyGrowth = lastMonthRevenue > 0 
          ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
          : 0;

        setMetrics({
          totalUsers: users.length,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue,
          activeUsers,
          dailyOrders,
          monthlyGrowth: parseFloat(monthlyGrowth.toFixed(2))
        });
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        setError('Failed to fetch dashboard metrics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lg:flex gap-5 p-5">
      <Sidebar />
      
      <section className="space-y-5 border-primary lg:w-[85%] p-3 bg-background rounded-lg shadow-slate-400 shadow-lg h-[calc(90vh-2.5rem)] flex flex-col overflow-auto">
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
              Admin Dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            /* Metrics Grid */
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="Total Users"
                  subtitle={`${metrics.activeUsers} active users`}
                  value={metrics.totalUsers}
                  icon={<UsersIcon />}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="Total Orders"
                  subtitle={`${metrics.dailyOrders} orders today`}
                  value={metrics.totalOrders}
                  icon={<OrdersIcon />}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="Total Products"
                  value={metrics.totalProducts}
                  icon={<ProductsIcon />}
                  color="warning"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="Total Revenue"
                  subtitle={`${metrics.monthlyGrowth}% monthly growth`}
                  value={`$${metrics.totalRevenue.toLocaleString()}`}
                  icon={<RevenueIcon />}
                  color="error"
                />
              </Grid>
            </Grid>
          )}

          {/* Charts and Tables Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <RecentOrders orders={recentOrders} />
            </Grid>
            <Grid item xs={12} lg={4}>
            </Grid>
          </Grid>
        </Box>
      </section>
    </div>
  );
};

export default AdminDashboard;
