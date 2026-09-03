import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
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
      supplierToToggle.status === "Active" ? "Inactive" : "Active";
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
              }}
            >
              Add Supplier
            </Button>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search suppliers..."
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
                        <div className="text-xl text-gray-500 h-80 flex justify-center items-center">
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
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {supplier.supplierId}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {supplier.supplierName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {supplier.contactPerson}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {supplier.contactNo}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
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
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <IconButton
                              size="small"
                              sx={{ color: "#2563eb", padding: "4px" }}
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
                                padding: "4px",
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
                              sx={{ color: "#ef4444", padding: "4px" }}
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
                sx={{
                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: 2,
                    paddingRight: 2,
                    minHeight: 56,
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
          supplierToToggle?.status === "Active" ? "Deactivate" : "Activate"
        } Supplier`}
        message={`Are you sure you want to ${
          supplierToToggle?.status === "Active" ? "deactivate" : "activate"
        } "${supplierToToggle?.supplierName}"?`}
        confirmText={
          supplierToToggle?.status === "Active" ? "Deactivate" : "Activate"
        }
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default SupplierManagement;