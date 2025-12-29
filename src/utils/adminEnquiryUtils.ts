import { ENV } from "@/config/env.config";
import { AdminEnquiry } from "@/types/api-types/API-types";

// Valid enquiry statuses
export const ENQUIRY_STATUSES = {
  NEW: "NEW",
  // ACCEPTED: "ACCEPTED",
  // REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  CONTACTED: "CONTACTED",
  // DECLINED: "DECLINED",
  AGENTVIEW: "AGENTVIEW",
} as const;

export type EnquiryStatus =
  (typeof ENQUIRY_STATUSES)[keyof typeof ENQUIRY_STATUSES];

// Status display configurations
export const statusConfig = {
  [ENQUIRY_STATUSES.NEW]: {
    label: "New",
    color: "blue",
    variant: "default",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  // [ENQUIRY_STATUSES.ACCEPTED]: {
  //   label: "Accepted",
  //   color: "green",
  //   variant: "success",
  //   bgColor: "bg-green-100",
  //   textColor: "text-green-800",
  // },
  // [ENQUIRY_STATUSES.REJECTED]: {
  //   label: "Rejected",
  //   color: "red",
  //   variant: "destructive",
  //   bgColor: "bg-red-100",
  //   textColor: "text-red-800",
  // },
  [ENQUIRY_STATUSES.CANCELLED]: {
    label: "Cancelled",
    color: "gray",
    variant: "secondary",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
  [ENQUIRY_STATUSES.EXPIRED]: {
    label: "Expired",
    color: "orange",
    variant: "warning",
    bgColor: "bg-orange-100",
    textColor: "text-orange-800",
  },
  // [ENQUIRY_STATUSES.CONTACTED]: {
  //   label: "Contacted",
  //   color: "purple",
  //   variant: "default",
  //   bgColor: "bg-purple-100",
  //   textColor: "text-purple-800",
  // },
  // [ENQUIRY_STATUSES.DECLINED]: {
  //   label: "Declined",
  //   color: "rose",
  //   variant: "destructive",
  //   bgColor: "bg-rose-100",
  //   textColor: "text-rose-800",
  // },
  [ENQUIRY_STATUSES.AGENTVIEW]: {
    label: "Agent View",
    color: "amber",
    variant: "warning",
    bgColor: "bg-amber-100",
    textColor: "text-amber-800",
  },
};

// Get base domain from environment variables
const getBaseDomain = (): string => {
  return ENV.PUBLIC_SITE_DOMAIN || "https://ride.rent";
};

/**
 * Utility functions for admin enquiries
 */
export const adminEnquiryUtils = {
  /**
   * Check if a status is valid
   */
  isValidStatus: (status: string): status is EnquiryStatus => {
    return Object.values(ENQUIRY_STATUSES).includes(status as EnquiryStatus);
  },

  /**
   * Format enquiry status for display
   */
  formatStatus: (status: string) => {
    if (adminEnquiryUtils.isValidStatus(status)) {
      return (
        statusConfig[status as keyof typeof statusConfig] || {
          label: status,
          color: "gray",
          variant: "secondary",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        }
      );
    }
    return {
      label: status,
      color: "gray",
      variant: "secondary",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    };
  },

  /**
   * Calculate rental duration in days
   */
  calculateRentalDuration: (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Format date for display with time
   * Format: "Dec 7, 2025, 02:10 PM"
   */
  formatDate: (
    dateString: string,
    options?: Intl.DateTimeFormatOptions,
  ): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      ...options,
    });
  },

  /**
   * Format date and time for display
   */
  formatDateTime: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  /**
   * Mask user information if needed
   */
  formatUserInfo: (enquiry: AdminEnquiry) => {
    if (enquiry.isMasked) {
      return {
        name: enquiry.user.name,
        phone: enquiry.user.phone,
        countryCode: enquiry.user.countryCode,
        email: enquiry.user.email,
      };
    }
    return enquiry.user;
  },

  /**
   * Get enquiry summary statistics
   */
  getEnquiryStats: (enquiries: AdminEnquiry[], apiSummary?: any) => {
    // If API summary is provided, use it (for better performance)
    if (apiSummary) {
      return {
        total: apiSummary.totalEnquiries,
        statusCounts: {},
        uniqueVehicles: new Set(enquiries.map((e) => e.vehicle._id)).size,
        uniqueUsers: new Set(enquiries.map((e) => e.user._id)).size,
        newEnquiries: apiSummary.newEnquiries,
        acceptedEnquiries: 0, // Legacy field
        rejectedEnquiries: 0, // Legacy field
        cancelledEnquiries: apiSummary.cancelledEnquiries,
        expiredEnquiries: apiSummary.expiredEnquiries,
        contactedEnquiries: apiSummary.contactedEnquiries,
        declinedEnquiries: apiSummary.declinedEnquiries,
        agentviewEnquiries: apiSummary.agentviewEnquiries,
      };
    }

    // Fallback to client-side calculation
    const total = enquiries.length;
    const statusCounts = enquiries.reduce(
      (acc, enquiry) => {
        acc[enquiry.status] = (acc[enquiry.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const uniqueVehicles = new Set(enquiries.map((e) => e.vehicle._id)).size;
    const uniqueUsers = new Set(enquiries.map((e) => e.user._id)).size;

    return {
      total,
      statusCounts,
      uniqueVehicles,
      uniqueUsers,
      newEnquiries: statusCounts[ENQUIRY_STATUSES.NEW] || 0,
      // acceptedEnquiries: statusCounts[ENQUIRY_STATUSES.ACCEPTED] || 0,
      // rejectedEnquiries: statusCounts[ENQUIRY_STATUSES.REJECTED] || 0,
      cancelledEnquiries: statusCounts[ENQUIRY_STATUSES.CANCELLED] || 0,
      expiredEnquiries: statusCounts[ENQUIRY_STATUSES.EXPIRED] || 0,
      contactedEnquiries: statusCounts[ENQUIRY_STATUSES.CONTACTED] || 0,
      // declinedEnquiries: statusCounts[ENQUIRY_STATUSES.DECLINED] || 0,
      agentviewEnquiries: statusCounts[ENQUIRY_STATUSES.AGENTVIEW] || 0,
    };
  },

  /**
   * Generate full car link URL
   */
  getFullCarLink: (enquiry: AdminEnquiry): string => {
    if (!enquiry.vehicle.carLink) {
      return "";
    }
    return `${getBaseDomain()}/${enquiry.vehicle.carLink}`;
  },

  /**
   * Open car link in new tab
   */
  openCarLink: (enquiry: AdminEnquiry): void => {
    const fullLink = adminEnquiryUtils.getFullCarLink(enquiry);
    if (fullLink) {
      window.open(fullLink, "_blank", "noopener,noreferrer");
    }
  },

  /**
   * Sort enquiries by different criteria
   */
  sortEnquiries: (
    enquiries: AdminEnquiry[],
    sortBy: "date" | "status" | "vehicle" | "user" = "date",
    order: "asc" | "desc" = "desc",
  ) => {
    return [...enquiries].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "vehicle":
          comparison = a.vehicle.name.localeCompare(b.vehicle.name);
          break;
        case "user":
          comparison = a.user.name.localeCompare(b.user.name);
          break;
      }

      return order === "desc" ? -comparison : comparison;
    });
  },
};
