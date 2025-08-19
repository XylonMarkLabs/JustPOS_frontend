import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import { useAlert } from "../Components/AlertProvider";
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
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Visibility as ActivateIcon,
  DisabledVisible as DeactivateIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ApiCall from "../Services/ApiCall";

const ProductManagement = () => {
  const { showSuccess, showInfo } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToToggle, setProductToToggle] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  // Fetch all products from the API
  const getProducts = async () => {
    try {
      const products = await ApiCall.product.getAll();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle adding new product
  const handleAddProduct = async (newProduct) => {
    const response = await ApiCall.product.addProduct(newProduct);
    if (response) {
      getProducts();
      setAddModalOpen(false);
      showSuccess(
        `Product "${newProduct.productName}" has been added successfully!`,
        "Product Added"
      );
    } else {
      showInfo("Failed to add product. Please try again.", "Error");
    }
  };

  // Handle editing product
  const handleEditProduct = async (updatedProduct) => {
    const response = await ApiCall.product.editProduct(updatedProduct);
    if (response) {
      getProducts();
      setEditModalOpen(false);
      showSuccess(
        `Product "${updatedProduct.productName}" has been updated successfully!`,
        "Product Updated"
      );
    } else {
      showInfo("Failed to update product. Please try again.", "Error");
    }
  };

  // Handle opening edit modal
  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  // Handle delete product
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    const productCode = productToDelete.productCode;
    const productName = productToDelete.name;

    const response = await ApiCall.product.deleteProduct(productCode);

    if (response) {
      getProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      showSuccess(
        `Product "${productName}" has been deleted successfully!`,
        "Product Deleted"
      );
    } else {
      showInfo("Failed to delete product. Please try again.", "Error");
      setDeleteDialogOpen(false);
    }
  };

  // Handle toggle product status
  const handleToggleStatus = (product) => {
    setProductToToggle(product);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    const newStatus = productToToggle.status === 1 ? 0 : 1;
    const productCode = productToToggle.productCode;
    const productName = productToToggle.productName;

    const response = await ApiCall.product.updateStatus(productCode, newStatus);

    if (response) {
      getProducts();
      setStatusDialogOpen(false);
      setProductToToggle(null);
      showInfo(
        `Product "${productName}" status changed to ${newStatus === 1 ? "Active" : "Deactive"
        }`,
        "Status Updated"
      );
    } else {
      showInfo("Failed to update product status. Please try again.", "Error");
    }
  };

  // Filter products based on search term, category, and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode.includes(searchTerm);
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All Status" || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get current page products
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset pagination when filters change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const getStockColor = (quantityInStock, minStock = 0) => {
    if (quantityInStock <= 0) return "error"; // Out of stock
    if (quantityInStock <= minStock) return "warning"; // Below minimum stock
    if (quantityInStock <= minStock * 1.5) return "info"; // Low stock warning
    return "success"; // Good stock level
  };

  const isLowStock = (quantityInStock, minStock = 0) => {
    return quantityInStock <= minStock && quantityInStock > 0;
  };

  const isOutOfStock = (quantityInStock) => {
    return quantityInStock <= 0;
  };

  return (
    <div className="lg:flex gap-5  p-5 ">
      <Sidebar />

      <section className="space-y-5 border-primary lg:w-[85%] p-3 bg-background rounded-lg shadow-slate-400 shadow-lg h-[calc(90vh-2.5rem)] flex flex-col">
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1a1a1a" }}
            >
              Product Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
              sx={{
                backgroundColor: "#b0a892",
                "&:hover": { backgroundColor: "#e0dac5" },
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                py: 1,
              }}
            >
              Add Product
            </Button>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search product by name or barcode"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ flex: 1, minWidth: "300px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9ca3af" }} />
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
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Products Table */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{ flex: 1, overflow: "auto" }}
            >
              <Table
                stickyHeader
                size="small"
                sx={{
                  "& .MuiTableCell-root": { borderBottom: "1px solid #f3f4f6" },
                }}
              >
                <TableHead>
                  <TableRow sx={{ height: 48 }}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      PRODUCT
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      CATEGORY
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      PRICE
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      DISCOUNT
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      CURRENT STOCK
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      MIN STOCK
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      STATUS
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                      }}
                    >
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>
                {/* No products found */}
                <TableBody>
                  {paginatedProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <div className="text-xl text-gray-500 h-80 flex justify-center items-center">
                          No products found.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedProducts.map((product) => (
                      <TableRow
                        key={product.productCode}
                        sx={{
                        "&:hover": { backgroundColor: "#f9fafb" },
                        height: 60,
                      }}
                    >
                      <TableCell sx={{ py: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <div >
                            <img
                              src={product.imageURL}
                              alt={product.productName}
                              className="rounded-md "
                              style={{ width: 52, height: 52 }}
                            />
                          </div>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium", lineHeight: 1.2 }}
                            >
                              {product.productName}
                            </Typography>
                            <Typography
                              variant="body"
                              color="text.secondary"
                              sx={{ lineHeight: 1 }}
                            >
                              {product.productCode}
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
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          Rs.{product.sellingPrice.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {product.discount}%
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Chip
                          label={product.quantityInStock}
                          color={getStockColor(
                            product.quantityInStock,
                            product.minStock
                          )}
                          variant="outlined"
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            backgroundColor:
                              getStockColor(
                                product.quantityInStock,
                                product.minStock
                              ) === "success"
                                ? "#f0fdf4"
                                : getStockColor(
                                  product.quantityInStock,
                                  product.minStock
                                ) === "warning"
                                  ? "#fffbeb"
                                  : getStockColor(
                                    product.quantityInStock,
                                    product.minStock
                                  ) === "info"
                                    ? "#f0f9ff"
                                    : getStockColor(
                                      product.quantityInStock,
                                      product.minStock
                                    ) === "error"
                                      ? "#fef2f2"
                                      : "#f9fafb",
                            borderColor:
                              getStockColor(
                                product.quantityInStock,
                                product.minStock
                              ) === "success"
                                ? "#dcfce7"
                                : getStockColor(
                                  product.quantityInStock,
                                  product.minStock
                                ) === "warning"
                                  ? "#fef3c7"
                                  : getStockColor(
                                    product.quantityInStock,
                                    product.minStock
                                  ) === "info"
                                    ? "#dbeafe"
                                    : getStockColor(
                                      product.quantityInStock,
                                      product.minStock
                                    ) === "error"
                                      ? "#fecaca"
                                      : "#e5e7eb",
                            color:
                              getStockColor(
                                product.quantityInStock,
                                product.minStock
                              ) === "success"
                                ? "#059669"
                                : getStockColor(
                                  product.quantityInStock,
                                  product.minStock
                                ) === "warning"
                                  ? "#d97706"
                                  : getStockColor(
                                    product.quantityInStock,
                                    product.minStock
                                  ) === "info"
                                    ? "#2563eb"
                                    : getStockColor(
                                      product.quantityInStock,
                                      product.minStock
                                    ) === "error"
                                      ? "#dc2626"
                                      : "#6b7280",
                          }}
                        />
                        {isLowStock(
                          product.quantityInStock,
                          product.minStock
                        ) && (
                            <Typography
                              variant="caption"
                              color="warning.main"
                              sx={{ display: "block", fontSize: "0.65rem" }}
                            >
                              Low Stock!
                            </Typography>
                          )}
                        {isOutOfStock(product.quantityInStock) && (
                          <Typography
                            variant="caption"
                            color="error.main"
                            sx={{ display: "block", fontSize: "0.65rem" }}
                          >
                            Out of Stock!
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {product.minStock || 0}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Chip
                          label={product.status === 1 ? "Active" : "Inactive"}
                          color={product.status === 1 ? "success" : "error"}
                          variant="outlined"
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            backgroundColor:
                              product.status === 1 ? "#f0fdf4" : "#fef2f2",
                            borderColor:
                              product.status === 1 ? "#dcfce7" : "#fecaca",
                            color: product.status === 1 ? "#059669" : "#dc2626",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            sx={{ color: "#4b5563", padding: "4px" }}
                            onClick={() => {
                              setSelectedProduct(product);
                              setDetailsModalOpen(true);
                            }}
                            title="View Details"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "#2563eb", padding: "4px" }}
                            onClick={() => handleOpenEditModal(product)}
                            title="Edit Product"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color:
                                product.status === 1 ? "#f59e0b" : "#10b981",
                              padding: "4px",
                            }}
                            onClick={() => handleToggleStatus(product)}
                            title={
                              product.status === 1
                                ? "Deactivate Product"
                                : "Activate Product"
                            }
                          >
                            {product.status === 1 ? (
                              <DeactivateIcon fontSize="small" />
                            ) : (
                              <ActivateIcon fontSize="small" />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "#ef4444", padding: "4px" }}
                            onClick={() => handleDeleteProduct(product)}
                            title="Delete Product"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              component={Paper}
              sx={{
                borderTop: "1px solid #e5e7eb",
                borderRadius: 0,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
              }}
            >
              <TablePagination
                component="div"
                count={filteredProducts.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: 2,
                    paddingRight: 2,
                    minHeight: 48,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  },
                  "& .MuiTablePagination-select": {
                    fontSize: "0.875rem",
                  },
                  "& .MuiTablePagination-actions": {
                    color: "#6b7280",
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
        message={`Are you sure you want to delete "${productToDelete?.productName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmationDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={confirmToggleStatus}
        title={`${productToToggle?.status === 1 ? "Deactivate" : "Activate"
          } Product`}
        message={`Are you sure you want to ${productToToggle?.status === 1 ? "deactivate" : "activate"
          } "${productToToggle?.productName}"?`}
        confirmText={productToToggle?.status === 1 ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        type="warning"
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductManagement;
