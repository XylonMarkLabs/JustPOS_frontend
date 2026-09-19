import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { useAlert } from "../Components/AlertProvider";
import logo from "../assets/JUSTPOS_transparent.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BusinessRegister = () => {
  const { showError, showSuccess } = useAlert();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.businessName || !formData.businessEmail || !formData.password || !formData.confirmPassword) {
      showError("All fields marked with * are required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      showError("Password must be at least 8 characters long");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.businessEmail)) {
      showError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    console.log(formData)

    try {
      const response = await axios.post(
        `${baseURL}/business/register`,
        formData
      );

      if (response.data.success) {
        showSuccess("Business registered successfully! You can now login.");
        navigate("/");
      } else {
        showError("Registration failed: " + response.data.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      showError(
        "Registration failed: " +
          (err.response ? err.response.data.message : "Network error")
      );
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#292929] via-[#5c5b5a] to-[#FBF8EF]">
      <div className="flex h-auto w-auto shadow-md rounded-lg">
        {/* Left Logo Panel */}
        <div className="bg-secondary flex justify-center items-center rounded-l-lg px-5 w-96">
          <div>
            <img src={logo} className="w-full" alt="Logo" />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="bg-primary flex flex-col justify-center items-center rounded-r-lg px-5 w-96 py-8">
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#FBF8EF",
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              Register Business
            </Typography>
          </Box>

          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="business-name" sx={{ color: "#FBF8EF" }}>
              Business Name *
            </InputLabel>
            <OutlinedInput
              id="business-name"
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleInputChange}
              label="Business Name *"
              sx={{
                color: "#FBF8EF",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
              }}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="business-email" sx={{ color: "#FBF8EF" }}>
              Business Email *
            </InputLabel>
            <OutlinedInput
              id="business-email"
              name="businessEmail"
              type="email"
              value={formData.businessEmail}
              onChange={handleInputChange}
              label="Business Email *"
              sx={{
                color: "#FBF8EF",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
              }}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="business-phone" sx={{ color: "#FBF8EF" }}>
              Business Phone
            </InputLabel>
            <OutlinedInput
              id="business-phone"
              name="businessPhone"
              type="tel"
              value={formData.businessPhone}
              onChange={handleInputChange}
              label="Business Phone"
              sx={{
                color: "#FBF8EF",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
              }}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="business-address" sx={{ color: "#FBF8EF" }}>
              Business Address
            </InputLabel>
            <OutlinedInput
              id="business-address"
              name="businessAddress"
              type="text"
              value={formData.businessAddress}
              onChange={handleInputChange}
              label="Business Address"
              multiline
              rows={2}
              sx={{
                color: "#FBF8EF",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
              }}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="password" sx={{ color: "#FBF8EF" }}>
              Password *
            </InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword("password")}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ color: "#FBF8EF" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password *"
              sx={{
                color: "#FBF8EF",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
              }}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="confirm-password" sx={{ color: "#FBF8EF" }}>
              Confirm Password *
            </InputLabel>
            <OutlinedInput
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword("confirm")}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ color: "#FBF8EF" }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password *"
              sx={{
                color: "#FBF8EF",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
              }}
            />
          </FormControl>

          <Button
            variant="contained"
            onClick={handleRegister}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#FBF8EF",
              color: "#000000",
              "&:hover": {
                bgcolor: "#e0e0e0",
              },
              width: "100%",
            }}
          >
            Register Business
          </Button>

          <Button
            onClick={handleBackToLogin}
            sx={{
              color: "#FBF8EF",
              textDecoration: "underline",
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegister;
