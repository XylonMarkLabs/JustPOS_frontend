import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
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

const AddProductModal = ({ open, onClose, onAddProduct }) => {
  const { showError, showWarning, showSuccess } = useAlert();

  const [formData, setFormData] = useState({
    productType: "INVENTORY",
    name: "",
    category: "Beverages",
    barcode: "",
    minStock: "",
    sellingPrice: "",
    costPrice: "",
    image: null,
    imagePreview: null,
  });

  const [errors, setErrors] = useState({
    minStock: "",
    sellingPrice: "",
    costPrice: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const categories = await ApiCall.category.getAll();
      const categoryNames = categories.map((cat) => cat.categoryName);

      setCategories(categoryNames);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    if (
      (field === "minStock" || field === "sellingPrice" || field === "costPrice") &&
      value < 0
    ) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Value cannot be less than 0",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleProductTypeChange = (event, newType) => {
    if (!newType) return; // ignore re-clicking the already-selected option
    setFormData({
      ...formData,
      productType: newType,
      minStock: newType === "INVENTORY" ? formData.minStock : "",
      sellingPrice: newType === "NON_INVENTORY" ? formData.sellingPrice : "",
      costPrice: newType === "NON_INVENTORY" ? formData.costPrice : "",
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        showError(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
          "Invalid File Type"
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showError("Image file must be less than 5MB", "File Too Large");
        return;
      }

      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "just_pos");
    data.append("cloud_name", "dszxdrfy0");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dszxdrfy0/image/upload",
      { method: "POST", body: data }
    );

    const result = await res.json();

    return { url: result.secure_url, publicId: result.public_id };
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null,
    });
  };

  const handleSubmit = async () => {
    const isInventory = formData.productType === "INVENTORY";

    if (!formData.name || !formData.barcode) {
      showError("Please fill in all required fields", "Missing Information");
      return;
    }

    if (!isInventory && !formData.sellingPrice) {
      showError("Please enter a selling price for this product", "Missing Information");
      return;
    }

    if (
      !isInventory &&
      formData.sellingPrice &&
      parseFloat(formData.sellingPrice) <= 0
    ) {
      showWarning("Selling price must be greater than 0", "Invalid Price");
      return;
    }

    let imageUrl = null;
    let publicId = null;

    if (formData.image) {
      try {
        const imageResponse = await uploadImageToCloudinary(formData.image);
        imageUrl = imageResponse.url;
        publicId = imageResponse.publicId;
      } catch (error) {
        showError("Image upload failed. Please try again.", "Upload Error");
        return;
      }
    }

    const newProduct = {
      productName: formData.name,
      productCode: formData.barcode,
      category: formData.category,
      productType: formData.productType,
      minStock: isInventory && formData.minStock ? parseInt(formData.minStock) : undefined,
      sellingPrice: !isInventory && formData.sellingPrice ? parseFloat(formData.sellingPrice) : undefined,
      costPrice: !isInventory && formData.costPrice ? parseFloat(formData.costPrice) : undefined,
      imageURL: imageUrl,
      imagePublicId: publicId,
    };

    onAddProduct(newProduct);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      productType: "INVENTORY",
      name: "",
      category: "Beverages",
      barcode: "",
      minStock: "",
      sellingPrice: "",
      costPrice: "",
      image: null,
      imagePreview: null,
    });
    onClose();
  };

  const isInventory = formData.productType === "INVENTORY";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          Add New Product
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Product Type */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Product Type
            </Typography>
            <ToggleButtonGroup
              value={formData.productType}
              exclusive
              onChange={handleProductTypeChange}
              size="small"
              fullWidth
              sx={{
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontWeight: "medium",
                  "&.Mui-selected": {
                    backgroundColor: "#b0a892",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#9a9078" },
                  },
                },
              }}
            >
              <ToggleButton value="INVENTORY">
                Inventory (from supplier)
              </ToggleButton>
              <ToggleButton value="NON_INVENTORY">
                Made to order
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" sx={{ color: "#9ca3af", mt: 0.5, display: "block" }}>
              {isInventory
                ? "Stock is added afterward via Add Stock — this just creates the product record."
                : "No stock to track — price is set directly, and prepared when ordered (e.g. fresh juice)."}
            </Typography>
          </Box>

          {/* Product Image Upload */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Product Image
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                border: "1px dashed #d1d5db",
                borderRadius: 1,
                backgroundColor: "#f9fafb",
              }}
            >
              {formData.imagePreview ? (
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={formData.imagePreview}
                    sx={{
                      width: 50,
                      height: 50,
                      border: "2px solid #e5e7eb",
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      backgroundColor: "#ef4444",
                      color: "white",
                      width: 18,
                      height: 18,
                      "&:hover": { backgroundColor: "#dc2626" },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                </Box>
              ) : (
                <Avatar
                  sx={{ width: 50, height: 50, backgroundColor: "#e5e7eb" }}
                >
                  <ImageIcon sx={{ fontSize: 24, color: "#9ca3af" }} />
                </Avatar>
              )}

              <Box sx={{ flex: 1 }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    size="small"
                    startIcon={<PhotoCameraIcon />}
                    sx={{
                      textTransform: "none",
                      borderColor: "#d1d5db",
                      color: "#6b7280",
                      height: "32px",
                      fontSize: "0.75rem",
                      "&:hover": {
                        borderColor: "#9ca3af",
                        backgroundColor: "#f3f4f6",
                      },
                    }}
                  >
                    {formData.imagePreview ? "Change" : "Upload"}
                  </Button>
                </label>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 0.5, color: "#9ca3af", fontSize: "0.7rem" }}
                >
                  PNG, JPG, GIF (max 5MB)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Product Name */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Product Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange("name")}
              variant="outlined"
              size="small"
              sx={fieldSx}
            />
          </Box>

          {/* Barcode + Category */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Barcode
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter barcode"
                value={formData.barcode}
                onChange={handleChange("barcode")}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Category
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  fullWidth
                  value={formData.category}
                  onChange={handleChange("category")}
                  variant="outlined"
                  sx={{
                    backgroundColor: "#f9fafb",
                    height: "40px",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                    },
                  }}
                >
                  {categories.map((categoryName, index) => (
                    <MenuItem key={index} value={categoryName}>
                      {categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Type-specific fields */}
          {isInventory ? (
            <Box sx={{ maxWidth: "50%", pr: 1 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Min Stock Level
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="0"
                value={formData.minStock}
                onChange={handleChange("minStock")}
                variant="outlined"
                size="small"
                error={!!errors.minStock}
                helperText={errors.minStock || "Used to trigger low-stock alerts once stock is received"}
                inputProps={{ min: 0, style: { fontSize: "0.875rem" } }}
                sx={fieldSx}
              />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
                >
                  Selling Price
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="0.00"
                  value={formData.sellingPrice}
                  onChange={handleChange("sellingPrice")}
                  variant="outlined"
                  size="small"
                  error={!!errors.sellingPrice}
                  helperText={errors.sellingPrice || ""}
                  inputProps={{ min: 0, step: 0.01, style: { fontSize: "0.875rem" } }}
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
                >
                  Cost Price (optional)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChange={handleChange("costPrice")}
                  variant="outlined"
                  size="small"
                  error={!!errors.costPrice}
                  helperText={errors.costPrice || "Estimated ingredient/prep cost, for profit reports"}
                  inputProps={{ min: 0, step: 0.01, style: { fontSize: "0.875rem" } }}
                  sx={fieldSx}
                />
              </Grid>
            </Grid>
          )}
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
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;