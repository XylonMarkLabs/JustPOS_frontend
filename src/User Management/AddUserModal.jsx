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
  Typography,
  Grid,
  Alert
} from '@mui/material'
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useAlert } from '../Components/AlertProvider'

const AddUserModal = ({ open, onClose, onAddUser }) => {
  const { showError, showWarning, showSuccess } = useAlert()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Cashier'
  })
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
        password: '',
        confirmPassword: ''
      };

      // Validate password
      if (formData.password) {
        const validation = validatePassword(formData.password);
        if (!validation.isValid) {
          newErrors.password = `Password must contain: ${validation.message}`;
        }
      }

      // Validate password confirmation
      if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      setErrors(newErrors);
    };

    validateForm();
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.confirmPassword || !formData.role) {
      showError('Please fill in all required fields', 'Missing Information')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match', 'Password Mismatch')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showError('Please enter a valid email address', 'Invalid Email')
      return
    }

    if (!validatePassword(formData.password).isValid) {
      showError('Please ensure your password meets all requirements', 'Password Requirements Not Met')
      return
    }

    // Create new user object
    const newUser = {
      id: Date.now(), // Simple ID generation
      name: formData.name,
      email: formData.email,
      username: formData.username,
      role: formData.role,
      status: 'Active',
      created: new Date().toLocaleDateString(),
      initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    
    onAddUser(newUser)
    showSuccess(`User "${formData.name}" has been added successfully!`, 'User Added')
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'Cashier'
    })
    setErrors({
      password: '',
      confirmPassword: ''
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          Add New User
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

          {/* Password and Confirm Password */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium', color: '#374151' }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange('password')}
              variant="outlined"
              size="small"
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              variant="outlined"
              size="small"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          {formData.password && !validatePassword(formData.password).isValid && (
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
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddUserModal
