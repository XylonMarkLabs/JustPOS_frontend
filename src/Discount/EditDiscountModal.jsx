import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
} from "@mui/material";
import { useAlert } from "../Components/AlertProvider";

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

const STATUS_STYLES = {
  active: { backgroundColor: "#f0fdf4", borderColor: "#dcfce7", color: "#059669" },
  scheduled: { backgroundColor: "#f0f9ff", borderColor: "#dbeafe", color: "#2563eb" },
  inactive: { backgroundColor: "#fffbeb", borderColor: "#fef3c7", color: "#d97706" },
  expired: { backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" },
};

// NOTE: productId / stockItemId are set at creation time and aren't editable
// here — same idea as stockId being locked in EditStockModal. If a discount
// needs to move to a different batch, that reads as "delete and re-add"
// rather than an edit.
//
// NOTE: status (active/inactive) isn't edited here either, matching the
// app's existing convention (ProductManagement toggles status via its own
// confirmation dialog, not through the edit form) — use updateStatus for that.

const EditDiscountModal = ({ open, onClose, onEditDiscount, discount }) => {
  const { showError, showWarning } = useAlert();

  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Populate the form whenever a new discount record is opened for editing
  useEffect(() => {
    if (discount && open) {
      setDiscountType(discount.discountType || "percentage");
      setDiscountValue(discount.discountValue ?? "");
      setQuantity(discount.quantity ?? "");
      setStartDate(discount.startDate ? String(discount.startDate).slice(0, 10) : "");
      setEndDate(discount.endDate ? String(discount.endDate).slice(0, 10) : "");
    }
  }, [discount, open]);

  const sellingPrice = discount?.sellingPrice ?? discount?.stockItem?.sellingPrice;
  const quantityRemaining = discount?.stockItem?.quantityRemaining;

  const handleSubmit = () => {
    if (discountValue === "" || isNaN(parseFloat(discountValue)) || parseFloat(discountValue) <= 0) {
      showWarning("Please enter a valid discount value", "Invalid Discount Value");
      return;
    }
    if (discountType === "percentage" && parseFloat(discountValue) > 100) {
      showWarning("Percentage discount cannot exceed 100%", "Invalid Discount Value");
      return;
    }
    if (discountType === "fixed" && sellingPrice != null && parseFloat(discountValue) >= Number(sellingPrice)) {
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
    if (quantityRemaining != null && parseInt(quantity) > Number(quantityRemaining)) {
      showWarning(
        `Quantity cannot exceed the available stock (${quantityRemaining})`,
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

    const updatedDiscount = {
      ...discount,
      discountId: discount.discountId,
      discountType,
      discountValue: parseFloat(discountValue),
      quantity: parseInt(quantity),
      startDate,
      endDate,
    };

    onEditDiscount(updatedDiscount);
    handleClose();
  };

  const handleClose = () => {
    setDiscountType("percentage");
    setDiscountValue("");
    setQuantity("");
    setStartDate("");
    setEndDate("");
    onClose();
  };

  if (!discount) return null;

  const statusStyles = STATUS_STYLES[discount.status] || STATUS_STYLES.inactive;

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1a1a1a" }}>
            Edit Discount
          </Typography>
          <Chip
            label={discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
            variant="outlined"
            size="small"
            sx={{ height: 24, fontSize: "0.75rem", ...statusStyles }}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Discount ID */}
          <Box sx={{ maxWidth: 220 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Discount ID
            </Typography>
            <TextField
              fullWidth
              value={discount.discountId || ""}
              size="small"
              disabled
              sx={fieldSx}
            />
          </Box>

          {/* Product / batch (locked) */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Product
              </Typography>
              <TextField
                fullWidth
                value={discount.productName || discount.productId || ""}
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
                Stock Batch
              </Typography>
              <TextField
                fullWidth
                value={discount.stockItemId || ""}
                size="small"
                disabled
                helperText="Batch can't be changed — delete and re-add to move it"
                sx={fieldSx}
              />
            </Box>
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
              inputProps={{ min: 1, max: quantityRemaining }}
              helperText={quantityRemaining != null ? `Available: ${quantityRemaining}` : " "}
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
          Update Discount
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDiscountModal;