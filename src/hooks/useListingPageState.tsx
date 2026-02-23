import { CompanyType } from "@/types/api-types/vehicleAPI-types";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LiveListingVehicleType } from "@/types/api-types/vehicleAPI-types";
import { LimitType } from "@/types/types";

export type SortOrder = "ASC" | "DESC";

export function useListingPageState(
  defaultLimit: LimitType = 10,
  defaultSort: SortOrder = "DESC",
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<LimitType>(defaultLimit);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSort);
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(
    null,
  );
  const [isHighPriority, setIsHighPriority] = useState(false);
  const [offerDialogVehicle, setOfferDialogVehicle] =
    useState<LiveListingVehicleType | null>(null);

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search")?.trim() || "";

  return {
    page,
    setPage,
    limit,
    setLimit,
    sortOrder,
    setSortOrder,
    searchTerm,
    selectedCompany,
    setSelectedCompany,
    isHighPriority,
    setIsHighPriority,
    offerDialogVehicle,
    setOfferDialogVehicle,
  };
}
