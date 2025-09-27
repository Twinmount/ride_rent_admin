import { useState, useMemo, useCallback } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchAdminEnquiries,
  AdminEnquiryParams,
} from "@/api/enquiry/adminEnquiryApi";
import {
  AdminEnquiriesResponse,
  AdminEnquiry,
} from "@/types/api-types/API-types";

// Query Keys
export const adminEnquiryKeys = {
  all: ["admin-enquiries"] as const,
  lists: () => [...adminEnquiryKeys.all, "list"] as const,
  list: (params: AdminEnquiryParams) =>
    [
      ...adminEnquiryKeys.lists(),
      params.page?.toString() || "1",
      params.limit?.toString() || "20",
      params.status || "all",
    ] as const,
};

export interface UseAdminEnquiryManagementOptions extends AdminEnquiryParams {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
  initialFilters?: {
    searchTerm?: string;
    statusFilter?: string;
    dateRange?: {
      start?: string;
      end?: string;
    };
  };
}

export interface UseAdminEnquiryManagementReturn {
  // Data
  enquiries: AdminEnquiry[];
  filteredEnquiries: AdminEnquiry[];

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefetching: boolean;

  // Filter states
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateRange: {
    start?: string;
    end?: string;
  };
  setDateRange: (range: { start?: string; end?: string }) => void;

  // Actions
  refetch: () => void;
  clearFilters: () => void;

  // Pagination controls
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;

  // Computed values
  uniqueAgents: string[];
  uniqueVehicleLocations: string[];
  statusCounts: Record<string, number>;
}

/**
 * Comprehensive hook for managing admin enquiries with filtering, pagination, and search
 */
export const useAdminEnquiryManagement = (
  options: UseAdminEnquiryManagementOptions = {},
): UseAdminEnquiryManagementReturn => {
  const {
    page: initialPage = 1,
    limit: initialLimit = 20,
    status: initialStatus,
    enabled = true,
    refetchInterval,
    staleTime = 5 * 60 * 1000, // 5 minutes
    initialFilters = {},
  } = options;

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [statusFilter, setStatusFilter] = useState(
    initialFilters.statusFilter || "all",
  );
  const [dateRange, setDateRange] = useState(initialFilters.dateRange || {});
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);

  // Prepare query parameters
  const queryParams: AdminEnquiryParams = {
    page: currentPage,
    limit: pageSize,
    status:
      (statusFilter &&
      statusFilter !== "all" &&
      ["NEW", "ACCEPTED", "REJECTED", "CANCELLED"].includes(statusFilter)
        ? (statusFilter as "NEW" | "ACCEPTED" | "REJECTED" | "CANCELLED")
        : initialStatus) || undefined,
  };

  // Fetch enquiries with current pagination and status filter using React Query
  const {
    data,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  }: UseQueryResult<AdminEnquiriesResponse, Error> = useQuery({
    queryKey: adminEnquiryKeys.list(queryParams),
    queryFn: () => fetchAdminEnquiries(queryParams),
    enabled,
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const enquiries = data?.result.list || [];
  const pagination = {
    page: data?.result.page || currentPage,
    limit: data?.result.limit || pageSize,
    total: data?.result.total || 0,
    totalPages: data?.result.totalNumberOfPages || 0,
  };

  console.log("enquiries: ", enquiries);

  // Filter enquiries based on search term and date range (client-side filtering)
  const filteredEnquiries = useMemo(() => {
    let filtered = [...enquiries];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enquiry: AdminEnquiry) =>
          enquiry.user.name.toLowerCase().includes(searchLower) ||
          enquiry.user.email.toLowerCase().includes(searchLower) ||
          enquiry.user.phone.includes(searchTerm) ||
          enquiry.vehicle.name.toLowerCase().includes(searchLower) ||
          enquiry.vehicle.location.toLowerCase().includes(searchLower) ||
          enquiry.agent.name.toLowerCase().includes(searchLower) ||
          enquiry.message.toLowerCase().includes(searchLower),
      );
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((enquiry: AdminEnquiry) => {
        const enquiryDate = new Date(enquiry.createdAt);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        if (startDate && enquiryDate < startDate) return false;
        if (endDate && enquiryDate > endDate) return false;
        return true;
      });
    }

    return filtered;
  }, [enquiries, searchTerm, dateRange]);

  // Computed values
  const uniqueAgents = useMemo(() => {
    const agents = enquiries.map((enquiry: AdminEnquiry) => enquiry.agent.name);
    return [...new Set(agents)].filter(Boolean);
  }, [enquiries]);

  const uniqueVehicleLocations = useMemo(() => {
    const locations = enquiries.map(
      (enquiry: AdminEnquiry) => enquiry.vehicle.location,
    );
    return [...new Set(locations)].filter(Boolean);
  }, [enquiries]);

  const statusCounts = useMemo(() => {
    return enquiries.reduce(
      (counts: Record<string, number>, enquiry: AdminEnquiry) => {
        counts[enquiry.status] = (counts[enquiry.status] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>,
    );
  }, [enquiries]);

  // Actions
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange({});
    setCurrentPage(1);
  }, []);

  return {
    // Data
    enquiries,
    filteredEnquiries,

    // Pagination
    pagination,

    // Loading states
    isLoading,
    isError,
    error,
    isRefetching,

    // Filter states
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,

    // Actions
    refetch,
    clearFilters,

    // Pagination controls
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,

    // Computed values
    uniqueAgents,
    uniqueVehicleLocations,
    statusCounts,
  };
};
