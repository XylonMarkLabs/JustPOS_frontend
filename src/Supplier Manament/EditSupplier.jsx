import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";
import { useAlert } from "../Components/AlertProvider";

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

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,15}$/;

const EditSupplierModal = ({ open, onClose, onEditSupplier, supplier }) => {
  const { showError, showSuccess } = useAlert();

  const [formData, setFormData] = useState({
    supplierId: "",
    supplierName: "",
    contactPerson: "",
    contactNo: "",
    email: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({
    contactNo: "",
    email: "",
  });

  useEffect(() => {
    if (supplier && open) {
      setFormData({
        supplierId: supplier.supplierId || "",
        supplierName: supplier.supplierName || "",
        contactPerson: supplier.contactPerson || "",
        contactNo: supplier.contactNo || "",
        email: supplier.email || "",
        status: supplier.status || "Active",
      });
      setErrors({ contactNo: "", email: "" });
    }
  }, [supplier, open]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleEmailKeyUp = (event) => {
    const email = event.target.value;
    if (email && !EMAIL_REGEX.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePhoneKeyUp = (event) => {
    const contactNo = event.target.value;
    if (contactNo && !PHONE_REGEX.test(contactNo)) {
      setErrors((prev) => ({
        ...prev,
        contactNo: "Please enter a valid phone number",
      }));
    } else {
      setErrors((prev) => ({ ...prev, contactNo: "" }));
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      !formData.supplierName ||
      !formData.contactPerson ||
      !formData.contactNo ||
      !formData.email ||
      !formData.status
    ) {
      showError("Please fill in all required fields", "Missing Information");
      return;
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      showError("Please enter a valid email address", "Invalid Email");
      return;
    }

    if (!PHONE_REGEX.test(formData.contactNo)) {
      showError("Please enter a valid phone number", "Invalid Phone Number");
      return;
    }

    // Create updated supplier object
    const updatedSupplier = {
      ...supplier,
      supplierName: formData.supplierName,
      contactPerson: formData.contactPerson,
      contactNo: formData.contactNo,
      email: formData.email.trim(),
      status: formData.status,
    };

    onEditSupplier(updatedSupplier);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      supplierId: "",
      supplierName: "",
      contactPerson: "",
      contactNo: "",
      email: "",
      status: "Active",
    });
    setErrors({
      contactNo: "",
      email: "",
    });
    onClose();
  };

  if (!supplier) return null;

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
          Edit Supplier
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Supplier Id and Supplier Name */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Supplier ID
              </Typography>
              <TextField
                fullWidth
                value={formData.supplierId}
                variant="outlined"
                size="small"
                disabled
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Supplier Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter supplier name"
                value={formData.supplierName}
                onChange={handleChange("supplierName")}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
            </Grid>
          </Grid>

          {/* Contact Person and Phone */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
              >
                Contact Person
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter contact person"
                value={formData.contactPerson}
                onChange={handleChange("contactPerson")}
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
                Contact Number
              </Typography>
              <TextField
                fullWidth
                type="tel"
                placeholder="Enter phone number"
                value={formData.contactNo}
                onChange={handleChange("contactNo")}
                onKeyUp={handlePhoneKeyUp}
                error={!!errors.contactNo}
                helperText={errors.contactNo}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
            </Grid>
          </Grid>

          {/* Email */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: "medium", color: "#374151" }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange("email")}
              onKeyUp={handleEmailKeyUp}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              size="small"
              sx={fieldSx}
            />
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
          Update Supplier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSupplierModal;