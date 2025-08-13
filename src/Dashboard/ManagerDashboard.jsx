import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import MetricCard from '../Components/MetricCard';
import {
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  TrendingUp as SalesIcon,
  Warning as LowStockIcon
} from '@mui/icons-material';
import ApiCall from '../Services/ApiCall';

const ManagerDashboard = () => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    dailySales: 0,
    totalProducts: 0,
    lowStockItems: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    // Fetch dashboard metrics
    const fetchMetrics = async () => {
      try {
        // Get orders and products
        const [orders, products] = await Promise.all([
          ApiCall.order.getorders(),
          ApiCall.product.getAll()
        ]);

        // Calculate daily sales (orders from today)
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(order => 
          order.date.split('T')[0] === today
        );
        const dailySales = todayOrders.reduce((sum, order) => sum + order.total, 0);

        // Calculate low stock items
        const lowStock = products.filter(product => 
          product.stock <= product.minStock && product.status === 1
        );

        setMetrics({
          totalOrders: orders.length,
          dailySales: dailySales,
          totalProducts: products.length,
          lowStockItems: lowStock.length
        });

        // Set low stock products for the table
        setLowStockProducts(lowStock);
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
              Manager Dashboard
            </Typography>
          </Box>

          {/* Metrics Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Today's Orders"
                value={metrics.totalOrders}
                icon={<OrdersIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Daily Sales"
                value={`$${metrics.dailySales.toLocaleString()}`}
                icon={<SalesIcon />}
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
                title="Low Stock Items"
                value={metrics.lowStockItems}
                icon={<LowStockIcon />}
                color="error"
              />
            </Grid>
          </Grid>

          {/* Low Stock Products Table */}
          <Paper
            sx={{
              p: 3,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              flex: 1,
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
                    <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Current Stock</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Min. Stock</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.minStock}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: product.stock === 0 ? '#dc2626' : '#d97706',
                            fontWeight: 'medium'
                          }}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </section>
    </div>
  );
};

export default ManagerDashboard;
