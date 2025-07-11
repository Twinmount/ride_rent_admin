// import { getAllSRMVehicles } from "@/api/srm";
import ListingPageLayout from "@/components/common/ListingPageLayout";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { SortDropdown } from "@/components/SortDropdown";
import { SRMVehicleColumn } from "@/components/table/columns/SRMVehicleColumn";
import { GenericTable } from "@/components/table/GenericTable";
import { useListingPageState } from "@/hooks/useListingPageState";
import { SRMVehicleType } from "@/types/api-types/srm-api.types";
// import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function SRMVehiclePage() {
  const navigate = useNavigate();

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
  //     getAllSRMVehicles({
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

  const handleEditClick = (
    vehicleId: string,
    rentalDetails: SRMVehicleType["rentalDetails"],
  ) => {
    sessionStorage.setItem(
      `rentalDetails-${vehicleId}`,
      JSON.stringify(rentalDetails),
    );
    navigate(`/srm/vehicles/edit/${vehicleId}`);
  };

  return (
    <ListingPageLayout
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
    >
      <GenericTable<SRMVehicleType>
        columns={SRMVehicleColumn(handleEditClick)}
        data={list}
        loading={isLoading}
        loadingText="Fetching vehicles..."
      />

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </ListingPageLayout>
  );
}
