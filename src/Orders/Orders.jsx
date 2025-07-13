import React, { useState } from 'react'
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

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Sample order data
  const [orders] = useState([
    {
      id: 1,
      orderId: '#1',
      customer: 'John Smith',
      items: '2 items',
      itemDetails: [
        { name: 'Coffee - Americano', quantity: 1, price: 3.50 },
        { name: 'Muffin - Blueberry', quantity: 1, price: 2.99 }
      ],
      total: '$15.99',
      payment: 'Card',
      status: 'Completed',
      date: '1/15/2024',
      time: '10:30 AM'
    },
    {
      id: 2,
      orderId: '#2',
      customer: 'Walk-in Customer',
      items: '2 items',
      itemDetails: [
        { name: 'Sandwich - Club', quantity: 1, price: 8.99 },
        { name: 'Water Bottle', quantity: 1, price: 1.99 }
      ],
      total: '$6.97',
      payment: 'Cash',
      status: 'Completed',
      date: '1/15/2024',
      time: '11:15 AM'
    },
    {
      id: 3,
      orderId: '#3',
      customer: 'Sarah Johnson',
      items: '3 items',
      itemDetails: [
        { name: 'Latte', quantity: 2, price: 4.25 },
        { name: 'Croissant', quantity: 1, price: 2.49 }
      ],
      total: '$10.99',
      payment: 'Card',
      status: 'Pending',
      date: '1/15/2024',
      time: '12:00 PM'
    },
    {
      id: 4,
      orderId: '#4',
      customer: 'Mike Wilson',
      items: '1 item',
      itemDetails: [
        { name: 'Caesar Salad', quantity: 1, price: 7.99 }
      ],
      total: '$7.99',
      payment: 'Cash',
      status: 'Preparing',
      date: '1/15/2024',
      time: '12:30 PM'
    },
    {
      id: 5,
      orderId: '#5',
      customer: 'Emily Davis',
      items: '4 items',
      itemDetails: [
        { name: 'Green Tea', quantity: 1, price: 2.75 },
        { name: 'Chocolate Cake', quantity: 1, price: 4.99 },
        { name: 'Pizza Slice', quantity: 2, price: 3.99 }
      ],
      total: '$15.72',
      payment: 'Card',
      status: 'Completed',
      date: '1/15/2024',
      time: '1:00 PM'
    },
    {
      id: 6,
      orderId: '#6',
      customer: 'David Brown',
      items: '2 items',
      itemDetails: [
        { name: 'Smoothie', quantity: 1, price: 5.50 },
        { name: 'Bagel', quantity: 1, price: 1.99 }
      ],
      total: '$7.49',
      payment: 'Cash',
      status: 'Cancelled',
      date: '1/15/2024',
      time: '1:30 PM'
    }
  ])

  // Handle viewing order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        STATUS
                      </TableCell>
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
                      <TableRow key={order.id} sx={{ 
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
                            {order.customer}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {order.items}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {order.total}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {order.payment}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            variant="outlined"
                            size="small"
                            sx={{ height: 24, fontSize: '0.75rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {order.date}
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
