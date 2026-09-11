import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Chip,
  TablePagination
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import MetricCard from '../Components/MetricCard'
import { isAdmin } from '../Services/authRole'

const InventoryReport = ({ data }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const showFinancials = isAdmin()

  const money = (value) => {
    const num = Number(value)
    return isNaN(num) ? '0.00' : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get status color for inventory items
  const getStatusColor = (status) => {
    switch (status) {
      case 'Low Stock': return 'warning'
      case 'Out of Stock': return 'error'
      case 'Critical': return 'error'
      case 'In Stock': return 'success'
      default: return 'warning'
    }
  }

  const lowStockItems = data.lowStockItems || []

  // Get current page items for pagination
  const paginatedItems = lowStockItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={showFinancials ? 3 : 4}>
          <MetricCard
            title="Total Products"
            value={data.totalProducts}
            icon={<InventoryIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={showFinancials ? 3 : 4}>
          <MetricCard
            title="Low Stock"
            value={data.lowStock}
            icon={<WarningIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} md={showFinancials ? 3 : 4}>
          <MetricCard
            title="Out of Stock"
            value={data.outOfStock}
            icon={<CancelIcon />}
            color="error"
          />
        </Grid>
        {showFinancials && (
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Total Value"
              value={`Rs.${money(data.totalValue)}`}
              icon={<TrendingUpIcon />}
              color="success"
            />
          </Grid>
        )}
      </Grid>

      <Card>
        <CardContent sx={{ px: 3, pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Low Stock Alert
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <TableContainer component={Box} sx={{ flex: 1, overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Product
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Current Stock
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Minimum Stock
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No low or out-of-stock items right now.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedItems.map((item) => (
                      <TableRow key={item.productCode} sx={{
                        '&:hover': { backgroundColor: '#f9fafb' },
                        height: 40
                      }}>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.currentStock}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.minimumStock}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={item.status}
                            color={getStatusColor(item.status)}
                            variant="outlined"
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: getStatusColor(item.status) === 'success' ? '#bbf7d0' :
                                getStatusColor(item.status) === 'warning' ? '#fed7aa' :
                                  getStatusColor(item.status) === 'error' ? '#fca5a5' : '#d1d5db',
                              borderColor: getStatusColor(item.status) === 'success' ? '#86efac' :
                                getStatusColor(item.status) === 'warning' ? '#fb923c' :
                                  getStatusColor(item.status) === 'error' ? '#f87171' : '#9ca3af',
                              color: getStatusColor(item.status) === 'success' ? '#047857' :
                                getStatusColor(item.status) === 'warning' ? '#9a3412' :
                                  getStatusColor(item.status) === 'error' ? '#991b1b' : '#374151'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box>
              <TablePagination
                component="div"
                count={lowStockItems.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{
                  '& .MuiTablePagination-toolbar': {
                    paddingLeft: 0,
                    paddingRight: 0,
                    minHeight: 50,
                    margin: 0,
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
        </CardContent>
      </Card>
    </Box>
  )
}

export default InventoryReport