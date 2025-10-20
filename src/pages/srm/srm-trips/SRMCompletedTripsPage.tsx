import TablePageLayout from "@/components/common/TablePageLayout";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { SortDropdown } from "@/components/SortDropdown";
import { SRMCompletedTripsColumn } from "@/components/table/columns/SRMCompletedTripsColumn";
import { GenericTable } from "@/components/table/GenericTable";
import { useListingPageState } from "@/hooks/useListingPageState";
import { SRMCompletedTripType } from "@/types/api-types/srm-api.types";
// import {  fetchAllSRMCompletedTrips } from "@/api/srm";
// import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CompletedTripReceiptDownloadDialog from "@/components/dialog/CompletedTripReceiptDownloadDialog";

export default function SRMCompletedTripsPage() {
  const [selectedTrip, setSelectedTrip] = useState<SRMCompletedTripType | null>(
    null,
  );

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
  //     fetchAllSRMCompletedTrips({
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
  const list: SRMCompletedTripType[] = [
    // {
    //   tripId: "TRIP-001",
    //   agentName: "John Doe",
    //   customerName: "Alice Smith",
    //   countryCode: "+971",
    //   phoneNumber: "501234567",
    //   nationality: "UAE",
    //   vehicleId: "VEH-123",
    //   vehicleName: "Toyota Camry 2022",
    //   bookingStartDate: "2024-07-01",
    //   bookingEndDate: "2024-07-05",
    //   totalAmountCollected: "250.0",
    // },
    // {
    //   tripId: "TRIP-002",
    //   agentName: "Jane Johnson",
    //   customerName: "Michael Brown",
    //   countryCode: "+91",
    //   phoneNumber: "9876543210",
    //   nationality: "India",
    //   vehicleId: "VEH-456",
    //   vehicleName: "Honda Civic 2021",
    //   bookingStartDate: "2024-07-03",
    //   bookingEndDate: "2024-07-08",
    //   totalAmountCollected: "400.0",
    // },
  ];

  const handleOpenModal = (tripData: SRMCompletedTripType) => {
    setSelectedTrip(tripData);
  };

  const handleDownloadReceipt = async (tripData: SRMCompletedTripType) => {
    try {
      console.log("Downloading receipt for trip:", tripData);
    } catch (error) {
    } finally {
      setSelectedTrip(null);
    }
  };

  return (
    <TablePageLayout
      heading={"SRM - Completed Trips"}
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
      {/* table */}
      <GenericTable<SRMCompletedTripType>
        columns={SRMCompletedTripsColumn(handleOpenModal)}
        data={list}
        loading={isLoading}
        loadingText="Fetching Listings..."
      />

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {/* receipt download dialog */}
      <CompletedTripReceiptDownloadDialog
        tripData={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        onSubmit={handleDownloadReceipt}
      />
    </TablePageLayout>
  );
}
