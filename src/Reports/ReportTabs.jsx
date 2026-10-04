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
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 1.5, md: 2 },
        mb: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1.5, sm: 2 },
          minWidth: 0,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: { xs: 40, sm: 48 },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'medium',
              minWidth: 'auto',
              minHeight: { xs: 40, sm: 48 },
              px: { xs: 2, sm: 3 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }
          }}
        >
          <Tab label="Sales Report" />
          <Tab label="Inventory Report" />
        </Tabs>

        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
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
        fullWidth={false}
        sx={{
          bgcolor: '#b0a892',
          '&:hover': { bgcolor: '#e0dac5' },
          textTransform: 'none',
          fontWeight: 'medium',
          px: 3,
          width: { xs: '100%', md: 'auto' },
          flexShrink: 0,
        }}
      >
        Export Report
      </Button>
    </Box>
  )
}

export default ReportTabs