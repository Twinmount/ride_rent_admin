import { z } from "zod";
import {
  RidePromotionCardSchema,
  RidePromotionFormSchema,
  SRMCustomerDetailsFormSchema,
} from "@/lib/validator";

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

type RentalDetailType = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
  unlimitedMileage: boolean;
};

type HourlyRentalDetailType = RentalDetailType & {
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
  vehiclePhotos: string[];
  thumbnail: string | null;
  vehicleVideos: string[];
  vehicleRegistrationNumber: string;
  isFancyNumber: boolean;
  vehicleRegisteredYear: string;
  commercialLicenses: string[];
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
  isUPIAccepted: boolean;
  vehicleMetaTitle: string;
  vehicleMetaDescription: string;
  tempCitys?: CityType[];
  location?: Location;
  isVehicleModified: boolean;
  disablePriceMatching?: boolean;
};

export type CompanyFormType = {};

export type SRMCustomerDetailsFormType = z.infer<
  typeof SRMCustomerDetailsFormSchema
>;

export type RentalDetailsFormFieldType = {
  day: RentalDetailType;
  week: RentalDetailType;
  month: RentalDetailType;
  hour: HourlyRentalDetailType;
};

export type SRMVehicleFormType = {
  rentalDetails: RentalDetailsFormFieldType;
};

/**
 * Type for a single promotion vehicle card
 */
export type RidePromotionCardType = z.infer<typeof RidePromotionCardSchema>;

/**
 * Type for the entire promotion form
 */
export type RidePromotionFormType = z.infer<typeof RidePromotionFormSchema>;

export type FAQItemType = {
  question: string;
  answer: string;
};
