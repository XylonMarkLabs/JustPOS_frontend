import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Typography,
} from '@mui/material';
import logo from '../assets/JUSTPOS_transparent.png';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  const handleLogin = () => {
    axios.post('http://localhost:4000/api/user/login', {
        username: email,
        password: password  
    })
    .then(response => {
        console.log('Login response:', response.data);
    })
    .catch( err => {
        console.error('Login error:', err);
    })
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#292929] via-[#5c5b5a] to-[#FBF8EF]">
      <div className="flex h-1/2 w-auto shadow-md rounded-lg">
        {/* Left Logo Panel */}
        <div className="bg-secondary flex justify-center items-center rounded-l-lg px-5 w-96">
          <div>
            <img src={logo} className="w-full" alt="Logo" />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="bg-primary flex flex-col justify-center items-center rounded-r-lg px-5 w-96">
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                    color: '#FBF8EF',
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    }}
                >
                    Welcome to <span style={{ color: '#FBF8EF',fontFamily:'fantasy' }}>JUSTPOS</span>
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                    color: '#FBF8EF',
                    mt: 1,
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                    }}
                >
                    Powering your sales with speed and simplicity
                </Typography>
                <Box
                    sx={{
                    height: '2px',
                    width: '60px',
                    backgroundColor: '#FBF8EF',
                    margin: '8px auto 0',
                    borderRadius: '4px',
                    }}
                />
                </Box>
            

            {/* Email Input */}
            <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined" color="primary">
                <InputLabel
                htmlFor="outlined-adornment-email"
                sx={{
                    color: '#FBF8EF',
                    '&.Mui-focused': {
                    color: '#FBF8EF',
                    },
                }}
                >
                Email
                </InputLabel>
                <OutlinedInput
                id="outlined-adornment-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                sx={{
                    input: { color: '#FBF8EF' },
                    '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FBF8EF',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FBF8EF',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FBF8EF',
                    },
                }}
                />
            </FormControl>

            {/* Password Input */}
            <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined" color="primary">
                <InputLabel
                htmlFor="outlined-adornment-password"
                sx={{
                    color: '#FBF8EF',
                    '&.Mui-focused': {
                    color: '#FBF8EF',
                    },
                }}
                >
                Password
                </InputLabel>
                <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        aria-label={showPassword ? 'hide password' : 'show password'}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                        color="primary"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                }
                label="Password"
                sx={{
                    input: { color: '#FBF8EF' },
                    '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FBF8EF',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FBF8EF',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FBF8EF',
                    },
                }}
                />
            </FormControl>

            {/* Login Button */}
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, width: '44ch',py:2 }}
                onClick={handleLogin}
            >
                Login
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
