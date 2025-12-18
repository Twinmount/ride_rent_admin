import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFaqTemplate,
  getLevelsFilled,
  getPrimaryDetailsFormData,
  resetFaqFn,
  upadteFaqFn,
} from "@/api/vehicle";
import { mapGetPrimaryFormToPrimaryFormType } from "@/helpers/form";
import { save, StorageKeys } from "@/utils/storage";

export type TabsTypes = "primary" | "specifications" | "features" | "faq";

export const useVehicleUpdateForm = (
  vehicleId: string | undefined,
  isIndia: boolean,
) => {
  const [activeTab, setActiveTab] = useState<TabsTypes>("primary");
  const queryClient = useQueryClient();

  // Fetch primary form data
  const { data, isLoading } = useQuery({
    queryKey: ["primary-details-form", vehicleId],
    queryFn: () => getPrimaryDetailsFormData(vehicleId as string),
    staleTime: 0,
    gcTime: 0,
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
    staleTime: 0,
    gcTime: 0,
    enabled: !!vehicleId,
  });

  const { data: faqData, isFetching: isFaqFetching } = useQuery({
    queryKey: ["faq-template", vehicleId],
    queryFn: () => getFaqTemplate(vehicleId as string),
    staleTime: 0,
    gcTime: 0,
    enabled: !!vehicleId && activeTab === "faq",
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
    ? mapGetPrimaryFormToPrimaryFormType(data.result, isIndia)
    : null;

  // Extract necessary fields
  const vehicleCategoryId = data?.result?.vehicleCategoryId;
  const vehicleTypeId = data?.result?.vehicleTypeId;
  const initialCountryCode =
    data?.result?.countryCode || (isIndia ? "+91" : "+971");

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
      staleTime: 0,
    });
  }, [vehicleId, queryClient]);

  const updateFaqMutation = useMutation({
    mutationFn: upadteFaqFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-template", vehicleId] });
    },
    onError: (err) => {
      console.error("Error adding agent:", err);
    },
  });

  const resetFaqMutation = useMutation({
    mutationFn: resetFaqFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-template", vehicleId] });
    },
    onError: (err) => {
      console.error("Error adding agent:", err);
    },
  });

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
    isFaqFetching,
    faqData,
    updateFaqMutation,
    resetFaqMutation,
  };
};
