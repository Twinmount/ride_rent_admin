import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import {
  fetchNewOrModifiedVehicles,
  updateVehicleStatus,
} from "@/api/listings";
import { VehicleStatusType } from "@/types/formTypes";
import { GeneralListingColumns } from "@/components/table/columns/GeneralListingsColumn";
import { GeneralListingVehicleType } from "@/types/api-types/vehicleAPI-types";
import VehicleStatusModal from "@/components/VehicleStatusModal";
import { toast } from "@/components/ui/use-toast";
import SearchBox from "@/components/SearchBox";
import { useSearchParams } from "react-router-dom";
import { useAdminContext } from "@/context/AdminContext";
import ListingPageHeading from "../../components/ListingPageHeading";
import { GenericTable } from "@/components/table/GenericTable";
import TablePageLayout from "@/components/common/TablePageLayout";

interface GeneralListingPageProps {
  queryKey: any[];
  approvalStatus: VehicleStatusType;
  isModified?: boolean;
  title: string;
  newRegistration?: boolean;
}

export default function GeneralListingPage({
  queryKey,
  approvalStatus,
  isModified = false,
  newRegistration,
}: GeneralListingPageProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedVehicle, setSelectedVehicle] =
    useState<GeneralListingVehicleType | null>(null);

  const { state } = useAdminContext();

  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, page, limit, sortOrder, searchTerm, state],
    queryFn: () =>
      fetchNewOrModifiedVehicles({
        page,
        limit,
        sortOrder,
        isModified,
        approvalStatus,
        newRegistration,
        search: searchTerm.trim(),
        stateId: state.stateId as string,
      }),
    enabled: !!state.stateId,
    staleTime: 10 * 1000,
  });

  const handleOpenModal = (vehicle: GeneralListingVehicleType) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  // Handler for submitting the form in the modal
  const handleSubmitModal = async (values: {
    approvalStatus: string;
    rejectionReason?: string;
  }) => {
    if (values.approvalStatus === "PENDING") {
      toast({
        variant: "destructive",
        title: "Invalid Status Change",
        description: "Cannot change status back to PENDING.",
      });
      return;
    }
    if (values.approvalStatus === "UNDER_REVIEW") {
      toast({
        variant: "destructive",
        title: "Invalid Status Change",
        description: "Cannot change status back to UNDER REVIEW.",
      });
      return;
    }
    if (selectedVehicle) {
      try {
        const data = await updateVehicleStatus({
          vehicleId: selectedVehicle.vehicleId,
          approvalStatus: values.approvalStatus,
          rejectionReason: values.rejectionReason,
        });

        if (data) {
          queryClient.invalidateQueries({ queryKey: ["vehicles", "listings"] });
          queryClient.invalidateQueries({
            queryKey: [...queryKey, page, limit, sortOrder, searchTerm, state],
            exact: true,
          });
          queryClient.invalidateQueries({
            queryKey: ["vehicle-listing-count"],
            exact: true,
          });

          toast({
            title: "Vehicle status updated successfully",
            className: "bg-green-500 text-white",
          });
        }

        handleCloseModal();
      } catch (error) {
        console.error("Failed to update vehicle status:", error);
        toast({
          variant: "destructive",
          title: "Failed to update status",
          description:
            "Something went wrong while updating the vehicle status.",
        });
      }
    }
  };

  const totalNumberOfPages = data?.result?.totalNumberOfPages || 0;

  return (
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
          searchDescription="vehicle model, registration number, vehicle code, year, or phone number can be used to search"
        />
      }
    >
      <GenericTable<GeneralListingVehicleType>
        columns={GeneralListingColumns(handleOpenModal)}
        data={data?.result?.list || []}
        loading={isLoading}
        loadingText="Fetching General Listings..."
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages}
      />

      {selectedVehicle && (
        <VehicleStatusModal
          rejectionReason={selectedVehicle.rejectionReason || ""}
          vehicleModel={selectedVehicle.vehicleModel}
          currentStatus={selectedVehicle.approvalStatus}
          isOpen={!!selectedVehicle}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
        />
      )}
    </TablePageLayout>
  );
}
