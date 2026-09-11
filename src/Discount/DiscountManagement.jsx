import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import AddDiscountModal from "./AddDiscountModal";
import EditDiscountModal from "./EditDiscountModal";
import DiscountDetailsModal from "./DiscountDetailsModal";
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
  ToggleOn as ActivateIcon,
  ToggleOff as DeactivateIcon,
} from "@mui/icons-material";
import ApiCall from "../Services/ApiCall";
import AdminPageShell from "../Components/AdminPageShell";

// NOTE: this assumes ApiCall.discount.{getAll, addDiscount, editDiscount, updateStatus, deleteDiscount}
// exist and follow the same call/response shape as ApiCall.product. If your ApiCall.js doesn't have
// a `discount` group yet, add one that hits the discountRouter endpoints (/add, /edit, /update-status,
// /get-all, /delete).
//
// This also assumes getAll() returns each discount already carrying the product's display info
// (e.g. productName, productCode) alongside productId/stockItemId — either via a populate/join on the
// backend, or by merging with your existing product list on the frontend. Swap the `product.productName`
// references below for whatever field your API actually returns.

const DiscountManagement = () => {
  const { showSuccess, showInfo } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState(null);
  const [discountToToggle, setDiscountToToggle] = useState(null);
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    getDiscounts();
  }, []);

  // Fetch all discounts from the API
  const getDiscounts = async () => {
    try {
      const discounts = await ApiCall.discount.getAll();
      setDiscounts(discounts);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  // Handle adding new discount
  const handleAddDiscount = async (newDiscount) => {
    const response = await ApiCall.discount.addDiscount(newDiscount);
    if (response) {
      getDiscounts();
      setAddModalOpen(false);
      showSuccess(
        `Discount has been added successfully!`,
        "Discount Added"
      );
    } else {
      showInfo("Failed to add discount. Please try again.", "Error");
    }
  };

  // Handle editing discount
  const handleEditDiscount = async (updatedDiscount) => {
    const response = await ApiCall.discount.editDiscount(updatedDiscount);
    if (response) {
      getDiscounts();
      setEditModalOpen(false);
      showSuccess(
        `Discount has been updated successfully!`,
        "Discount Updated"
      );
    } else {
      showInfo("Failed to update discount. Please try again.", "Error");
    }
  };

  // Handle opening edit modal
  const handleOpenEditModal = (discount) => {
    setSelectedDiscount(discount);
    setEditModalOpen(true);
  };

  // Handle delete discount
  const handleDeleteDiscount = (discount) => {
    setDiscountToDelete(discount);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDiscount = async () => {
    const discountId = discountToDelete.discountId;

    const response = await ApiCall.discount.deleteDiscount(discountId);

    if (response) {
      getDiscounts();
      setDeleteDialogOpen(false);
      setDiscountToDelete(null);
      showSuccess(
        `Discount "${discountId}" has been deleted successfully!`,
        "Discount Deleted"
      );
    } else {
      showInfo("Failed to delete discount. Please try again.", "Error");
      setDeleteDialogOpen(false);
    }
  };

  // Handle toggle discount status (active <-> inactive)
  const handleToggleStatus = (discount) => {
    setDiscountToToggle(discount);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    const newStatus = discountToToggle.status === "active" || discountToToggle.status === "scheduled" ? "inactive" : "active";
    const discountId = discountToToggle.discountId;

    const response = await ApiCall.discount.updateStatus(discountId, newStatus);

    if (response) {
      getDiscounts();
      setStatusDialogOpen(false);
      setDiscountToToggle(null);
      showInfo(
        `Discount "${discountId}" status changed to ${newStatus === "active" ? "Active" : "Inactive"}`,
        "Status Updated"
      );
    } else {
      showInfo("Failed to update discount status. Please try again.", "Error");
    }
  };

  // Filter discounts based on search term, type, and status
  const filteredDiscounts = discounts.filter((discount) => {
    const productLabel = `${discount.productName || ""} ${discount.productId || ""}`.toLowerCase();
    const matchesSearch =
      productLabel.includes(searchTerm.toLowerCase()) ||
      discount.discountId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "All" || discount.discountType === typeFilter;
    const matchesStatus =
      statusFilter === "All Status" || discount.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Get current page discounts
  const paginatedDiscounts = filteredDiscounts.slice(
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

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "scheduled":
        return "info";
      case "inactive":
        return "warning";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "active":
        return { backgroundColor: "#f0fdf4", borderColor: "#dcfce7", color: "#059669" };
      case "scheduled":
        return { backgroundColor: "#f0f9ff", borderColor: "#dbeafe", color: "#2563eb" };
      case "inactive":
        return { backgroundColor: "#fffbeb", borderColor: "#fef3c7", color: "#d97706" };
      case "expired":
        return { backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" };
      default:
        return { backgroundColor: "#f9fafb", borderColor: "#e5e7eb", color: "#6b7280" };
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatValue = (discount) => {
    if (discount.discountType === "percentage") return `${discount.discountValue}%`;
    return `Rs.${Number(discount.discountValue).toFixed(2)}`;
  };

  return (
    <AdminPageShell>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
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
              Discount Management
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
              Add Discount
            </Button>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search by product or discount ID"
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
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} label="Type" onChange={handleTypeChange}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="All Status">All Status</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Discounts Table */}
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
                    {[
                      "DISCOUNT ID",
                      "PRODUCT",
                      "TYPE",
                      "VALUE",
                      "QUANTITY",
                      "QUANTITY REMAINING",
                      "PERIOD",
                      "STATUS",
                      "ACTIONS",
                    ].map((heading) => (
                      <TableCell
                        key={heading}
                        sx={{
                          fontWeight: "bold",
                          color: "#6b7280",
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                          py: 1.5,
                        }}
                      >
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDiscounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <div className="text-xl text-gray-500 h-80 flex justify-center items-center">
                          No discounts found.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDiscounts.map((discount) => {
                      const statusStyles = getStatusStyles(discount.status);
                      return (
                        <TableRow
                          key={discount.discountId}
                          sx={{
                            "&:hover": { backgroundColor: "#f9fafb" },
                            height: 60,
                          }}
                        >
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                              {discount.discountId}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: "medium", lineHeight: 1.2 }}>
                              {discount.productName || discount.productId}
                            </Typography>
                            <Typography variant="body" color="text.secondary" sx={{ lineHeight: 1 }}>
                              {discount.stockId}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {discount.discountType === "percentage" ? "Percentage" : "Fixed Amount"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                              {formatValue(discount)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {discount.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {discount.remainingQuantity != null ? discount.remainingQuantity : "-"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Chip
                              label={discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                              color={getStatusColor(discount.status)}
                              variant="outlined"
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: "0.75rem",
                                ...statusStyles,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <IconButton
                                size="small"
                                sx={{ color: "#4b5563", padding: "4px" }}
                                onClick={() => {
                                  setSelectedDiscount(discount);
                                  setDetailsModalOpen(true);
                                }}
                                title="View Details"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ color: "#2563eb", padding: "4px" }}
                                onClick={() => handleOpenEditModal(discount)}
                                title="Edit Discount"
                                disabled={discount.status === "expired"}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  color: discount.status === "active" || discount.status === "scheduled" ? "#10b981" : "#f59e0b",
                                  padding: "4px",
                                }}
                                onClick={() => handleToggleStatus(discount)}
                                title={discount.status === "active" || discount.status === "scheduled" ? "Deactivate Discount" : "Activate Discount"}
                                disabled={discount.status === "expired"}
                              >
                                {discount.status === "active" || discount.status === "scheduled" ? (
                                  <ActivateIcon fontSize="medium" />
                                ) : (
                                  <DeactivateIcon fontSize="medium" />
                                )}
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ color: "#ef4444", padding: "4px" }}
                                onClick={() => handleDeleteDiscount(discount)}
                                title="Delete Discount"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
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
                count={filteredDiscounts.length}
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

      {/* Add Discount Modal */}
      <AddDiscountModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddDiscount={handleAddDiscount}
      />

      {/* Edit Discount Modal */}
      <EditDiscountModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEditDiscount={handleEditDiscount}
        discount={selectedDiscount}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteDiscount}
        title="Delete Discount"
        message={`Are you sure you want to delete discount "${discountToDelete?.discountId}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmationDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={confirmToggleStatus}
        title={`${discountToToggle?.status === "active" || discountToToggle?.status === "scheduled" ? "Deactivate" : "Activate"} Discount`}
        message={`Are you sure you want to ${discountToToggle?.status === "active" || discountToToggle?.status === "scheduled" ? "deactivate" : "activate"} discount "${discountToToggle?.discountId}"?`}
        confirmText={discountToToggle?.status === "active" || discountToToggle?.status === "scheduled" ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        type="warning"
      />

      {/* Discount Details Modal */}
      <DiscountDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        discount={selectedDiscount}
      />
    </AdminPageShell>
  );
};

export default DiscountManagement;