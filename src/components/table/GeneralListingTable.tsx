import { ColumnDef } from "@tanstack/react-table";
import { GeneralListingVehicleType } from "@/types/api-types/vehicleAPI-types";
import { GenericTable } from "@/components/table/GenericTable";

interface GeneralListingTableProps {
  columns: ColumnDef<GeneralListingVehicleType>[];
  data: GeneralListingVehicleType[];
  loading: boolean;
}

export function GeneralListingTable(props: GeneralListingTableProps) {
  return <GenericTable {...props} />;
}
