import React, { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon
} from '@mui/icons-material'

const OrderDetailsModal = ({ open, onClose, order }) => {
  const printRef = useRef()

  if (!order) return null

  const money = (value) => {
    const num = Number(value)
    return isNaN(num) ? '0.00' : num.toFixed(2)
  }

  const subtotalBeforeDiscount = order.items.reduce(
    (sum, item) => sum + (Number(item.originalPrice) || 0) * item.quantity,
    0
  )
  const totalDiscount = Number(order.discount) || 0
  const total = Number(order.totalAmount) || 0

  // Admin-only: cost of goods and profit for this order. Never shown on the
  // printable customer receipt further down.
  const totalCost = order.items.reduce(
    (sum, item) => sum + (Number(item.unitCost) || 0) * item.quantity,
    0
  )
  const profit = total - totalCost

  const formatDateTime = (value) => {
    const date = new Date(value)
    if (isNaN(date.getTime())) return '-'
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
  }

  const itemDiscountLabel = (item) => {
    if (!item.discountId) return null
    return item.discountType === 'percentage'
      ? `${item.discountValue}% off`
      : `Rs.${money(item.discountValue)} off`
  }

  const handlePrintReceipt = async () => {
    try {
      const element = printRef.current
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`Order-${order.orderId}-Receipt.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: '500px'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon sx={{ color: '#6b7280' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Order Details - #{order.orderId}
            </Typography>
          </Box>
          <Button
            onClick={onClose}
            sx={{ minWidth: 'auto', p: 1, color: '#6b7280' }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Order Header Information */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                  Cashier
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {order.username}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                  Order Date
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(order.date)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                  Payment Method
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {order.paymentMethod}
                </Typography>
              </Box>
              {order.paymentMethod === 'cash' && order.cashReceived != null && (
                <>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                      Cash Received
                    </Typography>
                    <Typography variant="body1">
                      Rs.{money(order.cashReceived)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                      Change Given
                    </Typography>
                    <Typography variant="body1">
                      Rs.{money(order.changeGiven)}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Order Items */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Order Items
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                    <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Item</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', py: 1.5 }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', py: 1.5 }}>Unit Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', py: 1.5 }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => {
                    const discountLabel = itemDiscountLabel(item)
                    return (
                      <TableRow key={item._id || index}>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {item.productCode}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <Typography variant="body2">
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            Rs.{money(item.unitPrice)}
                          </Typography>
                          {discountLabel && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <Typography
                                variant="caption"
                                sx={{ color: '#94a3b8', textDecoration: 'line-through' }}
                              >
                                Rs.{money(item.originalPrice)}
                              </Typography>
                              <Chip
                                label={discountLabel}
                                size="small"
                                variant="outlined"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  mt: 0.25,
                                  backgroundColor: '#f0fdf4',
                                  borderColor: '#dcfce7',
                                  color: '#059669',
                                }}
                              />
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            Rs.{money(item.subtotal)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Order Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ minWidth: '260px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal:
                </Typography>
                <Typography variant="body2">
                  Rs.{money(subtotalBeforeDiscount)}
                </Typography>
              </Box>
              {totalDiscount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Discount:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#059669' }}>
                    -Rs.{money(totalDiscount)}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Rs.{money(total)}
                </Typography>
              </Box>

              {/* Admin-only figures — cost basis and profit for this order.
                  Deliberately left out of the printable receipt below. */}
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #e5e7eb' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cost of Goods:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rs.{money(totalCost)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Profit:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'medium', color: profit >= 0 ? '#059669' : '#dc2626' }}
                  >
                    Rs.{money(profit)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 'medium',
              px: 3,
              py: 1
            }}
          >
            Close
          </Button>
          <Button
            onClick={handlePrintReceipt}
            variant="contained"
            startIcon={<PrintIcon />}
            sx={{
              backgroundColor: '#b0a892',
              '&:hover': { backgroundColor: '#9a9078' },
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              py: 1
            }}
          >
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden Printable Receipt — customer-facing, so no cost/profit data
          appears here regardless of what's shown in the admin dialog above. */}
      <Box
        ref={printRef}
        sx={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: 'white',
          padding: '20mm',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          lineHeight: 1.4,
          color: '#000000'
        }}
      >
        {/* Receipt Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#000' }}>
            JustPOS
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
            123 Business Street, City, State 12345
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 1 }}>
            Phone: (555) 123-4567 | Email: info@justpos.com
          </Typography>
          <Box sx={{ borderBottom: '2px solid #000', my: 2 }}></Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000' }}>
            ORDER RECEIPT
          </Typography>
        </Box>

        {/* Order Information */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold', color: '#000' }}>Order #:</Typography>
            <Typography sx={{ color: '#000' }}>{order.orderId}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold', color: '#000' }}>Cashier:</Typography>
            <Typography sx={{ color: '#000' }}>{order.username}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold', color: '#000' }}>Date:</Typography>
            <Typography sx={{ color: '#000' }}>{formatDateTime(order.date)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold', color: '#000' }}>Payment:</Typography>
            <Typography sx={{ color: '#000', textTransform: 'capitalize' }}>{order.paymentMethod}</Typography>
          </Box>
        </Box>

        <Box sx={{ borderBottom: '1px solid #ccc', my: 2 }}></Box>

        {/* Items Table */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#000' }}>
            Order Items
          </Typography>
          <Box sx={{ border: '1px solid #ccc' }}>
            {/* Table Header */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '3fr 1fr 1fr 1fr',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderBottom: '1px solid #ccc',
              fontWeight: 'bold',
              color: '#000'
            }}>
              <Typography sx={{ fontWeight: 'bold' }}>Item</Typography>
              <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>Qty</Typography>
              <Typography sx={{ fontWeight: 'bold', textAlign: 'right' }}>Price</Typography>
              <Typography sx={{ fontWeight: 'bold', textAlign: 'right' }}>Total</Typography>
            </Box>
            {/* Table Body */}
            {order.items.map((item, index) => {
              const discountLabel = itemDiscountLabel(item)
              return (
                <Box key={item._id || index} sx={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 1fr',
                  padding: '8px',
                  borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none',
                  color: '#000'
                }}>
                  <Box>
                    <Typography>{item.name}</Typography>
                    {discountLabel && (
                      <Typography sx={{ fontSize: '10px', color: '#666' }}>
                        {discountLabel} (was Rs.{money(item.originalPrice)})
                      </Typography>
                    )}
                  </Box>
                  <Typography sx={{ textAlign: 'center' }}>{item.quantity}</Typography>
                  <Typography sx={{ textAlign: 'right' }}>Rs.{money(item.unitPrice)}</Typography>
                  <Typography sx={{ textAlign: 'right' }}>Rs.{money(item.subtotal)}</Typography>
                </Box>
              )
            })}
          </Box>
        </Box>

        <Box sx={{ borderBottom: '1px solid #ccc', my: 2 }}></Box>

        {/* Order Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Box sx={{ minWidth: '200px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#000' }}>Subtotal:</Typography>
              <Typography sx={{ color: '#000' }}>Rs.{money(subtotalBeforeDiscount)}</Typography>
            </Box>
            {totalDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#000' }}>Discount:</Typography>
                <Typography sx={{ color: '#000' }}>-Rs.{money(totalDiscount)}</Typography>
              </Box>
            )}
            <Box sx={{ borderTop: '1px solid #000', pt: 1, mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#000' }}>
                  Total:
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#000' }}>
                  Rs.{money(total)}
                </Typography>
              </Box>
            </Box>
            {order.paymentMethod === 'cash' && order.cashReceived != null && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography sx={{ color: '#000' }}>Cash Received:</Typography>
                  <Typography sx={{ color: '#000' }}>Rs.{money(order.cashReceived)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#000' }}>Change:</Typography>
                  <Typography sx={{ color: '#000' }}>Rs.{money(order.changeGiven)}</Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4, pt: 2, borderTop: '1px solid #ccc' }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            Thank you for your business!
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Please keep this receipt for your records.
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default OrderDetailsModal