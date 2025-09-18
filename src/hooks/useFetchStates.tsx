import { useQuery } from "@tanstack/react-query";
import { fetchAllStates } from "@/api/states";
import { useAdminContext } from "@/context/AdminContext";
import { useImmer } from "use-immer";

type filterType = {
  count: number | null;
  searchTerm: string | null;
  stateId: string | null;
};

export const useFetchStates = (
  parentStateId: string | null = null,
  enabled = true,
) => {
  const [filter, setFilter] = useImmer<filterType>({
    count: 20,
    searchTerm: null,
    stateId: null,
  });

  const { country } = useAdminContext();
  // Fetch categories
  const { data, isLoading: isStateLoading } = useQuery({
    queryKey: ["states", country.countryId, parentStateId, filter],
    queryFn: () =>
      fetchAllStates(
        country.countryId,
        false,
        parentStateId,
        filter.count,
        filter.searchTerm,
        filter.stateId,
      ),
    enabled: enabled,
  });

  const statesResult = data?.result || [];

  return {
    statesList: statesResult,
    isStateLoading,
    filter,
    setFilter,
  };
};
