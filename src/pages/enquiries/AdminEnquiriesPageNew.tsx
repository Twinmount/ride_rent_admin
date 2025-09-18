"use client";

import { useState } from "react";
import {
  EnquiryStatsCards,
  EnquiryFilters,
  EnquiryTable,
} from "@/components/enquiry";
import { DataTablePagination } from "@/components/common";
import { useAdminEnquiryManagement } from "@/hooks/useAdminEnquiryManagement";
import { ENQUIRY_STATUSES } from "@/utils/adminEnquiryUtils";
import { AdminEnquiry } from "@/types/api-types/API-types";

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
    currentPage,
    setCurrentPage,
    clearFilters,
    refetch,
    uniqueVehicleLocations,
  } = useAdminEnquiryManagement({
    page: 1,
    limit: 20,
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialFilters: {
      statusFilter: "all", // Set default to "all" instead of empty string
    },
  });

  const [locationFilter, setLocationFilter] = useState("all");
  const [revealedPhones, setRevealedPhones] = useState<{
    [key: string]: boolean;
  }>({});

  const getEnquiriesByStatus = (status: string) => {
    let filtered = filteredEnquiries;

    return filtered.filter((enquiry) => {
      if (status === "new") return enquiry.status === ENQUIRY_STATUSES.NEW;
      if (status === "contacted")
        return enquiry.status === ENQUIRY_STATUSES.ACCEPTED;
      if (status === "cancelled")
        return enquiry.status === ENQUIRY_STATUSES.CANCELLED;
      return false;
    });
  };

  const togglePhoneVisibility = (enquiryId: string) => {
    setRevealedPhones((prev) => ({
      ...prev,
      [enquiryId]: !prev[enquiryId],
    }));
  };

  const handleExportToExcel = () => {
    console.log("Exporting enquiries to Excel...");
    // Implementation for Excel export would go here
  };

  const handleVehicleClick = (enquiry: AdminEnquiry) => {
    console.log("Navigate to vehicle:", enquiry.vehicle.name);
    // Implementation for vehicle navigation would go here
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
              pendingCount={getEnquiriesByStatus("new").length}
              acceptedCount={getEnquiriesByStatus("contacted").length}
              cancelledCount={getEnquiriesByStatus("cancelled").length}
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
      </div>
    </main>
  );
}
