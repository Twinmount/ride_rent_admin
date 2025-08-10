import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GeneralListingVehicleType } from "@/types/api-types/vehicleAPI-types";

export const GeneralListingColumns = (
  handleOpenModal: (vehicle: GeneralListingVehicleType) => void,
): ColumnDef<GeneralListingVehicleType>[] => [
  {
    accessorKey: "vehicleModel",
    header: "Model",
    cell: ({ row }) => {
      const { vehicleId, vehicleModel, company } = row.original;
      return (
        <Link
          to={`/listings/edit/${vehicleId}/${company?.companyId}/${company?.userId}`}
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
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {row.original.company?.companyName}
      </span>
    ),
  },
  {
    accessorKey: "approvalStatus",
    header: "Approval Status",
    cell: ({ row }) => {
      const { approvalStatus } = row.original;
      return (
        <Button
          onClick={() => handleOpenModal(row.original)}
          className={`${
            approvalStatus === "APPROVED"
              ? "!bg-green-500 text-white"
              : approvalStatus === "PENDING"
                ? "!bg-blue-500 text-white"
                : approvalStatus === "UNDER_REVIEW"
                  ? "!bg-yellow text-white"
                  : "!bg-red-500 text-white"
          }`}
        >
          {approvalStatus}
        </Button>
      );
    },
  },
];
