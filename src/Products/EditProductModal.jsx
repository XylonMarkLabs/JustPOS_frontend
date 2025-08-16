import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useAlert } from "../Components/AlertProvider";
import ApiCall from "../Services/ApiCall";

const EditProductModal = ({ open, onClose, onEditProduct, product }) => {
  const { showError, showWarning, showSuccess } = useAlert();

  const [formData, setFormData] = useState({
    name: "",
    category: "Beverages",
    price: 0,
    stock: 0,
    minStock: 0,
    discount: 0,
    barcode: "",
    image: null,
    imagePreview: null,
  });

  const [errors, setErrors] = useState({
    price: "",
    stock: "",
    minStock: "",
  });

  // Populate form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.productName || "",
        category: product.category || "Beverages",
        price: product.sellingPrice,
        stock: product.quantityInStock || "",
        minStock: product.minStock || "",
        barcode: product.productCode || "",
        status: product.status === 1 ? "Active" : "Inactive",
        discount: product.discount || 0,
        image: null,
        imagePreview: product.imageURL,
        existingImageURL: product.imageURL,
        imagePublicId: product.imagePublicId || null,
      });
    }
  }, [product]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    // Inline validation for negative numbers
    if (
      (field === "price" || field === "stock" || field === "minStock") &&
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
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

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showError("Image file must be less than 5MB", "File Too Large");
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
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
    return result;
  };

  const deleteImageFromCloudinary = async (publicId) => {
    const res = await ApiCall.product.deleteImage(publicId);

    if (res) {
      return true;
    } else {
      showError("Failed to delete image from Cloudinary", "Deletion Error");
      return false;
    }
  }

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null,
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      !formData.barcode
    ) {
      showError("Please fill in all required fields", "Missing Information");
      return;
    }

    if (
      formData.minStock &&
      parseInt(formData.minStock) > parseInt(formData.stock)
    ) {
      showWarning(
        "Minimum stock level cannot be greater than current stock",
        "Invalid Stock Level"
      );
      return;
    }

    let imageUrl = formData.existingImageURL
    let imagePublicId = formData.imagePublicId

    if (formData.image) {

      const uploadRes = await uploadImageToCloudinary(formData.image)

      imageUrl = uploadRes.secure_url
      imagePublicId = uploadRes.public_id

      if (formData.imagePublicId) {
        await deleteImageFromCloudinary(formData.imagePublicId)
      }
    }

    const updatedProduct = {
      ...product,
      productName: formData.name,
      productCode: formData.barcode,
      category: formData.category,
      sellingPrice: `${parseFloat(formData.price).toFixed(2)}`,
      quantityInStock: parseInt(formData.stock),
      minStock: formData.minStock ? parseInt(formData.minStock) : 0,
      discount: formData.discount ? parseFloat(formData.discount) : 0,
      imageURL: imageUrl,
      imagePublicId: imagePublicId,
    };

    onEditProduct(updatedProduct);
    // showSuccess(
    //   `Product "${formData.name}" has been updated successfully!`,
    //   "Product Updated"
    // );
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      Beverages: "☕",
      Food: "🍕",
      Bakery: "🧁",
    };
    return emojiMap[category] || "📦";
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
          minHeight: "450px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1a1a1a" }}>
          Edit Product
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              ) : product?.image &&
                !product.image.match(
                  /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/u
                ) ? (
                <Avatar
                  src={product.image}
                  sx={{
                    width: 50,
                    height: 50,
                    border: "2px solid #e5e7eb",
                  }}
                />
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
                  id="image-upload-edit"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload-edit">
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
                    {formData.imagePreview ||
                    (product?.image &&
                      !product.image.match(
                        /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/u
                      ))
                      ? "Change"
                      : "Upload"}
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
              sx={{
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
              }}
            />
          </Box>

          {/* Category and Barcode */}
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
                sx={{
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
                }}
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
                  <MenuItem value="Beverages">Beverages</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Bakery">Bakery</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Price and Discount */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Price
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={handleChange("price")}
                variant="outlined"
                size="small"
                error={!!errors.price}
                helperText={errors.price || ""}
                inputProps={{
                  min: 0,
                  step: 0.01,
                  style: { fontSize: "0.875rem" },
                }}
                sx={{
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
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Discount (%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="0"
                value={formData.discount}
                onChange={handleChange("discount")}
                variant="outlined"
                size="small"
                inputProps={{
                  min: 0,
                  style: { fontSize: "0.875rem" },
                }}
                sx={{
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
                }}
              />
            </Grid>
          </Grid>

          {/* Current Stock and Min Stock Level */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Current Stock
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange("stock")}
                variant="outlined"
                size="small"
                error={!!errors.stock}
                helperText={errors.stock || ""}
                inputProps={{
                  min: 0,
                  style: { fontSize: "0.875rem" },
                }}
                sx={{
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
                }}
              />
            </Grid>
            <Grid item xs={6}>
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
                helperText={errors.minStock || ""}
                inputProps={{
                  min: 0,
                  style: { fontSize: "0.875rem" },
                }}
                sx={{
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
                }}
              />
            </Grid>
          </Grid>
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
          Update Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
