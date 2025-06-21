import { ColumnDef } from "@tanstack/react-table";
import { GenericTable } from "@/components/table/GenericTable";
import { JobFormType } from "@/types/types";

interface ApplicationListingTableProps {
  columns: ColumnDef<JobFormType>[];
  data: JobFormType[];
  loading: boolean;
}

export function ApplicationListingTable(props: ApplicationListingTableProps) {
  return <GenericTable {...props} />;
}
