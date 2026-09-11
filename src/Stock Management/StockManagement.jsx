import React, { useEffect, useState } from "react";
import AdminPageShell from "../Components/AdminPageShell";
import AddStockModal from "./AddStockModal";
import EditStockModal from "./EditStockModal";
import StockDetailsModal from "./StockDetailsModal";
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
} from "@mui/icons-material";
import ApiCall from "../Services/ApiCall";

const StockManagement = () => {
  const { showSuccess, showInfo } = useAlert();

  const [searchTerm, setSearchTerm] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    getStocks();
  }, []);

  // Fetch all stock receipts from the API
  const getStocks = async () => {
    try {
      const stocks = await ApiCall.stock.getAll();
      setStocks(stocks);
    } catch (error) {
      console.error("Error fetching stock records:", error);
    }
  };

  // Handle adding new stock receipt
  const handleAddStock = async (newStock) => {
    const response = await ApiCall.stock.addStock(newStock);
    if (response) {
      getStocks();
      setAddModalOpen(false);
      showSuccess(
        `Stock from "${newStock.supplierName}" has been added successfully!`,
        "Stock Added"
      );
    } else {
      showInfo("Failed to add stock. Please try again.", "Error");
    }
  };

  // Handle editing stock receipt
  const handleEditStock = async (updatedStock) => {
    const response = await ApiCall.stock.editStock(updatedStock);
    if (response) {
      getStocks();
      setEditModalOpen(false);
      showSuccess("Stock record has been updated successfully!", "Stock Updated");
    } else {
      showInfo("Failed to update stock record. Please try again.", "Error");
    }
  };

  // Handle opening edit modal
  const handleOpenEditModal = (stock) => {
    setSelectedStock(stock);
    setEditModalOpen(true);
  };

  // Handle delete stock receipt
  const handleDeleteStock = (stock) => {
    setStockToDelete(stock);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStock = async () => {
    const stockId = stockToDelete.stockId;

    const response = await ApiCall.stock.deleteStock(stockId);

    if (response) {
      getStocks();
      setDeleteDialogOpen(false);
      setStockToDelete(null);
      showSuccess("Stock record has been deleted successfully!", "Stock Deleted");
    } else {
      showInfo("Failed to delete stock record. Please try again.", "Error");
      setDeleteDialogOpen(false);
    }
  };

  // Total quantity received across all line items in a stock receipt
  const getTotalQuantity = (stock) =>
    (stock.items || []).reduce(
      (sum, item) => sum + (parseInt(item.quantityReceived) || 0),
      0
    );

  // Unique supplier names present in the loaded stock records, for the filter dropdown
  const supplierNames = [
    ...new Set(stocks.map((stock) => stock.supplierName).filter(Boolean)),
  ];

  // Filter stock records based on search term and supplier
  const filteredStocks = stocks.filter((stock) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (stock.stockId || "").toLowerCase().includes(term) ||
      (stock.supplierName || "").toLowerCase().includes(term) ||
      (stock.invoiceNo || "").toLowerCase().includes(term);
    const matchesSupplier =
      supplierFilter === "All Suppliers" ||
      stock.supplierName === supplierFilter;

    return matchesSearch && matchesSupplier;
  });

  // Get current page stock records
  const paginatedStocks = filteredStocks.slice(
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

  const handleSupplierChange = (e) => {
    setSupplierFilter(e.target.value);
    setPage(0);
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
              Stock Management
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
              Add New Stock
            </Button>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search by stock ID, supplier, or invoice no"
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
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={supplierFilter}
                label="Supplier"
                onChange={handleSupplierChange}
              >
                <MenuItem value="All Suppliers">All Suppliers</MenuItem>
                {supplierNames.map((name, index) => (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Stock Table */}
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
                      STOCK ID
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
                      DATE
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
                      SUPPLIER
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
                      ITEMS
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
                      TOTAL QTY
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
                      ADDED BY
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
                  {paginatedStocks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <div className="text-xl text-gray-500 h-80 flex justify-center items-center">
                          No stock records found.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStocks.map((stock, index) => (
                      <TableRow
                        key={stock.stockId ?? stock.id ?? index}
                        sx={{
                          "&:hover": { backgroundColor: "#f9fafb" },
                          height: 60,
                        }}
                      >
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {stock.stockId}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {stock.receivedDate}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {stock.supplierName}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {(stock.items || []).length} item
                            {(stock.items || []).length === 1 ? "" : "s"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {getTotalQuantity(stock)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {stock.addedBy || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <IconButton
                              size="small"
                              sx={{ color: "#4b5563", padding: "4px" }}
                              onClick={() => {
                                setSelectedStock(stock);
                                setDetailsModalOpen(true);
                              }}
                              title="View Details"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ color: "#2563eb", padding: "4px" }}
                              onClick={() => handleOpenEditModal(stock)}
                              title="Edit Stock Record"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ color: "#ef4444", padding: "4px" }}
                              onClick={() => handleDeleteStock(stock)}
                              title="Delete Stock Record"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
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
                count={filteredStocks.length}
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

      {/* Add Stock Modal */}
      <AddStockModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddStock={handleAddStock}
        stocks={stocks}
      />

      {/* Edit Stock Modal */}
      <EditStockModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEditStock={handleEditStock}
        stock={selectedStock}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteStock}
        title="Delete Stock Record"
        message={`Are you sure you want to delete stock record "${stockToDelete?.stockId}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Stock Details Modal */}
      <StockDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        stock={selectedStock}
      />
    </AdminPageShell>
  );
};

export default StockManagement;