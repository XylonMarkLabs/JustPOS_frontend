import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme
} from '@mui/material';
import MetricCard from '../Components/MetricCard';
import {
  Group as UsersIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  Paid as RevenueIcon
} from '@mui/icons-material';
import ApiCall from '../Services/ApiCall';

const AdminDashboard = () => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Fetch dashboard metrics
    const fetchMetrics = async () => {
      try {
        // You'll need to implement these API endpoints
        const [users, orders, products] = await Promise.all([
          ApiCall.user.getUsers(),
          ApiCall.order.getorders(),
          ApiCall.product.getAll()
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        setMetrics({
          totalUsers: users.length,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      }
    };

    fetchMetrics();
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

          {/* Metrics Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Total Users"
                value={metrics.totalUsers}
                icon={<UsersIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Total Orders"
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
                value={`$${metrics.totalRevenue.toLocaleString()}`}
                icon={<RevenueIcon />}
                color="error"
              />
            </Grid>
          </Grid>

          {/* Charts and Tables Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  minHeight: 400,
                  backgroundColor: 'background.paper',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Recent Orders
                </Typography>
                {/* Add orders table or chart here */}
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  minHeight: 400,
                  backgroundColor: 'background.paper',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  User Activity
                </Typography>
                {/* Add user activity stats or chart here */}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </section>
    </div>
  );
};

export default AdminDashboard;
