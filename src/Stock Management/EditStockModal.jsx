import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { useAlert } from "../Components/AlertProvider";
import ApiCall from "../Services/ApiCall";

// Shared styling for the compact form inputs, kept consistent with the
// rest of the app's forms.
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f9fafb",
    height: "40px",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
    },
  },
};

// Products (and suppliers) from the API may key their unique identifier
// differently (id, _id, productCode/supplierId, ...). Fall back through
// the common options so the dropdown always has a truly unique value
// per row, rather than every option silently matching the same (or
// undefined) id.
const getProductId = (product, index) =>
  product?.id ?? product?._id ?? product?.productCode ?? `idx-${index}`;

const getSupplierId = (supplier, index) =>
  supplier?.id ?? supplier?._id ?? supplier?.supplierId ?? `idx-${index}`;

let nextRowId = 1;
const createRowFromItem = (item = {}) => ({
  rowId: nextRowId++,
  productId: item.productId || "",
  productName: item.productName || "",
  currentStock: item.currentStock ?? "",
  quantityReceived: item.quantityReceived ?? "",
  unitCost: item.unitCost ?? "",
  // The quantity this row started at when the modal opened. A brand new
  // row (added via "Add Product") starts at 0, since the whole amount
  // entered is a fresh addition to stock.
  originalQuantityReceived: item.quantityReceived ?? 0,
});

const createEmptyRow = () => createRowFromItem();

const EditStockModal = ({ open, onClose, onEditStock, stock }) => {
  const { showError, showWarning } = useAlert();

  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([createEmptyRow()]);

  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      getProducts();
      getSuppliers();
    }
  }, [open]);

  // Populate the form whenever a new stock record is opened for editing
  useEffect(() => {
    if (stock && open) {
      const items = stock.items && stock.items.length ? stock.items : [{}];
      setRows(items.map((item) => createRowFromItem(item)));
      setSupplierId(stock.supplierId || "");
      setReceivedDate(
        stock.receivedDate ? String(stock.receivedDate).slice(0, 10) : ""
      );
      setInvoiceNo(stock.invoiceNo || "");
      setNotes(stock.notes || "");
    }
  }, [stock, open]);

  const getProducts = async () => {
    try {
      const productList = await ApiCall.product.getAll();
      
      setProducts(productList.filter((product) => product.productType === "INVENTORY"));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getSuppliers = async () => {
    try {
      const supplierList = await ApiCall.supplier.getAll();
      setSuppliers(supplierList);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const rowTotal = (row) => {
    const qty = parseFloat(row.quantityReceived);
    const cost = parseFloat(row.unitCost);
    if (isNaN(qty) || isNaN(cost)) return 0;
    return qty * cost;
  };

  // How much this row's product stock level will change by when saved,
  // compared to what this row originally contributed.
  const rowDelta = (row) => {
    const qty = parseFloat(row.quantityReceived);
    if (isNaN(qty)) return 0;
    return qty - (row.originalQuantityReceived || 0);
  };

  const grandTotal = rows.reduce((sum, row) => sum + rowTotal(row), 0);

  const findProductById = (productId) =>
    products.find((product, index) => getProductId(product, index) === productId) ||
    null;

  const findSupplierById = (id) =>
    suppliers.find((supplier, index) => getSupplierId(supplier, index) === id) ||
    null;

  // Numeric row fields (quantity received, unit cost) still come from a
  // plain input's onChange event.
  const handleRowFieldChange = (rowId, field) => (event) => {
    const value = event.target.value;

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.rowId === rowId ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleRowProductChange = (rowId, selectedProduct) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.rowId !== rowId) return row;

        return {
          ...row,
          productId: selectedProduct
            ? getProductId(selectedProduct, products.indexOf(selectedProduct))
            : "",
          productName: selectedProduct ? selectedProduct.productName : "",
          currentStock: selectedProduct ? selectedProduct.quantityInStock : "",
          // Swapping the product means this row now tracks a different
          // item, so the "before" quantity for stock-impact display
          // resets to 0 (the whole entered amount is new to this product).
          originalQuantityReceived: 0,
        };
      }),
    );
  };

  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, createEmptyRow()]);
  };

  const handleRemoveRow = (rowId) => {
    setRows((prevRows) => {
      if (prevRows.length === 1) return prevRows;
      return prevRows.filter((row) => row.rowId !== rowId);
    });
  };

  const handleSubmit = () => {
    // Validate product rows
    const incompleteRow = rows.find(
      (row) => !row.productId || !row.quantityReceived || row.unitCost === "",
    );
    if (incompleteRow) {
      showError(
        "Please select a product and enter quantity received and unit cost for every row",
        "Missing Information",
      );
      return;
    }

    const invalidQuantity = rows.find(
      (row) => parseFloat(row.quantityReceived) <= 0,
    );
    if (invalidQuantity) {
      showWarning(
        "Quantity received must be greater than 0",
        "Invalid Quantity",
      );
      return;
    }

    const negativeCost = rows.find((row) => parseFloat(row.unitCost) < 0);
    if (negativeCost) {
      showWarning("Unit cost cannot be less than 0", "Invalid Unit Cost");
      return;
    }

    if (!supplierId || !receivedDate) {
      showError("Please fill in all required fields", "Missing Information");
      return;
    }

    const selectedSupplier = suppliers.find(
      (supplier, index) => getSupplierId(supplier, index) === supplierId,
    );

    const updatedStock = {
      ...stock,
      stockId: stock.stockId,
      items: rows.map((row) => ({
        productId: row.productId,
        productName: row.productName,
        currentStock: row.currentStock,
        quantityReceived: parseInt(row.quantityReceived),
        unitCost: parseFloat(row.unitCost),
        totalCost: rowTotal(row),
      })),
      supplierId,
      supplierName: selectedSupplier ? selectedSupplier.supplierName : "",
      totalPrice: grandTotal,
      receivedDate,
      invoiceNo,
      notes,
    };

    onEditStock(updatedStock);
    handleClose();
  };

  const handleClose = () => {
    setRows([createEmptyRow()]);
    setSupplierId("");
    setReceivedDate("");
    setInvoiceNo("");
    setNotes("");
    onClose();
  };

  if (!stock) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "450px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1a1a1a" }}>
          Edit Stock
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Stock ID */}
          <Box sx={{ maxWidth: 220 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Stock ID
            </Typography>
            <TextField
              fullWidth
              value={stock.stockId || ""}
              size="small"
              disabled
              sx={fieldSx}
            />
          </Box>

          {/* Product line-items table */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Products
            </Typography>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ borderRadius: 2, boxShadow: "none" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Product Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Current Stock
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Quantity Received
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Unit Cost
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Total Cost
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.rowId}>
                      <TableCell sx={{ minWidth: 200 }}>
                        <Autocomplete
                          size="small"
                          options={products}
                          getOptionLabel={(option) => option.productName || ""}
                          value={findProductById(row.productId)}
                          onChange={(event, selectedProduct) =>
                            handleRowProductChange(row.rowId, selectedProduct)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search product"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#f9fafb",
                                },
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.currentStock !== "" ? row.currentStock : "-"}
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 110 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          placeholder="0"
                          value={row.quantityReceived}
                          onChange={handleRowFieldChange(
                            row.rowId,
                            "quantityReceived",
                          )}
                          inputProps={{ min: 0 }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#f9fafb",
                            },
                          }}
                        />
                        {rowDelta(row) !== 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              mt: 0.5,
                              color:
                                rowDelta(row) > 0 ? "#059669" : "#dc2626",
                            }}
                          >
                            {rowDelta(row) > 0 ? "+" : ""}
                            {rowDelta(row)} to stock
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 110 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          placeholder="0.00"
                          value={row.unitCost}
                          onChange={handleRowFieldChange(row.rowId, "unitCost")}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#f9fafb",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 100 }}>
                        {rowTotal(row).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveRow(row.rowId)}
                          disabled={rows.length === 1}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              onClick={handleAddRow}
              startIcon={<AddIcon />}
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: "medium",
                color: "#374151",
              }}
            >
              Add Product
            </Button>
          </Box>

          {/* Stock receipt details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
                >
                  Invoice No
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter invoice number"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
                >
                  Supplier
                </Typography>
                <Autocomplete
                  size="small"
                  options={suppliers}
                  getOptionLabel={(option) => option.supplierName || ""}
                  value={findSupplierById(supplierId)}
                  onChange={(event, selectedSupplier) =>
                    setSupplierId(
                      selectedSupplier
                        ? getSupplierId(
                            selectedSupplier,
                            suppliers.indexOf(selectedSupplier),
                          )
                        : "",
                    )
                  }
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Search supplier" sx={fieldSx} />
                  )}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
                >
                  Total Price
                </Typography>
                <TextField
                  fullWidth
                  value={grandTotal.toFixed(2)}
                  size="small"
                  disabled
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
                >
                  Received Date
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldSx}
                />
              </Box>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Additional notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={fieldSx}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: "#6b7280",
            borderColor: "#d1d5db",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f9fafb",
            },
            textTransform: "none",
            fontWeight: "medium",
            px: 3,
            py: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#b0a892",
            "&:hover": { backgroundColor: "#e0dac5" },
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            py: 1,
          }}
        >
          Update Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStockModal;