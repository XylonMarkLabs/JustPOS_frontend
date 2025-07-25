import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import OrderDetailsModal from './OrderDetailsModal'
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  TablePagination
} from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import ApiCall from '../Services/ApiCall'

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getOrders();
  }, [])
  

  const getOrders = async () => {
    await ApiCall.order.getorders()
      .then((orders) => {
        setOrders(orders);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }

  // Handle viewing order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const orderIdStr = String(order.orderId);

    const matchesSearch = 
      orderIdStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
});


  // Get current page orders
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Reset pagination when filters change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setPage(0)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    setPage(0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'Pending': return 'warning'
      case 'Preparing': return 'info'
      case 'Cancelled': return 'error'
      default: return 'default'
    }
  }

  return (
    <div className="lg:flex gap-5  p-5 ">
        <Sidebar/>

        <section className="space-y-5 border-primary lg:w-[85%] p-3 bg-background rounded-lg shadow-slate-400 shadow-lg h-[calc(90vh-2.5rem)] flex flex-col">
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                Order Management
              </Typography>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ flex: 1, minWidth: '300px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Preparing">Preparing</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Orders Table */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto' }}>
                <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f3f4f6' } }}>
                  <TableHead>
                    <TableRow sx={{ height: 48 }}>
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
                      {/* <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        STATUS
                      </TableCell> */}
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        DATE
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow key={order._id} sx={{ 
                        '&:hover': { backgroundColor: '#f9fafb' },
                        height: 60
                      }}>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {order.orderId}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {order.username}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {order.totalAmount}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {order.payment}
                          </Typography>
                        </TableCell>
                        {/* <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            variant="outlined"
                            size="small"
                            sx={{ 
                              height: 24, 
                              fontSize: '0.75rem',
                              backgroundColor: getStatusColor(order.status) === 'success' ? '#f0f9ff' :
                                             getStatusColor(order.status) === 'warning' ? '#fffbeb' :
                                             getStatusColor(order.status) === 'info' ? '#f0f9ff' :
                                             getStatusColor(order.status) === 'error' ? '#fef2f2' : '#f9fafb',
                              borderColor: getStatusColor(order.status) === 'success' ? '#dcfce7' :
                                          getStatusColor(order.status) === 'warning' ? '#fef3c7' :
                                          getStatusColor(order.status) === 'info' ? '#dbeafe' :
                                          getStatusColor(order.status) === 'error' ? '#fecaca' : '#e5e7eb',
                              color: getStatusColor(order.status) === 'success' ? '#059669' :
                                    getStatusColor(order.status) === 'warning' ? '#d97706' :
                                    getStatusColor(order.status) === 'info' ? '#2563eb' :
                                    getStatusColor(order.status) === 'error' ? '#dc2626' : '#6b7280'
                            }}
                          />
                        </TableCell> */}
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.date).toISOString().slice(0, 10)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <IconButton 
                            size="small" 
                            sx={{ color: '#2563eb', padding: '4px' }}
                            onClick={() => handleViewOrder(order)}
                            title="View Order Details"
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <Box component={Paper} sx={{ 
                borderTop: '1px solid #e5e7eb', 
                borderRadius: 0,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4
              }}>
                <TablePagination
                  component="div"
                  count={filteredOrders.length}
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
          </Box>
        </section>

        {/* Order Details Modal */}
        <OrderDetailsModal
          open={orderDetailsOpen}
          onClose={() => setOrderDetailsOpen(false)}
          order={selectedOrder}
        />
    </div>
  )
}

export default Orders
