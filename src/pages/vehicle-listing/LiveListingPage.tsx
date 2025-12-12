import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LiveListingColumns } from "@/components/table/columns/LiveListingColumn";
import {
  fetchAllVehicles,
  enableOrDisableVehicle,
  toggleVehiclePriorityApi,
} from "@/api/listings";
import { toast } from "@/components/ui/use-toast";
import Pagination from "@/components/Pagination";
import { LimitDropdown } from "@/components/LimitDropdown";
import { SortDropdown } from "@/components/SortDropdown";
import SearchBox from "@/components/SearchBox";
import { useAdminContext } from "@/context/AdminContext";
import ListingPageHeading from "../../components/ListingPageHeading";
import { GenericTable } from "@/components/table/GenericTable";
import { LiveListingVehicleType } from "@/types/api-types/vehicleAPI-types";
import TablePageLayout from "@/components/common/TablePageLayout";
import { useListingPageState } from "@/hooks/useListingPageState";
import CompanySearchDialog from "@/components/dialog/CompanySearchDialog";
import FilterTag from "@/components/FilterTag";
import { Switch } from "@/components/ui/switch";
import PriceOfferDialog from "@/components/dialog/PriceOfferDialog";

export default function AllListingPage() {
  const {
    page,
    setPage,
    limit,
    setLimit,
    sortOrder,
    setSortOrder,
    searchTerm,
    selectedCompany,
    setSelectedCompany,
    isHighPriority,
    setIsHighPriority,
    offerDialogVehicle,
    setOfferDialogVehicle,
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
      selectedCompany?.userId,
      isHighPriority,
    ],
    queryFn: () =>
      fetchAllVehicles({
        page,
        limit,
        sortOrder,
        approvalStatus: "APPROVED",
        search: searchTerm.trim(),
        stateId: state.stateId as string,
        userId: selectedCompany?.userId,
        isHighPriority,
      }),
    enabled: !!state.stateId,
  });

  const {
    mutateAsync: toggleVehicleStatus,
    isPending: isVehicleStatusPending,
  } = useMutation({
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
        queryKey: ["listings", "live-listings"],
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

  const { mutateAsync: setVehiclePriority, isPending: isPriorityPending } =
    useMutation({
      mutationFn: async ({ vehicleId }: { vehicleId: string }) => {
        await toggleVehiclePriorityApi({ vehicleId });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["listings", "live-listings"],
        });
        toast({
          title: "Vehicle Priority Updated",
          description: "The high priority flag was updated successfully.",
          className: "bg-yellow text-white",
        });
      },
      onError: (error: any) => {
        console.log("error updating vehicle priority", error);

        toast({
          variant: "destructive",
          title: "Failed to update vehicle priority",
          description: "An error occurred while toggling high priority.",
        });
      },
    });

  const handleToggleVehicleStatus = async (
    vehicleId: string,
    isDisabled: boolean,
  ) => {
    await toggleVehicleStatus({ vehicleId, isDisabled });
  };

  const handleToggleVehiclePriority = async (vehicleId: string) => {
    await setVehiclePriority({ vehicleId });
  };

  const totalPages = data?.result?.totalNumberOfPages || 0;

  return (
    <>
      <TablePageLayout
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
            searchDescription="vehicle model,vehicle registration number, vehicle code, year of manufacture
          or phone number can be used to search the vehicle"
          />
        }
        extraFilters={
          <div className="flex items-center gap-2">
            <CompanySearchDialog onSelect={setSelectedCompany} />
            {selectedCompany && (
              <FilterTag
                label={selectedCompany.companyName}
                onClear={() => setSelectedCompany(null)}
              />
            )}

            <div className="flex items-center">
              <Switch
                checked={isHighPriority}
                onCheckedChange={setIsHighPriority}
                className={`ml-3 data-[state=checked]:bg-yellow`}
              />
              <span className="ml-2 text-sm">High Priority</span>
            </div>
          </div>
        }
      >
        <GenericTable<LiveListingVehicleType>
          columns={LiveListingColumns(
            handleToggleVehicleStatus,
            isVehicleStatusPending,
            handleToggleVehiclePriority,
            isPriorityPending,
            setOfferDialogVehicle,
          )}
          data={data?.result?.list || []}
          loading={isLoading}
          loadingText="Fetching Listings..."
          noDataText={
            selectedCompany
              ? `No Listing found under ${selectedCompany.companyName}`
              : "No Listings found."
          }
        />
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </TablePageLayout>

      <PriceOfferDialog
        vehicle={offerDialogVehicle}
        onClose={() => setOfferDialogVehicle(null)}
      />
    </>
  );
}
