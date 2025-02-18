import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import GridSkelton from "@/components/skelton/GridSkelton";
import Pagination from "@/components/Pagination";
import SearchComponent from "@/components/Search";

import CategoryDropdown from "@/components/VehicleCategoryDropdown";
import { CategoryType } from "@/types/api-types/API-types";
import { fetchAllCategories } from "@/api/vehicle-categories";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBrands } from "@/api/brands";

export default function ManageBrandsPage() {
  const navigate = useNavigate();
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>();
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | undefined
  >();

  const [searchParams] = useSearchParams();

  //vehicle categories fetching for dropdown
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories({ page: 1, limit: 20, sortOrder: "ASC" }),
  });

  // redirecting to "/manage-brands/categoryId" route as soon as the category data is fetched
  // useEffect(() => {
  //   if (isSuccess) {
  //     const categories = categoryData?.result?.list || [];
  //     if (!vehicleCategoryId && categories.length > 0) {
  //       const firstCategory = categories[0];
  //       navigate(`/manage-brands/${firstCategory.categoryId}`, {
  //         replace: true,
  //       });
  //     }
  //   }
  // }, [isSuccess, categoryData, vehicleCategoryId, navigate]);

  // destructuring the "categories" from categoryData
  const { list: categories = [] } = categoryData?.result || {};

  // Brands fetching after category is fetched
  const {
    data: brandData,
    isLoading: isBrandsLoading,
    refetch: refetchBrands,
  } = useQuery({
    queryKey: ["brands", vehicleCategoryId, page],
    queryFn: () =>
      fetchAllBrands({
        page: page,
        limit: 20,
        sortOrder: "ASC",
        vehicleCategoryId: vehicleCategoryId as string, // ensure this is non-null
        search: searchParams.get("search")?.trim() || "",
      }),

    enabled: !!vehicleCategoryId && !isCategoryLoading,
  });

  // destructuring brandData
  const brandList = brandData?.result?.list || [];

  const baseAssetsUrl = import.meta.env.VITE_ASSETS_URL;

  // setting selected category
  useEffect(() => {
    if (vehicleCategoryId && categoryData) {
      const selected = categoryData.result.list.find(
        (category) => category.categoryId === vehicleCategoryId,
      );
      setSelectedCategory(selected);
      setPage(1);
    }
  }, [vehicleCategoryId, categoryData]);

  useEffect(() => {
    if (vehicleCategoryId) {
      refetchBrands();
    }
  }, [searchParams, page, vehicleCategoryId]);

  return (
    <section className="container h-auto min-h-screen pb-10">
      <div className="flex-between h-20 pl-2 pr-10">
        <div className="flex items-center gap-x-2 whitespace-nowrap text-2xl font-bold capitalize">
          <CategoryDropdown
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            isLoading={isCategoryLoading}
            type="brand"
          />
          Manage Vehicle Series
        </div>

        {/* vehicle category dropdown */}
      </div>

      {/* search component */}
      <SearchComponent />

      {/* Render brands grid only when vehicleCategoryId is available */}
      {vehicleCategoryId ? (
        <>
          {isBrandsLoading ? (
            <div className="grid grid-cols-3 place-items-center gap-2 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              <GridSkelton type="brand" />
            </div>
          ) : brandList.length === 0 ? (
            <div className="flex-center col-span-full h-72 flex-col text-center">
              <p className="text-xl font-semibold text-gray-800">
                No brands found{" "}
                {searchParams.get("search") &&
                  `for "${searchParams.get("search")}"`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 place-items-center gap-2 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {brandList.map((data) => (
                <Link
                  to={`/manage-brands/edit/${data.id}`}
                  key={data.id}
                  className="h-36 w-full min-w-32 rounded-xl border bg-white"
                >
                  <div className="flex-center h-[7.5rem] w-auto p-2">
                    <img
                      src={`${baseAssetsUrl}/icons/brands/${data.brandName}.png`}
                      alt={data.brandName}
                      className="h-full w-[95%] max-w-28 object-contain"
                    />
                  </div>
                  <div className="max-w-full text-center text-sm font-semibold">
                    {data.brandName}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {brandList.length > 0 && (
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={brandData?.result.total as number}
            />
          )}
        </>
      ) : (
        <GridSkelton type="brand" />
      )}

      <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center flex-center gap-x-1 bg-yellow px-3 py-2 text-white shadow-xl transition-all hover:scale-[1.02]"
          to={`/manage-brands/${selectedCategory?.categoryId}/add-brand`}
        >
          New Brand <Plus />
        </Link>
      </button>
    </section>
  );
}
