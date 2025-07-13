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

const InventoryReport = ({ data }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get current page items for pagination
  const paginatedItems = data.lowStockItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Products"
            value={data.totalProducts}
            icon={<InventoryIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Low Stock"
            value={data.lowStock}
            icon={<WarningIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Out of Stock"
            value={data.outOfStock}
            icon={<CancelIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total Value"
            value={`$${data.totalValue.toLocaleString()}`}
            icon={<TrendingUpIcon />}
            color="success"
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ px: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Low Stock Alert
          </Typography>
          <TableContainer>
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
                {paginatedItems.map((item, index) => (
                  <TableRow key={index} sx={{ 
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
                        color="warning"
                        variant="outlined"
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={data.lowStockItems.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 2,
                paddingRight: 2,
                minHeight: 50,
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
        </CardContent>
      </Card>
    </Box>
  )
}

export default InventoryReport
