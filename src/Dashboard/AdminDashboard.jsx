import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
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
import AdminPageShell from '../Components/AdminPageShell';

const STATUS_STYLES = {
  'Out of Stock': { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' },
  Critical: { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' },
  'Low Stock': { backgroundColor: '#fffbeb', borderColor: '#fef3c7', color: '#d97706' },
};

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const money = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatTime = (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTrendLabel = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const data = await ApiCall.dashboard.getOverview();
        setOverview(data);
      } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        setOverview(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading || !overview) {
    return (
      <AdminPageShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#b0a892' }} />
        </Box>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
            Business-wide overview — {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Today's Revenue"
              value={`Rs.${money(overview.todayRevenue)}`}
              icon={<RevenueIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Today's Orders"
              value={overview.todayOrders}
              icon={<OrdersIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Total Products"
              value={overview.totalProducts}
              icon={<ProductsIcon />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Total Users"
              value={overview.totalUsers}
              icon={<UsersIcon />}
              color="error"
            />
          </Grid>
        </Grid>

        {/* Recent Orders + Low Stock Alerts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, height: '100%', minHeight: 400, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recent Orders
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>Order #</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>Cashier</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }} align="center">Items</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>Payment</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }} align="right">Total</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }} align="right">Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overview.recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                            No orders yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      overview.recentOrders.map((order) => (
                        <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>#{order.orderId}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">{order.username}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="text.secondary">{order.itemCount}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                              {order.paymentMethod}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Rs.{money(order.totalAmount)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">{formatTime(order.date)}</Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, height: '100%', minHeight: 400, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Low Stock Alerts
                </Typography>
                {(overview.lowStock + overview.outOfStock) > 0 && (
                  <Chip
                    label={`${overview.lowStock + overview.outOfStock} item${overview.lowStock + overview.outOfStock === 1 ? '' : 's'}`}
                    size="small"
                    sx={{ backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 'medium' }}
                  />
                )}
              </Box>
              {overview.lowStockItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  All stock levels look healthy.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {overview.lowStockItems.map((item) => (
                    <Box
                      key={item.productCode}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: '#f9fafb',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.currentStock} / {item.minimumStock} min
                        </Typography>
                      </Box>
                      <Chip
                        label={item.status}
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.7rem', ...(STATUS_STYLES[item.status] || {}) }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Top Products + Sales Trend */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3, height: '100%', minHeight: 320, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Top Products (7 days)
              </Typography>
              {overview.topProducts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No sales in the last 7 days.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {overview.topProducts.map((product, index) => (
                    <Box key={product.productCode} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="body2" sx={{ color: '#9ca3af', width: 16 }}>{index + 1}</Typography>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{product.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{product.unitsSold} units sold</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Rs.{money(product.revenue)}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 3, height: '100%', minHeight: 320, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Sales Trend (7 days)
              </Typography>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={overview.salesTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatTrendLabel}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(v) => `Rs.${v}`}
                  />
                  <Tooltip
                    formatter={(value) => [`Rs.${money(value)}`, 'Revenue']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#b0a892"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#b0a892' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminPageShell>
  );
};

export default AdminDashboard;