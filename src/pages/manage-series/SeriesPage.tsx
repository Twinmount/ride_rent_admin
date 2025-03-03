import { useSearchParams, useParams } from "react-router-dom";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import SearchComponent from "@/components/Search";
import CategoryDropdown from "@/components/VehicleCategoryDropdown";
import { useCategories } from "@/hooks/useCategories";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import useFetchBrands from "./SeriesPage.hooks";
import PageHeading from "@/components/general/PageHeading";
import { SeriesList } from "@/components/SeriesList";

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
    <section className="container h-auto min-h-screen py-6">
      <PageHeading heading={`Manage Vehicle Series`} />

      <div className="flex items-center gap-3 pl-2 pr-10">
        {/* search component */}
        <SearchComponent placeholder="search series name or brand" />

        {/* category dropdown */}
        <CategoryDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categoryList}
          isLoading={isCategoryLoading}
          type="series"
        />
      </div>

      {/* brand grid and loading skeleton */}
      <SeriesList
        brandList={brandList}
        isSeriesLoading={isBrandsLoading}
        search={searchQuery}
        categoryValue={selectedCategory?.value}
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={brandData?.result.total as number}
      />

      <FloatingActionButton
        href={`/manage-series/${selectedCategory?.categoryId}/add-brand`}
        label="New Series"
      />
    </section>
  );
}
