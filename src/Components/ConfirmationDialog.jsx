import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Typography
} from '@mui/material'

const ConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default' // 'default', 'warning', 'danger'
}) => {
  const getThemeColors = () => {
    switch (type) {
      case 'danger':
        return {
          titleColor: '#dc2626',
          buttonBg: '#dc2626',
          buttonHover: '#b91c1c'
        }
      case 'warning':
        return {
          titleColor: '#f59e0b',
          buttonBg: '#f59e0b',
          buttonHover: '#d97706'
        }
      default:
        return {
          titleColor: '#2563eb',
          buttonBg: '#2563eb',
          buttonHover: '#1d4ed8'
        }
    }
  }

  const themeColors = getThemeColors()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          m: { xs: 2, sm: 4 },
          width: { xs: 'calc(100% - 32px)', sm: '100%' },
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', color: themeColors.titleColor, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}
        >
          {title}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
        <DialogContentText
          sx={{ color: '#374151', fontSize: { xs: '0.875rem', sm: '1rem' }, lineHeight: 1.6 }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: 1,
          gap: 1,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
        }}
      >
        <Button
          onClick={onClose}
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
            py: 1,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: themeColors.buttonBg,
            '&:hover': { backgroundColor: themeColors.buttonHover },
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            py: 1,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog