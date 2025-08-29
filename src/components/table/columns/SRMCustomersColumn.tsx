import { SRMCustomerType } from "@/types/api-types/srm-api.types";
import { ColumnDef } from "@tanstack/react-table";

export const SRMCustomersColumn: ColumnDef<SRMCustomerType>[] = [
  {
    accessorKey: "customerId",
    header: "Customer ID",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    header: "Contact Number",
    cell: ({ row }) => {
      const { countryCode, phoneNumber } = row.original;
      return `${countryCode}${phoneNumber}`;
    },
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
  },
  {
    accessorKey: "passportNumber",
    header: "Passport Number",
  },
  {
    accessorKey: "drivingLicenseNumber",
    header: "Driving License Number",
  },
];
