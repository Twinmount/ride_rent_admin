export type VehicleStatusType =
  | "ALL"
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

// rental details sub type
export type RentalDetailType = {
  enabled: boolean;
  rentInAED?: string;
  mileageLimit?: string;
};

// primary details form type
export type PrimaryFormType = {
  vehicleId?: string;
  vehicleCategoryId: string;
  vehicleTypeId: string;
  vehicleBrandId: string;
  vehicleModel: string;
  vehiclePhotos: string[]; // Array of  URLs
  vehicleRegistrationNumber: string;
  vehicleRegisteredYear: string;
  commercialLicenses: string[]; // Array of  URLs
  commercialLicenseExpireDate: Date;
  isLease: boolean;
  isCryptoAccepted: boolean;
  isSpotDeliverySupported: boolean;
  specification: "UAE_SPEC" | "USA_SPEC" | "OTHERS";
  rentalDetails: {
    day: RentalDetailType;
    week: RentalDetailType;
    month: RentalDetailType;
  };
  countryCode?: string;
  phoneNumber: string;
  stateId: string;
  cityIds: string[];
  description: string;
  services?: string[];
  securityDeposit: {
    enabled: boolean;
    amountInAED?: string;
  };
  paymentModes: {
    creditDebitCards: boolean;
    tabby: boolean;
  };
  hourlyRentals: {
    enabled: boolean;
    minBookingHours?: string;
    rentInAED?: string;
    mileageLimit?: string;
  };
};
