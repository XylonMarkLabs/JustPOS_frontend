import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
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
                className: 'rounded-lg shadow-xl max-w-[400px]'
            }}
        >
            <div className="p-8 bg-secondary flex flex-col items-center">
                <img 
                    src={logo} 
                    alt="JUSTPOS Logo" 
                    className="h-[60px] mb-6" 
                />
                
                <h2 className="text-primary text-2xl font-semibold mb-8">
                    Change Password
                </h2>

                <div className="w-full">
                    <div className="flex flex-col space-y-6">
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPassword.oldPassword ? 'text' : 'password'}
                                    name="oldPassword"
                                    value={passwordForm.oldPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Current Password"
                                    className={`w-full px-4 py-2 bg-[#FBF8EF] border rounded-md focus:outline-none ${
                                        errors.oldPassword 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-gray-700 focus:border-primary'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleClickShowPassword('oldPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword.oldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </button>
                            </div>
                            {errors.oldPassword && (
                                <p className="text-sm text-red-500">{errors.oldPassword}</p>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPassword.newPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="New Password"
                                    className={`w-full px-4 py-2 bg-[#FBF8EF] border rounded-md focus:outline-none ${
                                        errors.newPassword 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-gray-700 focus:border-primary'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleClickShowPassword('newPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">{errors.newPassword}</p>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPassword.confirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm New Password"
                                    className={`w-full px-4 py-2 bg-[#FBF8EF] border rounded-md focus:outline-none ${
                                        errors.confirmPassword 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-gray-700 focus:border-primary'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleClickShowPassword('confirmPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 w-full flex justify-between space-x-4">
                    <button
                        onClick={handleClose}
                        className="min-w-[100px] py-2 px-4 rounded-md border-primary border text-primary hover:bg-primary hover:text-secondary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitPasswordChange}
                        className={`min-w-[140px] py-2 px-6 rounded-md transition-all ${
                            isFormValid()
                                ? 'bg-primary text-secondary hover:brightness-90'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isFormValid()}
                    >
                        Update Password
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default ChangePasswordModal;
