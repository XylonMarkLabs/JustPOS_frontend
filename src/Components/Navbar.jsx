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
        <div className='px-2 sm:px-5 pt-2'>
            <AppBar
                position="static"
                sx={{
                    borderRadius: '8px',
                    backgroundColor: '#FBF8EF',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        minHeight: { xs: 56, sm: 64 },
                        px: { xs: 1.5, sm: 2 },
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                        <img
                            src={logo}
                            alt="JUSTPOS Logo"
                            style={{ height: 32 }}
                            className="sm:!h-10 md:!h-[45px]"
                        />
                    </Box>

                    {/* Account Icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
                        <Chip
                            label={role || 'Guest'}
                            color="warning"
                            variant="outlined"
                            size="small"
                            sx={{
                                display: { xs: 'none', sm: 'inline-flex' },
                                fontSize: { sm: '0.75rem', md: '0.8125rem' },
                            }}
                        />
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            sx={{ p: { xs: 0.5, sm: 1 } }}
                        >
                            <Avatar
                                sx={{
                                    width: { xs: 32, sm: 40 },
                                    height: { xs: 32, sm: 40 },
                                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                                }}
                            >
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
                            <MenuItem
                                sx={{ display: { xs: 'flex', sm: 'none' }, pointerEvents: 'none' }}
                            >
                                <Chip
                                    label={role || 'Guest'}
                                    color="warning"
                                    variant="outlined"
                                    size="small"
                                />
                            </MenuItem>
                            <MenuItem onClick={handlePasswordModalOpen}>Change Password</MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                                <LogoutIcon sx={{ mr: 1 }} fontSize="small" />Logout
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