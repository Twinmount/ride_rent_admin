import { useSearchParams, useParams } from "react-router-dom";
import Pagination from "@/components/Pagination";
import SearchComponent from "@/components/Search";
import CategoryDropdown from "@/components/VehicleCategoryDropdown";
import { useCategories } from "@/hooks/useCategories";
import { BrandGrid } from "@/components/BrandGrid";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import useFetchBrands from "./BrandsPage.hooks";
import PageWrapper from "@/components/common/PageWrapper";

export default function BrandsPage() {
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>();

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
  const { brandData, isBrandsLoading, page, setPage } = useFetchBrands({
    vehicleCategoryId:
      vehicleCategoryId || (selectedCategory?.categoryId as string),
    searchQuery,
  });

  // Extract brand list
  const brandList = brandData?.result?.list || [];

  return (
    <PageWrapper heading="Manage Brands" shouldRenderNavigation={false}>
      <div className="flex items-center gap-3 pl-2 pr-10">
        {/* search component */}
        <SearchComponent placeholder="search brand" />

        {/* category dropdown */}
        <CategoryDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categoryList}
          isLoading={isCategoryLoading}
          type="brand"
        />
      </div>

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
    </PageWrapper>
  );
}
