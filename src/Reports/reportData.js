// Sample data for Sales Report
export const salesData = {
  totalSales: 12485.5,
  totalOrders: 247,
  avgOrderValue: 50.55,
  salesGrowth: 15.3,
  ordersGrowth: 8.7,
  avgOrderGrowth: 5.2,
  topProducts: [
    { name: 'Coffee - Americano', unitsSold: 156, revenue: 546.00 },
    { name: 'Sandwich - Club', unitsSold: 89, revenue: 800.11 },
    { name: 'Latte', unitsSold: 134, revenue: 569.50 },
    { name: 'Muffin - Blueberry', unitsSold: 67, revenue: 200.33 }
  ]
}

// Sample data for Inventory Report
export const inventoryData = {
  totalProducts: 156,
  lowStock: 8,
  outOfStock: 2,
  totalValue: 15420.75,
  lowStockItems: [
    { name: 'Croissant', currentStock: 8, minimumStock: 10, status: 'Low Stock' },
    { name: 'Water Bottle', currentStock: 5, minimumStock: 20, status: 'Low Stock' },
    { name: 'Muffin - Blueberry', currentStock: 3, minimumStock: 15, status: 'Low Stock' }
  ]
}
