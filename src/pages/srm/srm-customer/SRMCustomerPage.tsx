// import { fetchAllSRMCustomers } from "@/api/srm";
import TablePageLayout from "@/components/common/TablePageLayout";
import LinkButton from "@/components/general/LinkButton";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { SortDropdown } from "@/components/SortDropdown";

import { SRMCustomersColumn } from "@/components/table/columns/SRMCustomersColumn";
import { GenericTable } from "@/components/table/GenericTable";
import { useListingPageState } from "@/hooks/useListingPageState";
import { SRMCustomerType } from "@/types/api-types/srm-api.types";
// import { useQuery } from "@tanstack/react-query";

export default function SRMCustomerPage() {
  const {
    page,
    setPage,
    limit,
    setLimit,
    sortOrder,
    setSortOrder,
    // searchTerm,
  } = useListingPageState();

  // const { data, isLoading } = useQuery({
  //   queryKey: ["srm", "srm-active-trips", page, limit, sortOrder, searchTerm],
  //   queryFn: () =>
  //     fetchAllSRMCustomers({
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
    <TablePageLayout
      heading={"SRM - Active Trips"}
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
          placeholder="trip id"
          searchDescription="search with trip id"
        />
      }
      actionButton={
        <LinkButton label="New Customer" link="/srm/customers/add" />
      }
    >
      <GenericTable<SRMCustomerType>
        columns={SRMCustomersColumn}
        data={list}
        loading={isLoading}
        loadingText="Fetching Listings..."
      />

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </TablePageLayout>
  );
}
