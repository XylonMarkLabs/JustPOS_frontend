import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Chip,
    useTheme
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/JUSTPOS_transparent.png';
import ChangePasswordModal from './ChangePasswordModal';
import AuthService from '../Services/AuthService';

const Navbar = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
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
        setPasswordForm({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setError('');
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitPasswordChange = () => {
        // Validate passwords
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        // TODO: Add API call to change password here
        console.log('Password change submitted:', passwordForm);
        handlePasswordModalClose();
    };

    const handleLogout = () => {
        AuthService.logout();
        handleClose();
    }

    return (
        <div className='px-5 pt-2'>
            <AppBar position="static" sx={{ borderRadius: '8px', backgroundColor:'#FBF8EF', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
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
