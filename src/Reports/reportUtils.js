import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const exportReportToPDF = async (activeTab) => {
  const element = document.getElementById('report-content')
  if (element) {
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF()
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    const reportType = activeTab === 0 ? 'Sales' : 'Inventory'
    pdf.save(`${reportType}_Report_${new Date().toLocaleDateString()}.pdf`)
  }
}
