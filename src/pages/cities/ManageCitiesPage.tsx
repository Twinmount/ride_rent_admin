import { useAdminContext } from "@/context/AdminContext";

import { useQuery } from "@tanstack/react-query";
import { fetchAllCitiesPaginated } from "@/api/cities";

import { CityGrid } from "@/components/CityGrid";
import { useState } from "react";
import PageLayout from "@/components/common/PageLayout";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { useSearchParams } from "react-router-dom";
import { LimitDropdown } from "@/components/LimitDropdown";
import { LimitType } from "@/types/types";

export default function ManageCitiesPage() {
  const { state } = useAdminContext();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<LimitType>(30);

  const search = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["cities", state, page, limit, search],
    queryFn: () =>
      fetchAllCitiesPaginated({
        page,
        limit,
        search,
        state: state.stateId as string,
      }),
    enabled: !!state.stateId,
  });

  const cities = data?.result.list || [];

  return (
    <PageLayout heading={`Cities Under ${state.stateName}`}>
      <div className="flex items-center gap-3 pl-2 pr-10">
        {/* search component */}
        <SearchBox placeholder="search city" className="!m-0" />

        <LimitDropdown
          limit={limit}
          setLimit={setLimit}
          isLoading={isLoading}
        />
      </div>

      <div className="mt-12">
        <CityGrid cities={cities} isLoading={isLoading} />
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.result.total as number}
      />

      <FloatingActionButton
        href={`/locations/manage-cities/add`}
        label="New City"
      />
    </PageLayout>
  );
}
