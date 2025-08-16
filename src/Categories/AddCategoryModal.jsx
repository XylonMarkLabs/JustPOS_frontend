import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from "@mui/material";

const AddCategoryModal = ({ open, onClose, onAddCategory }) => {
    const [categoryData, setCategoryData] = useState({
        categoryName: "",
        description: "",
    });

    const [errors, setErrors] = useState({});

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
            onAddCategory({
                ...categoryData,
                status: 1, // Default status is active
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setCategoryData({
            categoryName: "",
            description: "",
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
            PaperProps={{
                sx: {
                    borderRadius: "8px",
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#1a1a1a",
                    borderBottom: "1px solid #e5e7eb",
                    p: 2,
                }}
            >
                Add New Category
            </DialogTitle>
                <DialogContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                        <TextField
                            name="categoryName"
                            label="Category Name"
                            value={categoryData.categoryName}
                            onChange={handleChange}
                            fullWidth
                            required
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
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            color: '#6b7280',
                            borderColor: '#d1d5db',
                            '&:hover': {
                                borderColor: '#9ca3af',
                                backgroundColor: '#f9fafb'
                            },
                            textTransform: 'none',
                            fontWeight: 'medium',
                            px: 3,
                            py: 1
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            backgroundColor: '#b0a892',
                            '&:hover': { backgroundColor: '#e0dac5' },
                            textTransform: 'none',
                            fontWeight: 'bold',
                            px: 3,
                            py: 1
                        }}
                    >
                        Add Product
                    </Button>
                </DialogActions>
        </Dialog>
    );
};

export default AddCategoryModal;
