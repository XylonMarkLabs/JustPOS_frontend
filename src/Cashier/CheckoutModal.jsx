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
import jsPDF from 'jspdf';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from "@mui/icons-material/Payment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAlert } from "../Components/AlertProvider";
import ApiCall from "../Services/ApiCall";

const CheckoutModal = ({ open, onClose, cart, total, discount }) => {
    const { showSuccess, showInfo } = useAlert();

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [cashReceived, setCashReceived] = useState("");
    const [step, setStep] = useState(1);
    const [billDoc, setBillDoc] = useState(null);

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
        setBillDoc(null);
    };

    const generateBill = (orderData) => {
        const doc = new jsPDF();
        const user = JSON.parse(localStorage.getItem("user"));
        const now = new Date();

        // Set font size and style for header
        doc.setFontSize(20);
        doc.text("JUSTPOS", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text("Sales Receipt", 105, 30, { align: "center" });
        doc.setFontSize(10);

        // Header info
        doc.text(`Date: ${now.toLocaleDateString()}`, 15, 40);
        doc.text(`Time: ${now.toLocaleTimeString()}`, 15, 45);
        doc.text(`Receipt No: ${orderData?.orderId || now.getTime()}`, 15, 50);
        doc.text(`Cashier: ${user.username}`, 15, 55);
        doc.text(`Payment Method: ${paymentMethod.toUpperCase()}`, 15, 60);

        // Items table header
        let yPos = 70;
        doc.setFont(undefined, 'bold');
        doc.text("Item", 15, yPos);
        doc.text("Qty", 85, yPos);
        doc.text("Price", 110, yPos);
        doc.text("Discount", 135, yPos);
        doc.text("Total", 170, yPos);
        doc.setFont(undefined, 'normal');

        // Draw header line
        yPos += 2;
        doc.line(15, yPos, 195, yPos);
        yPos += 8;

        // Items
        cart.forEach(item => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            const originalPrice = item.product.unitPrice;
            const discountedPrice = item.product.discountValue > 0 
                ? originalPrice * (1 - item.product.discountValue / 100) 
                : originalPrice;
            const lineTotal = discountedPrice * item.product.quantity;

            // Item name with truncation if needed
            const name = item.product.name.length > 35 
                ? item.product.name.substring(0, 32) + '...' 
                : item.product.name;
            doc.text(name, 15, yPos);
            
            // Quantity
            doc.text(item.product.quantity.toString(), 85, yPos);
            
            // Original Price
            doc.text(`Rs.${originalPrice.toFixed(2)}`, 110, yPos);
            
            // Discount
            if (item.product.discountValue > 0) {
                doc.text(`${item.product.discountValue}%`, 135, yPos);
            } else {
                doc.text("-", 135, yPos);
            }
            
            // Line Total
            doc.text(`Rs.${lineTotal.toFixed(2)}`, 170, yPos);

            // If there's a discount, show the original total struck through
            if (item.product.discountValue > 0) {
                const originalTotal = originalPrice * item.product.quantity;
                yPos += 4;
                doc.setTextColor(128, 128, 128); // Gray color for struck through price
                doc.text(`Original: Rs.${originalTotal.toFixed(2)}`, 140, yPos);
                doc.line(140, yPos - 1, 190, yPos - 1); // Strike through line
                doc.setTextColor(0, 0, 0); // Reset to black
            }

            yPos += 8;
        });

        // Totals section
        yPos += 5;
        doc.line(15, yPos, 195, yPos);
        yPos += 8;

        // Subtotal
        const subtotal = total + parseFloat(discount);
        doc.text("Subtotal:", 130, yPos);
        doc.text(`Rs.${subtotal.toFixed(2)}`, 170, yPos);

        // Total Discount
        if (parseFloat(discount) > 0) {
            yPos += 6;
            doc.text("Total Discount:", 130, yPos);
            doc.text(`- Rs.${parseFloat(discount).toFixed(2)}`, 170, yPos);
        }

        // Final Total
        yPos += 8;
        doc.setFont(undefined, 'bold');
        doc.text("Total:", 130, yPos);
        doc.text(`Rs.${total.toFixed(2)}`, 170, yPos);
        doc.setFont(undefined, 'normal');

        // Payment Details
        if (paymentMethod === "cash") {
            yPos += 6;
            doc.text("Cash Received:", 130, yPos);
            doc.text(`Rs.${parseFloat(cashReceived).toFixed(2)}`, 170, yPos);
            yPos += 6;
            doc.text("Change:", 130, yPos);
            doc.text(`Rs.${change}`, 170, yPos);
        }

        // Footer
        yPos += 15;
        doc.setFontSize(8);
        doc.text("Thank you for shopping with us!", 105, yPos, { align: "center" });
        yPos += 5;
        doc.text("Please keep this receipt for your records.", 105, yPos, { align: "center" });
        

        return doc;
    };

    const handlePrint = () => {
        if (!billDoc) return;
        const pdfUrl = billDoc.output('bloburl');
        const printWindow = window.open(pdfUrl);
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };

    const handleDownload = () => {
        if (!billDoc) return;
        const now = new Date();
        const fileName = `receipt_${now.getTime()}.pdf`;
        billDoc.save(fileName);
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
                const bill = generateBill(response);
                setBillDoc(bill);
                setStep(3);
                showSuccess(`Sale recorded successfully!`, "Success");
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
                                Rs.{(item.product.unitPrice * item.product.quantity).toFixed(2)}
                            </Typography>
                        </Box>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography>Subtotal:</Typography>
                            <Typography>Rs.{(total + parseFloat(discount)).toFixed(2)}</Typography>
                        </Box>
                        {parseFloat(discount) > 0 && (
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography color="success.main">Total Discount:</Typography>
                                <Typography color="success.main">- Rs.{discount}</Typography>
                            </Box>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                            <Typography variant="h6" color="primary">Total</Typography>
                            <Typography variant="h6" color="primary">Rs.{total.toFixed(2)}</Typography>
                        </Box>
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

    const renderReceiptStep = () => (
        <>
            <DialogTitle>Payment Complete</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        py: 3,
                    }}
                >
                    <CheckCircleIcon color="success" sx={{ fontSize: 56 }} />
                    <Typography variant="h6">Sale recorded successfully!</Typography>
                    <Typography color="text.secondary">
                        Total charged: Rs.{total.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Print or download the receipt below, or just close this window.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        variant="outlined"
                    >
                        Print
                    </Button>
                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        variant="outlined"
                    >
                        Download
                    </Button>
                </Box>
                <Button
                    onClick={() => {
                        resetModal();
                        onClose();
                    }}
                    variant="contained"
                    color="primary"
                    sx={{ color: "white" }}
                >
                    Done
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
            {step === 1 && renderPaymentMethodSelection()}
            {step === 2 && renderOrderSummary()}
            {step === 3 && renderReceiptStep()}
        </Dialog>
    );
};

export default CheckoutModal;