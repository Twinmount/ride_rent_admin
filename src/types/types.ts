// admin context org  type
export type orgType = {
  id?: string;
  label: string;
  value: string;
};

// admin context  state type
export type stateType = {
  stateId: string;
  stateName: string;
  stateValue: string;
};

export type NavbarStateType = {
  stateName: string;
  stateValue: string;
  stateId: string;
  newVehicles: number;
  updatedVehicles: number;
};

// admin context  type
export type AdminContextType = {
  isSidebarOpen: boolean;
  setSidebarOpen?: (value: boolean) => void;
  toggleSidebar: () => void;
  isSmallScreen: boolean;
  org: orgType;
  setOrg: (origin: orgType) => void;
  state: stateType;
  setState: (state: stateType) => void;
};

export type VehicleCategoryType =
  | "car"
  | "sports-car"
  | "cycle"
  | "motorcycle"
  | "sports-bike"
  | "leisure-boat"
  | "charter"
  | "bus"
  | "van"
  | "buggy"
  | "yacht";

export type VehicleCategoriesType = {
  categoryId: number | string;
  name: string;
  value: VehicleCategoryType;
};

export type VehicleTypeFormType = {
  typeId?: string;
  name: string;
  value: string;
  vehicleCategoryId?: string;
};

export type BrandFormType = {
  brandName: string;
  brandValue: string;
  vehicleCategoryId: string;
  brandLogo: string;
};

export type StateFormType = {
  stateId?: string;
  stateName: string;
  stateValue: string;
  stateImage: string;
};

export type CategoryFormType = {
  name: string;
  value: string;
};

export type CityFormType = {
  cityName: string;
  cityValue: string;
};

export type LinkFormType = {
  linkId?: string;
  label: string;
  link: string;
};

export type RecommendedLinkFormType = {
  linkId?: string;
  label: string;
  link: string;
};

export type PromotionFormType = {
  promotionImage: string;
  promotionLink: string;
};

export type BlogPromotionFormType = {
  promotionImage: string;
  promotionLink: string;
};

export type HomeMetaFormType = {
  stateId: string;
  metaTitle: string;
  metaDescription: string;
};

export type ListingMetaFormType = {
  stateId: string;
  categoryId: string;
  typeId: string;
  metaTitle: string;
  metaDescription: string;
};

export type BrandType = {
  id: number | string;
  label: string;
  value: VehicleCategoryType;
  link: string;
};

export type CompanyFormType = {
  companyName: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate: Date;
  regNumber: string;
  agentId?: string;
  approvalStatus?: string;
  rejectionReason?: string;
  phoneNumber?: string;
  email?: string;
};

export type CompanyStatusFormType = {
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
};
export type VehicleStatusFormType = {
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";
  rejectionReason?: string;
};

export type TabsTypes = "primary" | "specifications" | "features";

export interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}

// vehicle listing count response
export interface CompanyListingResponse {
  result: {
    all: number;
    pending: number;
    rejected: number;
    approved: number;
    total: number;
  };
  status: string;
  statusCode: number;
}

// blog

export type BlogFormType = {
  blogTitle: string;
  blogDescription: string;
  blogImage: string;
  blogImagePath: string;
  blogCategory: string;
  authorName: string;
  metaTitle: string;
  metaDescription: string;
  blogContent: string;
  updatedAt?: string;
};
export type CategoryType =
  | "all"
  | "design"
  | "engineering"
  | "automotive"
  | "news"
  | "travel"
  | "travel";
