import { iconConfigSchema } from "@/lib/validator";
import { z } from "zod";

// admin context org  type
export type orgType = {
  id?: string;
  label: string;
  value: string;
};

export type AppSuportedCountries = {
  id: string;
  name: string;
  value: string;
  icon: string;
};

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// admin context  state type
export type stateType = {
  stateId: string;
  stateName: string;
  stateValue: string;
};

export type countryType = {
  countryId: string;
  countryName: string;
  countryValue: string;
};

export type ParentState = {
  stateName: string;
  stateValue: string;
  stateId: string;
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
  state: stateType;
  setState: (state: stateType) => void;
  country: countryType;
  setCountry: (state: countryType) => void;
  parentState: stateType;
  setParentState: (state: stateType) => void;
  appCountry: string;
  updateAppCountry: (country: string) => void;
  appSuportedCountries: AppSuportedCountries[];
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

export type IconConfig = z.infer<typeof iconConfigSchema>;

export type StateFormType = {
  stateId?: string;
  stateName: string;
  stateValue: string;
  stateImage: string;
  relatedStates?: string[];
  isFavorite?: boolean;
  stateIcon?: string;
  location: Location;
  iconConfig?: IconConfig;
};

export type CountryFormType = {
  countryId?: string;
  countryName: string;
  countryValue: string;
};

export type CategoryFormType = {
  name: string;
  value: string;
};

export type CityFormType = {
  cityId?: string;
  cityName: string;
  cityValue: string;
  cityPageHeading?: string;
  cityPageSubheading?: string;
  cityMetaTitle?: string;
  cityMetaDescription?: string;
  cityBodyContent?: string;
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

export type BlogPromotionPlacementType =
  | "recommended-deals"
  | "popular-list"
  | "bottom-banner";

export type BlogPromotionFormType = {
  promotionImage: string;
  promotionLink: string;
  blogPromotionPlacement: string;
};
export type AdvisorPromotionFormType = {
  promotionImage: string;
  promotionLink: string;
};

export type HomeMetaFormType = {
  stateId: string;
  categoryId: string;
  metaTitle: string;
  metaDescription: string;
};

export type ListingMetaFormType = {
  stateId?: string;
  categoryId: string;
  typeId?: string | undefined;
  brandId?: string | undefined;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  h2: string;
};

// export type BrandType = {
//   id: number | string;
//   label: string;
//   value: string;
//   link: string;
// };

export type CompanyFormType = {
  companyName: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate?: Date | undefined;
  regNumber?: string;
  noRegNumber?: boolean;
  agentId?: string;
  approvalStatus?: string;
  rejectionReason?: string;
  phoneNumber?: string;
  email?: string;
  companyAddress: string;
  displayAddress: string;
  companyLanguages: string[];
  companyMetaTitle: string;
  companyMetaDescription: string;
  accountType?: string;
  countryName?: string;
  location?: Location;
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

export type AdvisorBlogFormType = {
  blogTitle: string;
  blogDescription: string;
  blogImage: string;
  blogImagePath?: string;
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

export type VehicleSeriesType = {
  state: string;
  vehicleCategoryId: string;
  brandId: string;
  vehicleSeries: string;
  vehicleSeriesLabel: string;
  vehicleSeriesPageHeading: string;
  vehicleSeriesPageSubheading: string;
  vehicleSeriesInfoTitle: string;
  vehicleSeriesInfoDescription: string;
  vehicleSeriesMetaTitle: string;
  vehicleSeriesMetaDescription: string;
  seriesBodyContent?: string;
};

// Job

export type JobSectionDto = {
  title: string;
  points: string[];
};

export type JobFormType = {
  _id?: string;
  jobtitle: string;
  jobdescription: string;
  location: string;
  date: string;
  level: string;
  experience: string;
  country: string;
  sections?: JobSectionDto[];
  aboutCompany?: string;
  fileUrl?: string | null;
};

export type ApplicationTypes = "all" | "intern" | "career";
export type ContentFor = "state" | "country" | "parentState";
