import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import SearchComponent from "@/components/Search";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import PageHeading from "@/components/general/PageHeading";
import SeriesCategoryDropdown from "@/components/SeriesCategoryDropdown";
import { BrandType, CategoryType } from "@/types/api-types/API-types";
import { useGetSearchParams } from "@/hooks/useGetSearchParams";
import SeriesBrandDropdown from "@/components/SeriesBrandDropdown";
import { SeriesList } from "@/components/SeriesList";
import { useAdminContext } from "@/context/AdminContext";

export default function BrandsPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [selectedBrand, setSelectedBrand] = useState<BrandType | null>(null);
  const { state } = useAdminContext();

  const searchQuery = useGetSearchParams({ key: "search" });

  const totalNumberOfPages = 1;

  return (
    <section className="container h-auto min-h-screen py-6">
      <PageHeading
        heading={`Manage Vehicle Series Under ${state.stateName}/${selectedCategory?.name}/${selectedBrand?.brandName}`}
      />

      <div className="flex flex-col items-center gap-3 pl-2 pr-10 md:flex-row">
        {/* search component */}
        <SearchComponent placeholder="search series name or brand" />

        <div className="flex items-center gap-x-2">
          {/* category dropdown */}
          <SeriesCategoryDropdown
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <SeriesBrandDropdown
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
        </div>
      </div>

      <SeriesList
        stateId={state.stateId}
        brand={selectedBrand}
        search={searchQuery}
        page={page}
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages}
      />

      <FloatingActionButton
        href={`/manage-series/${selectedCategory?.categoryId}/add-brand`}
        label="New Series"
      />
    </section>
  );
}
