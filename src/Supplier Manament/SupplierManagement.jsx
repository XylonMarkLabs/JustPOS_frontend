import React, { useEffect, useState } from "react";
import AdminPageShell from "../Components/AdminPageShell";
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
  GroupAdd as AddIcon,
  Search as SearchIcon,
  EditNote as EditIcon,
  Delete as DeleteIcon,
  PersonOff as DeactivateIcon,
  PersonAdd as ActivateIcon,
} from "@mui/icons-material";
import ApiCall from "../Services/ApiCall";
import EditSupplierModal from "./EditSupplier";
import AddSupplierModal from "./AddSupplier";

const hideOnXs = { display: { xs: "none", sm: "table-cell" } };
const hideOnXsSm = { display: { xs: "none", md: "table-cell" } };
const hideOnXsSmMd = { display: { xs: "none", lg: "table-cell" } };

const SupplierManagement = () => {
  const { showSuccess, showInfo } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [supplierToToggle, setSupplierToToggle] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    getSuppliers();
  }, []);

  // Fetch all suppliers from the API
  const getSuppliers = async () => {
    await ApiCall.supplier
      .getAll()
      .then((suppliers) => {
        setSuppliers(suppliers);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  };

  // Handle adding new supplier
  const handleAddSupplier = async (newSupplier) => {
    const response = await ApiCall.supplier.addSupplier(newSupplier);
    if (response) {
      getSuppliers();
      setAddModalOpen(false);
      showSuccess(
        `Supplier "${newSupplier.supplierName}" has been added successfully!`,
        "Supplier Added"
      );
    } else {
      showInfo("Failed to add supplier. Please try again.", "Error");
    }
  };

  // Handle editing supplier
  const handleEditSupplier = async (updatedSupplier) => {
    const response = await ApiCall.supplier.editSupplier(updatedSupplier);
    if (response) {
      getSuppliers();
      setEditModalOpen(false);
      showSuccess(
        `Supplier "${updatedSupplier.supplierName}" has been updated successfully!`,
        "Supplier Updated"
      );
    } else {
      showInfo("Failed to update supplier. Please try again.", "Error");
    }
  };

  // Handle opening edit modal
  const handleOpenEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setEditModalOpen(true);
  };

  // Handle delete supplier
  const handleDeleteSupplier = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSupplier = async () => {
    const supplierId = supplierToDelete.supplierId;
    const supplierName = supplierToDelete.supplierName;

    const response = await ApiCall.supplier.deleteSupplier(supplierId);

    if (response) {
      getSuppliers();
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
      showSuccess(
        `Supplier "${supplierName}" has been deleted successfully!`,
        "Supplier Deleted"
      );
    } else {
      showInfo("Failed to delete supplier. Please try again.", "Error");
      setDeleteDialogOpen(false);
    }
  };

  // Handle toggle supplier status
  const handleToggleStatus = (supplier) => {
    setSupplierToToggle(supplier);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    const newStatus =
      supplierToToggle.status === 1 ? 0 : 1;
    const supplierId = supplierToToggle.supplierId;
    const supplierName = supplierToToggle.supplierName;

    const response = await ApiCall.supplier.updateStatus(
      supplierId,
      newStatus
    );

    if (response) {
      getSuppliers();
      setStatusDialogOpen(false);
      setSupplierToToggle(null);
      showInfo(
        `Supplier "${supplierName}" status changed to ${newStatus}`,
        "Status Updated"
      );
    } else {
      showInfo(
        "Failed to update supplier status. Please try again.",
        "Error"
      );
    }
  };

  // Filter suppliers based on search term and status
  const filteredSuppliers = suppliers.filter((supplier) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      supplier.supplierName.toLowerCase().includes(term) ||
      supplier.email.toLowerCase().includes(term) ||
      supplier.contactPerson.toLowerCase().includes(term) ||
      supplier.supplierId.toLowerCase().includes(term);
    const matchesStatus =
      statusFilter === "All Status" || supplier.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get current page suppliers
  const paginatedSuppliers = filteredSuppliers.slice(
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
    <AdminPageShell>
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: { xs: 1.5, sm: 0 },
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1a1a1a", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              Supplier Management
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
                alignSelf: { xs: "stretch", sm: "auto" },
              }}
            >
              Add Supplier
            </Button>
          </Box>

          {/* Search and Filters */}
          <Box 
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: { xs: 2, sm: 3 },
              flexWrap: { md: "wrap" },
            }}
          >
            <TextField
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              sx={{ flex: 1, minWidth: { xs: "100%", md: "260px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9ca3af" }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 120 }, flex: { xs: 1, sm: "none" } }}>
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

          {/* Suppliers Table */}
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
                  minWidth: 640,
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
                        ...hideOnXsSmMd,
                      }}
                    >
                      SUPPLIER ID
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
                      SUPPLIER NAME
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                        ...hideOnXsSm,
                      }}
                    >
                      CONTACT PERSON
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                        ...hideOnXs,
                      }}
                    >
                      PHONE
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        py: 1.5,
                        ...hideOnXsSm,
                      }}
                    >
                      EMAIL
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
                  {paginatedSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <div className="text-base sm:text-xl text-gray-500 h-60 sm:h-80 flex justify-center items-center text-center px-4">
                          No suppliers found.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSuppliers.map((supplier, index) => (
                      <TableRow
                        key={supplier.id ?? supplier.supplierId ?? index}
                        sx={{
                          "&:hover": { backgroundColor: "#f9fafb" },
                          height: 60,
                        }}
                      >
                        <TableCell sx={{ py: 1, ...hideOnXsSmMd }}>
                          <Typography variant="body2" color="text.secondary">
                            {supplier.supplierId}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: { xs: 1, sm: 1.5 },
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: "#3b82f6",
                                fontSize: "0.875rem",
                                fontWeight: "bold",
                                color: "white",
                                flexShrink: 0,
                              }}
                            >
                              {supplier.supplierName
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "medium", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                                noWrap
                              >
                                {supplier.supplierName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: { xs: "block", lg: "none" }, fontSize: "0.65rem" }}
                                noWrap
                              >
                                {supplier.supplierId}
                                {supplier.contactPerson ? ` • ${supplier.contactPerson}` : ""}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1, ...hideOnXsSm }}>
                          <Typography variant="body2" color="text.secondary">
                            {supplier.contactPerson}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1, ...hideOnXs }}>
                          <Typography variant="body2" color="text.secondary">
                            {supplier.phone}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1, ...hideOnXsSm }}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {supplier.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={supplier.status === 1 ? "Active" : "Inactive"}
                            color={
                              supplier.status === 1
                                ? "success"
                                : "error"
                            }
                            variant="outlined"
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: "0.75rem",
                              backgroundColor:
                                supplier.status === 1
                                  ? "#f0fdf4"
                                  : "#fef2f2",
                              borderColor:
                                supplier.status === 1
                                  ? "#dcfce7"
                                  : "#fecaca",
                              color:
                                supplier.status === 1
                                  ? "#059669"
                                  : "#dc2626",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Box sx={{ display: "flex", gap: 0.25 }}>
                            <IconButton
                              size="small"
                              sx={{ color: "#2563eb", padding: { xs: "2px", sm: "4px" } }}
                              onClick={() => handleOpenEditModal(supplier)}
                              title="Edit Supplier"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{
                                color:
                                  supplier.status === 1
                                    ? "#f59e0b"
                                    : "#10b981",
                                padding: { xs: "2px", sm: "4px" },
                              }}
                              onClick={() => handleToggleStatus(supplier)}
                              title={
                                supplier.status === 1
                                  ? "Deactivate Supplier"
                                  : "Activate Supplier"
                              }
                            >
                              {supplier.status === 1 ? (
                                <DeactivateIcon fontSize="small" />
                              ) : (
                                <ActivateIcon fontSize="small" />
                              )}
                            </IconButton>
                            {/* <IconButton
                              size="small"
                              sx={{ color: "#ef4444", padding: { xs: "2px", sm: "4px" } }}
                              onClick={() => handleDeleteSupplier(supplier)}
                              title="Delete Supplier"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton> */}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
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
                count={filteredSuppliers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage={
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Rows per page:
                  </Box>
                }
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: { xs: 1, sm: 2 },
                    paddingRight: { xs: 1, sm: 2 },
                    minHeight: 56,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    justifyContent: { xs: "center", sm: "flex-end" },
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#6b7280",
                    },
                  "& .MuiTablePagination-select": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                  "& .MuiTablePagination-actions": {
                    color: "#6b7280",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

      {/* Add Supplier Modal */}
      <AddSupplierModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddSupplier={handleAddSupplier}
        suppliers={suppliers}
      />

      {/* Edit Supplier Modal */}
      <EditSupplierModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEditSupplier={handleEditSupplier}
        supplier={selectedSupplier}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteSupplier}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${supplierToDelete?.supplierName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmationDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={confirmToggleStatus}
        title={`${
          supplierToToggle?.status === 1 ? "Deactivate" : "Activate"
        } Supplier`}
        message={`Are you sure you want to ${
          supplierToToggle?.status === 1 ? "deactivate" : "activate"
        } "${supplierToToggle?.supplierName}"?`}
        confirmText={
          supplierToToggle?.status === 1 ? "Deactivate" : "Activate"
        }
        cancelText="Cancel"
        type="warning"
      />
    </AdminPageShell>
  );
};

export default SupplierManagement;