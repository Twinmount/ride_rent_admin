import { useQuery } from "@tanstack/react-query";
import { fetchListingMetaList } from "@/api/meta-data";

import LazyLoader from "@/components/skelton/LazyLoader";
import SeoData from "@/components/general/SeoData";
import { useState } from "react";
import { useAdminContext } from "@/context/AdminContext";

import Pagination from "@/components/Pagination";
import { useCategorySelection } from "@/hooks/useCategorySelection";

export default function AgentPortfolioMetaDataPage() {
  const [page, setPage] = useState(1);

  const { state } = useAdminContext();

  const { selectedCategory, isCategoryLoading } = useCategorySelection();

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
      {/* category dropdown */}
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <h2 className="h3-bold text-center sm:text-left">
          Agent Portfolio Meta Data
        </h2>
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
