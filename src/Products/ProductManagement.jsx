import React, { useState } from 'react'
import Sidebar from '../Components/Sidebar'
import AddProductModal from './AddProductModal'
import EditProductModal from './EditProductModal'
import ConfirmationDialog from '../Components/ConfirmationDialog'
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  InputAdornment,
  TablePagination
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Visibility as ActivateIcon,
  DisabledVisible as DeactivateIcon
} from '@mui/icons-material'

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [productToToggle, setProductToToggle] = useState(null)

  // Sample product data - converted to state so we can add new products
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Coffee - Americano',
      code: '123456789123',
      category: 'Beverages',
      price: '$3.50',
      stock: 100,
      status: 'Active',
      image: '☕'
    },
    {
      id: 2,
      name: 'Sandwich - Club',
      code: '123456789124',
      category: 'Food',
      price: '$8.99',
      stock: 25,
      status: 'Active',
      image: '🥪'
    },
    {
      id: 3,
      name: 'Muffin - Blueberry',
      code: '123456789125',
      category: 'Bakery',
      price: '$2.99',
      stock: 15,
      status: 'Active',
      image: '🧁'
    },
    {
      id: 4,
      name: 'Water Bottle',
      code: '123456789126',
      category: 'Beverages',
      price: '$1.99',
      stock: 50,
      status: 'Active',
      image: '🍺'
    },
    {
      id: 5,
      name: 'Croissant',
      code: '123456789127',
      category: 'Bakery',
      price: '$2.49',
      stock: 8,
      status: 'Active',
      image: '🥐'
    },
    {
      id: 6,
      name: 'Latte',
      code: '123456789128',
      category: 'Beverages',
      price: '$4.25',
      stock: 100,
      status: 'Active',
      image: '☕'
    },
    {
      id: 7,
      name: 'Caesar Salad',
      code: '123456789129',
      category: 'Food',
      price: '$7.99',
      stock: 20,
      status: 'Active',
      image: '🥗'
    },
    {
      id: 8,
      name: 'Chocolate Cake',
      code: '123456789130',
      category: 'Bakery',
      price: '$4.99',
      stock: 12,
      status: 'Active',
      image: '🍰'
    },
    {
      id: 9,
      name: 'Green Tea',
      code: '123456789131',
      category: 'Beverages',
      price: '$2.75',
      stock: 75,
      status: 'Active',
      image: '🍵'
    },
    {
      id: 10,
      name: 'Pizza Slice',
      code: '123456789132',
      category: 'Food',
      price: '$3.99',
      stock: 30,
      status: 'Active',
      image: '🍕'
    },
    {
      id: 11,
      name: 'Bagel',
      code: '123456789133',
      category: 'Bakery',
      price: '$1.99',
      stock: 18,
      status: 'Active',
      image: '🥯'
    },
    {
      id: 12,
      name: 'Smoothie',
      code: '123456789134',
      category: 'Beverages',
      price: '$5.50',
      stock: 40,
      status: 'Active',
      image: '🥤'
    },
    {
      id: 13,
      name: 'Burger',
      code: '123456789135',
      category: 'Food',
      price: '$9.99',
      stock: 15,
      status: 'Inactive',
      image: '🍔'
    },
    {
      id: 14,
      name: 'Donut',
      code: '123456789136',
      category: 'Bakery',
      price: '$2.25',
      stock: 5,
      status: 'Active',
      image: '🍩'
    },
    {
      id: 15,
      name: 'Hot Chocolate',
      code: '123456789137',
      category: 'Beverages',
      price: '$3.75',
      stock: 60,
      status: 'Inactive',
      image: '☕'
    }
  ])

  // Handle adding new product
  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct])
  }

  // Handle editing product
  const handleEditProduct = (updatedProduct) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ))
  }

  // Handle opening edit modal
  const handleOpenEditModal = (product) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  // Handle delete product
  const handleDeleteProduct = (product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteProduct = () => {
    setProducts(products.filter(product => product.id !== productToDelete.id))
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  // Handle toggle product status
  const handleToggleStatus = (product) => {
    setProductToToggle(product)
    setStatusDialogOpen(true)
  }

  const confirmToggleStatus = () => {
    const newStatus = productToToggle.status === 'Active' ? 'Inactive' : 'Active'
    setProducts(products.map(product => 
      product.id === productToToggle.id 
        ? { ...product, status: newStatus }
        : product
    ))
    setStatusDialogOpen(false)
    setProductToToggle(null)
  }

  // Filter products based on search term, category, and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.includes(searchTerm)
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter
    const matchesStatus = statusFilter === 'All Status' || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get current page products
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Reset pagination when filters change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setPage(0)
  }

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value)
    setPage(0)
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    setPage(0)
  }

  const getStockColor = (stock) => {
    if (stock <= 10) return 'warning'
    if (stock <= 30) return 'info'
    return 'success'
  }

  return (
    <div className="lg:flex gap-5  p-5 ">
        <Sidebar/>

        <section className="space-y-5 border-primary lg:w-[85%] p-3 bg-background rounded-lg shadow-slate-400 shadow-lg h-[calc(90vh-2.5rem)] flex flex-col">
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                Product Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddModalOpen(true)}
                sx={{
                  backgroundColor: '#b0a892',
                  '&:hover': { backgroundColor: '#e0dac5' },
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1.5
                }}
              >
                Add Product
              </Button>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ flex: 1, minWidth: '300px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Beverages">Beverages</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Bakery">Bakery</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Products Table */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <TableContainer component={Paper} sx={{ flex: 1, overflow: 'auto' }}>
                <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f3f4f6' } }}>
                  <TableHead>
                    <TableRow sx={{ height: 48 }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        PRODUCT
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        CATEGORY
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        PRICE
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        STOCK
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        STATUS
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', py: 1.5 }}>
                        ACTIONS
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product.id} sx={{ 
                        '&:hover': { backgroundColor: '#f9fafb' },
                        height: 60
                      }}>
                        <TableCell sx={{ py: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, backgroundColor: '#f3f4f6', fontSize: '1rem' }}>
                              {product.image}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', lineHeight: 1.2 }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                                {product.code}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {product.category}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {product.price}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={product.stock}
                            color={getStockColor(product.stock)}
                            variant="outlined"
                            size="small"
                            sx={{ height: 24, fontSize: '0.75rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={product.status}
                            color={product.status === 'Active' ? 'success' : 'error'}
                            variant="outlined"
                            size="small"
                            sx={{ height: 24, fontSize: '0.75rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#2563eb', padding: '4px' }}
                              onClick={() => handleOpenEditModal(product)}
                              title="Edit Product"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: product.status === 'Active' ? '#f59e0b' : '#10b981', padding: '4px' }}
                              onClick={() => handleToggleStatus(product)}
                              title={product.status === 'Active' ? 'Deactivate Product' : 'Activate Product'}
                            >
                              {product.status === 'Active' ? (
                                <DeactivateIcon fontSize="small" />
                              ) : (
                                <ActivateIcon fontSize="small" />
                              )}
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#ef4444', padding: '4px' }}
                              onClick={() => handleDeleteProduct(product)}
                              title="Delete Product"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <Box component={Paper} sx={{ 
                borderTop: '1px solid #e5e7eb', 
                borderRadius: 0,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4
              }}>
                <TablePagination
                  component="div"
                  count={filteredProducts.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  sx={{
                    '& .MuiTablePagination-toolbar': {
                      paddingLeft: 2,
                      paddingRight: 2,
                      minHeight: 56,
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontSize: '0.875rem',
                      color: '#6b7280',
                    },
                    '& .MuiTablePagination-select': {
                      fontSize: '0.875rem',
                    },
                    '& .MuiTablePagination-actions': {
                      color: '#6b7280',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </section>

        {/* Add Product Modal */}
        <AddProductModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddProduct={handleAddProduct}
        />

        {/* Edit Product Modal */}
        <EditProductModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEditProduct={handleEditProduct}
          product={selectedProduct}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDeleteProduct}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

        {/* Status Toggle Confirmation Dialog */}
        <ConfirmationDialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
          onConfirm={confirmToggleStatus}
          title={`${productToToggle?.status === 'Active' ? 'Deactivate' : 'Activate'} Product`}
          message={`Are you sure you want to ${productToToggle?.status === 'Active' ? 'deactivate' : 'activate'} "${productToToggle?.name}"?`}
          confirmText={productToToggle?.status === 'Active' ? 'Deactivate' : 'Activate'}
          cancelText="Cancel"
          type="warning"
        />
    </div>
  )
}

export default ProductManagement