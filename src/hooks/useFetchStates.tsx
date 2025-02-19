import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StateType } from "@/types/api-types/vehicleAPI-types";
import { fetchAllStates } from "@/api/states";

export const useFetchStates = () => {
  const [selectedState, setSelectedState] = useState<StateType | null>(null);

  // Fetch categories
  const { data, isLoading: isStateLoading } = useQuery({
    queryKey: ["states"],
    queryFn: fetchAllStates,
  });

  const statesResult = data?.result || [];

  // Set default category to "cars"
  useEffect(() => {
    if (statesResult) {
      const defaultState = statesResult.find(
        (state) => state.stateValue === "dubai",
      );
      if (defaultState) {
        setSelectedState(defaultState);
      } else {
        setSelectedState(statesResult[0]);
      }
    }
  }, [statesResult]);

  return {
    selectedState,
    setSelectedState,
    statesList: statesResult,
    isStateLoading,
  };
};
