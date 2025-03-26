import { useQuery } from "@tanstack/react-query";
import { fetchAllStates } from "@/api/states";

export const useStateListQuery = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["states"],
    queryFn: fetchAllStates,
    enabled,
  });
};
