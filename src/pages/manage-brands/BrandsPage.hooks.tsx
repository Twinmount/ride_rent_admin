import { fetchAllBrands } from "@/api/brands";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useFetchBrands({
  vehicleCategoryId,
  searchQuery,
}: {
  vehicleCategoryId: string;
  searchQuery: string;
}) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Fetch brands after category is selected
  const { data: brandData, isLoading: isBrandsLoading } = useQuery({
    queryKey: ["brands", vehicleCategoryId, searchQuery, page],
    queryFn: () =>
      fetchAllBrands({
        page,
        limit: 20,
        sortOrder: "ASC",
        vehicleCategoryId: vehicleCategoryId as string,
        search: searchQuery,
      }),
    enabled: !!vehicleCategoryId,
  });

  // navigate to the selected category
  useEffect(() => {
    if (vehicleCategoryId) {
      navigate(`/manage-brands/${vehicleCategoryId}`);
    }
  }, [vehicleCategoryId]);

  return {
    brandData,
    isBrandsLoading,
    page,
    setPage,
  };
}
