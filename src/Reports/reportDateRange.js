// Converts a ReportTabs time-period label into an ISO startDate/endDate
// pair the backend can filter on. Centralised here so Sales and Inventory
// reports (and anything else added later) compute the same ranges.
export const getDateRangeForPeriod = (period) => {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case 'Last 7 days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'Last 30 days':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case 'Last 3 months':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'Last 6 months':
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case 'Last year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 7);
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};