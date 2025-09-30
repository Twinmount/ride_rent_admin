import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AdminEnquiry } from '@/types/api-types/API-types';
import { adminEnquiryUtils } from './adminEnquiryUtils';

export interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
  includeTimestamp?: boolean;
}

/**
 * Export enquiries data to Excel file
 */
export const exportEnquiriesToExcel = (
  enquiries: AdminEnquiry[],
  options: ExcelExportOptions = {}
) => {
  const {
    filename = 'enquiries-export',
    sheetName = 'Enquiries',
    includeTimestamp = true,
  } = options;

  try {
    // Prepare data for Excel export
    const exportData = enquiries.map((enquiry, index) => ({
      'S.No': index + 1,
      'Company Name': enquiry.agent.companyName || 'N/A',
      'Agent Email': enquiry.agent.email || 'N/A',
      'Customer Name': enquiry.user.name,
      'Customer Email': enquiry.user.email || 'N/A',
      'Customer Phone': enquiry.user.phone,
      'Vehicle Name': enquiry.vehicle.name,
      'Vehicle Code': enquiry.vehicle.vehicleCode || 'N/A',
      'Vehicle Location': enquiry.vehicle.location,
      'Car Link': enquiry.vehicle.carLink 
        ? adminEnquiryUtils.getFullCarLink(enquiry) 
        : 'N/A',
      'Status': adminEnquiryUtils.formatStatus(enquiry.status).label,
      'Message': enquiry.message || 'N/A',
      'Rental Start Date': enquiry.rentalStartDate 
        ? adminEnquiryUtils.formatDate(enquiry.rentalStartDate)
        : 'N/A',
      'Rental End Date': enquiry.rentalEndDate 
        ? adminEnquiryUtils.formatDate(enquiry.rentalEndDate)
        : 'N/A',
      'Is Masked': enquiry.isMasked ? 'Yes' : 'No',
      'Created Date': adminEnquiryUtils.formatDateTime(enquiry.createdAt),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 8 },   // S.No
      { wch: 20 },  // Company Name
      { wch: 25 },  // Agent Email
      { wch: 20 },  // Customer Name
      { wch: 25 },  // Customer Email
      { wch: 15 },  // Customer Phone
      { wch: 25 },  // Vehicle Name
      { wch: 12 },  // Vehicle Code
      { wch: 15 },  // Vehicle Location
      { wch: 40 },  // Car Link
      { wch: 12 },  // Status
      { wch: 30 },  // Message
      { wch: 15 },  // Rental Start Date
      { wch: 15 },  // Rental End Date
      { wch: 10 },  // Is Masked
      { wch: 18 },  // Created Date
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });

    // Create filename with timestamp if requested
    const timestamp = includeTimestamp 
      ? `_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}`
      : '';
    const finalFilename = `${filename}${timestamp}.xlsx`;

    // Save the file
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(data, finalFilename);

    return {
      success: true,
      filename: finalFilename,
      recordCount: enquiries.length,
    };
  } catch (error) {
    console.error('Excel export failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Export enquiry summary/statistics to Excel
 */
export const exportEnquiryStatsToExcel = (
  stats: any,
  statusCounts: Record<string, number>,
  options: ExcelExportOptions = {}
) => {
  const {
    filename = 'enquiry-stats-export',
    includeTimestamp = true,
  } = options;

  try {
    // Prepare summary data
    const summaryData = [
      { Metric: 'Total Enquiries', Value: stats.total },
      { Metric: 'New Enquiries', Value: stats.newEnquiries },
      { Metric: 'Contacted Enquiries', Value: stats.contactedEnquiries },
      { Metric: 'Cancelled Enquiries', Value: stats.cancelledEnquiries },
      { Metric: 'Declined Enquiries', Value: stats.declinedEnquiries },
      { Metric: 'Agent View Enquiries', Value: stats.agentviewEnquiries },
      { Metric: 'Expired Enquiries', Value: stats.expiredEnquiries },
    ];

    // Prepare status breakdown data
    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      Status: adminEnquiryUtils.formatStatus(status).label,
      Count: count,
      Percentage: stats.total > 0 ? `${((count / stats.total) * 100).toFixed(1)}%` : '0%',
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add summary sheet
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Add status breakdown sheet
    const statusSheet = XLSX.utils.json_to_sheet(statusData);
    statusSheet['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, statusSheet, 'Status Breakdown');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });

    // Create filename with timestamp if requested
    const timestamp = includeTimestamp 
      ? `_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}`
      : '';
    const finalFilename = `${filename}${timestamp}.xlsx`;

    // Save the file
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(data, finalFilename);

    return {
      success: true,
      filename: finalFilename,
      recordCount: summaryData.length,
    };
  } catch (error) {
    console.error('Stats export failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
