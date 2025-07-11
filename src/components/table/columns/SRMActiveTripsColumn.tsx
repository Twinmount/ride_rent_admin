import { SRMActiveTripType } from "@/types/api-types/srm-api.types";
import { ColumnDef } from "@tanstack/react-table";

export const SRMActiveTripsColumn: ColumnDef<SRMActiveTripType>[] = [
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
];
