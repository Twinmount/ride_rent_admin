import { useQuery } from "@tanstack/react-query";
import {
  getFeaturesFormData,
  getFeaturesFormFieldsData,
  getSpecificationFormFieldData,
  getSpecificationFormData,
} from "@/api/vehicle";

interface UseSpecificationFormQueryParams {
  vehicleId: string;
  vehicleCategoryId: string | undefined;
  vehicleTypeId: string | undefined;
  isAddOrIncomplete: boolean;
}

/**
 * A react query hook for fetching specification form data for a vehicle.
 *
 * If `isAddOrIncomplete` is true, it will fetch the form fields data for the
 * given `vehicleCategoryId`. If false, it will fetch the form data for the
 * given `vehicleId`.
 *
 * @param {string} vehicleId - The vehicle ID to fetch form data for.
 * @param {string | undefined} vehicleCategoryId - The vehicle category ID to
 *   fetch form fields data for if `isAddOrIncomplete` is true.
 * @param {string | undefined} vehicleTypeId - The vehicle type ID to fetch form
 *   fields data for if `isAddOrIncomplete` is true.
 * @param {boolean} isAddOrIncomplete - Whether to fetch the form fields data
 *   for the given vehicle category ID or the form data for the given vehicle
 *   ID.
 *
 * @returns {UseQueryResult<GetSpecificationFormFieldsResponse | GetSpecificationFormDataResponse>}
 */
export function useSpecificationFormQuery({
  vehicleId,
  vehicleCategoryId,
  vehicleTypeId,
  isAddOrIncomplete,
}: UseSpecificationFormQueryParams) {
  return useQuery({
    queryKey: [
      isAddOrIncomplete
        ? "specification-form-data"
        : "specification-update-form-data",
      vehicleId,
    ],

    queryFn: async () => {
      if (isAddOrIncomplete) {
        const data = await getSpecificationFormFieldData({
          vehicleCategoryId: vehicleCategoryId as string,
          vehicleTypeId: vehicleTypeId as string,
        });
        return {
          ...data,
          result: data.result.list,
        };
      } else {
        return await getSpecificationFormData(vehicleId);
      }
    },
    enabled: !!vehicleId,
  });
}

interface UseFeaturesFormQueryParams {
  vehicleId: string;
  vehicleCategoryId: string | undefined;
  isAddOrIncomplete: boolean;
}

/**
 * React query hook for fetching features form data for a vehicle.
 *
 * If `isAddOrIncomplete` is true, it will fetch the form fields data for the
 * given `vehicleCategoryId`. If false, it will fetch the form data for the
 * given `vehicleId`.
 *
 * @param {string} vehicleId - The vehicle ID to fetch form data for.
 * @param {string | undefined} vehicleCategoryId - The vehicle category ID to
 *   fetch form fields data for if `isAddOrIncomplete` is true.
 * @param {boolean} isAddOrIncomplete - Whether to fetch the form fields data
 *   for the given vehicle category ID or the form data for the given vehicle
 *   ID.
 *
 * @returns {UseQueryResult<GetFeaturesFormDataResponse | GetFeaturesFormFieldsResponse>}
 */
export function useFeaturesFormQuery({
  vehicleId,
  vehicleCategoryId,
  isAddOrIncomplete,
}: UseFeaturesFormQueryParams) {
  return useQuery({
    queryKey: [
      isAddOrIncomplete ? "features-form-data" : "features-update-form-data",
      vehicleId,
    ],
    queryFn: async () => {
      if (isAddOrIncomplete) {
        const data = await getFeaturesFormFieldsData({
          vehicleCategoryId: vehicleCategoryId as string,
        });
        return {
          ...data,
          result: data.result.list,
        };
      } else {
        return await getFeaturesFormData(vehicleId);
      }
    },
    enabled: !!vehicleId,
  });
}
