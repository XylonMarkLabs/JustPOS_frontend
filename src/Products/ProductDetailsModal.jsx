import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
  LocalOffer as PriceIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

const ProductDetailsModal = ({ open, onClose, product }) => {
  if (!product) return null;

  const getStockColor = (quantityInStock, minStock = 0) => {
    if (quantityInStock <= 0) return "error";
    if (quantityInStock <= minStock) return "warning";
    if (quantityInStock <= minStock * 1.5) return "info";
    return "success";
  };

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
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 3,
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {product.productName}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#64748b', mt: 0.5 }}>
              Product Code: {product.productCode}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={product.status === 1 ? "Active" : "Inactive"}
              color={product.status === 1 ? "success" : "error"}
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: product.status === 1 ? '#f0fdf4' : '#fef2f2',
                borderColor: product.status === 1 ? '#dcfce7' : '#fecaca',
                color: product.status === 1 ? '#059669' : '#dc2626',
              }}
            />
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: '#64748b',
                '&:hover': { color: '#475569' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Product Image */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                p: 2,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            >
              <Box
                component="img"
                src={product.imageURL}
                alt={product.productName}
                sx={{
                  width: '280px',
                  height: '280px',
                  borderRadius: 2,
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Category Information */}
              <Grid item xs={12}>
                <InfoSection 
                  icon={<CategoryIcon sx={{ color: '#475569' }} />}
                  title="Category Information"
                >
                  <Typography variant="body1">
                    {product.category}
                  </Typography>
                </InfoSection>
              </Grid>

              {/* Price Information */}
              <Grid item xs={12}>
                <InfoSection 
                  icon={<PriceIcon sx={{ color: '#475569' }} />}
                  title="Price Information"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Selling Price
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#047857', mt: 0.5 }}>
                        Rs.{product.sellingPrice.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Discount
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#0369a1', mt: 0.5 }}>
                        {product.discount}%
                      </Typography>
                    </Grid>
                  </Grid>
                </InfoSection>
              </Grid>

              {/* Stock Information */}
              <Grid item xs={12}>
                <InfoSection 
                  icon={<InventoryIcon sx={{ color: '#475569' }} />}
                  title="Stock Information"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Current Stock
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={product.quantityInStock}
                          color={getStockColor(product.quantityInStock, product.minStock)}
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                          }}
                        />
                        {product.quantityInStock <= product.minStock && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              mt: 0.5,
                              color: product.quantityInStock <= 0 ? '#dc2626' : '#d97706'
                            }}
                          >
                            {product.quantityInStock <= 0 ? 'Out of Stock!' : 'Low Stock Warning!'}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Minimum Stock Level
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#475569', mt: 0.5 }}>
                        {product.minStock}
                      </Typography>
                    </Grid>
                  </Grid>
                </InfoSection>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
