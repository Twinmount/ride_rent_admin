import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAdminContext } from "@/context/AdminContext";
import { countryType, NavbarStateType, stateType } from "@/types/types";
import {
  getAllVehicleListingByParentStateCount,
  getAllVehicleListingCount,
} from "@/api/vehicle";
import { useCountryListQuery } from "./query/useCountryListQuery";
import { fetchAllStates } from "@/api/states";

const LOCAL_STORAGE_KEY = "selectedState";
const LOCAL_STORAGE_PARENT_KEY = "selectedParentState";
const LOCAL_STORAGE_COUNTRY_KEY = "selectedCountry";

export function useFetchGlobalStates() {
  const { state, setState, setCountry, country, parentState, setParentState } =
    useAdminContext();

  const stateListQuery = useCountryListQuery({ enabled: true });
  const { data: countryList, isLoading: isCountryLoading } =
    !!stateListQuery && stateListQuery;

  const { data: parentStateList, isLoading: isParentStateLoading } = useQuery({
    queryKey: ["parent-states-with-listing-count", country.countryId],
    queryFn: () => fetchAllStates(country.countryId, true),
    enabled:
      !!country.countryValue &&
      !isCountryLoading &&
      country.countryValue === "India",
    staleTime: 0,
  });

  const {
    data,
    isLoading: isStateLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "states-with-listing-count",
      country.countryId,
      parentState?.stateId ?? null,
    ],
    queryFn: () =>
      country.countryValue === "India"
        ? getAllVehicleListingByParentStateCount(
            country.countryId,
            parentState.stateId,
          )
        : getAllVehicleListingCount(country.countryId),
    enabled:
      country.countryValue === "India"
        ? !!country.countryValue && !isCountryLoading && !!parentState.stateId
        : !!country.countryValue && !isCountryLoading,
    staleTime: 0,
  });

  const options: NavbarStateType[] = data?.result || [];
  const parentSatetOptions: stateType[] = parentStateList?.result || [];
  const countryOption: countryType[] = countryList?.result || [];
  const isLoading = isCountryLoading || isStateLoading || isParentStateLoading;

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
    if (!isParentStateLoading && parentSatetOptions.length) {
      const storedState = localStorage.getItem(LOCAL_STORAGE_PARENT_KEY);
      const parsedState = storedState ? JSON.parse(storedState) : null;

      if (parsedState) {
        setParentState(parsedState);
      } else {
        setParentState(parentSatetOptions[0]);
      }
    }
  }, [isParentStateLoading, parentSatetOptions, setParentState]);

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
    if (parentState.stateId) {
      localStorage.setItem(
        LOCAL_STORAGE_PARENT_KEY,
        JSON.stringify(parentState),
      );
    }
  }, [parentState]);

  useEffect(() => {
    if (country.countryId) {
      localStorage.setItem(LOCAL_STORAGE_COUNTRY_KEY, JSON.stringify(country));
    }
  }, [country]);

  return {
    options,
    countryOption,
    isLoading,
    isError,
    error,
    parentSatetOptions,
  };
}
