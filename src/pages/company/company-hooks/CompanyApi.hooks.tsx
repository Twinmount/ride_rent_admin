import { useAdminContext } from "@/context/AdminContext";
import { useQuery } from "@tanstack/react-query";
import { fetchPromotedCompanyList } from "../../../api/company/companyApi";

export const useFetchCompanyPromotionList = () => {
  const { state } = useAdminContext();

  return useQuery({
    queryKey: ["promoted-companies", state.stateId],
    queryFn: () =>
      fetchPromotedCompanyList({
        stateId: state.stateId,
      }),
    enabled: !!state.stateId,
  });
};
