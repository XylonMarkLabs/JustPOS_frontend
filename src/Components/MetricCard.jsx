import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material'

const MetricCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <Card sx={{ 
      height: '100%',
      width: '100%',
      minWidth: 250,
      '&:hover': { 
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: (theme) => theme.palette[color].main + '20',
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MetricCard
