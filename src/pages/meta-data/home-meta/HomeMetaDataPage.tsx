import { useQuery } from "@tanstack/react-query";
import { fetchHomeMetaList } from "@/api/meta-data";
import LazyLoader from "@/components/skelton/LazyLoader";
import SeoData from "@/components/general/SeoData";
import { useFetchStates } from "@/hooks/useFetchStates";
import GeneralStatesDropdown from "@/components/GeneralStatesDropdown";
import { StateType } from "@/types/api-types/vehicleAPI-types";
import { useState } from "react";
import FloatingActionButton from "@/components/general/FloatingActionButton";

export default function HomeMetaData() {
  const [selectedState, setSelectedState] = useState<StateType | null>(null);

  const { isStateLoading, statesList, setFilter } = useFetchStates();

  // Fetch meta data using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["home-meta-data", selectedState?.stateId],
    queryFn: () =>
      fetchHomeMetaList({
        page: 1,
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
          Homepage MetaData under {selectedState?.stateName} for categories
        </h1>

        <div className="ml-auto mr-6 w-fit md:mr-10 lg:mr-16">
          <GeneralStatesDropdown
            isLoading={isStateLoading}
            options={statesList}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            setFilter={setFilter}
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
              link={`/meta-data/home/edit/${item.metaDataId}`}
            />
          ))
        )}

        <FloatingActionButton label="Add New" href="/meta-data/home/add" />
      </div>
    </section>
  );
}
