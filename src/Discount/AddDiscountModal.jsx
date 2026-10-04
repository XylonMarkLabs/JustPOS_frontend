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
  useMediaQuery,
  useTheme,
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

const getProductId = (product, index) =>
  product?.id ?? product?._id ?? product?.productId ?? product?.productCode ?? `idx-${index}`;

const getStockItemId = (stockItem, index) =>
  stockItem?.id ?? stockItem?._id ?? stockItem?.stockItemId ?? `idx-${index}`;


const AddDiscountModal = ({ open, onClose, onAddDiscount }) => {
  const { showError, showWarning } = useAlert();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const isInventory = selectedProduct?.productType === "INVENTORY";

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
    try {
      const items = await ApiCall.stock.getByProduct(productId);
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

    if (product && product.productType === "INVENTORY") {
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

  const referencePrice = isInventory
    ? selectedStockItem?.sellingPrice
    : selectedProduct?.sellingPrice;

  const handleSubmit = () => {
    if (!selectedProduct) {
      showError("Please select a product", "Missing Information");
      return;
    }
    if (isInventory && !selectedStockItem) {
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
      referencePrice != null &&
      parseFloat(discountValue) >= Number(referencePrice)
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
      isInventory &&
      selectedStockItem?.quantityRemaining != null &&
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
      ...(isInventory
        ? { stockItemId: getStockItemId(selectedStockItem, stockItems.indexOf(selectedStockItem)) }
        : {}),
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
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 2 },
          minHeight: { xs: "auto", sm: "420px" },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1a1a1a", fontSize: { xs: "1.15rem", sm: "1.5rem" } }}>
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

          {/* Stock batch — INVENTORY only */}
          {isInventory ? (
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
          ) : selectedProduct ? (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography variant="body2" sx={{ color: "#374151", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                Made to order — no stock batch. Current price: Rs.
                {selectedProduct.sellingPrice != null
                  ? Number(selectedProduct.sellingPrice).toFixed(2)
                  : "-"}
              </Typography>
            </Box>
          ) : null}

          {/* Discount type + value */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
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
          <Box sx={{ maxWidth: { xs: "100%", sm: 260 } }}>
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
              inputProps={{ min: 1, max: isInventory ? selectedStockItem?.quantityRemaining : undefined }}
              disabled={isInventory ? !selectedStockItem : !selectedProduct}
              helperText={
                isInventory
                  ? selectedStockItem?.quantityRemaining != null
                    ? `Available: ${selectedStockItem.quantityRemaining}`
                    : " "
                  : "Number of discounted servings to offer — no stock limit"
              }
              sx={fieldSx}
            />
          </Box>

          {/* Dates */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
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

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: 2,
          gap: { xs: 1, sm: 2 },
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          fullWidth={fullScreen}
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
          fullWidth={fullScreen}
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