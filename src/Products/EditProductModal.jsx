import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid
} from '@mui/material'

const EditProductModal = ({ open, onClose, onEditProduct, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Beverages',
    price: '',
    stock: '',
    minStock: '',
    barcode: '',
    description: '',
    status: 'Active'
  })

  // Populate form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Beverages',
        price: product.price ? product.price.replace('$', '') : '',
        stock: product.stock || '',
        minStock: product.minStock || '',
        barcode: product.code || '',
        description: product.description || '',
        status: product.status || 'Active'
      })
    }
  }, [product])

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    })
  }

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.price || !formData.stock || !formData.barcode) {
      alert('Please fill in all required fields')
      return
    }

    // Validate minimum stock
    if (formData.minStock && parseInt(formData.minStock) > parseInt(formData.stock)) {
      alert('Minimum stock level cannot be greater than current stock')
      return
    }

    // Create updated product object
    const updatedProduct = {
      ...product,
      name: formData.name,
      code: formData.barcode,
      category: formData.category,
      price: `$${parseFloat(formData.price).toFixed(2)}`,
      stock: parseInt(formData.stock),
      minStock: formData.minStock ? parseInt(formData.minStock) : 0,
      status: formData.status,
      image: getCategoryEmoji(formData.category),
      description: formData.description
    }

    onEditProduct(updatedProduct)
    handleClose()
  }

  const handleClose = () => {
    onClose()
  }

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Beverages': '☕',
      'Food': '🍕',
      'Bakery': '🧁'
    }
    return emojiMap[category] || '📦'
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '450px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          Edit Product
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Product Name */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
              Product Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange('name')}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f9fafb',
                  height: '40px',
                  '&:hover': {
                    backgroundColor: '#f3f4f6'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff'
                  }
                }
              }}
            />
          </Box>

          {/* Category */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
              Category
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={formData.category}
                onChange={handleChange('category')}
                variant="outlined"
                sx={{
                  backgroundColor: '#f9fafb',
                  height: '40px',
                  '&:hover': {
                    backgroundColor: '#f3f4f6'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff'
                  }
                }}
              >
                <MenuItem value="Beverages">Beverages</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Bakery">Bakery</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Price and Barcode */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                Price
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={handleChange('price')}
                variant="outlined"
                size="small"
                inputProps={{ 
                  min: 0, 
                  step: 0.01,
                  style: { fontSize: '0.875rem' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                Barcode
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter barcode"
                value={formData.barcode}
                onChange={handleChange('barcode')}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>

          {/* Current Stock, Min Stock Level, and Status */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                Current Stock
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange('stock')}
                variant="outlined"
                size="small"
                inputProps={{ 
                  min: 0,
                  style: { fontSize: '0.875rem' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                Min Stock Level
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="0"
                value={formData.minStock}
                onChange={handleChange('minStock')}
                variant="outlined"
                size="small"
                inputProps={{ 
                  min: 0,
                  style: { fontSize: '0.875rem' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff'
                    }
                  }
                }}
                helperText="Alert threshold"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.status}
                  onChange={handleChange('status')}
                  variant="outlined"
                  sx={{
                    backgroundColor: '#f9fafb',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff'
                    }
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: '#6b7280',
            borderColor: '#d1d5db',
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb'
            },
            textTransform: 'none',
            fontWeight: 'medium',
            px: 3,
            py: 1
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#b0a892',
            '&:hover': { backgroundColor: '#e0dac5' },
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            py: 1
          }}
        >
          Update Product
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditProductModal
