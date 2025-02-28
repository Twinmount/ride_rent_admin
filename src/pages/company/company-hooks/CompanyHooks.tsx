import { useState } from "react";
import { useFetchCompanyPromotionList } from "./CompanyApi.hooks";

export default function usePromotedCompanies() {
  const [selectedAgentForDelete, setSelectedAgentForDelete] = useState<{
    companyId: string;
    stateId: string;
    categoryId: string;
  } | null>(null);
  const [selectedCategoryForAdd, setSelectedCategoryForAdd] = useState<{
    stateId: string;
    categoryId: string;
  } | null>(null);

  // fetching company promotion list
  const { data, isLoading } = useFetchCompanyPromotionList();

  const promotedCompanies = data?.result;

  return {
    selectedAgentForDelete,
    setSelectedAgentForDelete,
    selectedCategoryForAdd,
    setSelectedCategoryForAdd,
    promotedCompanies,
    isLoading,
  };
}
