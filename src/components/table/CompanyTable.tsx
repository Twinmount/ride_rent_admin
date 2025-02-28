import { GenericTable } from "@/components/table/GenericTable";
import { ColumnDef } from "@tanstack/react-table";
import { CompanyType } from "@/types/api-types/vehicleAPI-types";

interface CompanyTableProps {
  columns: ColumnDef<CompanyType>[]; // Use generic column definition
  data: CompanyType[];
  loading: boolean;
}

export function CompanyTable(props: CompanyTableProps) {
  return <GenericTable {...props} />;
}
