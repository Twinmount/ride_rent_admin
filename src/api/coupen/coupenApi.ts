import { API } from "../ApiService";
import { Slug } from "../Api-Endpoints";

// ==================== TYPES ====================

export interface StateAvailability {
  stateId: string;
  stateName: string;
  isEnabled: boolean;
}

export interface CouponType {
  _id: string;
  couponName: string;
  couponCode: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue: number;
  description?: string;
  termsAndConditions?: string;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  usageLimitPerUser?: number;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  isVisibleOnCard: boolean;
  countryId: string;
  stateAvailability: StateAvailability[];
  applicableVehicleCategories: string[];
  applicableCompanies: string[];
  excludedVehicleCategories: string[];
  excludedCompanies: string[];
  isFirstTimeUserOnly: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponPayload {
  couponName: string;
  couponCode: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  description?: string;
  termsAndConditions?: string;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageLimitPerUser?: number;
  isVisibleOnCard?: boolean;
  countryId: string;
  stateAvailability: StateAvailability[];
  applicableVehicleCategories?: string[];
  applicableCompanies?: string[];
  excludedVehicleCategories?: string[];
  excludedCompanies?: string[];
  isFirstTimeUserOnly?: boolean;
  priority?: number;
}

export interface UpdateCouponPayload extends Partial<CreateCouponPayload> {
  couponId: string;
}

export interface UpdateCouponStatusPayload {
  couponId: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
}

export interface GetAllCouponsParams {
  page: number;
  limit: number;
  sortOrder?: "ASC" | "DESC";
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  countryId?: string;
  search?: string;
  isVisibleOnCard?: boolean;
}

export interface ValidateCouponPayload {
  couponCode: string;
  orderAmount: number;
  vehicleId?: string;
  companyId?: string;
  stateId?: string;
}

export interface ApplyCouponPayload {
  couponCode: string;
  orderId: string;
  orderAmount: number;
  discountAmount: number;
}

export interface CouponListResponse {
  status: string;
  result: {
    list: CouponType[];
    count: number;
    page: number;
    limit: number;
    totalNumberOfPages: number;
  };
  statusCode: number;
}

export interface SingleCouponResponse {
  status: string;
  result: CouponType;
  statusCode: number;
}

export interface ValidateCouponResponse {
  status: string;
  result: {
    isValid: boolean;
    discountAmount?: number;
    finalAmount?: number;
    message?: string;
    coupon?: CouponType;
  };
  statusCode: number;
}

export interface CouponStatsResponse {
  status: string;
  result: {
    totalCoupons: number;
    activeCoupons: number;
    inactiveCoupons: number;
    expiredCoupons: number;
    totalUsageCount: number;
  };
  statusCode: number;
}

export interface AvailableCouponsResponse {
  status: string;
  result: CouponType[];
  statusCode: number;
}

// ==================== API FUNCTIONS ====================

/**
 * Create a new coupon
 */
export const createCoupon = async (
  payload: CreateCouponPayload,
): Promise<SingleCouponResponse> => {
  try {
    const data = await API.post<SingleCouponResponse>({
      slug: Slug.POST_COUPEN,
      body: payload,
    });

    if (!data) {
      throw new Error("Failed to create coupon");
    }

    return data;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

/**
 * Update an existing coupon
 */
export const updateCoupon = async (
  payload: UpdateCouponPayload,
): Promise<SingleCouponResponse> => {
  try {
    const data = await API.put<SingleCouponResponse>({
      slug: Slug.PUT_COUPON,
      body: payload,
    });

    if (!data) {
      throw new Error("Failed to update coupon");
    }

    return data;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

/**
 * Update coupon status (ACTIVE/INACTIVE/EXPIRED)
 */
export const updateCouponStatus = async (
  payload: UpdateCouponStatusPayload,
): Promise<SingleCouponResponse> => {
  try {
    const data = await API.put<SingleCouponResponse>({
      slug: Slug.PUT_COUPON_STATUS,
      body: payload,
    });

    if (!data) {
      throw new Error("Failed to update coupon status");
    }

    return data;
  } catch (error) {
    console.error("Error updating coupon status:", error);
    throw error;
  }
};

/**
 * Get a single coupon by ID or code
 */
export const getCoupon = async (
  couponIdOrCode: string,
): Promise<SingleCouponResponse> => {
  try {
    const data = await API.get<SingleCouponResponse>({
      slug: `${Slug.GET_COUPON}?couponId=${couponIdOrCode}`,
    });

    if (!data) {
      throw new Error("Failed to fetch coupon");
    }

    return data;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    throw error;
  }
};

/**
 * Get all coupons with filters and pagination
 */
export const getAllCoupons = async (
  params: GetAllCouponsParams,
): Promise<CouponListResponse> => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("page", params.page.toString());
    queryParams.append("limit", params.limit.toString());

    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.status) queryParams.append("status", params.status);
    if (params.countryId) queryParams.append("countryId", params.countryId);
    if (params.search) queryParams.append("search", params.search);
    if (params.isVisibleOnCard !== undefined)
      queryParams.append("isVisibleOnCard", params.isVisibleOnCard.toString());

    const queryString = queryParams.toString();
    const url = `${Slug.GET_COUPON_LIST}?${queryString}`;

    const data = await API.get<CouponListResponse>({
      slug: url,
    });

    if (!data) {
      throw new Error("Failed to fetch coupons");
    }

    return data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

/**
 * Validate a coupon before applying
 */
export const validateCoupon = async (
  payload: ValidateCouponPayload,
): Promise<ValidateCouponResponse> => {
  try {
    const data = await API.post<ValidateCouponResponse>({
      slug: Slug.POST_VALIDATE_COUPON,
      body: payload,
    });

    if (!data) {
      throw new Error("Failed to validate coupon");
    }

    return data;
  } catch (error) {
    console.error("Error validating coupon:", error);
    throw error;
  }
};

/**
 * Apply a coupon to an order
 */
export const applyCoupon = async (
  payload: ApplyCouponPayload,
): Promise<SingleCouponResponse> => {
  try {
    const data = await API.post<SingleCouponResponse>({
      slug: Slug.POST_APPLY_COUPON,
      body: payload,
    });

    if (!data) {
      throw new Error("Failed to apply coupon");
    }

    return data;
  } catch (error) {
    console.error("Error applying coupon:", error);
    throw error;
  }
};

/**
 * Get available coupons for a user
 */
export const getAvailableCoupons = async (params: {
  orderAmount: number;
  vehicleId?: string;
  companyId?: string;
  stateId?: string;
}): Promise<AvailableCouponsResponse> => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("orderAmount", params.orderAmount.toString());
    if (params.vehicleId) queryParams.append("vehicleId", params.vehicleId);
    if (params.companyId) queryParams.append("companyId", params.companyId);
    if (params.stateId) queryParams.append("stateId", params.stateId);

    const queryString = queryParams.toString();
    const url = `${Slug.GET_AVAILABLE_COUPONS}?${queryString}`;

    const data = await API.get<AvailableCouponsResponse>({
      slug: url,
    });

    if (!data) {
      throw new Error("Failed to fetch available coupons");
    }

    return data;
  } catch (error) {
    console.error("Error fetching available coupons:", error);
    throw error;
  }
};

/**
 * Delete a coupon (soft delete)
 */
export const deleteCoupon = async (
  couponId: string,
): Promise<{ status: string; result: { success: boolean }; statusCode: number }> => {
  try {
    const data = await API.delete<{
      status: string;
      result: { success: boolean };
      statusCode: number;
    }>({
      slug: Slug.DELETE_COUPON,
      body: { couponId },
    });

    if (!data) {
      throw new Error("Failed to delete coupon");
    }

    return data;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

/**
 * Get coupon statistics
 */
export const getCouponStats = async (
  countryId?: string,
): Promise<CouponStatsResponse> => {
  try {
    const url = countryId
      ? `${Slug.GET_COUPON_STATS}?countryId=${countryId}`
      : Slug.GET_COUPON_STATS;

    const data = await API.get<CouponStatsResponse>({
      slug: url,
    });

    if (!data) {
      throw new Error("Failed to fetch coupon stats");
    }

    return data;
  } catch (error) {
    console.error("Error fetching coupon stats:", error);
    throw error;
  }
};

/**
 * Get coupons visible on cards for a specific state
 */
export const getCouponsVisibleOnCard = async (
  stateId: string,
): Promise<AvailableCouponsResponse> => {
  try {
    const data = await API.get<AvailableCouponsResponse>({
      slug: `${Slug.GET_COUPONS_VISIBLE_ON_CARD}?stateId=${stateId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch visible coupons");
    }

    return data;
  } catch (error) {
    console.error("Error fetching visible coupons:", error);
    throw error;
  }
};