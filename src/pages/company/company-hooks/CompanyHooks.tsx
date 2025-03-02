import { useState } from "react";
import { useFetchCompanyPromotionList } from "./CompanyApi.hooks";

export default function usePromotedCompanies() {
  const [selectedAgentForDelete, setSelectedAgentForDelete] = useState<{
    companyId: string;
    stateId: string;
    categoryId: string;
  } | null>(null);
  const [selectedInfoForAdd, setSelectedInfoForAdd] = useState<{
    stateId: string;
    categoryId: string;
  } | null>(null);

  // fetching company promotion list
  const { data, isLoading } = useFetchCompanyPromotionList();

  const promotedCompaniesList = data?.result.list || [];

  const handleCloseDeleteModal = () => {
    setTimeout(() => {
      setSelectedAgentForDelete(null);
    }, 200); // Small delay to prevent premature clearing
  };

  const handleCloseAddModal = () => {
    setTimeout(() => {
      setSelectedInfoForAdd(null);
    }, 200); // Small delay to prevent premature clearing
  };

  return {
    selectedAgentForDelete,
    setSelectedAgentForDelete,
    selectedInfoForAdd,
    setSelectedInfoForAdd,
    promotedCompaniesList,
    isLoading,
    handleCloseDeleteModal,
    handleCloseAddModal,
  };
}
