import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import CategoryDetailsModal from "./CategoryDetailsModal";
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
  InputAdornment,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  DisabledVisible as DeactivateIcon,
  Visibility as ActivateIcon,
} from "@mui/icons-material";
import ApiCall from "../Services/ApiCall";

const CategoryManagement = () => {
  const { showSuccess, showInfo } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToToggle, setCategoryToToggle] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  // Fetch all categories from the API
  const getCategories = async () => {
    try {
      const categories = await ApiCall.category.getAll();
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle adding new category
  const handleAddCategory = async (newCategory) => {
    const response = await ApiCall.category.addCategory(newCategory);
    if (response) {
      getCategories();
      setAddModalOpen(false);
      showSuccess(
        `Category "${newCategory.categoryName}" has been added successfully!`,
        "Category Added"
      );
    } else {
      showInfo("Failed to add category. Please try again.", "Error");
    }
  };

  // Handle editing category
  const handleEditCategory = async (updatedCategory) => {
    if (!isAuthorized(userRole)) {
      showInfo("You are not authorized to edit categories.", "Unauthorized");
      return;
    }

    const response = await ApiCall.category.editCategory(updatedCategory);
    if (response) {
      getCategories();
      setEditModalOpen(false);
      showSuccess(
        `Category "${updatedCategory.categoryName}" has been updated successfully!`,
        "Category Updated"
      );
    } else {
      showInfo("Failed to update category. Please try again.", "Error");
    }
  };

  // Handle opening edit modal
  const handleOpenEditModal = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  // Handle delete category
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    // if (!isAuthorized(userRole)) {
    //   showInfo("You are not authorized to delete categories.", "Unauthorized");
    //   return;
    // }

    const categoryName = categoryToDelete.categoryName;

    const response = await ApiCall.category.deleteCategory(categoryName);

    if (response) {
      getCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      showSuccess(
        `Category "${categoryName}" has been deleted successfully!`,
        "Category Deleted"
      );
    } else {
      showInfo("Failed to delete category. Please try again.", "Error");
      setDeleteDialogOpen(false);
    }
  };

  // Handle toggle category status
  const handleToggleStatus = (category) => {
    setCategoryToToggle(category);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    // if (!isAuthorized(userRole)) {
    //   showInfo("You are not authorized to change category status.", "Unauthorized");
    //   return;
    // }

    const newStatus = categoryToToggle.status === 1 ? 0 : 1;
    const categoryName = categoryToToggle.categoryName;

    const response = await ApiCall.category.updateStatus(categoryName, newStatus);

    if (response) {
      getCategories();
      setStatusDialogOpen(false);
      setCategoryToToggle(null);
      showInfo(
        `Category "${categoryName}" status changed to ${newStatus === 1 ? "Active" : "Inactive"}`,
        "Status Updated"
      );
    } else {
      showInfo("Failed to update category status. Please try again.", "Error");
    }
  };

  // Filter categories based on search term and status
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || category.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get current page categories
  const paginatedCategories = filteredCategories.slice(
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

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  return (
    <div className="lg:flex gap-5 p-5">
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
              Category Management
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
              Add Category
            </Button>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search category by name"
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

          {/* Categories Table */}
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
                      CATEGORY NAME
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
                      DESCRIPTION
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
                      PRODUCTS COUNT
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
                <TableBody>
                  {paginatedCategories.map((category) => (
                    <TableRow
                      key={category._id}
                      sx={{
                        "&:hover": { backgroundColor: "#f9fafb" },
                        height: 60,
                      }}
                    >
                      <TableCell sx={{ py: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium", lineHeight: 1.2 }}
                        >
                          {category.categoryName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {category.productsCount || 0}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Chip
                          label={category.status === 1 ? "Active" : "Inactive"}
                          color={category.status === 1 ? "success" : "error"}
                          variant="outlined"
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            backgroundColor:
                              category.status === 1 ? "#f0fdf4" : "#fef2f2",
                            borderColor:
                              category.status === 1 ? "#dcfce7" : "#fecaca",
                            color: category.status === 1 ? "#059669" : "#dc2626",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            sx={{ color: "#4b5563", padding: "4px" }}
                            onClick={() => {
                              setSelectedCategory(category);
                              setDetailsModalOpen(true);
                            }}
                            title="View Details"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "#2563eb", padding: "4px" }}
                            onClick={() => handleOpenEditModal(category)}
                            title="Edit Category"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color:
                                category.status === 1 ? "#f59e0b" : "#10b981",
                              padding: "4px",
                            }}
                            onClick={() => handleToggleStatus(category)}
                            title={
                              category.status === 1
                                ? "Deactivate Category"
                                : "Activate Category"
                            }
                          >
                            {category.status === 1 ? (
                              <DeactivateIcon fontSize="small" />
                            ) : (
                              <ActivateIcon fontSize="small" />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "#ef4444", padding: "4px" }}
                            onClick={() => handleDeleteCategory(category)}
                            title="Delete Category"
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
                count={filteredCategories.length}
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

        {/* Add Category Modal */}
        <AddCategoryModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddCategory={handleAddCategory}
        />

        {/* Edit Category Modal */}
        <EditCategoryModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEditCategory={handleEditCategory}
          category={selectedCategory}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDeleteCategory}
          title="Delete Category"
          message={`Are you sure you want to delete "${categoryToDelete?.categoryName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

        {/* Status Toggle Confirmation Dialog */}
        <ConfirmationDialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
          onConfirm={confirmToggleStatus}
          title={`${categoryToToggle?.status === 1 ? "Deactivate" : "Activate"} Category`}
          message={`Are you sure you want to ${categoryToToggle?.status === 1 ? "deactivate" : "activate"} "${categoryToToggle?.categoryName}"?`}
          confirmText={categoryToToggle?.status === 1 ? "Deactivate" : "Activate"}
          cancelText="Cancel"
          type="warning"
        />

        {/* Category Details Modal */}
        <CategoryDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          category={selectedCategory}
        />
      </section>
    </div>
  );
};

export default CategoryManagement;
