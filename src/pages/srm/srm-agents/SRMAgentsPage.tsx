import { fetchAllSRMAgents } from "@/api/srm";
import ListingPageLayout from "@/components/common/ListingPageLayout";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { SortDropdown } from "@/components/SortDropdown";
import { SRMAgentsColumn } from "@/components/table/columns/SRMAgentsColumn";
import { GenericTable } from "@/components/table/GenericTable";
import { useListingPageState } from "@/hooks/useListingPageState";
import { SRMAgentType } from "@/types/api-types/srm-api.types";
import { useQuery } from "@tanstack/react-query";

export default function SRMAgentsPage() {
  const {
    page,
    setPage,
    limit,
    setLimit,
    sortOrder,
    setSortOrder,
    searchTerm,
  } = useListingPageState();

  // const { data, isLoading } = useQuery({
  //   queryKey: ["srm", "srm-active-trips", page, limit, sortOrder, searchTerm],
  //   queryFn: () =>
  //     fetchAllSRMAgents({
  //       page,
  //       limit,
  //       sortOrder,
  //       search: searchTerm.trim(),
  //     }),
  // });

  // const totalPages = data?.result?.totalNumberOfPages || 0;
  // const list = data?.result?.list || [];
  const totalPages = 1;
  const isLoading = false;
  const list: any = [];

  return (
    <ListingPageLayout
      heading={"SRM - Sellers"}
      sortDropdown={
        <SortDropdown
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      }
      limitDropdown={
        <LimitDropdown
          limit={limit}
          setLimit={setLimit}
          isLoading={isLoading}
        />
      }
      search={
        <SearchBox
          placeholder="Search seller"
          searchDescription="search seller"
        />
      }
    >
      <GenericTable<SRMAgentType>
        columns={SRMAgentsColumn}
        data={list}
        loading={isLoading}
        loadingText="Fetching Listings..."
      />

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </ListingPageLayout>
  );
}
