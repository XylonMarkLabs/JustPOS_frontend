import React from 'react'
import {
  Box,
  Tab,
  Tabs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material'
import {
  Download as DownloadIcon
} from '@mui/icons-material'

const ReportTabs = ({ 
  activeTab, 
  onTabChange, 
  timePeriod, 
  onTimePeriodChange,
  onExportReport 
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={onTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'medium',
              minWidth: 'auto',
              px: 3
            }
          }}
        >
          <Tab label="Sales Report" />
          <Tab label="Inventory Report" />
        </Tabs>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timePeriod}
            label="Time Period"
            onChange={onTimePeriodChange}
            size="small"
          >
            <MenuItem value="Last 7 days">Last 7 days</MenuItem>
            <MenuItem value="Last 30 days">Last 30 days</MenuItem>
            <MenuItem value="Last 3 months">Last 3 months</MenuItem>
            <MenuItem value="Last 6 months">Last 6 months</MenuItem>
            <MenuItem value="Last year">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={onExportReport}
        sx={{
          bgcolor: '#b0a892',
          '&:hover': { bgcolor: '#e0dac5' },
          textTransform: 'none',
          fontWeight: 'medium',
          px: 3
        }}
      >
        Export Report
      </Button>
    </Box>
  )
}

export default ReportTabs
