import { SRMVehicleType } from "@/types/api-types/srm-api.types";
import { RentalDetailsFormFieldType } from "@/types/formTypes";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

type HandleEditClickType = (
  vehicleId: string,
  rentalDetails: RentalDetailsFormFieldType,
) => void;

export const SRMVehicleColumn = (
  handleEditClick: HandleEditClickType,
): ColumnDef<SRMVehicleType>[] => [
  {
    accessorKey: "vehicleId",
    header: "Vehicle ID",
    cell: ({ row }) => (
      <Link
        to={`/srm/vehicles/edit/${row.original.vehicleId}`}
        className="font-semibold text-blue-600 hover:underline"
      >
        {row.original.vehicleId}
      </Link>
    ),
  },
  {
    accessorKey: "agentName",
    header: "Agent Name",
  },
  {
    accessorKey: "brandName",
    header: "Brand Name",
  },
  {
    accessorKey: "vehicleCategory",
    header: "Vehicle Category",
  },
  {
    accessorKey: "vehicleRegistrationNumber",
    header: "Registration Number",
  },
  {
    accessorKey: "vehiclePhoto",
    header: "Photo",
    cell: ({ row }) => {
      const vehiclePhoto = row.original.vehiclePhoto;
      return vehiclePhoto ? (
        <Link to={`/srm/manage-vehicles/edit/${row.original.vehicleId}`}>
          <div className="h-16 w-24 overflow-hidden rounded-md border bg-slate-300 hover:outline-2 hover:outline-blue-400">
            <img
              src={vehiclePhoto}
              alt="Vehicle"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      ) : (
        <div className="flex-center h-16 w-16 overflow-hidden rounded-md bg-slate-300 text-[0.6rem] text-gray-600">
          No Image
        </div>
      );
    },
  },

  {
    accessorKey: "rentalDetails",
    header: "Rental Details",
    cell: ({ row }) => (
      <div className="flex flex-col justify-center gap-y-1">
        <span>
          Day :{" "}
          <span className="font-semibold">
            {row.original.rentalDetails?.day?.rentInAED + " AED" || "N/A"}
          </span>
        </span>
        <span>
          Week :{" "}
          <span className="font-semibold">
            {row.original.rentalDetails?.week?.rentInAED + " AED" || "N/A"}
          </span>
        </span>
        <span>
          Month :
          <span className="font-semibold">
            {row.original.rentalDetails?.month?.rentInAED + " AED" || "N/A"}
          </span>
        </span>
        <span>
          Hour :{" "}
          <span className="font-semibold">
            {row.original.rentalDetails?.hour?.rentInAED + " AED" || "N/A"}
          </span>
        </span>
      </div>
    ),
  },
  {
    header: "Edit",
    cell: ({ row }) => {
      const { vehicleId, rentalDetails } = row.original;
      return (
        <button
          onClick={() => handleEditClick(vehicleId, rentalDetails)}
          className="text-blue-600 hover:underline"
        >
          Edit Rental Details
        </button>
      );
    },
  },
];
