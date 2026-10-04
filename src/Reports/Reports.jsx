import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import ReportTabs from './ReportTabs'
import SalesReport from './SalesReport'
import InventoryReport from './InventoryReport'
import { exportReportToPDF } from './reportUtils'
import { getDateRangeForPeriod } from './reportDateRange'
import ApiCall from '../Services/ApiCall'
import {
    Box,
    CircularProgress
} from '@mui/material'
import AdminPageShell from '../Components/AdminPageShell'

const Reports = () => {
    const [activeTab, setActiveTab] = useState(0)
    const [timePeriod, setTimePeriod] = useState('Last 7 days')

    const [salesData, setSalesData] = useState(null)
    const [salesLoading, setSalesLoading] = useState(true)

    const [inventoryData, setInventoryData] = useState(null)
    const [inventoryLoading, setInventoryLoading] = useState(true)

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const handleTimePeriodChange = (event) => {
        setTimePeriod(event.target.value)
    }

    const handleExportReport = () => {
        const reportData = activeTab === 0 ? salesData : inventoryData
        exportReportToPDF(activeTab, reportData, timePeriod)
    }

    useEffect(() => {
        if (activeTab !== 0) return

        const fetchSalesReport = async () => {
            setSalesLoading(true)
            try {
                const { startDate, endDate } = getDateRangeForPeriod(timePeriod)
                const report = await ApiCall.report.getSalesReport(startDate, endDate)
                setSalesData(report)
            } catch (error) {
                console.error('Error fetching sales report:', error)
                setSalesData(null)
            } finally {
                setSalesLoading(false)
            }
        }

        fetchSalesReport()
    }, [activeTab, timePeriod])

    useEffect(() => {
        if (activeTab !== 1) return

        const fetchInventoryReport = async () => {
            setInventoryLoading(true)
            try {
                const report = await ApiCall.report.getInventoryReport()
                setInventoryData(report)
            } catch (error) {
                console.error('Error fetching inventory report:', error)
                setInventoryData(null)
            } finally {
                setInventoryLoading(false)
            }
        }

        fetchInventoryReport()
    }, [activeTab])

    return (
        <AdminPageShell>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                {/* Content */}
                <Box id="report-content" sx={{ flex: 1, overflow: 'auto', px: { xs: 0.5, sm: 0 } }}>
                    {/* Tabs and Time Period */}
                    <ReportTabs
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        timePeriod={timePeriod}
                        onTimePeriodChange={handleTimePeriodChange}
                        onExportReport={handleExportReport}
                    />

                    {/* Report Content */}
                    {activeTab === 0 ? (
                        salesLoading || !salesData ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 6, sm: 8 } }}>
                                <CircularProgress sx={{ color: '#b0a892' }} />
                            </Box>
                        ) : (
                            <SalesReport data={salesData} />
                        )
                    ) : (
                        inventoryLoading || !inventoryData ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 6, sm: 8 } }}>
                                <CircularProgress sx={{ color: '#b0a892' }} />
                            </Box>
                        ) : (
                            <InventoryReport data={inventoryData} />
                        )
                    )}
                </Box>
            </Box>
        </AdminPageShell>
    )
}

export default Reports