import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Chip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/JUSTPOS_transparent.png';
import ChangePasswordModal from './ChangePasswordModal';
import { AuthContext } from '../Services/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    const { user, logout } = useContext(AuthContext);
    const role = user?.role;

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePasswordModalOpen = () => {
        handleClose();
        setOpenPasswordModal(true);
    };

    const handlePasswordModalClose = () => {
        setOpenPasswordModal(false);
    };

    const handleLogout = async () => {
        handleClose();
        await logout();
        navigate('/', { replace: true });
    }

    return (
        <div className='px-5 pt-2'>
            <AppBar position="static" sx={{ borderRadius: '8px', backgroundColor: '#FBF8EF', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="JUSTPOS Logo" style={{ height: 45 }} />
                    </Box>

                    {/* Account Icon */}
                    <Box>
                        <Chip label={role || 'Guest'} color="warning" variant="outlined" />
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar>
                                {role ? role.charAt(0).toUpperCase() : 'G'}
                            </Avatar>
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
                            <MenuItem onClick={handlePasswordModalOpen}>Change Password</MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                                <LogoutIcon sx={{ mr: 1 }} />Logout
                            </MenuItem>
                        </Menu>

                        <ChangePasswordModal
                            open={openPasswordModal}
                            onClose={handlePasswordModalClose}
                            logo={logo}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;