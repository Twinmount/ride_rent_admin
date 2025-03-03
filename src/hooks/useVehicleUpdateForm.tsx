import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLevelsFilled, getPrimaryDetailsFormData } from "@/api/vehicle";
import { mapGetPrimaryFormToPrimaryFormType } from "@/helpers/form";
import { save, StorageKeys } from "@/utils/storage";

export type TabsTypes = "primary" | "specifications" | "features";

export const useVehicleUpdateForm = (vehicleId: string | undefined) => {
  const [activeTab, setActiveTab] = useState<TabsTypes>("primary");
  const queryClient = useQueryClient();

  // Fetch primary form data
  const { data, isLoading } = useQuery({
    queryKey: ["primary-details-form", vehicleId],
    queryFn: () => getPrimaryDetailsFormData(vehicleId as string),
    staleTime: 60000,
    enabled: !!vehicleId,
  });

  // Fetch levelsFilled
  const {
    data: levelsData,
    refetch: refetchLevels,
    isFetching: isLevelsFetching,
  } = useQuery({
    queryKey: ["getLevelsFilled", vehicleId],
    queryFn: () => getLevelsFilled(vehicleId as string),
    enabled: !!vehicleId,
  });

  // Calculate levels filled
  const levelsFilled = levelsData
    ? parseInt(levelsData.result.levelsFilled, 10)
    : 1;

  // Determine form states based on levels
  const isAddOrIncompleteSpecifications = levelsFilled < 2;
  const isAddOrIncompleteFeatures = levelsFilled < 3;

  // Format form data
  const formData = data
    ? mapGetPrimaryFormToPrimaryFormType(data.result)
    : null;

  // Extract necessary fields
  const vehicleCategoryId = data?.result?.vehicleCategoryId;
  const vehicleTypeId = data?.result?.vehicleTypeId;
  const initialCountryCode = data?.result?.countryCode;

  // Store vehicleCategoryId in localStorage if levelsFilled < 3
  useEffect(() => {
    if (levelsFilled < 3 && vehicleCategoryId && vehicleTypeId) {
      save(StorageKeys.CATEGORY_ID, vehicleCategoryId);
      save(StorageKeys.VEHICLE_TYPE_ID, vehicleTypeId);
    }
  }, [levelsFilled, vehicleCategoryId]);

  // Prefetch levelsFilled data
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["getLevelsFilled", vehicleId],
      queryFn: () => getLevelsFilled(vehicleId as string),
    });
  }, [vehicleId, queryClient]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabsTypes);
  };

  return {
    activeTab,
    setActiveTab: handleTabChange,
    formData,
    isLoading,
    levelsFilled,
    isLevelsFetching,
    refetchLevels,
    isAddOrIncompleteSpecifications,
    isAddOrIncompleteFeatures,
    initialCountryCode,
  };
};
