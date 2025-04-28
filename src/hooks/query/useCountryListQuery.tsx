import { useQuery } from "@tanstack/react-query";
import { fetchAllCountry } from "@/api/states";

export const useCountryListQuery = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["country"],
    queryFn: fetchAllCountry,
    enabled,
  });
};

