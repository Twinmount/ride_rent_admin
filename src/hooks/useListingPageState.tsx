import { CompanyType } from "@/types/api-types/vehicleAPI-types";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LiveListingVehicleType } from "@/types/api-types/vehicleAPI-types";

export type SortOrder = "ASC" | "DESC";
export type Limit = 10 | 15 | 20 | 30;

export function useListingPageState(
  defaultLimit: Limit = 10,
  defaultSort: SortOrder = "DESC",
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<Limit>(defaultLimit);
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
