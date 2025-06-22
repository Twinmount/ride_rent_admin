import { ColumnDef } from "@tanstack/react-table";
import { GenericTable } from "@/components/table/GenericTable";
import { JobFormType } from "@/types/types";

interface CommonListingTableProps {
  columns: ColumnDef<JobFormType>[];
  data: JobFormType[];
  loading: boolean;
}

export function CommonListingTable(props: CommonListingTableProps) {
  return <GenericTable {...props} />;
}
