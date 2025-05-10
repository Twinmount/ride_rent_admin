export type VehicleStatusType =
  | "APPROVED"
  | "REJECTED"
  | "PENDING"
  | "UNDER_REVIEW";

export type CitiesType = {
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
};

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

type CityType = {
  _id?: string;
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
};

// Rental detail type for day, week, and month
type RentalDetailType = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
};

// Hourly rental detail type, which includes minBookingHours
type HourlyRentalDetailType = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
  minBookingHours: string;
};

// primary details form type
export type PrimaryFormType = {
  vehicleId?: string;
  vehicleCategoryId: string;
  vehicleTypeId: string;
  vehicleBrandId: string;
  vehicleSeriesId: string;
  vehicleModel: string;
  vehiclePhotos: string[]; // Array of  URLs
  vehicleRegistrationNumber: string;
  vehicleRegisteredYear: string;
  commercialLicenses: string[]; // Array of  URLs
  commercialLicenseExpireDate: Date | undefined;
  isLease: boolean;
  isCryptoAccepted: boolean;
  isSpotDeliverySupported: boolean;
  specification: "India_SPEC" | "UAE_SPEC" | "USA_SPEC" | "OTHERS";
  rentalDetails: {
    day: RentalDetailType;
    week: RentalDetailType;
    month: RentalDetailType;
    hour: HourlyRentalDetailType;
  };
  countryCode?: string;
  phoneNumber: string;
  stateId: string;
  cityIds: string[];
  description: string;
  vehicleTitle: string;
  vehicleTitleH1: string;
  additionalVehicleTypes?: string[];
  securityDeposit: {
    enabled: boolean;
    amountInAED?: string;
  };
  isCreditOrDebitCardsSupported: boolean;
  isTabbySupported: boolean;
  isCashSupported: boolean;
  vehicleMetaTitle: string;
  vehicleMetaDescription: string;
  tempCitys?: CityType[];
  location?: Location;
  isVehicleModified: boolean;
};

export type CompanyFormType = {};
