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
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useAlert } from "../Components/AlertProvider";
import ApiCall from "../Services/ApiCall";

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

// Products (and stock items) from the API may key their unique identifier
// differently. Fall back through the common options so Autocomplete always
// has a truly unique value per row.
const getProductId = (product, index) =>
  product?.id ?? product?._id ?? product?.productId ?? product?.productCode ?? `idx-${index}`;

const getStockItemId = (stockItem, index) =>
  stockItem?.id ?? stockItem?._id ?? stockItem?.stockItemId ?? `idx-${index}`;

// NOTE: unlike stockId (generated client-side and sent with the request),
// discountId is generated server-side in addDiscount, so there's no
// equivalent field here for the user to see.

// NOTE: assumes ApiCall.stockItem.getByProduct(productId) returns the stock
// item batches (with quantityRemaining, sellingPrice, stockItemId, etc.)
// belonging to that product. Swap this for your actual endpoint/shape.

const AddDiscountModal = ({ open, onClose, onAddDiscount }) => {
  const { showError, showWarning } = useAlert();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [stockItems, setStockItems] = useState([]);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [loadingStockItems, setLoadingStockItems] = useState(false);

  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (open) {
      getProducts();
    }
  }, [open]);

  const getProducts = async () => {
    try {
      const productList = await ApiCall.product.getAll();
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getStockItemsForProduct = async (productId) => {
    setLoadingStockItems(true);
    console.log("ProductId", productId);
    try {
      const items = await ApiCall.stock.getByProduct(productId);
      console.log("Fetched stock items:", items);
      setStockItems(items);
    } catch (error) {
      console.error("Error fetching stock items:", error);
      setStockItems([]);
    } finally {
      setLoadingStockItems(false);
    }
  };

  const handleProductChange = (event, product) => {
    setSelectedProduct(product);
    setSelectedStockItem(null);
    setStockItems([]);
    setQuantity("");

    if (product) {
      getStockItemsForProduct(getProductId(product, products.indexOf(product)));
    }
  };

  const handleStockItemChange = (event, stockItem) => {
    setSelectedStockItem(stockItem);
    setQuantity("");
  };

  const stockItemLabel = (stockItem) => {
    if (!stockItem) return "";
    const id = stockItem.stockId || "";
    const remaining = stockItem.quantityRemaining ?? "-";
    const price = stockItem.sellingPrice != null ? `Rs.${Number(stockItem.sellingPrice).toFixed(2)}` : "-";
    return `${id} - Qty: ${remaining} - Rs.${price}`;
  };

  const handleSubmit = () => {
    if (!selectedProduct) {
      showError("Please select a product", "Missing Information");
      return;
    }
    if (!selectedStockItem) {
      showError("Please select a stock batch for this product", "Missing Information");
      return;
    }
    if (discountValue === "" || isNaN(parseFloat(discountValue)) || parseFloat(discountValue) <= 0) {
      showWarning("Please enter a valid discount value", "Invalid Discount Value");
      return;
    }
    if (discountType === "percentage" && parseFloat(discountValue) > 100) {
      showWarning("Percentage discount cannot exceed 100%", "Invalid Discount Value");
      return;
    }
    if (
      discountType === "fixed" &&
      selectedStockItem.sellingPrice != null &&
      parseFloat(discountValue) >= Number(selectedStockItem.sellingPrice)
    ) {
      showWarning(
        "Fixed discount must be less than the item's selling price",
        "Invalid Discount Value"
      );
      return;
    }
    if (quantity === "" || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      showWarning("Please enter a valid quantity", "Invalid Quantity");
      return;
    }
    if (
      selectedStockItem.quantityRemaining != null &&
      parseInt(quantity) > Number(selectedStockItem.quantityRemaining)
    ) {
      showWarning(
        `Quantity cannot exceed the available stock (${selectedStockItem.quantityRemaining})`,
        "Invalid Quantity"
      );
      return;
    }
    if (!startDate || !endDate) {
      showError("Please select a start and end date", "Missing Information");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      showWarning("Start date must be before end date", "Invalid Date Range");
      return;
    }

    const discountData = {
      productId: getProductId(selectedProduct, products.indexOf(selectedProduct)),
      stockItemId: getStockItemId(selectedStockItem, stockItems.indexOf(selectedStockItem)),
      discountType,
      discountValue: parseFloat(discountValue),
      quantity: parseInt(quantity),
      startDate,
      endDate,
    };

    onAddDiscount(discountData);
    handleClose();
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setSelectedStockItem(null);
    setStockItems([]);
    setDiscountType("percentage");
    setDiscountValue("");
    setQuantity("");
    setStartDate("");
    setEndDate("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "420px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1a1a1a" }}>
          Add Discount
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Product */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Product
            </Typography>
            <Autocomplete
              size="small"
              options={products}
              getOptionLabel={(option) => option.productName || ""}
              value={selectedProduct}
              onChange={handleProductChange}
              renderInput={(params) => (
                <TextField {...params} placeholder="Search product" sx={fieldSx} />
              )}
            />
          </Box>

          {/* Stock batch */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Stock Batch
            </Typography>
            <Autocomplete
              size="small"
              options={stockItems}
              loading={loadingStockItems}
              getOptionLabel={(option) => stockItemLabel(option)}
              value={selectedStockItem}
              onChange={handleStockItemChange}
              disabled={!selectedProduct}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    selectedProduct
                      ? "Select which batch to discount"
                      : "Select a product first"
                  }
                  sx={fieldSx}
                />
              )}
            />
          </Box>

          {/* Discount type + value */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Discount Type
              </Typography>
              <Select
                fullWidth
                size="small"
                value={discountType}
                onChange={(e) => {
                  setDiscountType(e.target.value);
                  setDiscountValue("");
                }}
                sx={fieldSx}
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Discount Value
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder={discountType === "percentage" ? "0" : "0.00"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                inputProps={{ min: 0, step: discountType === "percentage" ? 1 : 0.01 }}
                InputProps={{
                  endAdornment: discountType === "percentage" ? (
                    <InputAdornment position="end">%</InputAdornment>
                  ) : (
                    <InputAdornment position="start">Rs.</InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
            </Box>
          </Box>

          {/* Quantity */}
          <Box sx={{ maxWidth: 220 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Quantity
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1, max: selectedStockItem?.quantityRemaining }}
              disabled={!selectedStockItem}
              helperText={
                selectedStockItem?.quantityRemaining != null
                  ? `Available: ${selectedStockItem.quantityRemaining}`
                  : " "
              }
              sx={fieldSx}
            />
          </Box>

          {/* Dates */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Start Date
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                End Date
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
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
          Add Discount
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDiscountModal;