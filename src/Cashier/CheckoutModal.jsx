import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Box,
    Typography,
    Divider,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useAlert } from "../Components/AlertProvider";
import ApiCall from "../Services/ApiCall";

const CheckoutModal = ({ open, onClose, cart, total, discount }) => {
    const { showSuccess, showInfo } = useAlert();

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [cashReceived, setCashReceived] = useState("");
    const [step, setStep] = useState(1);

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleCashReceivedChange = (event) => {
        const value = event.target.value;
        if (!value || /^\d*\.?\d{0,2}$/.test(value)) {
            setCashReceived(value);
        }
    };

    const handleNext = () => {
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setCashReceived("");
    };

    const resetModal = () => {
        setStep(1);
        setCashReceived("");
        setPaymentMethod("cash");
    };

    const handleCheckout = async () => {
        try {
            const response = await ApiCall.order.checkout({
                username: JSON.parse(localStorage.getItem("user")).username,
                totalAmount: total,
                paymentMethod: paymentMethod,
                cashReceived:
                    paymentMethod === "cash" ? parseFloat(cashReceived) : null,
                changeGiven: paymentMethod === "cash" ? change : null,
                discount: parseFloat(discount) || 0,
            });
            if (response) {
                showSuccess(`Sale recorded successfully!`, "Success");
                resetModal();
                onClose();
            } else {
                showInfo("Failed to record the sale. Please try again.");
            }
        } catch (error) {
            console.error("Error recording sale:", error);
            showInfo("An error occurred while recording the sale. Please try again.");
        }
    };

    const change = cashReceived
        ? (parseFloat(cashReceived) - total).toFixed(2)
        : "0.00";

    const renderPaymentMethodSelection = () => (
        <>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogContent>
                <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    sx={{ width: "100%", mt: 2 }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        <FormControlLabel
                            value="cash"
                            control={<Radio />}
                            label={
                                <Box
                                    sx={{
                                        border: "1px solid",
                                        borderColor:
                                            paymentMethod === "cash" ? "primary.main" : "grey.300",
                                        borderRadius: 1,
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <MonetizationOnIcon
                                        color={paymentMethod === "cash" ? "primary" : "action"}
                                    />
                                    Cash
                                </Box>
                            }
                            sx={{ m: 0 }}
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label={
                                <Box
                                    sx={{
                                        border: "1px solid",
                                        borderColor:
                                            paymentMethod === "card" ? "primary.main" : "grey.300",
                                        borderRadius: 1,
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <PaymentIcon
                                        color={paymentMethod === "card" ? "primary" : "action"}
                                    />
                                    Card
                                </Box>
                            }
                            sx={{ m: 0 }}
                            labelPlacement="bottom"
                        />
                    </Box>
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    sx={{ color: "white" }}
                >
                    Next
                </Button>
            </DialogActions>
        </>
    );

    const renderOrderSummary = () => (
        <>
            <DialogTitle>Order Summary</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Items
                    </Typography>
                    {cart.map((item) => (
                        <Box
                            key={item.product.productCode}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography>
                                {item.product.name} x {item.product.quantity}
                            </Typography>
                            <Typography>
                                Rs.{(item.product.price * item.product.quantity).toFixed(2)}
                            </Typography>
                        </Box>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h6">Rs.{total.toFixed(2)}</Typography>
                    </Box>

                    {paymentMethod === "cash" && (
                        <>
                            <TextField
                                fullWidth
                                label="Cash Received"
                                value={cashReceived}
                                onChange={handleCashReceivedChange}
                                type="number"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: <Typography sx={{ mr: 1 }}>Rs.</Typography>,
                                }}
                            />
                            <Box
                                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
                            >
                                <Typography variant="h6">Change</Typography>
                                <Typography
                                    variant="h6"
                                    color={change < 0 ? "error" : "inherit"}
                                >
                                    Rs.{change}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleBack}>Back</Button>
                <Button
                    onClick={handleCheckout}
                    variant="contained"
                    color="primary"
                    sx={{ color: "white" }}
                    disabled={
                        paymentMethod === "cash" &&
                        (parseFloat(cashReceived) < total || !cashReceived)
                    }
                >
                    Complete Payment
                </Button>
            </DialogActions>
        </>
    );

    return (
        <Dialog 
            open={open} 
            onClose={() => {
                resetModal();
                onClose();
            }} 
            maxWidth="sm" 
            fullWidth
        >
            {step === 1 ? renderPaymentMethodSelection() : renderOrderSummary()}
        </Dialog>
    );
};

export default CheckoutModal;
