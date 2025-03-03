import { useQuery } from "@tanstack/react-query";
import { fetchListingMetaList } from "@/api/meta-data";

import LazyLoader from "@/components/skelton/LazyLoader";
import SeoData from "@/components/general/SeoData";
import { useState } from "react";
import MetaCategoryDropdown from "@/components/MetaCategoryDropdown";
import Pagination from "@/components/Pagination";
import { useCategories } from "@/hooks/useCategories";
import GeneralStatesDropdown from "@/components/GeneralStatesDropdown";
import { useFetchStates } from "@/hooks/useFetchStates";

export default function ListingMetaDataPage() {
  const [page, setPage] = useState(1);

  const { isStateLoading, selectedState, statesList, setSelectedState } =
    useFetchStates();

  const {
    selectedCategory,
    setSelectedCategory,
    categoryList,
    isCategoryLoading,
  } = useCategories();

  // Fetch meta data using useQuery
  const { data, isLoading } = useQuery({
    queryKey: [
      "listing-meta-data",
      selectedCategory?.categoryId,
      selectedState?.stateId,
      page,
    ],
    queryFn: () =>
      fetchListingMetaList({
        page,
        limit: 20,
        sortOrder: "DESC",
        categoryId: selectedCategory?.categoryId || "",
        stateId: selectedState?.stateId as string,
      }),
    enabled: !!selectedCategory, // Fetch only when category is selected
  });

  const seoData = data?.result?.list || [];
  const totalNumberOfPages = data?.result?.totalNumberOfPages || 1;

  return (
    <div className="h-auto min-h-screen w-full bg-gray-100 py-10">
      <div className="mb-6 flex flex-col">
        <h1 className="mb-5 text-center text-2xl font-semibold lg:ml-6 lg:text-left">
          Listing Page MetaData for all Vehicle Types under{" "}
          {selectedState?.stateName}/ {selectedCategory?.name}{" "}
        </h1>

        <div className="ml-auto mr-6 flex w-fit items-center gap-x-2 md:mr-10 lg:mr-16">
          <GeneralStatesDropdown
            isLoading={isStateLoading}
            options={statesList}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
          />

          {/* category dropdown */}
          <MetaCategoryDropdown
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categoryList || []}
            isLoading={isCategoryLoading}
          />
        </div>
      </div>

      <section className="container mx-auto max-w-4xl space-y-3">
        {isLoading || isCategoryLoading ? (
          <LazyLoader />
        ) : seoData.length === 0 ? (
          <div className="flex h-screen justify-center pt-36 text-2xl font-semibold">
            No Data Found !
          </div>
        ) : (
          seoData.map((item) => (
            <SeoData
              key={item.metaDataId}
              item={item}
              link="/meta-data/listing/edit"
            />
          ))
        )}
      </section>

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages}
      />
    </div>
  );
}
