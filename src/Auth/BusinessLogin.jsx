import React, { useState, useContext } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAlert } from "../Components/AlertProvider";
import { AuthContext } from "../Services/AuthContext";
import logo from "../assets/JUSTPOS_transparent.png";
import axios from "axios";

const BusinessLogin = () => {
  const { showError, showSuccess } = useAlert();
  const navigate = useNavigate();
  const { selectBusiness } = useContext(AuthContext);
  const [businessId, setBusinessId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleBusinessLogin = async () => {
    if (!businessId || !password) {
      showError("Business ID and password are required");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/business/login`,
        {
          businessEmail: businessId,
          password: password,
        }
      );

      if (response.data.success) {
        const businessData = response.data.business;
        localStorage.setItem("businessId", businessId);
        localStorage.setItem("businessData", JSON.stringify(businessData));
        if (selectBusiness) {
          selectBusiness(businessData);
        }
        showSuccess("Business login successful!");
        navigate("/user-login");
      } else {
        showError("Business verification failed: " + response.data.message);
      }
    } catch (err) {
      console.error("Business verification error:", err);
      showError(
        "Verification failed: " +
          (err.response ? err.response.data.message : "Network error")
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#292929] via-[#5c5b5a] to-[#FBF8EF]">
      <div className="flex h-3/4 w-auto shadow-md rounded-lg">
        <div className="bg-secondary flex justify-center items-center rounded-l-lg px-5 w-96">
          <div>
            <img src={logo} className="w-full" alt="Logo" />
          </div>
        </div>

        <div className="bg-primary flex flex-col justify-center items-center rounded-r-lg px-5 mx- w-96">
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#FBF8EF",
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              Business Login
            </Typography>
          </Box>

          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="business-id" sx={{ color: "#FBF8EF" }}>
              Business ID
            </InputLabel>
            <OutlinedInput
              id="business-id"
              type="text"
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
              label="Business ID"
              sx={{
                color: "#FBF8EF",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
              }}
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="business-password" sx={{ color: "#FBF8EF" }}>
              Business Password
            </InputLabel>
            <OutlinedInput
              id="business-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ color: "#FBF8EF" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Business Password"
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
            onClick={handleBusinessLogin}
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
            Continue
          </Button>

          <Typography
            variant="body2"
            sx={{
              color: "#FBF8EF",
              mt: 2,
              textAlign: "center",
            }}
          >
            Don't have a business account?{" "}
            <Button
              onClick={() => navigate("/register-business")}
              sx={{
                color: "#FBF8EF",
                textDecoration: "underline",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Register here
            </Button>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default BusinessLogin;
