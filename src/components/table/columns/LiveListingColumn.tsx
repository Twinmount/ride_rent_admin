import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { LiveListingVehicleType } from "@/types/api-types/vehicleAPI-types";

export const LiveListingColumns: (
  onToggle: (vehicleId: string, isDisabled: boolean) => void,
  isPending?: boolean,
) => ColumnDef<LiveListingVehicleType>[] = (onToggle, isPending) => [
  {
    accessorKey: "vehicleModel",
    header: "Model",
    cell: ({ row }) => {
      const { vehicleId, vehicleModel, company } = row.original;
      return (
        <Link
          to={`/listings/edit/${vehicleId}/${company.companyId}/${company.userId}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {vehicleModel}
        </Link>
      );
    },
  },
  {
    accessorKey: "vehicleCode",
    header: "Vehicle Code",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.vehicleCode}</span>
    ),
  },
  {
    accessorKey: "company.companyName",
    header: "Company Name",
  },
  {
    accessorKey: "isDisabled",
    header: "Vehicle Status",
    cell: ({ row }) => {
      const { vehicleId, isDisabled } = row.original;
      return (
        <Switch
          checked={!isDisabled}
          onCheckedChange={(checked) => onToggle(vehicleId, !checked)}
          disabled={isPending}
          className={`${isPending && "!cursor-wait"} ml-3`}
        />
      );
    },
  },
];
