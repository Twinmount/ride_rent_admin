import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAdminContext } from "@/context/AdminContext";
import { countryType, NavbarStateType } from "@/types/types";
import { getAllVehicleListingCount } from "@/api/vehicle";
import { useCountryListQuery } from "./query/useCountryListQuery";

const LOCAL_STORAGE_KEY = "selectedState";
const LOCAL_STORAGE_COUNTRY_KEY = "selectedCountry";

export function useFetchGlobalStates() {
  const { state, setState, setCountry, country } = useAdminContext();

  const stateListQuery = useCountryListQuery({ enabled: true });
  const { data: countryList, isLoading: isCountryLoading } =
    !!stateListQuery && stateListQuery;

  const {
    data,
    isLoading: isStateLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["states-with-listing-count", country.countryId],
    queryFn: () => getAllVehicleListingCount(country.countryId),
    enabled: !!country.countryValue && !isCountryLoading,
    staleTime: 0,
  });

  const options: NavbarStateType[] = data?.result || [];
  const countryOption: countryType[] = countryList?.result || [];
  const isLoading = isCountryLoading || isStateLoading;

  useEffect(() => {
    if (!isCountryLoading && countryOption.length) {
      const storedCountry = localStorage.getItem(LOCAL_STORAGE_COUNTRY_KEY);
      const parsedCountry = storedCountry ? JSON.parse(storedCountry) : null;

      if (parsedCountry) {
        setCountry(parsedCountry);
      } else {
        const uaeCountry = countryOption.find(
          (s) => s.countryValue.toLowerCase() === "UAE",
        );
        setCountry(uaeCountry || countryOption[0]);
      }
    }
  }, [isCountryLoading, countryOption, setCountry]);

  useEffect(() => {
    if (!isStateLoading && options.length) {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedState = storedState ? JSON.parse(storedState) : null;

      if (parsedState) {
        setState(parsedState);
      } else {
        const dubaiState = options.find(
          (s) => s.stateValue.toLowerCase() === "dubai",
        );
        setState(dubaiState || options[0]);
      }
    }
  }, [isStateLoading, options, setState]);

  // Save selected state to localStorage when it changes
  useEffect(() => {
    if (state.stateId) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    if (country.countryId) {
      localStorage.setItem(LOCAL_STORAGE_COUNTRY_KEY, JSON.stringify(country));
    }
  }, [country]);

  return { options, countryOption, isLoading, isError, error };
}
