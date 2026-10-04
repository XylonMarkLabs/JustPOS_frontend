import React, { useContext } from "react";
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
import { useAlert } from "../Components/AlertProvider";
import logo from "../assets/JUSTPOS_transparent.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApiCall, { baseURL } from "../Services/ApiCall";
import { AuthContext } from "../Services/AuthContext";

const ROLE_HOME_PATH = {
  Admin: "/admin/dashboard",
  Manager: "/manager/dashboard",
  Cashier: "/cashier",
};

const fieldSx = {
  m: 1,
  width: "100%",
  maxWidth: 360,
};

const Login = () => {
  const { showError, showSuccess, showInfo } = useAlert();
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/user/login`,
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );

      if (!response.data.success) {
        showError("Login failed: " + response.data.message);
        return;
      }

      const fullUser = await ApiCall.user.getUserData();

      if (!fullUser || !fullUser.role) {
        showError(
          "Login succeeded but we couldn't load your account details. Please try again."
        );
        return;
      }

      localStorage.setItem("user", JSON.stringify({ username: fullUser.username, role: fullUser.role }));

      login(fullUser);

      const destination = ROLE_HOME_PATH[fullUser.role] || "/";
      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      showError(
        "Login failed: " +
          (err.response ? err.response.data.message : "Network error")
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r from-[#292929] via-[#5c5b5a] to-[#FBF8EF] px-4 py-8">
      <div className="flex flex-col md:flex-row h-auto md:h-[500px] lg:h-[500px] w-full max-w-sm md:max-w-3xl shadow-md rounded-lg overflow-hidden">
        {/* Logo Panel */}
        <div className="bg-secondary flex justify-center items-center p-6 md:p-5 w-full md:w-96">
          <img
            src={logo}
            className="w-40 sm:w-52 md:w-full"
            alt="Logo"
          />
        </div>

        {/* Form Panel */}
        <div className="bg-primary flex flex-col justify-center items-center px-6 sm:px-8 md:px-5 py-8 md:py-5 w-full md:w-96">
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#FBF8EF",
                fontWeight: "bold",
                letterSpacing: 1,
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
              }}
            >
              Welcome to{" "}
              <span style={{ color: "#FBF8EF", fontFamily: "fantasy" }}>
                JUSTPOS
              </span>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#FBF8EF",
                mt: 1,
                fontStyle: "italic",
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
              }}
            >
              Powering your sales with speed and simplicity
            </Typography>
            <Box
              sx={{
                height: "2px",
                width: "60px",
                backgroundColor: "#FBF8EF",
                margin: "8px auto 0",
                borderRadius: "4px",
              }}
            />
          </Box>

          {/* Username Input */}
          <FormControl
            sx={fieldSx}
            variant="outlined"
            color="primary"
          >
            <InputLabel
              htmlFor="outlined-adornment-username"
              sx={{
                color: "#FBF8EF",
                "&.Mui-focused": {
                  color: "#FBF8EF",
                },
              }}
            >
              Username
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              sx={{
                input: { color: "#FBF8EF" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
              }}
            />
          </FormControl>

          {/* Password Input */}
          <FormControl
            sx={fieldSx}
            variant="outlined"
            color="primary"
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{
                color: "#FBF8EF",
                "&.Mui-focused": {
                  color: "#FBF8EF",
                },
              }}
            >
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "hide password" : "show password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    color="secondary"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              sx={{
                input: { color: "#FBF8EF" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBF8EF",
                },
              }}
            />
          </FormControl>

          {/* Login Button */}
          <Button
            variant="contained"
            color="secondary"
            sx={{ ...fieldSx, mt: 2, py: 2 }}
            onClick={handleLogin}
          >
            <Typography variant="button" sx={{ color: "black", fontWeight: "bold" , fontSize: "1.1rem" }}>
              Login
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;