export type CompanyType = {
  companyId: string;
  companyName: string;
  regNumber: string;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED";
  plan: "BASIC" | "PREMIUM" | "ENTERPRISE";
  rejectionReason: string;
  agentId: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate: string;
  userId: string;
  phoneNumber: string;
  email: string;
  companyAddress: string;
  companyLanguages: string[];
};

// type of single brand
export interface BrandType {
  id: string;
  vehicleCategoryId: string;
  brandName: string;
  brandValue: string;
  subHeading: string;
  brandLogo: any;
  metaTitle: string;
  metaDescription: string;
}

// type of single vehicle type
export interface VehicleTypeType {
  typeId: string;
  name: string;
  value: string;
  subHeading: string;
  typeLogo: any;
  metaTitle: string;
  metaDescription: string;
}

// category type
export interface CategoryType {
  categoryId: string;
  name: string;
  value: string;
}

// type fo rental details
export type RentalDetailsType = {
  day: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  week: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  month: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
    minBookingHours: string;
  };
  hour: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
};

// Type for state
export interface StateType {
  countryId: string;
  stateId: string;
  stateName: string;
  stateValue: string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
  stateImage: any; // Assuming stateImage is a URL (string)
}

// Type for city
export interface CityType {
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
}

export type FeatureType = {
  name: string;
  value: string;
  selected: boolean;
};

// Specification Type
export type SpecificationType = {
  name: string;
  value: string;
  selected: boolean;
};

// Vehicle Type
export type SingleVehicleType = {
  vehicleId: string;
  vehicleCode: string;
  tempId: string;
  disabledBy: "admin" | "seller";
  vehicleRegistrationNumber: string;
  company: CompanyType;
  brand: BrandType;
  vehicleType: VehicleTypeType;
  services: string[];
  vehicleCategory: CategoryType;
  vehicleModel: string;
  vehicleRegisteredYear: string;
  countryCode: string;
  phoneNumber: string;
  rentalDetails: RentalDetailsType;
  specification: string;
  state: StateType;
  city: CityType[];
  levelsFilled: string;
  vehiclePhotos: string[];
  commercialLicenses: string;
  commercialLicenseExpiryDate: string;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED" | "UNDER_REVIEW";
  rejectionReason: string;
  isLease: boolean;
  isModified: boolean;
  isDisabled: boolean;
  rank: number;
  newRegistration: boolean;
  features: Record<string, FeatureType[]>;
  specs: Record<string, SpecificationType>;
  additionalVehicleTypes: string[];
  securityDeposit: {
    enabled: boolean;
    amountInAed: string;
  };
  isCreditOrDebitCardsSupported: boolean;
  isTabbySupported: boolean;
  updatedAt: string;
  createdAt: string;
};

export type GeneralListingVehicleType = {
  vehicleId: string;
  vehicleModel: string;
  vehicleCode: string;
  approvalStatus: "APPROVED" | "PENDING" | "UNDER_REVIEW" | "REJECTED";
  rejectionReason?: string;
  company: {
    companyId: string;
    userId: string;
    companyName: string;
  };
};

// Define a simplified type for table data
export type LiveListingVehicleType = {
  vehicleId: string;
  vehicleModel: string;
  vehicleCode: string;
  isDisabled: boolean;
  company: {
    companyId: string;
    userId: string;
    companyName: string;
  };
};

// get all vehicles api response
export interface FetchAllVehiclesResponse {
  result: {
    list: SingleVehicleType[]; // Adjusted to match the nested structure
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

// Type for vehicle type
export interface VehicleType {
  typeId: string;
  name: string;
  value: string;
}

// Interface for the Primary Form (POST) API response
export interface AddPrimaryFormResponse {
  result: {
    vehicleId: string;
    tempId: string;
    commercialLicenseExpiryDate: string;
    brand: BrandType;
    vehicleType: VehicleType;
    vehicleCategory: CategoryType;
    vehicleModel: string;
    registredYear: string; // corrected to match the response field name
    rentalDetails: RentalDetailsType; // Assuming this is a JSON string, as in the response example
    specification: "USA_SPEC" | "UAE_SPEC" | "OTHERS";
    countryCode: string;
    phoneNumber: string;
    state: StateType;
    city: CityType[];
    levelsFilled: number; // Assuming this is a number based on the example response
    vehiclePhotos: string[];
    commercialLicences: string[];
    companyId: string;
    vehicleRegistrationNumber: string;
    createdAt: string;
    updatedAt: string;
  };
  status: string;
  statusCode: number;
}

// levels filled response to check whether whats the currently completed level of vehicle registration form
export interface GetLevelsFilledResponse {
  result: {
    levelsFilled: string;
  };
  status: string;
  statusCode: number;
}

// Features form data
export type FeaturesFormData = {
  id: string;
  name: string;
  values: { label: string; name: string; _id: string; selected?: boolean }[];
  vehicleCategoryId: string;
};

// Features form get all response
export interface FeaturesFormResponse {
  result: {
    list: FeaturesFormData[]; // Adjusted to match the nested structure
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export type EachFeatureValue = {
  name: string;
  label: string;
  _id: string;
  selected: boolean;
};
// Type for a single feature field
export type FeatureField = {
  id: string;
  name: string;
  values: EachFeatureValue[]; // Add `_id` field
  vehicleCategoryId: string;
  vehicleId: string | null;
};

// Type for the features form data response
export type GetFeaturesFormDataResponse = {
  status: string;
  result: FeatureField[]; // Adjusted to match the response structure
  statusCode: number;
};

// Specification form data
export type GetPrimaryForm = {
  vehicleId: string;
  vehicleRegistrationNumber: string;
  vehicleCategoryId: string;
  vehicleTypeId: string;
  vehicleBrandId: string;
  vehicleSeries: string;
  vehicleSeriesLabel: string;
  vehicleSeriesInfoTitle: string;
  vehicleSeriesInfoDescription: string;
  vehicleSeriesMetaTitle: string;
  vehicleSeriesMetaDescription: string;
  vehicleSeriesPageHeading: string;
  vehicleSeriesPageSubheading: string;
  vehicleModel: string;
  countryCode: string;
  phoneNumber: string;
  specification: "UAE_SPEC" | "USA_SPEC" | "OTHERS";
  rentalDetails: {
    day: {
      enabled: boolean;
      rentInAED: string;
      mileageLimit: string;
    };
    week: {
      enabled: boolean;
      rentInAED: string;
      mileageLimit: string;
    };
    month: {
      enabled: boolean;
      rentInAED: string;
      mileageLimit: string;
    };
    hour: {
      enabled: boolean;
      rentInAED: string;
      mileageLimit: string;
      minBookingHours: string;
    };
  };
  stateId: string;
  cityIds: string[];
  vehicleRegisteredYear: string;
  commercialLicenseExpireDate: string;
  isLease: boolean;
  isCryptoAccepted: boolean;
  isSpotDeliverySupported: boolean;
  description: string;
  vehicleTitle: string;
  vehiclePhotos: string[];
  commercialLicenses: string[];
  additionalVehicleTypes?: string[];
  securityDeposit: {
    enabled: boolean;
    amountInAED?: string;
  };
  isCreditOrDebitCardsSupported: boolean;
  isTabbySupported: boolean;
};

// Specification form get all response
export interface GetPrimaryFormResponse {
  result: GetPrimaryForm;
  status: string;
  statusCode: number;
}

// Type for each specification field (for "Update")
export type SpecificationField = {
  id: string;
  name: string;
  hoverInfo: string;
  values: {
    name: string;
    label: string;
    selected: boolean;
  }[];
  vehicleCategoryId: string;
  vehicleId: string | null; // vehicleId might be null
};

// Type for the API response (for "Update")
export interface GetSpecificationFormDataResponse {
  status: string;
  result: SpecificationField[]; // Array of SpecificationField
  statusCode: number;
}

// Specification form data
export type SpecificationFormData = {
  id: string;
  name: string;
  hoverInfo: string;
  values: { label: string; name: string; _id: string }[];
  vehicleCategoryId: string;
};

// Specification form get all response
export interface GetSpecificationFormFieldsResponse {
  result: {
    list: SpecificationFormData[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

// vehicle listing count response
export interface VehicleListingResponse {
  result: {
    all: number;
    newVehicle: number;
    updated: number;
    pending: number;
    rejected: number;
    approved: number;
    total: number;
  };
  status: string;
  statusCode: number;
}

// all vehicle listing count response
export interface AllVehicleListingResponse {
  result: {
    stateName: string;
    stateValue: string;
    stateId: string;
    newVehicles: number;
    updatedVehicles: number;
  }[];
  status: string;
  statusCode: number;
}
