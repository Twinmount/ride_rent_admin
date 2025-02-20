// register response
export interface RegisterResponse {
  result: {
    otpId: string;
    userId: string;
    otp: string;
  };
  status: string;
  statusCode: number;
}

// verify otp response
export interface VerifyOTPResponse {
  result: {
    emailId: string;
    refreshToken: string;
    isPhoneVerified: boolean;
    token: string;
    userId: string;
  };
}

// login response
export interface LoginResponse {
  result: {
    emailId: string | null;
    isPhoneVerified: boolean;
    refreshToken: string;
    token: string;
    userId: string;
  };
}

// state type
export interface StateType {
  countryId: string;
  stateId: string;
  stateName: string;
  stateValue: string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
  stateImage: any;
}

//  interface for the get-all-states  API response
export interface FetchStatesResponse {
  result: StateType[];
  status: string;
  statusCode: number;
}

//  interface for the states (by id)  API response
export interface FetchSpecificStateResponse {
  result: StateType;
  status: string;
  statusCode: number;
}

export interface CityType {
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
}

//  interface for the location API response
export interface FetchCitiesResponse {
  result: CityType[];
  status: string;
  statusCode: number;
}

export interface FetchSpecificCityResponse {
  result: CityType;
  status: string;
  statusCode: number;
}

// individual category type
export interface CategoryType {
  categoryId: string;
  name: string;
  value: string;
}

//  interface for the category (GET ALL) API response
export interface FetchCategoriesResponse {
  status: string;
  result: {
    list: CategoryType[]; // Array of categories
    page: number; // Current page number
    total: number; // Total number of categories
    totalNumberOfPages: number;
  };
  statusCode: number;
}

// interface for the category (GET BY ID) response
export interface SpecificCategoryResponse {
  result: CategoryType;
  status: string;
  statusCode: number;
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

//  interface for the vehicle types (GET ALL) API response
export interface FetchTypesResponse {
  status: string;
  result: {
    list: VehicleTypeType[]; // Array of vehicle types
    page: number; // Current page number
    total: number; // Total number of categories
    totalNumberOfPages: number;
  };
  statusCode: number;
}

// interface for the vehicle type (GET BY ID) response
export interface FetchSpecificTypeResponse {
  result: VehicleTypeType;
  status: string;
  statusCode: number;
}

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

//  interface for the Brand GET ALL) API response
export interface FetchBrandsResponse {
  status: string;
  result: {
    list: BrandType[]; // Array of brands
    page: number; // Current page number
    total: number; // Total number of categories
  };
  statusCode: number;
}

// interface for the  Brand (GET BY ID) response
export interface FetchSpecificBrandResponse {
  result: BrandType;
  status: string;
  statusCode: number;
}

// link type
export interface LinkType {
  linkId: string;
  label: string;
  link: string;
}

//  interface for the get-all-links  API response
export interface FetchLinksResponse {
  result: {
    list: LinkType[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

//  interface for the link (by id)  API response
export interface FetchSpecificLinkResponse {
  result: LinkType;
  status: string;
  statusCode: number;
}

// single promotion type
export interface PromotionType {
  promotionId: string;
  promotionImage: any;
  promotionLink: string;
}

//  get-all-promotions  API response
export interface FetchPromotionsResponse {
  result: {
    list: PromotionType[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

//  states (by id)  API response
export interface FetchSpecificPromotionResponse {
  result: PromotionType;
  status: string;
  statusCode: number;
}

// company type
export interface companyType {
  companyId: string;
  companyName: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate: string;
  regNumber: string;
  approvalStatus: "APPROVED" | "REJECTED" | "PENDING";
  rejectionReason: string;
  plan: "BASIC" | "PREMIUM" | "ENTERPRISE";
  agentId: string;
  userId: string;
  phoneNumber: string;
  email: string;
  companyAddress: string;
  companyLanguages: string[];
}

//  interface for the get-all-companies  API response
export interface FetchCompaniesResponse {
  result: {
    list: companyType[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

//  interface for the company (by id)  API response
export interface FetchSpecificCompanyResponse {
  result: companyType;
  status: string;
  statusCode: number;
}

// single data type
export interface HomeMetaListData {
  metaDataId: string;
  stateId: string;
  state: string;
  category: string;
  categoryId: string;
  metaTitle: string;
  metaDescription: string;
}

export interface FetchSingleHomeMetaData {
  result: HomeMetaListData;
  status: string;
  statusCode: number;
}

//  fetch home all meta data
export interface FetchHomeMetaListResponse {
  result: {
    list: HomeMetaListData[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

// single listing data type
export interface ListingMetaListData {
  metaDataId: string;
  stateId: string;
  state: string;
  category: string;
  type: string;
  categoryId: string;
  typeId: string;
  metaTitle: string;
  metaDescription: string;
}

//  fetch listing all meta data
export interface FetchListingMetaListResponse {
  result: {
    list: ListingMetaListData[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface FetchSingleListingMetaData {
  result: ListingMetaListData;
  status: string;
  statusCode: number;
}

export interface FetchDashboardAnalytics {
  result: {
    totalSellers: number;
    totalVehicles: number;
    totalBrands: number;
    totalCategories: number;
    totalVisits: number;
    allTimeVisits: number;
  };
  status: string;
  statusCode: number;
}

// api response types for single file upload
export interface SingleFileUploadResponse {
  result: {
    message: string;
    fileName: string;
    path: string;
  };
  status: string;
  statusCode: number;
}

// api response types for multiple file upload
export interface MultipleFileUploadResponse {
  result: {
    message: string;
    fileName: string;
    paths: string[]; //array of paths
  };
  status: string;
  statusCode: number;
}

export interface GetSingleImageResponse {
  status: string;
  statusCode: number;
  result: {
    url: string;
  };
}

export interface DeleteSingleImageResponse {
  status: string;
  statusCode: number;
  result: {
    message: string;
    fileFullPath: string;
  };
}

//  vehicle series type
export interface VehicleSeriesType {
  vehicleSeriesId: string;
  vehicleSeries: string;
  vehicleSeriesLabel: string;
  vehicleSeriesPageHeading: string;
  vehicleSeriesPageSubheading: string;
  vehicleSeriesInfoTitle: string;
  vehicleSeriesInfoDescription: string;
  vehicleSeriesMetaTitle: string;
  vehicleSeriesMetaDescription: string;
  seriesCode: string;
  stateId: string;
  vehicleCategoryId: string;
  vehicleBrandId: string;
}

//  Get all Vehicle Series Search
export interface VehicleSeriesSearch {
  status: string;
  result: VehicleSeriesType[]; // Array of brands

  statusCode: number;
}

// interface for the  Brand (GET BY ID) response
export interface FetchSpecificSeriesResponse {
  result: VehicleSeriesType;
  status: string;
  statusCode: number;
}

//  interface for the Series GET ALL) API response
export interface FetchAllSeriesResponse {
  status: string;
  result: {
    list: VehicleSeriesType[]; // Array of brands
    page: number; // Current page number
    total: number; // Total number of categories
  };
  statusCode: number;
}

// single listing data type
export interface CompanyPortfolioMetaData {
  companyName: string;
  companyLogo: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  companyAddress: string;
  companyLanguages: string[];
  regNumber: string;
  agentId: string;
  agentMetaTitle: string;
  agentMetaDescription: string;
}

//  fetch listing all meta data
export interface FetchCompanyPortfolioMetaResponse {
  result: {
    list: CompanyPortfolioMetaData[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}
