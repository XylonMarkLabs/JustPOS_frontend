import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const ChangePasswordModal = ({ open, onClose, logo }) => {
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const handleClickShowPassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handlePasswordChange = (field) => (event) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const validatePassword = (password) => {
        const validations = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const messages = [];
        if (!validations.length) messages.push('At least 8 characters');
        if (!validations.uppercase) messages.push('One uppercase letter');
        if (!validations.lowercase) messages.push('One lowercase letter');
        if (!validations.number) messages.push('One number');
        if (!validations.special) messages.push('One special character');

        return {
            isValid: Object.values(validations).every(Boolean),
            message: messages.join(', ')
        };
    };

    useEffect(() => {
        const validateForm = () => {
            const newErrors = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            };

            // Validate old password
            if (passwordForm.oldPassword && passwordForm.oldPassword.length < 1) {
                newErrors.oldPassword = 'Current password is required';
            }

            // Validate new password
            if (passwordForm.newPassword) {
                const validation = validatePassword(passwordForm.newPassword);
                if (!validation.isValid) {
                    newErrors.newPassword = `Password must contain: ${validation.message}`;
                }
            }

            // Validate password confirmation
            if (passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }

            setErrors(newErrors);
        };

        validateForm();
    }, [passwordForm]);

    const handleClose = () => {
        setPasswordForm({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        onClose();
    };

    const isFormValid = () => {
        return (
            passwordForm.oldPassword.length > 0 &&
            validatePassword(passwordForm.newPassword).isValid &&
            passwordForm.newPassword === passwordForm.confirmPassword
        );
    };

    const handleSubmitPasswordChange = () => {
        if (!isFormValid()) {
            return;
        }
        // TODO: Add API call to change password here
        console.log('Password change submitted:', passwordForm);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    minHeight: '400px'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1, pt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {logo && (
                    <Box sx={{ mb: 2 }}>
                        <img 
                            src={logo} 
                            alt="JUSTPOS Logo" 
                            style={{ height: '60px', objectFit: 'contain' }}
                        />
                    </Box>
                )}
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                    Change Password
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Current Password */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                            Current Password
                        </Typography>
                        <TextField
                            fullWidth
                            type={showPassword.oldPassword ? 'text' : 'password'}
                            placeholder="Enter current password"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordChange('oldPassword')}
                            variant="outlined"
                            size="small"
                            error={!!errors.oldPassword}
                            helperText={errors.oldPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleClickShowPassword('oldPassword')}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword.oldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#f9fafb',
                                    height: '40px',
                                    '&:hover': {
                                        backgroundColor: '#f3f4f6'
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#fff'
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* New Password */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                            New Password
                        </Typography>
                        <TextField
                            fullWidth
                            type={showPassword.newPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange('newPassword')}
                            variant="outlined"
                            size="small"
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleClickShowPassword('newPassword')}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#f9fafb',
                                    height: '40px',
                                    '&:hover': {
                                        backgroundColor: '#f3f4f6'
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#fff'
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* Confirm New Password */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                            Confirm New Password
                        </Typography>
                        <TextField
                            fullWidth
                            type={showPassword.confirmPassword ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange('confirmPassword')}
                            variant="outlined"
                            size="small"
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => handleClickShowPassword('confirmPassword')}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#f9fafb',
                                    height: '40px',
                                    '&:hover': {
                                        backgroundColor: '#f3f4f6'
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#fff'
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* Password Requirements Alert */}
                    {passwordForm.newPassword && !validatePassword(passwordForm.newPassword).isValid && (
                        <Alert severity="info" sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                                Password Requirements:
                            </Typography>
                            <Typography variant="body2" component="div">
                                • At least 8 characters<br />
                                • One uppercase letter<br />
                                • One lowercase letter<br />
                                • One number<br />
                                • One special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                            </Typography>
                        </Alert>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        color: '#6b7280',
                        borderColor: '#d1d5db',
                        '&:hover': {
                            borderColor: '#9ca3af',
                            backgroundColor: '#f9fafb'
                        },
                        textTransform: 'none',
                        fontWeight: 'medium',
                        px: 3,
                        py: 1
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmitPasswordChange}
                    variant="contained"
                    disabled={!isFormValid()}
                    sx={{
                        backgroundColor: '#b0a892',
                        '&:hover': { backgroundColor: '#e0dac5' },
                        '&:disabled': {
                            backgroundColor: '#d1d5db',
                            color: '#9ca3af'
                        },
                        textTransform: 'none',
                        fontWeight: 'bold',
                        px: 3,
                        py: 1
                    }}
                >
                    Update Password
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordModal;
