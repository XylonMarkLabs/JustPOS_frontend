import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const CategoryDetailsModal = ({ open, onClose, category }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!category) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          wordBreak: "break-word",
        }}
      >
        Category Details
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ mt: 2 }}>
          {/* Category Name */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#6b7280", mb: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Category Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "medium", fontSize: { xs: "0.9rem", sm: "1rem" }, wordBreak: "break-word" }}>
              {category.categoryName}
            </Typography>
          </Box>

          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#6b7280", mb: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Description
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, wordBreak: "break-word" }}>
              {category.description || "No description provided"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Products Count */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#6b7280", mb: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Number of Products
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              {category.productsCount || 0} products
            </Typography>
          </Box>

          {/* Status */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#6b7280", mb: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Status
            </Typography>
            <Chip
              label={category.status === 1 ? "Active" : "Inactive"}
              color={category.status === 1 ? "success" : "error"}
              variant="outlined"
              size="small"
              sx={{
                height: 24,
                fontSize: "0.75rem",
                backgroundColor:
                  category.status === 1 ? "#f0fdf4" : "#fef2f2",
                borderColor:
                  category.status === 1 ? "#dcfce7" : "#fecaca",
                color: category.status === 1 ? "#059669" : "#dc2626",
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: { xs: 2, sm: 2 },
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <Button
          onClick={onClose}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDetailsModal;