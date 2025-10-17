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
import { StateType } from "@/types/api-types/vehicleAPI-types";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import { useSearchParams } from "react-router-dom";
import {
  ListingMetaTabType,
  ListingMetaTab,
} from "@/components/ListingMetaTab";
import { useListingMetaTab } from "@/hooks/useListingMetaTab";

export default function ListingMetaDataPage() {
  const [page, setPage] = useState(1);
  const [selectedState, setSelectedState] = useState<StateType | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get("tab") as ListingMetaTabType) || "cars";

  const shouldFetchStates = activeTab !== "brand";

  const { isStateLoading, statesList, setFilter } = useFetchStates(
    null,
    shouldFetchStates,
  );

  const {
    selectedCategory,
    setSelectedCategory,
    categoryList,
    isCategoryLoading,
  } = useCategories();

  const isStateOrCategoryLoading = isStateLoading || isCategoryLoading;

  const { pageTitle } = useListingMetaTab({
    defaultTab: "category",
    isStateOrCategoryLoading: isStateOrCategoryLoading,
    selectedState: selectedState?.stateName || "",
    selectedCategory: selectedCategory?.name || "",
  });

  const shouldFetchListingMeta =
    activeTab === "brand"
      ? !!selectedCategory?.categoryId
      : activeTab === "category"
        ? !!selectedState?.stateId && !!selectedCategory?.categoryId
        : !!selectedCategory && !!selectedState?.stateId;

  // Fetch meta data using useQuery
  const { data, isLoading: isMetaDataLoading } = useQuery({
    queryKey: [
      "listing-meta-data",
      selectedCategory?.categoryId,
      selectedState?.stateId,
      page,
      activeTab,
    ],
    queryFn: () =>
      fetchListingMetaList({
        page,
        limit: 20,
        sortOrder: "DESC",
        categoryId: selectedCategory?.categoryId || "",
        stateId:
          activeTab === "brand" ? "" : (selectedState?.stateId as string),
        filterType: activeTab,
      }),
    enabled: shouldFetchListingMeta,
  });

  const handleTabChange = (tab: ListingMetaTabType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    setSearchParams(newParams);
    setPage(1);
  };

  const seoData = data?.result?.list || [];
  const totalNumberOfPages = data?.result?.totalNumberOfPages || 1;

  return (
    <div className="h-auto min-h-screen w-full bg-gray-100 py-10">
      <ListingMetaTab activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="mb-6 flex flex-col">
        <h1 className="mb-5 text-center text-2xl font-semibold lg:ml-6 lg:text-left">
          {pageTitle}
        </h1>

        <div className="ml-auto mr-6 flex w-fit items-center gap-x-2 md:mr-10 lg:mr-16">
          {activeTab !== "brand" && (
            <GeneralStatesDropdown
              isLoading={isStateLoading}
              options={statesList}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              setFilter={setFilter}
            />
          )}

          {/* category dropdown */}
          {activeTab !== "category" && (
            <MetaCategoryDropdown
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categoryList || []}
              isLoading={isCategoryLoading}
            />
          )}
        </div>
      </div>

      <section className="container mx-auto max-w-4xl space-y-3">
        {isMetaDataLoading || isStateOrCategoryLoading ? (
          <LazyLoader />
        ) : seoData.length === 0 ? (
          <div className="flex h-screen justify-center pt-36 text-2xl font-semibold">
            No Data Found ! {activeTab === "category" && "WORK IN PROGRESS"}
          </div>
        ) : (
          seoData.map((item) => (
            <SeoData
              key={item.metaDataId}
              item={item}
              link={`/meta-data/listing/edit/${item.metaDataId}?tab=${activeTab}`}
            />
          ))
        )}
      </section>

      <FloatingActionButton
        href={`/meta-data/listing/add?tab=${activeTab}`}
        label="New Listing Meta Data"
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages}
      />
    </div>
  );
}
