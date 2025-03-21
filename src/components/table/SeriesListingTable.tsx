import { GenericTable } from "@/components/table/GenericTable";
import { ColumnDef } from "@tanstack/react-table";
import { SeriesListType } from "@/types/api-types/API-types";

interface SeriesListingTableProps {
  columns: ColumnDef<SeriesListType>[];
  data: SeriesListType[];
  loading: boolean;
}

export function SeriesListingTable(props: SeriesListingTableProps) {
  return <GenericTable {...props} />;
}
