import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import {
  Visibility as ViewIcon
} from '@mui/icons-material';

const RecentOrders = ({ orders }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Sort orders by date, most recent first
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  }).slice(0, 10); // Only show the 10 most recent orders

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        minHeight: 350,
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Recent Orders (Last 10)
      </Typography>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto' }}>
          <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f3f4f6' } }}>
            <TableHead>
              <TableRow >
                <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                  ORDER ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                  CUSTOMER
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                  ITEMS
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                  TOTAL
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                  PAYMENT
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                  DATE
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order._id || 'unknown'} sx={{ 
                    '&:hover': { backgroundColor: '#f9fafb' },
                  
                  }}>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {order.orderId || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {order.username || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {Array.isArray(order.items) ? 
                          `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'}` : 
                          '0 items'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Rs. {order.totalAmount != null ? order.totalAmount.toFixed(2) : '0.00'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {order.paymentMethod || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {order.date ? new Date(order.date).toISOString().slice(0, 10) : 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box component={Paper} sx={{ 
          borderTop: '1px solid #e5e7eb', 
          borderRadius: 0,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4
        }}>
          <TablePagination
            component="div"
            count={sortedOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 2,
                paddingRight: 2,
                minHeight: 56,
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: '0.875rem',
                color: '#6b7280',
              },
              '& .MuiTablePagination-select': {
                fontSize: '0.875rem',
              },
              '& .MuiTablePagination-actions': {
                color: '#6b7280',
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default RecentOrders;