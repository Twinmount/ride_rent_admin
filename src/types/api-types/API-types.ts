import { BannerType } from "@/api/states";
import { IconConfig, Location, VehicleBucketDisplayGroupType } from "../types";
import { RidePromotionCardType } from "../formTypes";

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
  isFavorite?: boolean;
  stateIcon?: string;
  location: Location;
  IconConfig?: IconConfig;
}

export interface CountryType {
  countryId: string;
  countryName: string;
  countryValue: string;
}

//  interface for the get-all-states  API response
export interface FetchStatesResponse {
  result: StateType[];
  status: string;
  statusCode: number;
}

export interface FetchCountriesResponse {
  result: CountryType[];
  status: string;
  statusCode: number;
}

export interface BannerTypeResponse {
  result: BannerType[];
  status: string;
  statusCode: number;
}

export interface FetchParentStatesResponse {
  result: StateType;
  status: string;
  statusCode: number;
}

export interface FetchCountryResponse {
  result: CountryType[];
  status: string;
  statusCode: number;
}

type StateFAQItemWithId = {
  _id?: string;
  question: string;
  answer: string;
};

type StateFAQDocument = {
  _id?: string;
  stateId: string;
  faqs: StateFAQItemWithId[];
  updatedAt: string;
  version: number;
  __v: number;
};

export interface GetStateFAQResponse {
  result: StateFAQDocument;
  status: string;
  statusCode: number;
}

//  interface for the states (by id)  API response
export interface FetchSpecificStateResponse {
  result: StateType;
  status: string;
  statusCode: number;
}

export interface FetchSpecificCountryResponse {
  result: CountryType;
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
  brandName: string;
  brandValue: string;
  brandLogo: any;
  vehicleCategoryId: string;
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

export interface VehicleBucketType {
  id?: string;
  stateId: string;
  displayGroup: VehicleBucketDisplayGroupType;
  linkText: string;
  vehicleBucketName: string;
  vehicleBucketValue: string;
  vehicleCodes: string[];
  pageHeading: string;
  pageSubheading: string;
  metaTitle: string;
  metaDescription: string;
}

// interface for the vehicle bucket (GET ALL) API response
export interface FetchVehicleBucketsResponse {
  status: string;
  result: {
    list: VehicleBucketType[]; // Array of vehicle buckets
    page: number; // Current page number
    total: number; // Total number of categories
    totalNumberOfPages: number;
  };
  statusCode: number;
}

export interface VehicleBucketListType extends VehicleBucketType {
  stateValue: string;
  pageVisitCount: number;
}

export interface FetchVehicleBucketListResponse {
  result: {
    list: VehicleBucketListType[];
    page: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface FetchSpecificVehicleBucketResponse {
  result: VehicleBucketType;
  status: string;
  statusCode: number;
}

export interface VehicleQuickSearchType {
  id: string;
  vehicleCode: string;
  vehicleModel: string;
  brandName: string;
  vehicleName: string;
  thumbnailUrl: string;
}

export interface VehicleBucketSearchResponse {
  result: VehicleQuickSearchType[];
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
export interface BlogPromotionType {
  promotionId: string;
  promotionImage: any;
  promotionLink: string;
}

export interface PromotionType {
  promotionId: string;
  promotionImage: any;
  promotionLink: string;
  vehicleCategoryId?: string;
  type:
    | "homepage"
    | "listing-page"
    | "city-listing-page"
    | "series-listing-page"
    | "brand-listing-page"
    | "listing-page-filter";
  title?: string;
  subtitle?: string;
}

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

export interface RidePromotionType {
  _id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  cards: RidePromotionCardType[];
}
export interface FetchRidePromotionsResponse {
  status: string;
  statusCode: string;
  result: RidePromotionType;
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
  displayAddress: string;
  companyLanguages: string[];
  companyMetaTitle: string;
  companyMetaDescription: string;
  accountType: string;
  countryName?: string;
  countryId: string;
  location: Location;
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

export interface promotedCompanyType {
  companyId: string;
  agentId: string;
  companyName: string;
  companyLogo: string; //pass actual image url here
  companyShortId: string;
}

export interface FetchPromotedCompaniesSearchResponse {
  result: promotedCompanyType[];
  status: string;
  statusCode: number;
}

export interface FetchCompanyByIdResponse {
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
  h1?: string;
  h2?: string;
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
  state: string;
  stateId: string;
  category: string;
  categoryId: string;
  type: string;
  typeId: string;
  brand: string;
  brandId: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  h2: string;
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

// Updated types (in your types file, e.g., types/api-types/API-types.ts or supplier-central.ts)
export interface SupplierDetailedResponse {
  _id: string;
  companyShortId: string;
  companyName: string;
  state: string;
  lastLogin: string;
  lastActivity: string;
  lastEnquiry: string;
  monthlyEnquiries: number;
  lifetimeEnquiries: number;
  monthlyUnlocks: number;
  lifetimeUnlocks: number;
  plan: string;
  monthlyMissed: number;
  lifetimeMissed: number;
  monthlyCancelled: number;
  lifetimeCancelled: number;
  regNumber: string;
  agentId: string;
  joinedDate: string;
  countryName: string;
  expireDate: string;
  missedQueriesCount: number;
}

export interface FetchSupplierCategoryDetailsResponse {
  status: string;
  result: {
    data: SupplierDetailedResponse[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  statusCode: number;
}

export interface FetchSupplierCentralAnalytics {
  status: string;
  result: {
    totalSuppliers: number;
    subscribed: number;
    missedSubscriptions: number;
    inactive: number;
    orderMissed: number;
    totalSuppliersList: {
      data: SupplierCentralDto[];
      page: string;
      limit: string;
      total: number;
      totalNumberOfPages: number;
    };
    subscribedList: {
      data: SupplierCentralDto[];
      page: string;
      limit: string;
      total: number;
      totalNumberOfPages: number;
    };
    missedSubscriptionsList: {
      data: SupplierCentralDto[];
      page: string;
      limit: string;
      total: number;
      totalNumberOfPages: number;
    };
    inactiveList: {
      data: SupplierCentralDto[];
      page: string;
      limit: string;
      total: number;
      totalNumberOfPages: number;
    };
    orderMissedList: {
      data: SupplierCentralDto[];
      page: string;
      limit: string;
      total: number;
      totalNumberOfPages: number;
    };
  };
  statusCode: number;
}

export interface GetSupplierCategoryDetailsParams {
  category:
    | "total-suppliers"
    | "subscribed"
    | "missed-subscriptions"
    | "inactive"
    | "order-missed";
  page: number;
  limit: number;
  sortOrder: "ASC" | "DESC";
  search?: string;
  countryId?: string;
}

export interface SupplierCentralDto {
  _id: string;
  companyShortId: string;
  companyName: string;
  regNumber: string;
  createdAt: string; // ISO string from API
  countryId: string;
  countryName: string;
  location: {
    type?: string;
    coordinates?: number[];
    address: string;
  };
  plan: string; // Assume Plan enum as string
  expireDate: string; // ISO string from API
  hadPremium: boolean;
  hasMissedEnquiry: boolean;
  lastLogin: string; // ISO string from API
  missedQueriesCount: number;
  agentId: string;
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

export interface SendDigestPayload {
  supplierId: string;
  timePeriod?: "last_week" | "last_2weeks" | "last_month";
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
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

// individual full series type
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
  state: string;
  vehicleCategoryId: string;
  brandId: string;
}

// interface for the  Brand (GET BY ID) response
export interface FetchSpecificSeriesResponse {
  result: VehicleSeriesType;
  status: string;
  statusCode: number;
}

// individual series type
export interface SeriesListType {
  vehicleSeriesId: string;
  vehicleSeries: string;
  vehicleSeriesLabel: string;
}

// fetch all series type
export interface FetchAllSeriesResponse {
  status: string;
  result: {
    list: SeriesListType[];
    page: number;
    total: number;
    totalNumberOfPages: number;
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
  displayAddress: string;
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

// individual agent type
export interface PromotedAgent {
  companyId: string;
  agentId: string; //that short code eg: rd-1234
  companyName: string;
  companyLogo: string;
  companyLogoUrl: string;
}

// individual agent promotion card type
export interface PromotedCompanyCardType {
  state: {
    stateId: string;
    stateName: string;
  };
  category: {
    categoryId: string;
    categoryName: string;
  };
  agents: PromotedAgent[];
}

// agent promotion response
export interface FetchPromotedCompanyListResponse {
  result: {
    list: PromotedCompanyCardType[];
    page: string;
    limit: string;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface BlogType {
  blogTitle: string;
  blogDescription: string;
  blogImage: string;
  blogCategory: string;
  authorName: string;
  metaTitle: string;
  metaDescription: string;
  blogContent: string;
}

export interface FetchAllBlogsRequest {
  page: string;
  limit: string;
  sortOrder: "ASC" | "DESC";
  blogCategory?: string[];
}

// Admin Enquiries Types
export interface AdminEnquiry {
  _id: string;
  message: string;
  status: string;
  rentalStartDate: string;
  rentalEndDate: string;
  isMasked: boolean;
  createdAt: string;
  agent: {
    _id: string;
    name: string;
    email: string;
    companyName: string;
  };
  vehicle: {
    _id: string;
    name: string;
    vehicleCode: string;
    location: string;
    carLink: string;
  };
  user: {
    _id: string;
    name: string;
    phone: string;
    countryCode: string;
    email?: string;
  };
}

export interface EnquiryStatusCounts {
  NEW: number;
  CONTACTED: number;
  CANCELLED: number;
  DECLINED: number;
  AGENTVIEW: number;
  EXPIRED: number;
}

export interface EnquirySummary {
  totalEnquiries: number;
  newEnquiries: number;
  contactedEnquiries: number;
  cancelledEnquiries: number;
  declinedEnquiries: number;
  agentviewEnquiries: number;
  expiredEnquiries: number;
}

export interface AdminEnquiriesResponse {
  status: string;
  result: {
    list: AdminEnquiry[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
    statusCounts?: EnquiryStatusCounts;
    summary?: EnquirySummary;
  };
  statusCode: number;
}

// User Types
export interface OAuthProvider {
  provider: string;
  providerAccountId: string;
  createdAt: string;
}

export interface User {
  userId: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  countryCode: string | null;
  avatar: string | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isPasswordSet: boolean;
  isOAuthUser: boolean;
  oauthProviders: OAuthProvider[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    users: User[];
  };
}
