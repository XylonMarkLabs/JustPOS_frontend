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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'Pending': return 'warning'
      case 'Preparing': return 'info'
      case 'Cancelled': return 'error'
      default: return 'default'
    }
  }

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
  }

  const calculateTax = () => {
    return (calculateSubtotal() * 0.085).toFixed(2)
  }

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2)
  }

  const handlePrintReceipt = async () => {
    try {
      const element = printRef.current
      if (!element) return

      // Create canvas from the receipt element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Download the PDF
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
              Order Details - {order.orderId}
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
                  Customer
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
                  {new Date(order.date).toISOString().slice(0, 10)} at {new Date(order.date).toISOString().slice(11, 19)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                  Payment Method
                </Typography>
                <Typography variant="body1">
                  {order.payment}
                </Typography>
              </Box>
              {/* <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                  Status
                </Typography>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  variant="outlined"
                  size="small"
                  sx={{ height: 28, fontSize: '0.875rem' }}
                />
              </Box> */}
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
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <Typography variant="body2">
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        <Typography variant="body2">
                          ${item.price.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Order Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ minWidth: '250px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal:
                </Typography>
                <Typography variant="body2">
                  ${calculateSubtotal()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Tax (8.5%):
                </Typography>
                <Typography variant="body2">
                  ${calculateTax()}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${calculateTotal()}
                </Typography>
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

      {/* Hidden Printable Receipt */}
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
            <Typography sx={{ fontWeight: 'bold', color: '#000' }}>Customer:</Typography>
            <Typography sx={{ color: '#000' }}>{order.username}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold', color: '#000' }}>Date:</Typography>
            <Typography sx={{ color: '#000' }}>{new Date(order.date).toISOString().slice(0, 10)} at {new Date(order.date).toISOString().slice(11, 19)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold', color: '#000' }}>Payment:</Typography>
            <Typography sx={{ color: '#000' }}>{order.payment}</Typography>
          </Box>
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold', color: '#000' }}>Status:</Typography>
            <Typography sx={{ color: '#000' }}>{order.status}</Typography>
          </Box> */}
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
            {order.items.map((item, index) => (
              <Box key={index} sx={{ 
                display: 'grid', 
                gridTemplateColumns: '3fr 1fr 1fr 1fr',
                padding: '8px',
                borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none',
                color: '#000'
              }}>
                <Typography>{item.name}</Typography>
                <Typography sx={{ textAlign: 'center' }}>{item.quantity}</Typography>
                <Typography sx={{ textAlign: 'right' }}>${item.price.toFixed(2)}</Typography>
                <Typography sx={{ textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ borderBottom: '1px solid #ccc', my: 2 }}></Box>

        {/* Order Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Box sx={{ minWidth: '200px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#000' }}>Subtotal:</Typography>
              <Typography sx={{ color: '#000' }}>${calculateSubtotal()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#000' }}>Tax (8.5%):</Typography>
              <Typography sx={{ color: '#000' }}>${calculateTax()}</Typography>
            </Box>
            <Box sx={{ borderTop: '1px solid #000', pt: 1, mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#000' }}>
                  Total:
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#000' }}>
                  ${calculateTotal()}
                </Typography>
              </Box>
            </Box>
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
