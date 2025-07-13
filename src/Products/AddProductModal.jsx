import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid
} from '@mui/material'

const AddProductModal = ({ open, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Beverages',
    price: '',
    stock: '',
    barcode: '',
    description: ''
  })

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

    // Create new product object
    const newProduct = {
      id: Date.now(), // Simple ID generation
      name: formData.name,
      code: formData.barcode,
      category: formData.category,
      price: `$${parseFloat(formData.price).toFixed(2)}`,
      stock: parseInt(formData.stock),
      status: 'Active',
      image: getCategoryEmoji(formData.category),
      description: formData.description
    }

    onAddProduct(newProduct)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      category: 'Beverages',
      price: '',
      stock: '',
      barcode: '',
      description: ''
    })
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
          Add New Product
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

          {/* Price and Stock */}
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
                Stock
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
          </Grid>

          {/* Barcode */}
          <Box>
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
                    backgroundColor: '#fff',
                    borderColor: '#000000'
                  }
                }
              }}
            />
          </Box>

          {/* Description */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter product description (optional)"
              value={formData.description}
              onChange={handleChange('description')}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f9fafb',
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
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddProductModal
