import { useQuery } from "@tanstack/react-query";
import { fetchAllStates } from "@/api/states";
import { useAdminContext } from "@/context/AdminContext";
import { useState } from "react";

export const useStateListQuery = ({
  enabled,
  parentStateId = null,
}: {
  enabled: boolean;
  parentStateId?: string | null;
}) => {
  const [filter, setFilter] = useState({
    count: null,
    searchTerm: "",
  });
  const { country } = useAdminContext();

  return {
    query: useQuery({
      queryKey: ["states", country.countryId, parentStateId, filter],
      queryFn: () =>
        fetchAllStates(
          country.countryId,
          false,
          parentStateId,
          filter.count,
          filter.searchTerm,
        ),
      enabled,
    }),
    filter,
    setFilter,
  };
};
