import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LiveListingColumns } from "@/components/table/columns/LiveListingColumn";
import { fetchAllVehicles, enableOrDisableVehicle } from "@/api/listings";
import { toast } from "@/components/ui/use-toast";
import Pagination from "@/components/Pagination";
import { LimitDropdown } from "@/components/LimitDropdown";
import { SortDropdown } from "@/components/SortDropdown";
import SearchBox from "@/components/SearchBox";
import { useAdminContext } from "@/context/AdminContext";
import ListingPageHeading from "../../components/ListingPageHeading";
import { GenericTable } from "@/components/table/GenericTable";
import { LiveListingVehicleType } from "@/types/api-types/vehicleAPI-types";
import ListingPageLayout from "@/components/common/ListingPageLayout";
import { useListingPageState } from "@/hooks/useListingPageState";

export default function AllListingPage() {
  const {
    page,
    setPage,
    limit,
    setLimit,
    sortOrder,
    setSortOrder,
    searchTerm,
  } = useListingPageState();

  const queryClient = useQueryClient();

  const { state } = useAdminContext();

  const { data, isLoading } = useQuery({
    queryKey: [
      "listings",
      "live-listings",
      page,
      limit,
      sortOrder,
      searchTerm,
      state,
    ],
    queryFn: () =>
      fetchAllVehicles({
        page,
        limit,
        sortOrder,
        approvalStatus: "APPROVED",
        search: searchTerm.trim(),
        stateId: state.stateId as string,
      }),
    enabled: !!state.stateId,
    staleTime: 10000,
  });

  const { mutateAsync: toggleVehicleStatus, isPending } = useMutation({
    mutationFn: async ({
      vehicleId,
      isDisabled,
    }: {
      vehicleId: string;
      isDisabled: boolean;
    }) => {
      await enableOrDisableVehicle({ vehicleId, isDisabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "listings",
          "live-listings",
          page,
          limit,
          sortOrder,
          searchTerm,
          state,
        ],
        exact: true,
      });
      toast({
        title: "Vehicle status updated",
        description: "The status of the vehicle was  updated successfully.",
        className: "bg-yellow text-white",
      });
    },
    onError: (error) => {
      console.error("Error updating vehicle status:", error);
      toast({
        variant: "destructive",
        title: "Failed to update vehicle status",
        description: "An error occurred while updating the vehicle status.",
      });
    },
  });

  const handleToggle = async (vehicleId: string, isDisabled: boolean) => {
    await toggleVehicleStatus({ vehicleId, isDisabled });
  };

  const totalPages = data?.result?.totalNumberOfPages || 0;

  return (
    <ListingPageLayout
      heading={<ListingPageHeading />}
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
          placeholder="Search vehicle"
          searchDescription="vehicle model,vehicle registration number, vehicle code, registered year
          or phone number can be used to search the vehicle"
        />
      }
    >
      <GenericTable<LiveListingVehicleType>
        columns={LiveListingColumns(handleToggle, isPending)}
        data={data?.result?.list || []}
        loading={isLoading}
        loadingText="Fetching Listings..."
      />

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </ListingPageLayout>
  );
}
