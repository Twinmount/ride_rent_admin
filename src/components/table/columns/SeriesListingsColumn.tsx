import { SeriesListType } from "@/types/api-types/API-types";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export const SeriesListingColumns: ColumnDef<SeriesListType>[] = [
  {
    accessorKey: "vehicleSeriesLabel",
    header: "Vehicle Series",
    cell: ({ row }) => (
      <Link
        to={`/manage-series/edit/${row.original.vehicleSeriesId}`}
        className="font-semibold text-blue-600"
      >
        {row.original.vehicleSeriesLabel || "N/A"}
      </Link>
    ),
  },
  {
    accessorKey: "vehicleSeries",
    header: "Value (for URL)",
  },
  {
    accessorKey: "vehicleSeriesId",
    header: "Series ID",
  },
];
