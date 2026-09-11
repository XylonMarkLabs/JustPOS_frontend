import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const BRAND_COLOR = [176, 168, 146]
const TEXT_DARK = [30, 41, 59]
const TEXT_MUTED = [107, 114, 128]

const money = (value) => {
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const addLetterhead = (doc, reportTitle, subtitle) => {
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(...TEXT_DARK)
  doc.text('JustPOS', 14, 18)

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(...TEXT_MUTED)
  doc.text('123 Business Street, City, State 12345', 14, 24)
  doc.text('Phone: (555) 123-4567 | Email: info@justpos.com', 14, 29)

  doc.setDrawColor(...BRAND_COLOR)
  doc.setLineWidth(0.6)
  doc.line(14, 33, pageWidth - 14, 33)

  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(...TEXT_DARK)
  doc.text(reportTitle, 14, 42)

  doc.setFontSize(9)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(...TEXT_MUTED)
  doc.text(subtitle, 14, 48)

  return 56 // y-position where content can start
}

// Renders a row of "metric cards" as a borderless table — label on top,
// bold value below, evenly spaced across the page width.
const addMetricsRow = (doc, startY, metrics) => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const usableWidth = pageWidth - 28
  const colWidth = usableWidth / metrics.length

  metrics.forEach((metric, index) => {
    const x = 14 + index * colWidth

    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...TEXT_MUTED)
    doc.text(metric.label.toUpperCase(), x, startY)

    doc.setFontSize(13)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...TEXT_DARK)
    doc.text(metric.value, x, startY + 7)
  })

  return startY + 16
}

const addFooters = (doc) => {
  const pageCount = doc.internal.getNumberOfPages()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...TEXT_MUTED)
    doc.text(
      `Generated ${new Date().toLocaleString()}`,
      14,
      pageHeight - 10
    )
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 14,
      pageHeight - 10,
      { align: 'right' }
    )
  }
}

const buildSalesReportPDF = (doc, data, timePeriod) => {
  let y = addLetterhead(doc, 'Sales Report', `Period: ${timePeriod}`)

  y = addMetricsRow(doc, y, [
    { label: 'Total Sales', value: `Rs.${money(data.totalSales)}` },
    { label: 'Total Orders', value: String(data.totalOrders) },
    { label: 'Avg Order Value', value: `Rs.${money(data.avgOrderValue)}` },
    { label: 'Total Profit', value: `Rs.${money(data.totalProfit)}` },
  ])

  if (data.totalDiscountGiven > 0) {
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...TEXT_MUTED)
    doc.text(`Rs.${money(data.totalDiscountGiven)} given in discounts over this period`, 14, y)
    y += 8
  }

  doc.setFontSize(11)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(...TEXT_DARK)
  doc.text('Top Selling Products', 14, y + 4)

  autoTable(doc, {
    startY: y + 8,
    head: [['Product', 'Units Sold', 'Revenue']],
    body: (data.topProducts || []).map((p) => [
      p.name,
      String(p.unitsSold),
      `Rs.${money(p.revenue)}`,
    ]),
    headStyles: { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
    margin: { left: 14, right: 14 },
  })
}

const buildInventoryReportPDF = (doc, data) => {
  let y = addLetterhead(
    doc,
    'Inventory Report',
    `Snapshot as of ${new Date().toLocaleString()}`
  )

  y = addMetricsRow(doc, y, [
    { label: 'Total Products', value: String(data.totalProducts) },
    { label: 'Low Stock', value: String(data.lowStock) },
    { label: 'Out of Stock', value: String(data.outOfStock) },
    { label: 'Total Value (cost)', value: `Rs.${money(data.totalValue)}` },
  ])

  doc.setFontSize(11)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(...TEXT_DARK)
  doc.text('Low Stock Alert', 14, y + 4)

  autoTable(doc, {
    startY: y + 8,
    head: [['Product', 'Current Stock', 'Minimum Stock', 'Status']],
    body: (data.lowStockItems || []).map((item) => [
      item.name,
      String(item.currentStock),
      String(item.minimumStock),
      item.status,
    ]),
    headStyles: { fillColor: BRAND_COLOR, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
    margin: { left: 14, right: 14 },
    didParseCell: (hookData) => {
      // Colour the Status column to match the on-screen chip colours.
      if (hookData.section === 'body' && hookData.column.index === 3) {
        const status = hookData.cell.raw
        if (status === 'Out of Stock' || status === 'Critical') {
          hookData.cell.styles.textColor = [153, 27, 27]
        } else if (status === 'Low Stock') {
          hookData.cell.styles.textColor = [154, 52, 18]
        }
      }
    },
  })
}

// activeTab: 0 = Sales, 1 = Inventory
// data: the same salesData / inventoryData object already held in Reports.jsx state
// timePeriod: only meaningful for Sales (Inventory is always a live snapshot)
export const exportReportToPDF = (activeTab, data, timePeriod) => {
  if (!data) {
    console.warn('No report data available to export yet')
    return
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  if (activeTab === 0) {
    buildSalesReportPDF(doc, data, timePeriod)
  } else {
    buildInventoryReportPDF(doc, data)
  }

  addFooters(doc)

  const reportType = activeTab === 0 ? 'Sales' : 'Inventory'
  doc.save(`${reportType}_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
}