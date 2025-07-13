import React from 'react'
import {
    Box,
    Typography,
    Button
} from '@mui/material'
import {
    Download as DownloadIcon
} from '@mui/icons-material'

const ReportHeader = ({ onExportReport, title = "Reports" }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                {title}
            </Typography>
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

export default ReportHeader
