import { useQuery } from "@tanstack/react-query";
import { fetchListingMetaList } from "@/api/meta-data";

import LazyLoader from "@/components/skelton/LazyLoader";
import SeoData from "@/components/general/SeoData";
import { useState } from "react";
import { useAdminContext } from "@/context/AdminContext";

import Pagination from "@/components/Pagination";
import { useCategories } from "@/hooks/useCategories";
import PageHeading from "@/components/general/PageHeading";
import SearchComponent from "@/components/Search";

export default function AgentPortfolioMetaDataPage() {
  const [page, setPage] = useState(1);

  const { state } = useAdminContext();

  const { selectedCategory, isCategoryLoading } = useCategories();

  // Fetch meta data using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["listing-meta-data", selectedCategory?.value, page],
    queryFn: () =>
      fetchListingMetaList({
        page,
        limit: 20,
        sortOrder: "ASC",
        category: selectedCategory?.value || "",
        state: state.stateValue,
      }),
    enabled: !!selectedCategory, // Fetch only when category is selected
  });

  const seoData = data?.result?.list || [];

  return (
    <section className="h-auto min-h-screen w-full bg-gray-100 py-10">
      <div className="mb-6 ml-3 flex flex-col">
        {/* page heading */}
        <PageHeading heading={`Manage Agent Portfolio Meta`} />

        {/* search component */}
        <SearchComponent placeholder="search agent" />
      </div>

      <div className="container mx-auto max-w-4xl space-y-3">
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
      </div>

      {seoData.length > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages || 1}
        />
      )}
    </section>
  );
}
