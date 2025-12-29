// Plan Types and Interfaces

export enum CompanyTireType {
  TIER_1 = 0,
  TIER_2 = 1,
  TIER_3 = 2,
}

// Plan Type Enum
export enum PlanType {
  LISTING = 'listing',
  RECHARGE = 'recharge',
}

// Tier Details Structure for Listing Plans
export interface ListingTierDetails {
  subscriptionPrice: number;
  individualBoostPrice: number;
  individualUnlockPrice: number;
  noOfBoost: number;
  noOfUnlock: number;
  title: string;
  priceTitle: string;
  description: string;
  features: string[];
}

// Tier Details Structure for Recharge Plans (no individualBoostPrice and individualUnlockPrice)
export interface RechargeTierDetails {
  subscriptionPrice: number;
  noOfBoost: number;
  noOfUnlock: number;
  title: string;
  priceTitle: string;
  description: string;
  features: string[];
}

// Union type for TierDetails
export type TierDetails = ListingTierDetails | RechargeTierDetails;

// Plan Structure
export interface Plan {
  id: string;
  planType: PlanType; // Type of plan (Listing or Recharge)
  plan: string; // Plan name (e.g., "Basic", "Premium")
  validityInDays?: number; // Validity in days (required for both plan types)
  T1: TierDetails | false;
  T2: TierDetails | false;
  T3: TierDetails | false;
  isHidden?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanPagination {
  page: number;
  limit: number;
  total: number;
  totalNumberOfPages: number;
}

export interface FetchPlansResponse {
  result: GetAllPlansApiResponse;
  status: string;
  statusCode: number;
}

// Raw API response structure
export interface GetAllPlansApiResponse {
  list: Plan[];
  page: number;
  limit: number;
  total: number;
  totalNumberOfPages: number;
}

// Normalized response for use in components
export interface GetAllPlansResponse {
  plans: Plan[];
  pagination: PlanPagination;
}


export interface GetSinglePlanResponse {
  status: string;
  result: Plan;
  statusCode: number;
}

export interface CreatePlanPayload {
  planType: PlanType;
  plan: string;
  validityInDays?: number;
  T1: TierDetails | false;
  T2: TierDetails | false;
  T3: TierDetails | false;
  isHidden?: boolean;
}

export interface UpdatePlanPayload extends Partial<CreatePlanPayload> {
  id: string;
}

export interface GetAllPlansParams {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PlanFilterParams {
  companyTireType: CompanyTireType;
}
