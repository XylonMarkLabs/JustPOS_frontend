import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const EditCategoryModal = ({ open, onClose, onEditCategory, category }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [categoryData, setCategoryData] = useState({
    categoryId: "",
    categoryName: "",
    description: "",
    status: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setCategoryData({
        categoryId: category._id,
        categoryName: category.categoryName,
        description: category.description || "",
        status: category.status,
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors = {};

    if (!categoryData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onEditCategory(categoryData);
      handleClose();
    }
  };

  const handleClose = () => {
    setCategoryData({
      categoryId: "",
      categoryName: "",
      description: "",
      status: 1,
    });
    setErrors({});
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
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
          borderRadius: { xs: 0, sm: "8px" },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          fontWeight: "bold",
          color: "#1a1a1a",
          borderBottom: "1px solid #e5e7eb",
          p: { xs: 1.5, sm: 2 },
        }}
      >
        Edit Category
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              name="categoryName"
              label="Category Name"
              value={categoryData.categoryName}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              error={!!errors.categoryName}
              helperText={errors.categoryName}
            />
            <TextField
              name="description"
              label="Description"
              value={categoryData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: { xs: 2, sm: 2 },
            borderTop: "1px solid #e5e7eb",
            gap: { xs: 1, sm: 1 },
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
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            fullWidth={fullScreen}
            sx={{
              bgcolor: "#b0a892",
              color: "black",
              "&:hover": {
                bgcolor: "#e0dac5",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCategoryModal;