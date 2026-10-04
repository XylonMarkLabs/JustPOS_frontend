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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
  LocalOffer as PriceIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

const ProductDetailsModal = ({ open, onClose, product }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!product) return null;

  const isInventory = product.productType === 'INVENTORY';

  const money = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const getStockColor = (quantityInStock, minStock = 0) => {
    if (quantityInStock <= 0) return "error";
    if (quantityInStock <= minStock) return "warning";
    if (quantityInStock <= minStock * 1.5) return "info";
    return "success";
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
              {product.productName}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#64748b', mt: 0.5, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
              Product Code: {product.productCode}
            </Typography>
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Chip
                label={isInventory ? "Inventory" : "Made to Order"}
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: isInventory ? '#f9fafb' : '#f0f9ff',
                  borderColor: isInventory ? '#e5e7eb' : '#dbeafe',
                  color: isInventory ? '#6b7280' : '#2563eb',
                }}
              />
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
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flexShrink: 0 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Chip
                label={isInventory ? "Inventory" : "Made to Order"}
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: isInventory ? '#f9fafb' : '#f0f9ff',
                  borderColor: isInventory ? '#e5e7eb' : '#dbeafe',
                  color: isInventory ? '#6b7280' : '#2563eb',
                }}
              />
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
            </Box>
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
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

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
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
                  width: { xs: '160px', sm: '200px', md: '240px', lg: '280px' },
                  height: { xs: '160px', sm: '200px', md: '240px', lg: '280px' },
                  maxWidth: '100%',
                  borderRadius: 2,
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Category Information */}
              <Grid item xs={12}>
                <InfoSection 
                  icon={<CategoryIcon sx={{ color: '#475569' }} />}
                  title="Category Information"
                >
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    {product.category}
                  </Typography>
                </InfoSection>
              </Grid>

              {isInventory ? (
                <Grid item xs={12}>
                  <InfoSection
                    icon={<PriceIcon sx={{ color: '#475569' }} />}
                    title="Price Information"
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Priced per batch — see Stock Management for the current selling price of each received batch.
                    </Typography>
                  </InfoSection>
                </Grid>
              ) : (
                /* NON_INVENTORY: a real, single price lives on the product itself. */
                <Grid item xs={12}>
                  <InfoSection
                    icon={<PriceIcon sx={{ color: '#475569' }} />}
                    title="Price Information"
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Selling Price
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#047857', mt: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          Rs.{money(product.sellingPrice)}
                        </Typography>
                      </Grid>
                      {product.costPrice > 0 && (
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Estimated Cost
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#475569', mt: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            Rs.{money(product.costPrice)}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </InfoSection>
                </Grid>
              )}

              {isInventory ? (
                <Grid item xs={12}>
                  <InfoSection
                    icon={<InventoryIcon sx={{ color: '#475569' }} />}
                    title="Stock Information"
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Current Stock
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={product.quantityInStock}
                            color={getStockColor(product.quantityInStock, product.minStock)}
                            sx={{
                              fontSize: { xs: '0.85rem', sm: '1rem' },
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
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Minimum Stock Level
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#475569', mt: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {product.minStock}
                        </Typography>
                      </Grid>
                    </Grid>
                  </InfoSection>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <InfoSection
                    icon={<InventoryIcon sx={{ color: '#475569' }} />}
                    title="Stock Information"
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Made to order — prepared when a customer orders it, so no stock is tracked for this product.
                    </Typography>
                  </InfoSection>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;