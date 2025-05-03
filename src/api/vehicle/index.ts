import { PrimaryFormType } from "@/types/formTypes.ts";

export * from "./vehicleApi.ts";

// Helper to build the shared request body fields
export const buildCommonPrimaryDetails = (
  values: PrimaryFormType,
  countryCode: string,
  phoneNumber: string,
  isCarsCategory: boolean,
): Record<string, any> => {
  return {
    countryCode,
    vehicleCategoryId: values.vehicleCategoryId,
    vehicleTypeId: values.vehicleTypeId,
    vehicleBrandId: values.vehicleBrandId,
    vehicleSeriesId: values.vehicleSeriesId,
    vehicleModel: values.vehicleModel,
    vehicleRegistrationNumber: values.vehicleRegistrationNumber,
    vehicleRegisteredYear: values.vehicleRegisteredYear,
    commercialLicenseExpireDate:
      values.commercialLicenseExpireDate?.toISOString(),
    isLease: values.isLease.toString(),
    isCryptoAccepted: values.isCryptoAccepted.toString(),
    isSpotDeliverySupported: values.isSpotDeliverySupported.toString(),
    description: values.description,
    vehicleTitle: values.vehicleTitle,
    vehicleTitleH1: values.vehicleTitleH1,
    specification: values.specification,
    phoneNumber,
    stateId: values.stateId,
    cityIds: values.cityIds,
    rentalDetails: JSON.stringify(values.rentalDetails),
    vehiclePhotos: values.vehiclePhotos,
    commercialLicenses: values.commercialLicenses,
    securityDeposit: values.securityDeposit,
    isCreditOrDebitCardsSupported: values.isCreditOrDebitCardsSupported,
    isTabbySupported: values.isTabbySupported,
    isCashSupported: values.isCashSupported,
    vehicleMetaTitle: values.vehicleMetaTitle,
    vehicleMetaDescription: values.vehicleMetaDescription,
    location: values.location,
    // Include additionalVehicleTypes only if isCarsCategory is true
    ...(isCarsCategory && {
      additionalVehicleTypes: values.additionalVehicleTypes || [],
    }),
    tempCitys: values.tempCitys,
  };
};
