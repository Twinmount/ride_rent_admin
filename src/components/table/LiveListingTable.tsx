import { ColumnDef } from "@tanstack/react-table";
import { LiveListingVehicleType } from "@/types/api-types/vehicleAPI-types";
import { GenericTable } from "@/components/table/GenericTable";

interface AllListingTableProps {
  columns: ColumnDef<LiveListingVehicleType>[];
  data: LiveListingVehicleType[];
  loading: boolean;
}

export function AllListingTable(props: AllListingTableProps) {
  return <GenericTable {...props} loadingText="Fetching Listings ..." />;
}
