import React, { useState } from 'react'
import Sidebar from '../Components/Sidebar'
import ReportTabs from './ReportTabs'
import SalesReport from './SalesReport'
import InventoryReport from './InventoryReport'
import { exportReportToPDF } from './reportUtils'
import { salesData, inventoryData } from './reportData'
import {
    Box
} from '@mui/material'

const Reports = () => {
    const [activeTab, setActiveTab] = useState(0)
    const [timePeriod, setTimePeriod] = useState('Last 7 days')

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const handleTimePeriodChange = (event) => {
        setTimePeriod(event.target.value)
    }

    const handleExportReport = () => {
        exportReportToPDF(activeTab)
    }

    return (
        <div className="lg:flex gap-5 p-5">
            <Sidebar />

            <section className="space-y-5 border-primary lg:w-[85%] p-3 bg-background rounded-lg shadow-slate-400 shadow-lg h-[calc(90vh-2.5rem)] flex flex-col">
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Content */}
                    <Box id="report-content" sx={{ flex: 1, overflow: 'auto' }}>
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
                            <SalesReport data={salesData} />
                        ) : (
                            <InventoryReport data={inventoryData} />
                        )}
                    </Box>
                </Box>
            </section>
        </div>
    )
}

export default Reports