import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAdminContext } from "@/context/AdminContext";
import { NavbarStateType } from "@/types/types";
import { getAllVehicleListingCount } from "@/api/vehicle";

const LOCAL_STORAGE_KEY = "selectedState";

export function useFetchGlobalStates() {
  const { state, setState } = useAdminContext();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["states-with-listing-count"],
    queryFn: getAllVehicleListingCount,
    staleTime: 0,
  });

  const options: NavbarStateType[] = data?.result || [];

  // Sync selected state with localStorage
  useEffect(() => {
    if (!isLoading && options.length) {
      // Try to get stored state from localStorage
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedState = storedState ? JSON.parse(storedState) : null;

      if (parsedState) {
        setState(parsedState); // Restore user's selection
      } else {
        // Default to Dubai if no previous selection
        const dubaiState = options.find(
          (s) => s.stateValue.toLowerCase() === "dubai",
        );
        setState(dubaiState || options[0]); // Default to Dubai or first option
      }
    }
  }, [isLoading, options, setState]);

  // Save selected state to localStorage when it changes
  useEffect(() => {
    if (state.stateId) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  return { options, isLoading, isError, error };
}
