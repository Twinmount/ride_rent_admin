import { PrimaryFormType } from "@/types/formTypes";
import {
  BlogFormType,
  BrandFormType,
  CategoryFormType,
  CityFormType,
  CompanyFormType,
  CompanyStatusFormType,
  CountryFormType,
  StateFormType,
  VehicleSeriesType,
  VehicleTypeFormType,
} from "@/types/types";
import {
  CarFront,
  FileSearch,
  FileText,
  LayoutDashboard,
  List,
  MapPin,
  Megaphone,
  Star,
  UserPlus,
} from "lucide-react";

// sidebar content
export const sidebarContent = [
  { label: "Dashboard", icon: LayoutDashboard, link: "/" },
  { label: "Live Listings", icon: List, link: "/listings" },
  {
    label: "Agents",
    icon: UserPlus,
    link: "/registrations",
  },
  {
    label: "Categories & Types",
    icon: CarFront,
    link: "/vehicle",
  },
  { label: "Brands", icon: Star, link: "/manage-brands" },
  { label: "Locations", icon: MapPin, link: "/locations" },
  { label: "Links & Promotions", icon: Megaphone, link: "/marketing" },
  { label: "Blogs", icon: FileText, link: "/happenings" },
  { label: "Meta Data", icon: FileSearch, link: "/meta-data" },
];

// Vehicle type form default values
export const VehicleTypeFormDefaultValues: VehicleTypeFormType = {
  name: "",
  value: "",
};

// Vehicle type form default values
export const BrandFormDefaultValues: BrandFormType = {
  brandName: "",
  brandValue: "",
  vehicleCategoryId: "",
  brandLogo: "",
};

// State form default values
export const StateFormDefaultValues: StateFormType = {
  stateId: "",
  stateName: "",
  stateValue: "",
  stateImage: "",
  relatedStates: [""],
};

export const CountryFormDefaultValues: CountryFormType = {
  countryId: "",
  countryName: "",
  countryValue: "",
};

export const CityFormDefaultValues: CityFormType = {
  cityName: "",
  cityValue: "",
};

// Vehicle Category form default values
export const CategoryFormDefaultValues: CategoryFormType = {
  name: "",
  value: "",
};

// Link form default values
export const LinkFormDefaultValues = {
  label: "",
  link: "",
};

// Link form default values
export const RecommendedLinkFormDefaultValues = {
  label: "",
  link: "",
};

// ads form default values
export const PromotionFormDefaultValue = {
  promotionImage: "",
  promotionLink: "",
};

// blog promotion form default values
export const BlogPromotionFormDefaultValue = {
  promotionImage: "",
  promotionLink: "",
};

export const HomeMetaFormDefaultValue = {
  stateId: "",
  categoryId: "",
  metaTitle: "",
  metaDescription: "",
};

export const ListingMetaFormDefaultValue = {
  stateId: "",
  categoryId: "",
  typeId: "",
  metaTitle: "",
  metaDescription: "",
};

// navbar origin dropdown temporary value/s
export const orgs = [{ id: "1", label: "UAE", value: "uae" }];

// primary details form default values
export const getPrimaryFormDefaultValues = (
  isIndia: boolean,
): PrimaryFormType => ({
  vehicleCategoryId: "",
  vehicleTypeId: "", //'luxury' for example
  vehicleBrandId: "",
  vehicleSeriesId: "",
  vehicleModel: "",
  vehiclePhotos: [], //upto 8 photos of the vehicle
  vehicleRegistrationNumber: "",
  vehicleRegisteredYear: "",
  commercialLicenses: [],
  commercialLicenseExpireDate: undefined,
  isLease: false,
  isCryptoAccepted: false,
  isSpotDeliverySupported: false,
  specification: isIndia ? "India_SPEC" : "UAE_SPEC",
  rentalDetails: {
    day: { enabled: false, rentInAED: "", mileageLimit: "" },
    week: { enabled: false, rentInAED: "", mileageLimit: "" },
    month: { enabled: false, rentInAED: "", mileageLimit: "" },
    hour: {
      enabled: false,
      minBookingHours: "",
      rentInAED: "",
      mileageLimit: "",
    },
  },
  phoneNumber: "",
  stateId: "",
  cityIds: [],
  description: "",
  vehicleTitle: "",
  vehicleTitleH1: "",
  additionalVehicleTypes: [],
  securityDeposit: {
    enabled: false,
    amountInAED: "",
  },
  isCreditOrDebitCardsSupported: false,
  isTabbySupported: false,
  isCashSupported: false,
  vehicleMetaTitle: "",
  vehicleMetaDescription: "",
  tempCitys: [],
  location: undefined,
  isVehicleModified: false,
});

// login page default value
export const LoginPageDefaultValues = {
  phoneNumber: "",
  password: "",
};

// Company registration phase 2 form default values
export const CompanyFormDefaultValues: CompanyFormType = {
  companyName: "",
  companyLogo: "",
  commercialLicense: "",
  expireDate: new Date(),
  regNumber: "",
  phoneNumber: "",
  email: "",
  companyAddress: "", // Default empty value
  companyLanguages: [],
  companyMetaTitle: "",
  companyMetaDescription: "",
  location: undefined,
};

// Company registration phase 2 form default values
export const CompanyStatusFormDefaultValues: CompanyStatusFormType = {
  approvalStatus: "PENDING",
  rejectionReason: "",
};

// Blog form default values
export const BlogFormDefaultValues: BlogFormType = {
  blogTitle: "",
  blogDescription: "",
  blogImage: "",
  blogImagePath: "",
  blogCategory: "",
  authorName: "",
  metaTitle: "",
  metaDescription: "",
  blogContent: "",
};

// tags array
export const categoryTags = [
  { label: "All", value: "all" },
  { label: "Design", value: "design" },
  { label: "Engineering", value: "engineering" },
  { label: "Automotive", value: "automotive" },
  { label: "News", value: "news" },
  { label: "Travel", value: "travel" },
];

export const VehicleSeriesFormDefaultValues: VehicleSeriesType = {
  state: "",
  vehicleCategoryId: "",
  brandId: "",
  vehicleSeries: "",
  vehicleSeriesLabel: "",
  vehicleSeriesPageHeading: "",
  vehicleSeriesPageSubheading: "",
  vehicleSeriesInfoTitle: "",
  vehicleSeriesInfoDescription: "",
  vehicleSeriesMetaTitle: "",
  vehicleSeriesMetaDescription: "",
};
