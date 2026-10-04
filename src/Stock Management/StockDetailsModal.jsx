import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Grid,
  Divider,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  ReceiptLong as ReceiptIcon,
  LocalShipping as SupplierIcon,
  Inventory2 as ItemsIcon,
  StickyNote2 as NotesIcon,
} from '@mui/icons-material';

const StockDetailsModal = ({ open, onClose, stock }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!stock) return null;

  const items = stock.items || [];
  const totalQuantity = items.reduce(
    (sum, item) => sum + (Number(item.quantityReceived) || 0),
    0
  );

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString();
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const InfoSection = ({ icon, title, children }) => (
    <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, height: '100%', backgroundColor: '#f8fafc' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{
        m: 0,
        p: { xs: 2, sm: 3 },
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', fontSize: { xs: '1.1rem', sm: '1.5rem' }, wordBreak: 'break-word' }}>
              {stock.stockId}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#64748b', mt: 0.5, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              {stock.supplierName} &bull; {formatDate(stock.receivedDate)}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              color: '#64748b',
              flexShrink: 0,
              '&:hover': { color: '#475569' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Receipt Details */}
          <Grid item xs={12} md={4}>
            <InfoSection
              icon={<SupplierIcon sx={{ color: '#475569' }} />}
              title="Receipt Details"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Supplier
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' }, wordBreak: 'break-word' }}>
                    {stock.supplierName || '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Invoice No
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {stock.invoiceNo || '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Received Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {formatDate(stock.receivedDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Added By
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {stock.addedBy || '-'}
                  </Typography>
                </Box>
              </Box>
            </InfoSection>
          </Grid>

          {/* Items */}
          <Grid item xs={12} md={8}>
            <InfoSection
              icon={<ItemsIcon sx={{ color: '#475569' }} />}
              title={`Items (${items.length})`}
            >
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 480 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8125rem' } }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} align="right">
                        Qty Received
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} align="right">
                        Unit Cost
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} align="right">
                        Total Cost
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No items in this receipt.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow key={item.productId ?? index}>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{item.productName}</TableCell>
                          <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {item.quantityReceived}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Rs.{formatCurrency(item.unitCost)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Rs.{formatCurrency(item.totalCost)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Total Quantity
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#475569', mt: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {totalQuantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Total Price
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#047857', mt: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    Rs.{formatCurrency(stock.totalPrice)}
                  </Typography>
                </Grid>
              </Grid>
            </InfoSection>
          </Grid>

          {/* Notes */}
          {stock.notes && (
            <Grid item xs={12}>
              <InfoSection
                icon={<NotesIcon sx={{ color: '#475569' }} />}
                title="Notes"
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                  {stock.notes}
                </Typography>
              </InfoSection>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StockDetailsModal;