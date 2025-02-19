import { useQuery } from "@tanstack/react-query";
import { fetchHomeMetaList } from "@/api/meta-data";

import LazyLoader from "@/components/skelton/LazyLoader";
import SeoData from "@/components/general/SeoData";
import Pagination from "@/components/Pagination";
import { useState } from "react";
import { useFetchStates } from "@/hooks/useFetchStates";
import GeneralStatesDropdown from "@/components/GeneralStatesDropdown";

export default function HomeMetaData() {
  const [page, setPage] = useState(1);

  const { isStateLoading, selectedState, statesList, setSelectedState } =
    useFetchStates();

  // Fetch meta data using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["home-meta-data", page, selectedState?.stateId],
    queryFn: () =>
      fetchHomeMetaList({
        page,
        limit: 20,
        sortOrder: "DESC",
        stateId: selectedState?.stateId as string,
      }),
    enabled: !!selectedState,
  });

  const seoData = data?.result?.list || [];

  return (
    <section className="h-auto min-h-screen w-full bg-gray-100 py-10">
      <div className="mb-6 flex flex-col">
        <h1 className="mb-5 text-center text-2xl font-semibold lg:ml-6 lg:text-left">
          HomePage meta-data under {selectedState?.stateName} for all 11
          categories
        </h1>

        <div className="ml-auto mr-6 w-fit md:mr-10 lg:mr-16">
          <GeneralStatesDropdown
            isLoading={isStateLoading}
            options={statesList}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
          />
        </div>
      </div>
      <div className="container max-w-4xl space-y-3">
        {isLoading ? (
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
              link="/meta-data/home/edit"
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

      {/* <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center flex-center gap-x-1 bg-yellow px-3 py-2 text-white shadow-xl transition-all hover:scale-[1.02]"
          to={`/meta-data/home/add`}
        >
          New Home Meta <Plus />
        </Link>
      </button> */}
    </section>
  );
}
