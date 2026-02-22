import {
  PrimaryFormType,
  RidePromotionFormType,
  SRMCustomerDetailsFormType,
  SRMVehicleFormType,
  VehicleBucketFormType,
} from "@/types/formTypes";
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
  ListingMetaFormType,
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
  brandBodyContent: "",
  brandMetaTitle: "",
  brandMetaDescription: "",
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
  cityPageHeading: "",
  cityPageSubheading: "",
  cityMetaTitle: "",
  cityMetaDescription: "",
  cityBodyContent: "",
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
  vehicleCategoryId: "",
  type: "homepage" as const,
  title: "",
  subtitle: "",
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

export const ListingMetaFormDefaultValue: ListingMetaFormType = {
  stateId: "",
  categoryId: "",
  typeId: "",
  brandId: "",
  h1: "",
  h2: "",
  metaTitle: "",
  metaDescription: "",
};

// navbar origin dropdown temporary value/s
export const orgs = [{ id: "1", label: "UAE", value: "ae" }];

// primary details form default values
export const getPrimaryFormDefaultValues = (
  isIndia: boolean,
  countryCode: string,
): PrimaryFormType => ({
  vehicleCategoryId: "",
  vehicleTypeId: "", //'luxury' for example
  vehicleBrandId: "",
  vehicleSeriesId: "",
  vehicleModel: "",
  vehiclePhotos: [],
  thumbnail: "",
  vehicleVideos: [],
  vehicleRegistrationNumber: "",
  isFancyNumber: false,
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
  phoneNumber: countryCode.startsWith("+") ? countryCode : `+${countryCode}`,
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
  isUPISupported: false,
  vehicleMetaTitle: "",
  vehicleMetaDescription: "",
  tempCitys: [],
  location: undefined,
  displayAddress: "",
  isVehicleModified: false,
});

export const getSRMVehicleFormDefaultValue = (): SRMVehicleFormType => ({
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
  displayAddress: "",
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
  seriesBodyContent: "",
};

// Job form default values

export const JobFormDefaultValues: JobFormType = {
  jobtitle: "",
  jobdescription: "",
  location: "",
  date: "",
  level: "",
  experience: "",
  country: "",
  metaTitle: "",
  metaDescription: "",
  sections: [
    {
      title: "Section 1",
      points: ["Section point 1"],
    },
  ],
};

export const SRMCustomerDetailsFormDefaultValues: SRMCustomerDetailsFormType = {
  customerProfilePic: "",
  customerName: "", // Name of the Customer
  email: "",
  nationality: "", // Nationality of the user
  passportNumber: "", // Passport number
  passport: [], // Passport image
  drivingLicenseNumber: "", // Driving license number
  drivingLicense: [], // Driving license image
  phoneNumber: "", // Phone number with validation on minimum characters
};

export const RidePromotionFormDefaultValues: RidePromotionFormType = {
  sectionTitle: "",
  sectionSubtitle: "",
  cards: [
    {
      image: "",
      cardTitle: "",
      cardSubtitle: "",
      link: "",
    },
  ],
};

// form constants
export const SERVICE_OPTIONS = [
  {
    typeId: "429e89be-7a73-40d3-b149-a9c62b531d6b",
    label: "Car with Driver",
    value: "car-with-driver",
  },
  {
    typeId: "1373249a-9fca-4387-b6a3-1decc434e726",
    label: "Airport Pickup",
    value: "airport-pickup",
  },
  {
    typeId: "de553fb6-84a5-46a4-8e27-71640dfb7b74",
    label: "Monthly Rentals",
    value: "monthly-rentals",
  },
  {
    typeId: "029703ed-928a-4cf0-8c0e-d160670b12da",
    label: "Self Drive",
    value: "self-drive",
  },
  {
    typeId: "bff5a872-8113-46ae-bcf4-70c37386a3af",
    label: "Desert Safari",
    value: "desert-safari",
  },
];

export const VEHICLE_BUCKET_MODES_ENUM = {
  VEHICLE_CODE: "VEHICLE_CODE",
  VEHICLE_TYPE: "VEHICLE_TYPE",
  LOCATION_COORDINATES: "LOCATION_COORDINATES",
  VEHICLE_SERIES: "VEHICLE_SERIES",
} as const;

// Vehicle Bucket Mode Options
export const VEHICLE_BUCKET_MODES = [
  {
    label: "Vehicle Code Mode",
    value: VEHICLE_BUCKET_MODES_ENUM.VEHICLE_CODE,
    description:
      "Manually select up to 30 specific vehicles using vehicle codes",
  },
  {
    label: "Vehicle Type Mode",
    value: VEHICLE_BUCKET_MODES_ENUM.VEHICLE_TYPE,
    description:
      "Automatically fetch vehicles of a specific type using vehicle type",
  },
  {
    label: "Location Co-ordinates Mode",
    value: VEHICLE_BUCKET_MODES_ENUM.LOCATION_COORDINATES,
    description:
      "Automatically fetch vehicles near specific coordinates within a specific state/vehicle type",
  },
  {
    label: "Vehicle Series Mode",
    value: VEHICLE_BUCKET_MODES_ENUM.VEHICLE_SERIES,
    description: "Automatically fetch vehicles of a specific vehicle series",
  },
] as const;

export type VehicleBucketModeType =
  (typeof VEHICLE_BUCKET_MODES_ENUM)[keyof typeof VEHICLE_BUCKET_MODES_ENUM];

export const VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS = {
  POPULAR_RENTAL_SEARCHES: "POPULAR_RENTAL_SEARCHES",
  POPULAR_VEHICLE_PAGES: "POPULAR_VEHICLE_PAGES",
} as const;

export const VEHICLE_BUCKET_DISPLAY_GROUP_FILTER_DROPDOWN_OPTIONS: {
  label: string;
  value: string;
}[] = [
  {
    label: "Popular Rental Searches (Left Box)",
    value: "POPULAR_RENTAL_SEARCHES",
  },
  {
    label: "Popular Vehicle Pages (Right Box)",
    value: "POPULAR_VEHICLE_PAGES",
  },
];

export const VEHICLE_BUCKET_MODE_FILTER_DROPDOWN_OPTIONS = [
  {
    label: "All (Mode)",
    value: "all",
  },
  {
    label: "Vehicle Code Mode",
    value: VEHICLE_BUCKET_MODES_ENUM.VEHICLE_CODE,
  },
  {
    label: "Vehicle Type Mode",
    value: VEHICLE_BUCKET_MODES_ENUM.VEHICLE_TYPE,
  },
  {
    label: "Vehicle Series Mode",
    value: VEHICLE_BUCKET_MODES_ENUM.VEHICLE_SERIES,
  },
  {
    label: "Location Co-ordinates Mode",
    value: VEHICLE_BUCKET_MODES_ENUM.LOCATION_COORDINATES,
  },
];

export const VEHICLE_BUCKET_MAX_VEHICLE_CODE_LIMIT = 30;

export const VehicleBucketFormDefaultValues: VehicleBucketFormType = {
  vehicleBucketMode: VEHICLE_BUCKET_MODES_ENUM.VEHICLE_CODE,
  stateId: "",
  displayGroup: VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS.POPULAR_RENTAL_SEARCHES,
  vehicleBucketName: "",
  vehicleBucketValue: "",
  linkText: "",
  vehicleCodes: [],
  vehicleCategoryId: "",
  vehicleTypeId: "",
  location: undefined,
  vehicleBrandId: "",
  vehicleSeriesId: "",
  vehicleBucketDescription: "",
  pageHeading: "",
  pageSubheading: "",
  metaTitle: "",
  metaDescription: "",
};

// form text fields size limits
export const TEXT_LIMITS = {
  DESCRIPTION: 500,
  DETAILED_DESCRIPTION: 2000,
  META_DESCRIPTION: 180,
} as const;
