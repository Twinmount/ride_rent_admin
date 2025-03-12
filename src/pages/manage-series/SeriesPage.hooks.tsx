import { fetchAllBrands } from "@/api/brands";
import { fetchAllSeries } from "@/api/vehicle-series";
import { useQuery } from "@tanstack/react-query";

export const useFetchSeriesBrands = ({
  vehicleCategoryId,
  searchQuery,
}: {
  vehicleCategoryId: string;
  searchQuery: string;
}) => {
  // Fetch brands after category is selected
  const { data: brandData, isLoading: isBrandsLoading } = useQuery({
    queryKey: ["brands", vehicleCategoryId, searchQuery],
    queryFn: () =>
      fetchAllBrands({
        page: 1,
        limit: 10,
        sortOrder: "ASC",
        vehicleCategoryId: vehicleCategoryId,
        search: searchQuery,
      }),
    enabled: !!vehicleCategoryId,
  });

  const brands = brandData?.result?.list || [];

  return {
    brands,
    isBrandsLoading,
  };
};

export const useFetchSeries = ({
  vehicleBrandId,
  stateId,
  searchTerm,
  page,
}: {
  vehicleBrandId?: string;
  stateId: string;
  searchTerm: string;
  page: number;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["searchSeries", stateId, page, vehicleBrandId, searchTerm],
    queryFn: async () =>
      await fetchAllSeries({
        search: searchTerm,
        brandId: vehicleBrandId,
        stateId,
        page,
      }),
    enabled: !!stateId,
    staleTime: 0,
  });

  const seriesList = data?.result?.list || [];
  const totalNumberOfPages = data?.result?.totalNumberOfPages || 1;

  return {
    seriesList,
    isLoading,
    totalNumberOfPages,
  };
};
