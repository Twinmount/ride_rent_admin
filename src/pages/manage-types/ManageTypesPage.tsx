import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryDropdown from "@/components/VehicleCategoryDropdown";
import { fetchAllCategories } from "@/api/vehicle-categories";
import { fetchAllVehicleTypes } from "@/api/vehicle-types";
import { CategoryType } from "@/types/api-types/API-types";
import GridSkelton from "@/components/skelton/GridSkelton";
import { Plus } from "lucide-react";
import Pagination from "@/components/Pagination";

export default function ManageTypesPage() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>();
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | undefined
  >();

  //vehicle categories fetching for dropdown
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories({ page: 1, limit: 20, sortOrder: "ASC" }),
  });

  // redirecting to "/manage-types/categoryId" route as soon as the category data is fetched
  useEffect(() => {
    if (isSuccess) {
      const categories = categoryData?.result?.list || [];
      if (!vehicleCategoryId && categories.length > 0) {
        const firstCategory = categories[0];
        navigate(`/vehicle/manage-types/${firstCategory.categoryId}`, {
          replace: true,
        });
      }
    }
  }, [isSuccess, categoryData, vehicleCategoryId, navigate]);

  // destructuring the "categories" from categoryData
  const { list: categories = [] } = categoryData?.result || {};

  // vehicle types fetching after category is fetched
  const { data: vehicleTypeData, isLoading: isVehicleTypeLoading } = useQuery({
    queryKey: ["vehicle-types", vehicleCategoryId],
    queryFn: () =>
      fetchAllVehicleTypes({
        page,
        limit: 20,
        sortOrder: "ASC",
        vehicleCategoryId: vehicleCategoryId || "",
      }),
    enabled: !!vehicleCategoryId,
  });

  // destructuring list from vehicleTypeData
  const list = vehicleTypeData?.result.list || [];

  // setting selected category
  useEffect(() => {
    if (vehicleCategoryId) {
      const selected = categories.find(
        (category) => category.categoryId === vehicleCategoryId,
      );
      setSelectedCategory(selected);
    }
  }, [vehicleCategoryId, categories]);

  const baseAssetsUrl = import.meta.env.VITE_ASSETS_URL;

  return (
    <section className="container h-auto min-h-screen pb-10">
      <div className="flex-between mb-6 h-20 px-10">
        <div className="flex items-center gap-x-2 whitespace-nowrap text-2xl font-bold capitalize">
          {/* vehicle category dropdown */}
          <CategoryDropdown
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            isLoading={isCategoryLoading}
            type="type"
          />
          Types
        </div>
      </div>

      {isVehicleTypeLoading ? (
        <div className="grid grid-cols-3 place-items-center gap-2 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          <GridSkelton type="category" />
        </div>
      ) : list && list.length > 0 ? (
        <div className="grid grid-cols-2 place-items-center gap-4 gap-y-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {list.map((data) => (
            <Link
              key={data.typeId}
              to={`/vehicle/manage-types/${vehicleCategoryId}/edit/${data.typeId}`}
              className="flex-center flex h-36 w-full flex-col overflow-hidden rounded-lg border bg-white text-xl font-semibold capitalize shadow-md transition-all hover:border-yellow hover:text-yellow"
            >
              <div className="mx-auto h-[80%] w-[90%]">
                <img
                  src={`${baseAssetsUrl}/icons/vehicle-types/${selectedCategory?.value}/${data.value}.webp`}
                  alt={`${data.name} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="w-[95%] truncate text-center text-sm">
                {" "}
                {data.name}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">
          No Vehicle Types Found!
        </div>
      )}

      {/* add new category */}
      <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center flex-center gap-x-1 bg-yellow px-3 py-2 text-white shadow-xl transition-all hover:scale-[1.02]"
          to={`/vehicle/manage-types/${selectedCategory?.categoryId}/add`}
        >
          New Type <Plus />
        </Link>
      </button>

      {list.length > 0 && (
        <div className="mt-auto">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={categoryData?.result.totalNumberOfPages || 1}
          />
        </div>
      )}
    </section>
  );
}
