import { useSearchParams, useParams } from "react-router-dom";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import SearchComponent from "@/components/Search";
import CategoryDropdown from "@/components/VehicleCategoryDropdown";
import { useCategories } from "@/hooks/useCategories";
import { BrandGrid } from "@/components/BrandGrid";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import useFetchBrands from "./BrandsPage.hooks";

export default function BrandsPage() {
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>();
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  // ✅ Use the existing useCategories hook
  const {
    selectedCategory,
    setSelectedCategory,
    categoryList,
    isCategoryLoading,
  } = useCategories();

  const searchQuery = searchParams.get("search") || "";

  // Fetch brands after category is selected
  const { brandData, isBrandsLoading } = useFetchBrands({
    vehicleCategoryId: vehicleCategoryId as string,
    searchQuery,
    page,
    isCategoryLoading,
  });

  // Extract brand list
  const brandList = brandData?.result?.list || [];

  return (
    <section className="container h-auto min-h-screen pb-10">
      <div className="flex-between h-20 pl-2 pr-10">
        <div className="flex items-center gap-x-2 whitespace-nowrap text-2xl font-bold capitalize">
          <CategoryDropdown
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categoryList}
            isLoading={isCategoryLoading}
            type="brand"
          />
          Brands
        </div>
      </div>

      {/* Search Component */}
      <SearchComponent />

      {/* brand grid and loading skeleton */}
      <BrandGrid
        brandList={brandList}
        isBrandsLoading={isBrandsLoading}
        search={searchQuery}
        categoryValue={selectedCategory?.value}
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={brandData?.result.total as number}
      />

      <FloatingActionButton
        href={`/manage-brands/${selectedCategory?.categoryId}/add-brand`}
        label="New Brand"
      />
    </section>
  );
}
