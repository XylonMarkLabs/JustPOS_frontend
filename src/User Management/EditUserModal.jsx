import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Divider,
  Typography,
  Grid,
  Alert
} from '@mui/material'
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useAlert } from '../Components/AlertProvider'

const EditUserModal = ({ open, onClose, onEditUser, user }) => {
  const { showError, showWarning, showSuccess } = useAlert()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmNewPassword: ''
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        role: user.role || '',
        newPassword: '',
        confirmNewPassword: ''
      })
    }
  }, [user, open])

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    })
  }

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
        newPassword: '',
        confirmNewPassword: ''
      };

      // Validate new password (only if provided)
      if (formData.newPassword) {
        const validation = validatePassword(formData.newPassword);
        if (!validation.isValid) {
          newErrors.newPassword = `Password must contain: ${validation.message}`;
        }
      }

      // Validate password confirmation (only if new password is provided)
      if (formData.newPassword && formData.confirmNewPassword && formData.confirmNewPassword !== formData.newPassword) {
        newErrors.confirmNewPassword = 'Passwords do not match';
      }

      setErrors(newErrors);
    };

    validateForm();
  }, [formData.newPassword, formData.confirmNewPassword]);

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.username || !formData.role) {
      showError('Please fill in all required fields', 'Missing Information')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showError('Please enter a valid email address', 'Invalid Email')
      return
    }

    // Password validation (only if new password is provided)
    if (formData.newPassword) {
      if (!validatePassword(formData.newPassword).isValid) {
        showError('Please ensure your password meets all requirements', 'Password Requirements Not Met')
        return
      }
      
      if (formData.newPassword !== formData.confirmNewPassword) {
        showError('Passwords do not match', 'Password Mismatch')
        return
      }
    }

    // Create updated user object
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      username: formData.username,
      role: formData.role,
      initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    
    onEditUser(updatedUser)
    showSuccess(`User "${formData.name}" has been updated successfully!`, 'User Updated')
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      role: '',
      newPassword: '',
      confirmNewPassword: ''
    })
    setErrors({
      newPassword: '',
      confirmNewPassword: ''
    })
    setShowNewPassword(false)
    setShowConfirmNewPassword(false)
    onClose()
  }

  if (!user) return null

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '550px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          Edit User
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Full Name */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
              Full Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange('name')}
              variant="outlined"
              size="small"
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

          {/* Email */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange('email')}
              variant="outlined"
              size="small"
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

          {/* Username and Role */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                Username
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange('username')}
                variant="outlined"
                size="small"
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
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
                Role
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.role}
                  onChange={handleChange('role')}
                  variant="outlined"
                  sx={{
                    backgroundColor: '#f9fafb',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff'
                    }
                  }}
                >
                  <MenuItem value="Cashier">Cashier</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 0 }} />
          
          <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151', mb: 0 }}>
            Change Password (Optional)
          </Typography>

          {/* New Password and Confirm New Password */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
              New Password
            </Typography>
            <TextField
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange('newPassword')}
              variant="outlined"
              size="small"
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      size="small"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
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

          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
              Confirm New Password
            </Typography>
            <TextField
              fullWidth
              type={showConfirmNewPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={formData.confirmNewPassword}
              onChange={handleChange('confirmNewPassword')}
              variant="outlined"
              size="small"
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
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
          {formData.newPassword && !validatePassword(formData.newPassword).isValid && (
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
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#b0a892',
            '&:hover': { backgroundColor: '#e0dac5' },
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            py: 1
          }}
        >
          Update User
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditUserModal
