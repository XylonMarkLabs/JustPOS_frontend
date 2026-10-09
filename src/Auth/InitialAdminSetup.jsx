import React, { useState } from "react";
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Lock as LockIcon,
    Storefront as StorefrontIcon,
    PersonOutline as PersonOutlineIcon,
    MailOutline as MailOutlineIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    AccountCircle,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/JUSTPOS_transparent.png";
import { baseURL } from "../Services/ApiCall";

// ---------------------------------------------------------------------------
// API layer — kept deliberately separate from the UI below. The component
// never talks to axios directly; it only calls this function and reacts to
// what comes back (success / already-set-up / validation / network error).
// ---------------------------------------------------------------------------
const SETUP_ALREADY_COMPLETE = "SETUP_ALREADY_COMPLETE";

const createAdminAccount = async ({ businessName, adminName, email, username, password }) => {
    try {
        const response = await axios.post(
            `${baseURL}/setup/create-admin`,
            {
                businessName,
                adminName,
                email,
                username,
                password,
            },
            { withCredentials: true }
        );

        if (!response.data?.success) {
            // Backend is the source of truth on whether setup is still allowed.
            if (response.data?.code === SETUP_ALREADY_COMPLETE || response.status === 409) {
                return { ok: false, alreadySetUp: true };
            }
            return { ok: false, message: response.data?.message || "Setup failed. Please try again." };
        }

        return { ok: true };
    } catch (err) {
        if (err.response?.status === 409 || err.response?.data?.code === SETUP_ALREADY_COMPLETE) {
            return { ok: false, alreadySetUp: true };
        }
        return {
            ok: false,
            message: err.response?.data?.message || "Something went wrong. Please check your connection and try again.",
        };
    }
};

// ---------------------------------------------------------------------------
// Validation — plain functions, no UI concerns.
// ---------------------------------------------------------------------------
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const checkPasswordStrength = (password) => {
    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return { isValid: Object.values(rules).every(Boolean), rules };
};

// Provided validator — a username is only ever empty, or must pass these
// length/character rules. Kept exactly as given.
const usernameValidator = (username) => {
    if (typeof username !== "string") {
        return "Username must be a string";
    }

    if (username.length < 3 || username.length > 30) {
        return "Username must be between 3 and 30 characters";
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return "Username can only contain letters, numbers, and underscores";
    }

    return null;
};

const validateForm = (form) => {
    const errors = {};

    if (!form.businessName.trim()) errors.businessName = "Business name is required";
    if (!form.adminName.trim()) errors.adminName = "Administrator name is required";

    if (!form.email.trim()) {
        errors.email = "Email address is required";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
        errors.email = "Enter a valid email address";
    }

    if (!form.username.trim()) {
        errors.username = "Username is required";
    } else {
        const usernameError = usernameValidator(form.username.trim());
        if (usernameError) errors.username = usernameError;
    }

    if (!form.password) {
        errors.password = "Password is required";
    } else if (!checkPasswordStrength(form.password).isValid) {
        errors.password = "Password doesn't meet the requirements below";
    }

    if (!form.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
        errors.confirmPassword = "Passwords don't match";
    }

    return errors;
};

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#f9fafb",
        "&:hover fieldset": { borderColor: "#b0a892" },
        "&.Mui-focused fieldset": { borderColor: "#292929" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#292929" },
};

const StepIndicator = () => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.75, sm: 1 },
            flexWrap: "wrap",
            mb: { xs: 2.5, sm: 3 },
        }}
    >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CheckCircleIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: "#b0a892" }} />
            <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" }, fontWeight: 600, color: "#292929" }}>
                Create Administrator
            </Typography>
        </Box>
        <Box sx={{ width: { xs: 20, sm: 28 }, height: "1px", backgroundColor: "#d1d5db" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <RadioButtonUncheckedIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: "#9ca3af" }} />
            <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" }, fontWeight: 500, color: "#9ca3af" }}>
                Start Using JustPOS
            </Typography>
        </Box>
    </Box>
);

const PasswordRequirements = ({ password }) => {
    const { rules } = checkPasswordStrength(password);
    const items = [
        ["length", "At least 8 characters"],
        ["uppercase", "One uppercase letter"],
        ["lowercase", "One lowercase letter"],
        ["number", "One number"],
        ["special", "One special character"],
    ];

    return (
        <Box
            sx={{
                mt: 1,
                p: 1.5,
                borderRadius: 1.5,
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
            }}
        >
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 0.5 }}>
                {items.map(([key, label]) => (
                    <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        {rules[key] ? (
                            <CheckCircleIcon sx={{ fontSize: 14, color: "#059669" }} />
                        ) : (
                            <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                        )}
                        <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, color: rules[key] ? "#059669" : "#6b7280" }}>
                            {label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

const InitialAdminSetup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        businessName: "",
        adminName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [alreadySetUp, setAlreadySetUp] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (serverError) setServerError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = validateForm(form);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setIsSubmitting(true);
        setServerError("");

        const result = await createAdminAccount(form);

        setIsSubmitting(false);

        if (result.ok) {
            setSuccess(true);
            // Brief confirmation before handing off to the login screen.
            setTimeout(() => navigate("/login", { replace: true }), 1200);
            return;
        }

        if (result.alreadySetUp) {
            setAlreadySetUp(true);
            setTimeout(() => navigate("/login", { replace: true }), 2000);
            return;
        }

        setServerError(result.message);
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-[#f5f3ee] px-4 py-8">
            <div className="w-full max-w-md sm:max-w-lg">
                <Box
                    sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: { xs: 3, sm: 4 },
                        boxShadow: "0 10px 40px rgba(41,41,41,0.12)",
                        p: { xs: 3, sm: 5 },
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 3 } }}>
                        <img src={logo} alt="JustPOS" style={{ height: 44 }} />
                    </Box>

                    {/* "Initial Setup" badge */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 1.5, sm: 2 } }}>
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.75,
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 999,
                                backgroundColor: "#f3efe6",
                                border: "1px solid #e0dac5",
                            }}
                        >
                            <LockIcon sx={{ fontSize: 14, color: "#8a7f68" }} />
                            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: 0.5, color: "#8a7f68", textTransform: "uppercase" }}>
                                Initial Setup
                            </Typography>
                        </Box>
                    </Box>

                    {/* Heading */}
                    <Typography
                        sx={{
                            textAlign: "center",
                            fontWeight: 800,
                            color: "#1a1a1a",
                            fontSize: { xs: "1.4rem", sm: "1.75rem" },
                            mb: 0.75,
                        }}
                    >
                        Set Up Your JustPOS
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "#6b7280",
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            maxWidth: 400,
                            mx: "auto",
                            mb: { xs: 2.5, sm: 3 },
                        }}
                    >
                        Welcome to JustPOS. Complete the initial setup by creating your administrator account.
                    </Typography>

                    <StepIndicator />

                    {/* Setup already completed */}
                    {alreadySetUp && (
                        <Alert severity="info" sx={{ mb: 2.5 }}>
                            Setup has already been completed for this system. Redirecting you to the login page…
                        </Alert>
                    )}

                    {/* Success */}
                    {success && !alreadySetUp && (
                        <Alert severity="success" sx={{ mb: 2.5 }}>
                            Administrator account created. Taking you to the login page…
                        </Alert>
                    )}

                    {/* Server error */}
                    {serverError && !alreadySetUp && !success && (
                        <Alert severity="error" sx={{ mb: 2.5 }}>
                            {serverError}
                        </Alert>
                    )}

                    {!alreadySetUp && !success && (
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    label="Business Name"
                                    placeholder="Enter your business name"
                                    value={form.businessName}
                                    onChange={handleChange("businessName")}
                                    fullWidth
                                    size="small"
                                    error={!!fieldErrors.businessName}
                                    helperText={fieldErrors.businessName}
                                    disabled={isSubmitting}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <StorefrontIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={fieldSx}
                                />

                                <TextField
                                    label="Admin Name"
                                    placeholder="Enter administrator name"
                                    value={form.adminName}
                                    onChange={handleChange("adminName")}
                                    fullWidth
                                    size="small"
                                    error={!!fieldErrors.adminName}
                                    helperText={fieldErrors.adminName}
                                    disabled={isSubmitting}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={fieldSx}
                                />

                                <TextField
                                    label="Email Address"
                                    placeholder="admin@example.com"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange("email")}
                                    fullWidth
                                    size="small"
                                    error={!!fieldErrors.email}
                                    helperText={fieldErrors.email}
                                    disabled={isSubmitting}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={fieldSx}
                                />

                                <TextField
                                    label="Username"
                                    placeholder="admin"
                                    type="text"
                                    value={form.username}
                                    onChange={handleChange("username")}
                                    fullWidth
                                    size="small"
                                    error={!!fieldErrors.username}
                                    helperText={fieldErrors.username || "3–30 characters: letters, numbers, and underscores only"}
                                    disabled={isSubmitting}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle sx={{ fontSize: 20, color: "#9ca3af" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={fieldSx}
                                />

                                <Box>
                                    <TextField
                                        label="Password"
                                        placeholder="Create a strong password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleChange("password")}
                                        fullWidth
                                        size="small"
                                        error={!!fieldErrors.password}
                                        helperText={fieldErrors.password}
                                        disabled={isSubmitting}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        edge="end"
                                                        size="small"
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={fieldSx}
                                    />
                                    {form.password && !checkPasswordStrength(form.password).isValid && (
                                        <PasswordRequirements password={form.password} />
                                    )}
                                </Box>

                                <TextField
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={form.confirmPassword}
                                    onChange={handleChange("confirmPassword")}
                                    fullWidth
                                    size="small"
                                    error={!!fieldErrors.confirmPassword}
                                    helperText={fieldErrors.confirmPassword}
                                    disabled={isSubmitting}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                                    edge="end"
                                                    size="small"
                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={fieldSx}
                                />
                            </Box>

                            {/* Security / information note */}
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "flex-start",
                                    mt: { xs: 2.5, sm: 3 },
                                    p: { xs: 1.5, sm: 2 },
                                    borderRadius: 1.5,
                                    backgroundColor: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <LockIcon sx={{ fontSize: 18, color: "#9ca3af", mt: "1px", flexShrink: 0 }} />
                                <Typography sx={{ fontSize: { xs: "0.72rem", sm: "0.78rem" }, color: "#6b7280", lineHeight: 1.5 }}>
                                    This administrator account will have full access to your JustPOS system. You can create
                                    additional users after completing setup.
                                </Typography>
                            </Box>

                            {/* Submit */}
                            <Button
                                type="submit"
                                fullWidth
                                disabled={isSubmitting}
                                sx={{
                                    mt: { xs: 2.5, sm: 3 },
                                    py: { xs: 1.1, sm: 1.3 },
                                    backgroundColor: "#292929",
                                    color: "#FBF8EF",
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                    borderRadius: 2,
                                    "&:hover": { backgroundColor: "#1a1a1a" },
                                    "&:disabled": { backgroundColor: "#9ca3af", color: "#f3f4f6" },
                                }}
                            >
                                {isSubmitting ? (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <CircularProgress size={18} sx={{ color: "inherit" }} />
                                        Setting up...
                                    </Box>
                                ) : (
                                    "Create Administrator"
                                )}
                            </Button>
                        </Box>
                    )}
                </Box>

                <Typography
                    sx={{
                        textAlign: "center",
                        color: "#9a9078",
                        fontSize: "0.7rem",
                        mt: 2,
                    }}
                >
                    JustPOS — secure one-time system initialization
                </Typography>
            </div>
        </div>
    );
};

export default InitialAdminSetup;