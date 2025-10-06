"use client";

import { useState } from "react";
import {
  EnquiryStatsCards,
  EnquiryFilters,
  EnquiryTable,
  ExportConfirmationModal,
} from "@/components/enquiry";
import { DataTablePagination } from "@/components/common";
import { useAdminEnquiryManagement } from "@/hooks/useAdminEnquiryManagement";
import { adminEnquiryUtils } from "@/utils/adminEnquiryUtils";
import {
  exportEnquiriesToExcel,
  exportEnquiryStatsToExcel,
} from "@/utils/excelExport";
import { AdminEnquiry } from "@/types/api-types/API-types";
import { ExportOptions } from "@/components/enquiry/ExportConfirmationModal";
import { toast } from "@/components/ui/use-toast";

export default function AdminEnquiriesPageNew() {
  const {
    filteredEnquiries,
    pagination,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    locationFilter,
    setLocationFilter,
    currentPage,
    setCurrentPage,
    clearFilters,
    refetch,
    uniqueVehicleLocations,
    statusCounts,
  } = useAdminEnquiryManagement({
    page: 1,
    limit: 20,
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialFilters: {
      statusFilter: "all", // Set default to "all" instead of empty string
      locationFilter: "all", // Add default location filter
    },
  });

  console.log("filteredEnquiries: ", filteredEnquiries);
  console.log("statusCounts from API: ", statusCounts);

  // Use API status counts directly (already calculated in the hook)
  const stats = {
    total:
      statusCounts.NEW +
      statusCounts.CONTACTED +
      statusCounts.CANCELLED +
      statusCounts.DECLINED +
      statusCounts.AGENTVIEW +
      statusCounts.EXPIRED,
    newEnquiries: statusCounts.NEW || 0,
    contactedEnquiries: statusCounts.CONTACTED || 0,
    cancelledEnquiries: statusCounts.CANCELLED || 0,
    declinedEnquiries: statusCounts.DECLINED || 0,
    agentviewEnquiries: statusCounts.AGENTVIEW || 0,
    expiredEnquiries: statusCounts.EXPIRED || 0,
  };

  const [revealedPhones, setRevealedPhones] = useState<{
    [key: string]: boolean;
  }>({});
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const togglePhoneVisibility = (enquiryId: string) => {
    setRevealedPhones((prev) => ({
      ...prev,
      [enquiryId]: !prev[enquiryId],
    }));
  };

  const handleExportToExcel = async () => {
    // Check if there's data to export
    if (filteredEnquiries.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data to Export",
        description:
          "No enquiries to export. Please check your filters or data.",
      });
      return;
    }

    // Open the export confirmation modal
    setIsExportModalOpen(true);
  };

  const handleExportConfirm = async (options: ExportOptions) => {
    try {
      console.log("Exporting enquiries to Excel...");

      // Use filtered enquiries for export to respect current filters
      const dataToExport =
        filteredEnquiries.length > 0 ? filteredEnquiries : [];

      let exportResults: string[] = [];

      // Export main enquiries data if selected
      if (options.exportEnquiries) {
        const result = exportEnquiriesToExcel(dataToExport, {
          filename: "admin-enquiries-export",
          includeTimestamp: true,
        });

        if (result.success) {
          console.log(
            `✅ Successfully exported ${result.recordCount} enquiries to ${result.filename}`,
          );
          exportResults.push(`✅ Exported ${result.recordCount} enquiries`);
        } else {
          console.error("❌ Export failed:", result.error);
          throw new Error(`Export failed: ${result.error}`);
        }
      }

      // Export statistics if selected
      if (options.exportStatistics) {
        const statsResult = exportEnquiryStatsToExcel(stats, statusCounts, {
          filename: "admin-enquiry-statistics",
          includeTimestamp: true,
        });

        if (statsResult.success) {
          console.log(
            `✅ Successfully exported statistics to ${statsResult.filename}`,
          );
          exportResults.push(`✅ Exported summary statistics`);
        } else {
          console.error("❌ Failed to export statistics:", statsResult.error);
          throw new Error(`Statistics export failed: ${statsResult.error}`);
        }
      }

      // Show success toast notification
      if (exportResults.length > 0) {
        console.log("✅ Export completed successfully");
        toast({
          title: "Export Completed Successfully",
          description: exportResults.join("\n"),
          variant: "default",
        });
      }
    } catch (error) {
      console.error("❌ Export error:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description:
          "An unexpected error occurred during export. Please try again.",
      });
    }
  };

  const handleVehicleClick = (enquiry: AdminEnquiry) => {
    if (enquiry.vehicle.carLink) {
      adminEnquiryUtils.openCarLink(enquiry);
    } else {
      console.log("Navigate to vehicle:", enquiry.vehicle.name);
      // Fallback navigation implementation would go here
    }
  };

  const handleStatusChange = (enquiry: AdminEnquiry) => {
    console.log("Change status for enquiry:", enquiry._id);
    // Implementation for status change would go here
  };

  return (
    <main className="flex-1 p-6">
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <span className="ml-2">Loading enquiries...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <h3 className="font-medium text-red-800">
              Error loading enquiries
            </h3>
            <p className="mt-1 text-sm text-red-600">
              {error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !isError && (
          <>
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Enquiry Management
                </h1>
                <p className="text-muted-foreground">
                  Manage customer enquiries and booking requests.
                </p>
              </div>
            </div>

            <EnquiryFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              uniqueVehicleLocations={uniqueVehicleLocations}
              clearFilters={clearFilters}
              onExport={handleExportToExcel}
              searchPlaceholder="Search agents, cars or customers..."
            />

            <EnquiryStatsCards
              totalCount={stats.total}
              pendingCount={stats.newEnquiries}
              acceptedCount={stats.contactedEnquiries}
              cancelledCount={stats.cancelledEnquiries}
              expiredCount={stats.expiredEnquiries}
            />

            <EnquiryTable
              enquiries={filteredEnquiries}
              revealedPhones={revealedPhones}
              onTogglePhoneVisibility={togglePhoneVisibility}
              onVehicleClick={handleVehicleClick}
              onStatusChange={handleStatusChange}
            />

            <DataTablePagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Export Confirmation Modal */}
        <ExportConfirmationModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onConfirm={handleExportConfirm}
          enquiryCount={filteredEnquiries.length}
        />
      </div>
    </main>
  );
}
