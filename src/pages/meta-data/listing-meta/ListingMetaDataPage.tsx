import { useQuery } from "@tanstack/react-query";
import { fetchListingMetaList } from "@/api/meta-data";

import LazyLoader from "@/components/skelton/LazyLoader";
import SeoData from "@/components/general/SeoData";
import { useState } from "react";
import MetaCategoryDropdown from "@/components/MetaCategoryDropdown";
import { useAdminContext } from "@/context/AdminContext";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import { useCategories } from "@/hooks/useCategories";

export default function ListingMetaDataPage() {
  const [page, setPage] = useState(1);

  const { state } = useAdminContext();

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
      state.stateId,
      page,
    ],
    queryFn: () =>
      fetchListingMetaList({
        page,
        limit: 20,
        sortOrder: "ASC",
        category: selectedCategory?.categoryId || "",
        state: state.stateId,
      }),
    enabled: !!selectedCategory, // Fetch only when category is selected
  });

  const seoData = data?.result?.list || [];

  return (
    <section className="h-auto min-h-screen w-full bg-gray-100 py-10">
      {/* category dropdown */}
      <MetaCategoryDropdown
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categoryList || []}
        isLoading={isCategoryLoading}
      />

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

      <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center flex-center gap-x-1 bg-yellow px-3 py-2 text-white shadow-xl transition-all hover:scale-[1.02]"
          to={`/meta-data/listing/add`}
        >
          New Listing Meta <Plus />
        </Link>
      </button>
    </section>
  );
}
