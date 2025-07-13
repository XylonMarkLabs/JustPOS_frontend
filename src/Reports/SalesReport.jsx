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
  TablePagination
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  ShowChart as ChartIcon
} from '@mui/icons-material'
import MetricCard from '../Components/MetricCard'

const SalesReport = ({ data }) => {
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

  // Get current page products for pagination
  const paginatedProducts = data.topProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Total Sales"
            value={`$${data.totalSales.toLocaleString()}`}
            icon={<MoneyIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Total Orders"
            value={data.totalOrders}
            icon={<ReceiptIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Avg Order Value"
            value={`$${data.avgOrderValue}`}
            icon={<ChartIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ px: 3, pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Top Selling Products
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Product
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Units Sold
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Revenue
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product, index) => (
                  <TableRow key={index} sx={{
                    '&:hover': { backgroundColor: '#f9fafb' },
                    height: 40
                  }}>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {product.unitsSold}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        ${product.revenue.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={data.topProducts.length}
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
        </CardContent>
      </Card>
    </Box>
  )
}

export default SalesReport
