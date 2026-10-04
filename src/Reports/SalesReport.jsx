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
  ShowChart as ChartIcon,
  TrendingUp as ProfitIcon,
  LocalOffer as DiscountIcon
} from '@mui/icons-material'
import MetricCard from '../Components/MetricCard'
import { isAdmin } from '../Services/authRole'

const SalesReport = ({ data }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const showFinancials = isAdmin()

  const money = (value) => {
    const num = Number(value)
    return isNaN(num) ? '0.00' : num.toFixed(2)
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

  const topProducts = data.topProducts || []

  // Get current page products for pagination
  const paginatedProducts = topProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const metricColumnWidth = showFinancials ? 3 : 4

  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={metricColumnWidth}>
          <MetricCard
            title="Total Sales"
            value={`Rs.${money(data.totalSales)}`}
            icon={<MoneyIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={metricColumnWidth}>
          <MetricCard
            title="Total Orders"
            value={data.totalOrders}
            icon={<ReceiptIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={metricColumnWidth}>
          <MetricCard
            title="Avg Order Value"
            value={`Rs.${money(data.avgOrderValue)}`}
            icon={<ChartIcon />}
            color="warning"
          />
        </Grid>
        {showFinancials && (
          <Grid item xs={12} sm={6} md={metricColumnWidth}>
            <MetricCard
              title="Total Profit"
              value={`Rs.${money(data.totalProfit)}`}
              icon={<ProfitIcon />}
              color="success"
            />
          </Grid>
        )}
      </Grid>

      {data.totalDiscountGiven > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#6b7280' }}>
          <DiscountIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Rs.{money(data.totalDiscountGiven)} given in discounts over this period
          </Typography>
        </Box>
      )}

      <Card>
        <CardContent sx={{ px: { xs: 1.5, sm: 3 }, pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, px: { xs: 1, sm: 0 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Top Selling Products
          </Typography>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 420 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Product
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Units Sold
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Revenue
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No sales in this period.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.productCode} sx={{
                      '&:hover': { backgroundColor: '#f9fafb' },
                      height: 40
                    }}>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {product.unitsSold}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          Rs.{money(product.revenue)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={topProducts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage={
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Rows per page:
              </Box>
            }
            sx={{
              '& .MuiTablePagination-toolbar': {
                paddingLeft: { xs: 1, sm: 0 },
                paddingRight: { xs: 1, sm: 0 },
                minHeight: 50,
                margin: 0,
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                justifyContent: { xs: 'center', sm: 'flex-end' },
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: '#6b7280',
              },
              '& .MuiTablePagination-select': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
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