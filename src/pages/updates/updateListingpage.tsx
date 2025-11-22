import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import {
  updateVehicleStatus,
} from "@/api/listings";
import { VehicleStatusType } from "@/types/formTypes";
import { CompanyListingVehicleType } from "@/types/api-types/vehicleAPI-types";
import VehicleStatusModal from "@/components/VehicleStatusModal";
import { toast } from "@/components/ui/use-toast";
import SearchBox from "@/components/SearchBox";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GenericTable } from "@/components/table/GenericTable";
import { CircleArrowLeft, RefreshCw } from "lucide-react";
import AlertListingPageHeading from "@/components/updatesListingPageHeading";
import { GeneralCompanyListingColumns } from "@/components/table/columns/UpdateListingColumn";
import { fetchAllVehiclesV2} from "@/api/listings/updatelistingApi";
import { useAdminContext } from "@/context/AdminContext";

interface VehiclesWithStateLocationPageProps {
  queryKey: any[];
  approvalStatus: VehicleStatusType;
  isModified?: boolean;
  title: string;
  newRegistration?: boolean;
}

export default function VehiclesWithStateLocationPage({
  queryKey,
  approvalStatus,
  isModified = false,
  newRegistration,
}: VehiclesWithStateLocationPageProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedVehicle, setSelectedVehicle] =
    useState<CompanyListingVehicleType | null>(null);
      const { country } = useAdminContext();

const getCountryId = (): string => {
  try {
    const stored = localStorage.getItem("selectedCountry");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.countryId) return parsed.countryId;
    }
  } catch {}
  return 'ee8a7c95-303d-4f55-bd6c-85063ff1cf48'; // UAE
};

  const activeCountryId = getCountryId();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [...queryKey, page, limit, sortOrder, searchTerm, approvalStatus, activeCountryId,
    isModified ?? false,
    newRegistration ?? false,],
    queryFn: () =>
      fetchAllVehiclesV2({
        page,
      limit,
      sortOrder,
      isModified,
      approvalStatus,
      newRegistration,
      search: searchTerm.trim(),
      countryId: activeCountryId, // ← This is perfect
      }),
    // enabled: !!state.stateId,
    staleTime: 10 * 1000,
  });

  // Reset page to 1 when search or state changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleOpenModal = (vehicle: CompanyListingVehicleType) => {
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
  // Prevent reverting to previous workflow states
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

  if (!selectedVehicle) return;

  try {
    const data = await updateVehicleStatus({
      vehicleId: selectedVehicle.vehicleId,
      approvalStatus: values.approvalStatus as any, // adjust type if needed
      rejectionReason: values.rejectionReason,
    });

    if (data) {
      // ✅ Correct & Safe Invalidation (covers all variations of this list)
      queryClient.invalidateQueries({
        queryKey, // This is your base queryKey like ["vehicles-updated", ...]
      });

      // Also invalidate counts/sidebar numbers
      queryClient.invalidateQueries({
        queryKey: ["vehicle-listing-count"],
      });

      // Optional: invalidate global vehicle listings if needed
      // queryClient.invalidateQueries({ queryKey: ["vehicles"] });

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
      description: "Something went wrong while updating the vehicle status.",
    });
  }
};

  // const totalNumberOfPages = data?.result?.totalNumberOfPages || 0;
  // const totalNumberOfPages = data?.result?.totalNumberOfPages || 0;

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [...queryKey, page, limit, sortOrder, searchTerm, approvalStatus,country,
    isModified ?? false,
    newRegistration ?? false,],
      exact: true,
    });
  };

  return (
    <section className="container mx-auto min-h-screen py-5 md:py-7">
      <div className="flex-between my-2 mb-6 max-sm:flex-row">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
          >
            <CircleArrowLeft />
          </button>
          <AlertListingPageHeading />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 max-sm:flex-col max-sm:items-stretch">
        <SearchBox
          placeholder="Search vehicle"
          searchDescription="vehicle model, registration number, vehicle code, year, or phone number can be used to search"
        />

        <div className="flex items-center gap-2 flex-shrink-0 -mt-1 mb-10">
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center gap-1 px-3 py-2 bg-white text-black shadow-lg rounded-md hover:text-white hover:bg-[#ffa733] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <SortDropdown
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
          />
          <LimitDropdown
            limit={limit}
            setLimit={setLimit}
            isLoading={isLoading}
          />
        </div>
      </div>

      <GenericTable<CompanyListingVehicleType>
        columns={GeneralCompanyListingColumns(handleOpenModal, isModified)} // Pass isModified to conditionally show parameterField
        data={(data?.result?.list || []) as CompanyListingVehicleType[]}
        loading={isLoading}
        loadingText="Fetching Vehicles with State and Location..."
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.result.totalNumberOfPages as number}
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
    </section>
  );
}