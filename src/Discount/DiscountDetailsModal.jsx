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
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: { xs: 2, sm: 3 },
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', fontSize: { xs: '1.1rem', sm: '1.5rem' }, wordBreak: 'break-word' }}>
                {discount.discountId}
              </Typography>
              <Chip
                label={discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                variant="outlined"
                size="small"
                sx={{ height: 24, fontSize: '0.75rem', ...statusStyles }}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#64748b', mt: 0.5, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              {discount.productName || discount.productId} &bull; {formatDate(discount.createdAt)}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              color: '#64748b',
              flexShrink: 0,
              '&:hover': { color: '#475569' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Discount Details */}
          <Grid item xs={12} md={6}>
            <InfoSection
              icon={<DiscountIcon sx={{ color: '#475569' }} />}
              title="Discount Details"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {discount.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Value
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {discount.discountType === 'percentage'
                      ? `${discount.discountValue}%`
                      : `Rs.${formatCurrency(discount.discountValue)}`}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Quantity Covered
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {discount.quantity}
                  </Typography>
                </Box>
                {originalPrice != null && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Price
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
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
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Start Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {formatDate(discount.startDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    End Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {formatDate(discount.endDate)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Status
                  </Typography>
                  <Typography variant="h6" sx={{ color: statusStyles.color, mt: 0.5, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
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
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                    Stock Item ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, wordBreak: 'break-word' }}>
                    {discount.stockItemId || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                    Product Code
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, wordBreak: 'break-word' }}>
                    {discount.productId || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                    Qty Remaining in Batch
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                    {discount.stockItem?.quantityRemaining ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                    Batch Selling Price
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
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