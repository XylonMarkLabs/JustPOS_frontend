import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/JUSTPOS_transparent.png';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{px: 4,  }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' ,}}>
                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="JUSTPOS Logo" style={{ height: 45 }} />
                </Box>

                {/* Account Icon */}
                <Box>
                    <Chip label='Cashier' color='warning' variant="outlined"/>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                    <Avatar>C</Avatar>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Change Password</MenuItem>
                        <MenuItem onClick={handleClose} sx={{ color: 'red' }}>
                        <LogoutIcon sx={{ mr: 1 }} />Logout
                        </MenuItem>

                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        </Box>
    );
};

export default Navbar;
