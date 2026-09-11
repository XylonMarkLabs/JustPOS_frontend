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
} from '@mui/material';
import MetricCard from '../Components/MetricCard';
import {
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  TrendingUp as SalesIcon,
  Warning as LowStockIcon
} from '@mui/icons-material';
import ApiCall from '../Services/ApiCall';
import AdminPageShell from '../Components/AdminPageShell';

const STATUS_STYLES = {
  'Out of Stock': { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' },
  Critical: { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' },
  'Low Stock': { backgroundColor: '#fffbeb', borderColor: '#fef3c7', color: '#d97706' },
};

const ManagerDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  const money = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatTime = (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [overviewData, inventoryData] = await Promise.all([
          ApiCall.dashboard.getOverview(),
          ApiCall.report.getInventoryReport(),
        ]);
        setOverview(overviewData);
        setInventory(inventoryData);
      } catch (error) {
        console.error('Error fetching manager dashboard:', error);
        setOverview(null);
        setInventory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading || !overview || !inventory) {
    return (
      <AdminPageShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#b0a892' }} />
        </Box>
      </AdminPageShell>
    );
  }

  const lowStockCount = inventory.lowStock + inventory.outOfStock;

  return (
    <AdminPageShell>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
            Manager Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
              title="Daily Sales"
              value={`Rs.${money(overview.todayRevenue)}`}
              icon={<SalesIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Total Products"
              value={inventory.totalProducts}
              icon={<ProductsIcon />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              title="Low Stock Items"
              value={lowStockCount}
              icon={<LowStockIcon />}
              color="error"
            />
          </Grid>
        </Grid>

        {/* Low Stock Products + Recent Orders */}
        <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
          <Grid item xs={12} lg={7}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                height: '100%',
                minHeight: 400,
                overflow: 'auto'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Low Stock Products
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }} align="right">Current Stock</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }} align="right">Min. Stock</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventory.lowStockItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                            All stock levels look healthy.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventory.lowStockItems.map((product) => (
                        <TableRow key={product.productCode} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{product.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">{product.category}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">{product.currentStock}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">{product.minimumStock}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.status}
                              size="small"
                              variant="outlined"
                              sx={{ height: 22, fontSize: '0.7rem', ...(STATUS_STYLES[product.status] || {}) }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                height: '100%',
                minHeight: 400,
                overflow: 'auto'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recent Orders
              </Typography>
              {overview.recentOrders.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No orders yet today.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {overview.recentOrders.map((order) => (
                    <Box
                      key={order._id}
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
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          #{order.orderId} &bull; {order.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.itemCount} item{order.itemCount === 1 ? '' : 's'} &bull; {formatTime(order.date)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Rs.{money(order.totalAmount)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminPageShell>
  );
};

export default ManagerDashboard;