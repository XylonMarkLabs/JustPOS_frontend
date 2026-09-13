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
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocalOffer as DiscountIcon,
  Inventory2 as BatchIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';

const getStatusStyles = (status) => {
  switch (status) {
    case 'active':
      return { backgroundColor: '#f0fdf4', borderColor: '#dcfce7', color: '#059669' };
    case 'scheduled':
      return { backgroundColor: '#f0f9ff', borderColor: '#dbeafe', color: '#2563eb' };
    case 'inactive':
      return { backgroundColor: '#fffbeb', borderColor: '#fef3c7', color: '#d97706' };
    case 'expired':
      return { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' };
    default:
      return { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#6b7280' };
  }
};

const DiscountDetailsModal = ({ open, onClose, discount }) => {
  if (!discount) return null;

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

  const daysRemaining = () => {
    if (discount.status === 'expired') return 'Expired';
    if (discount.status === 'inactive') return 'Paused';
    const end = new Date(discount.endDate);
    if (isNaN(end.getTime())) return '-';
    const diffMs = end.getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Ends today';
    return `${days} day${days === 1 ? '' : 's'} left`;
  };

  const originalPrice = discount.sellingPrice ?? discount.stockItem?.sellingPrice;
  const discountedPrice =
    originalPrice != null
      ? discount.discountType === 'percentage'
        ? Number(originalPrice) - (Number(originalPrice) * Number(discount.discountValue)) / 100
        : Number(originalPrice) - Number(discount.discountValue)
      : null;

  const statusStyles = getStatusStyles(discount.status);

  const InfoSection = ({ icon, title, children }) => (
    <Paper elevation={0} sx={{ p: 2, height: '100%', backgroundColor: '#f8fafc' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, fontSize: '1rem' }}>
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
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {discount.discountId}
              </Typography>
              <Chip
                label={discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                variant="outlined"
                size="small"
                sx={{ height: 24, fontSize: '0.75rem', ...statusStyles }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#64748b', mt: 0.5 }}>
              {discount.productName || discount.productId} &bull; {formatDate(discount.createdAt)}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: '#64748b',
              '&:hover': { color: '#475569' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Discount Details */}
          <Grid item xs={12} md={6}>
            <InfoSection
              icon={<DiscountIcon sx={{ color: '#475569' }} />}
              title="Discount Details"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">
                    {discount.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Value
                  </Typography>
                  <Typography variant="body1">
                    {discount.discountType === 'percentage'
                      ? `${discount.discountValue}%`
                      : `Rs.${formatCurrency(discount.discountValue)}`}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Quantity Covered
                  </Typography>
                  <Typography variant="body1">
                    {discount.quantity}
                  </Typography>
                </Box>
                {originalPrice != null && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body1">
                      <Box
                        component="span"
                        sx={{ textDecoration: 'line-through', color: '#94a3b8', mr: 1 }}
                      >
                        Rs.{formatCurrency(originalPrice)}
                      </Box>
                      <Box component="span" sx={{ color: '#047857', fontWeight: 600 }}>
                        Rs.{formatCurrency(discountedPrice)}
                      </Box>
                    </Typography>
                  </Box>
                )}
              </Box>
            </InfoSection>
          </Grid>

          {/* Validity Period */}
          <Grid item xs={12} md={6}>
            <InfoSection
              icon={<DateRangeIcon sx={{ color: '#475569' }} />}
              title="Validity Period"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(discount.startDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(discount.endDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="h6" sx={{ color: statusStyles.color, mt: 0.5, fontSize: '1rem' }}>
                    {daysRemaining()}
                  </Typography>
                </Box>
              </Box>
            </InfoSection>
          </Grid>

          {/* Stock Batch */}
          <Grid item xs={12}>
            <InfoSection
              icon={<BatchIcon sx={{ color: '#475569' }} />}
              title="Stock Batch"
            >
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Stock Item ID
                  </Typography>
                  <Typography variant="body1">
                    {discount.stockItemId || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Product Code
                  </Typography>
                  <Typography variant="body1">
                    {discount.productId || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Qty Remaining in Batch
                  </Typography>
                  <Typography variant="body1">
                    {discount.stockItem?.quantityRemaining ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Batch Selling Price
                  </Typography>
                  <Typography variant="body1">
                    {originalPrice != null ? `Rs.${formatCurrency(originalPrice)}` : '-'}
                  </Typography>
                </Grid>
              </Grid>
            </InfoSection>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountDetailsModal;