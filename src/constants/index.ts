import { PrimaryFormType } from "@/types/formTypes";
import {
  AdvisorBlogFormType,
  BlogFormType,
  BrandFormType,
  CategoryFormType,
  CityFormType,
  CompanyFormType,
  CompanyStatusFormType,
  CountryFormType,
  JobFormType,
  StateFormType,
  VehicleSeriesType,
  VehicleTypeFormType,
} from "@/types/types";

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
  isFavorite: false,
  stateIcon: "",
  location: {
    lat: 0,
    lng: 0,
    address: "",
  },
  iconConfig: {
    iconName: "",
    bgColor: "#ffffff",
    strokeColor: "#000000",
    strokeWidth: "1",
  },
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
  blogPromotionPlacement: "",
};
export const AdvisorPromotionFormDefaultValue = {
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
export const orgs = [{ id: "1", label: "UAE", value: "ae" }];

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
  vehicleVideos: [],
  vehicleRegistrationNumber: "",
  vehicleRegisteredYear: "",
  commercialLicenses: [],
  commercialLicenseExpireDate: undefined,
  isLease: false,
  isCryptoAccepted: false,
  isSpotDeliverySupported: false,
  specification: isIndia ? "India_SPEC" : "UAE_SPEC",
  rentalDetails: {
    day: {
      enabled: false,
      rentInAED: "",
      mileageLimit: "",
      unlimitedMileage: false,
    },
    week: {
      enabled: false,
      rentInAED: "",
      mileageLimit: "",
      unlimitedMileage: false,
    },
    month: {
      enabled: false,
      rentInAED: "",
      mileageLimit: "",
      unlimitedMileage: false,
    },
    hour: {
      enabled: false,
      minBookingHours: "",
      rentInAED: "",
      mileageLimit: "",
      unlimitedMileage: false,
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
  blogCategory: "design",
  authorName: "",
  metaTitle: "",
  metaDescription: "",
  blogContent: "",
};
export const AdvisorBlogFormDefaultValues: AdvisorBlogFormType = {
  blogTitle: "",
  blogDescription: "",
  blogImage: "",
  blogImagePath: "",
  blogCategory: "discover",
  authorName: "",
  metaTitle: "",
  metaDescription: "",
  blogContent: "",
};

export type CategoryTagsType = {
  label: string;
  value: string;
}[];
// tags array
export const rideBlogCategoryTags: CategoryTagsType = [
  { label: "All", value: "all" },
  { label: "Design", value: "design" },
  { label: "Engineering", value: "engineering" },
  { label: "Automotive", value: "automotive" },
  { label: "News", value: "news" },
  { label: "Travel", value: "travel" },
];

export const advisorBlogCategoryTags: CategoryTagsType = [
  { label: "All", value: "all" },
  { label: "Discover", value: "discover" },
  { label: "Experiences", value: "experiences" },
  { label: "Insights", value: "insights" },
  { label: "What's Buzzing", value: "whats-buzzing" },
  { label: "News", value: "news" },
];

export const blogPromotionPlacement = [
  { label: "Recommended Deals (Top Right)", value: "recommended-deals" },
  { label: "Popular List (Side List)", value: "popular-list" },
  { label: "Bottom Banner (Bottom Wide)", value: "bottom-banner" },
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

// Blog form default values
export const JobFormDefaultValues: JobFormType = {
  jobtitle: "",
  jobdescription: "",
  location: "",
  date: "",
  level: "",
  experience: "",
  sections: [
    {
      title: "Section 1",
      points: ["Section point 1"],
    },
  ],
};
