// Updated: GeneralCompanyListingColumns (in @/components/table/columns/UpdateListingColumn)
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CompanyListingVehicleType } from "@/types/api-types/vehicleAPI-types";

export const GeneralCompanyListingColumns = (
  handleOpenModal: (vehicle: CompanyListingVehicleType) => void,
  isModified: boolean = false, // Accept isModified prop
): ColumnDef<CompanyListingVehicleType>[] => {
  const baseColumns: ColumnDef<CompanyListingVehicleType>[] = [
    // UPDATED: Reordered as per request: agentId first - Now clickable as a Link to company details page
    {
      accessorKey: "company.agentId",
      header: "Agent ID",
      cell: ({ row }) => (
        <Link
          to={`/company/registrations/view/${row.original.company.companyId}`}
          className="text-blue-500 hover:underline cursor-pointer font-bold whitespace-nowrap"
        >
          {row.original.company.agentId}
        </Link>
      ),
    },
    // companyname (Company Name)
    {
      accessorKey: "company.companyName",
      header: "Company Name",
      cell: ({ row }) => {
        return (
          <span className="whitespace-nowrap">
            {row.original.company.companyName}
          </span>
        );
      },
    },
    // date time (Agent Date Time)
    {
      accessorKey: "agentDateTime",
      header: "Date Time",
      cell: ({ row }) => {
        const dateTime = new Date(row.original.agentDateTime).toLocaleString();
        return <span className="whitespace-nowrap">{dateTime}</span>;
      },
    },
    // vehicle id (NEW: Added explicit Vehicle ID column)
   {
      accessorKey: "vehicleId",
      header: "Vehicle Code",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.vehicleCode}</span>
      ),
    },
    // state (State)
    {
      accessorKey: "state.stateName",
      header: "State",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium">
          {row.original.state?.stateName || "N/A"}
        </span>
      ),
    },
    // location (Location (Cities))
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => {
        const locations = Array.isArray(row.original.location) ? row.original.location : [];
        const cityNames = locations.map((loc: any) => loc.cityName).join(", ");
        return (
          <span className="line-clamp-2 max-w-[150px]">
            {cityNames || "N/A"}
          </span>
        );
      },
    },
    // modal (Model - vehicleModel)
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
    // approvalStatus (kept last as action column; not mentioned but essential)
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

  if (isModified) {
    baseColumns.splice(baseColumns.length - 1, 0, {
      accessorKey: "parameterField",
      header: "Parameters",
      cell: ({ row }) => {
        const { parameterField } = row.original;
        return (
          <span className="line-clamp-2 max-w-[200px] text-xs text-gray-600">
            {parameterField || "No changes"}
          </span>
        );
      },
    });
  }

  return baseColumns;
};