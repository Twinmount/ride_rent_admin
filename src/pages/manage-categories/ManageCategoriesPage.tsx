import { Link } from "react-router-dom";
import GridSkelton from "@/components/skelton/GridSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "@/api/vehicle-categories";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import FloatingActionButton from "@/components/general/FloatingActionButton";

export default function ManageCategoriesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories({ page, limit: 20, sortOrder: "ASC" }),
  });

  // Destructure the result from data
  const { list: categories = [] } = data?.result || {};

  const baseAssetsUrl = import.meta.env.VITE_ASSETS_URL;

  return (
    <section className="container h-auto min-h-screen pb-10">
      <div className="flex-between mb-6 h-20 px-10">
        <h1 className="text-2xl font-bold">Manage Vehicle Categories</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 place-items-center gap-2 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          <GridSkelton type="category" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 place-items-center gap-4 gap-y-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              to={`/vehicle/manage-categories/edit/${category.categoryId}`}
              key={category.categoryId}
              className="flex-center flex h-36 w-full flex-col overflow-hidden rounded-lg border bg-white text-xl font-semibold capitalize shadow-md transition-all hover:border-yellow hover:text-yellow"
            >
              <div className="flex-center mx-auto h-[80%] w-[70%]">
                <img
                  src={`${baseAssetsUrl}/icons/vehicle-categories/${category.value}.png`}
                  alt={`${category.name} logo`}
                  className="h-full w-[70%] object-contain"
                />
              </div>
              <span className="mb-1">{category.name}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Categories Found!</div>
      )}

      {/* add new category */}
      <FloatingActionButton
        href={`/vehicle/manage-categories/add`}
        label="New Category"
      />

      <div className="mt-auto">
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages || 1}
        />
      </div>
    </section>
  );
}
