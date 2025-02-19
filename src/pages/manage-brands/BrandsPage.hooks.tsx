import { fetchAllBrands } from "@/api/brands";
import { useQuery } from "@tanstack/react-query";

export default function useFetchBrands({
  vehicleCategoryId,
  searchQuery,
  page,
  isCategoryLoading,
}: {
  vehicleCategoryId: string;
  searchQuery: string;
  page: number;
  isCategoryLoading: boolean;
}) {
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
    enabled: !!vehicleCategoryId && !isCategoryLoading,
  });

  return {
    brandData,
    isBrandsLoading,
  };
}
