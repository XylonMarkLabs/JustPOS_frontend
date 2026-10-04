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
      '&:hover': {
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
      }
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
          <Box sx={{
            p: { xs: 1, sm: 1.5 },
            borderRadius: 2,
            bgcolor: (theme) => theme.palette[color].main + '20',
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            '& svg': {
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            },
          }}>
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#1a1a1a',
                mb: 0.5,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                wordBreak: 'break-word',
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MetricCard