import { BrandType, SeriesListType } from "@/types/api-types/API-types";
import { useFetchSeries } from "@/pages/manage-series/SeriesPage.hooks";
import { SeriesListingColumns } from "./table/columns/SeriesListingsColumn";
import Pagination from "./Pagination";
import { useState } from "react";
import { useGetSearchParams } from "@/hooks/useGetSearchParams";
import { GenericTable } from "./table/GenericTable";

type SeriesListProps = {
  stateId: string;
  brand: BrandType | null;
};

export const SeriesList: React.FC<SeriesListProps> = ({ stateId, brand }) => {
  const [page, setPage] = useState(1);

  const search = useGetSearchParams({ key: "search" });

  const { seriesList, isLoading, totalNumberOfPages } = useFetchSeries({
    stateId,
    searchTerm: search,
    vehicleBrandId: brand?.id,
    page,
  });

  return (
    <section className="mt-6">
      <GenericTable<SeriesListType>
        data={seriesList || []}
        columns={SeriesListingColumns}
        loading={isLoading}
        loadingText="Fetching Series..."
      />

      {/* pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages}
      />
    </section>
  );
};
