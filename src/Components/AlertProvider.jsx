import React, { createContext, useContext, useState } from 'react'
import { 
  Snackbar, 
  Alert, 
  AlertTitle,
  Slide
} from '@mui/material'

const AlertContext = createContext()

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

function SlideTransition(props) {
  return <Slide {...props} direction="down" />
}

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([])

  const showAlert = (message, severity = 'info', title = null, duration = 6000) => {
    const id = Date.now() + Math.random()
    const alert = {
      id,
      message,
      severity,
      title,
      duration,
      open: true
    }
    
    setAlerts(prev => [...prev, alert])

    // Auto-hide alert after duration
    if (duration > 0) {
      setTimeout(() => {
        hideAlert(id)
      }, duration)
    }

    return id
  }

  const hideAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const handleClose = (id) => {
    hideAlert(id)
  }

  // Convenience methods for different alert types
  const showSuccess = (message, title = null, duration = 4000) => 
    showAlert(message, 'success', title, duration)

  const showError = (message, title = null, duration = 6000) => 
    showAlert(message, 'error', title, duration)

  const showWarning = (message, title = null, duration = 5000) => 
    showAlert(message, 'warning', title, duration)

  const showInfo = (message, title = null, duration = 4000) => 
    showAlert(message, 'info', title, duration)

  const value = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
      
      {/* Render all alerts */}
      {alerts.map((alert, index) => (
        <Snackbar
          key={alert.id}
          open={alert.open}
          onClose={() => handleClose(alert.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ 
            vertical: 'top', 
            horizontal: 'right' 
          }}
          sx={{
            mt: index * 7, // Stack alerts vertically
            zIndex: 9999
          }}
        >
          <Alert
            onClose={() => handleClose(alert.id)}
            severity={alert.severity}
            variant="filled"
            sx={{
              width: '100%',
              minWidth: 300,
              maxWidth: 500,
              boxShadow: 3,
              '& .MuiAlert-message': {
                fontSize: '0.875rem',
                lineHeight: 1.4
              }
            }}
          >
            {alert.title && (
              <AlertTitle sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {alert.title}
              </AlertTitle>
            )}
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </AlertContext.Provider>
  )
}

export default AlertProvider
