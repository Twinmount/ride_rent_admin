import { Button } from "@/components/ui/button";
import { SRMCompletedTripType } from "@/types/api-types/srm-api.types";
import { ColumnDef } from "@tanstack/react-table";
import { CloudDownload } from "lucide-react";

// Define function type for handleOpenModal
type HandleOpenModalType = (tripData: SRMCompletedTripType) => void;

export const SRMCompletedTripsColumn = (
  handleOpenModal: HandleOpenModalType,
): ColumnDef<SRMCompletedTripType>[] => [
  {
    accessorKey: "tripId",
    header: "Trip ID",
  },
  {
    accessorKey: "agentName",
    header: "Agent Name",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "countryCode",
    header: "Country Code",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
  },
  {
    accessorKey: "vehicleId",
    header: "Vehicle ID",
  },
  {
    accessorKey: "vehicleName",
    header: "Vehicle Name",
  },
  {
    accessorKey: "bookingStartDate",
    header: "Booking Start Date",
  },
  {
    accessorKey: "bookingEndDate",
    header: "Booking End Date",
  },
  {
    accessorKey: "totalAmountCollected",
    header: "Total Amount Collected",
  },
  {
    accessorKey: "downloadReceipt",
    header: "Download Receipt",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <Button
          onClick={() => handleOpenModal(company)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-slate-800 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-1"
        >
          Receipt
          <CloudDownload className="h-4 w-4" />
        </Button>
      );
    },
  },
];
