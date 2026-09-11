import React from "react";
import {
    Dialog,
    DialogContent,
    Typography,
    Box,
    IconButton,
    LinearProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const STATUS_COLOR = {
    active: "#059669",
    scheduled: "#2563eb",
    inactive: "#d97706",
    expired: "#dc2626",
};

const STATUS_LABEL = {
    active: "Active",
    scheduled: "Scheduled",
    inactive: "Paused",
    expired: "Expired",
};

// A small perforated divider: dashed rule with two semicircle "notches"
// cut out of the left/right edges, like a tear-off ticket stub.
const Perforation = () => (
    <Box sx={{ position: "relative", mx: -4, my: 3 }}>
        <Box
            sx={{
                borderTop: "2px dashed #e2e8f0",
            }}
        />
        <Box
            sx={{
                position: "absolute",
                top: -10,
                left: -10,
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#f1f5f9",
            }}
        />
        <Box
            sx={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#f1f5f9",
            }}
        />
    </Box>
);

const Row = ({ label, value, align = "left" }) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: align === "right" ? "flex-end" : "flex-start",
        }}
    >
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            {label}
        </Typography>
        <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 500 }}>
            {value}
        </Typography>
    </Box>
);

const DiscountDetailsModal = ({ open, onClose, discount }) => {
    if (!discount) return null;

    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        if (isNaN(date.getTime())) return String(value);
        return date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const money = (value) => {
        const num = Number(value);
        return isNaN(num)
            ? "-"
            : num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
    };

    const originalPrice =
        discount.sellingPrice ?? discount.stockItem?.sellingPrice;
    const discountedPrice =
        originalPrice != null
            ? discount.discountType === "percentage"
                ? Number(originalPrice) -
                (Number(originalPrice) * Number(discount.discountValue)) / 100
                : Number(originalPrice) - Number(discount.discountValue)
            : null;

    const offLabel =
        discount.discountType === "percentage"
            ? `${discount.discountValue}% off`
            : `Rs.${money(discount.discountValue)} off`;

    const statusColor = STATUS_COLOR[discount.status] || "#64748b";
    const statusLabel = STATUS_LABEL[discount.status] || discount.status;

    // Where "today" sits between start and end, for the progress bar.
    const start = new Date(discount.startDate).getTime();
    const end = new Date(discount.endDate).getTime();
    const now = Date.now();
    let progress = 0;
    if (discount.status === "expired") progress = 100;
    else if (discount.status === "scheduled") progress = 0;
    else if (!isNaN(start) && !isNaN(end) && end > start) {
        progress = Math.min(
            100,
            Math.max(0, ((now - start) / (end - start)) * 100),
        );
    }

    const daysLabel = () => {
        if (discount.status === "expired") return "Ended";
        if (discount.status === "scheduled") {
            const days = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
            return `Starts in ${days} day${days === 1 ? "" : "s"}`;
        }
        const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        if (days <= 0) return "Ends today";
        return `${days} day${days === 1 ? "" : "s"} left`;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    backgroundColor: "#f1f5f9",
                    overflow: "visible",
                },
            }}
        >
            <IconButton
                onClick={onClose}
                aria-label="close"
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: "#94a3b8",
                    zIndex: 1,
                    "&:hover": { color: "#475569" },
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            <DialogContent sx={{ p: 4 }}>
                {/* Tag stub — id + status */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        pr: 3,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ color: "#64748b", fontWeight: 600, letterSpacing: "0.02em" }}
                    >
                        {discount.discountId}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: statusColor,
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{ color: statusColor, fontWeight: 600 }}
                        >
                            {statusLabel}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="body2" sx={{ color: "#475569", mt: 0.5 }}>
                    {discount.productName || discount.productId} — batch{" "}
                    {discount.stockId}
                </Typography>

                {/* Hero price */}
                <Box sx={{ mt: 3.5, mb: 0.5 }}>
                    {originalPrice != null ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: 1.5,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "2.5rem",
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    lineHeight: 1,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                Rs.{money(discountedPrice)}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "1.25rem",
                                    color: "#94a3b8",
                                    textDecoration: "line-through",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                Rs.{money(originalPrice)}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography
                            sx={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a" }}
                        >
                            {offLabel}
                        </Typography>
                    )}
                    {originalPrice != null && (
                        <Typography
                            variant="body2"
                            sx={{ color: "#b0a892", fontWeight: 700, mt: 0.5 }}
                        >
                            {offLabel}
                        </Typography>
                    )}
                </Box>

                <Perforation />

                {/* Validity, with elapsed-time bar */}
                <Box>
                    <Box
                        sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ color: "#475569", fontWeight: 500 }}
                        >
                            {formatDate(discount.startDate)} – {formatDate(discount.endDate)}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: statusColor, fontWeight: 600 }}
                        >
                            {daysLabel()}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "#e2e8f0",
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: statusColor,
                                borderRadius: 3,
                            },
                        }}
                    />
                </Box>

                <Perforation />

                {/* Batch + coverage details, receipt-line style */}
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Row label="Quantity covered" value={discount.quantity} />
                    <Row
                        label="Batch remaining"
                        value={discount?.remainingQuantity ?? "-"}
                        align="right"
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <Row label="Product code" value={discount.productCode || "-"} />
                    <Row
                        label="Created"
                        value={formatDate(discount.createdAt)}
                        align="right"
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default DiscountDetailsModal;
