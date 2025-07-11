import { SRMAgentType } from "@/types/api-types/srm-api.types";
import { ColumnDef } from "@tanstack/react-table";

export const SRMAgentsColumn: ColumnDef<SRMAgentType>[] = [
  {
    accessorKey: "agentName",
    header: "Agent",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "activatedDate",
    header: "Activated Date",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({}) => {
      // const expiryDate = new Date(row.original.expiryDate).toLocaleDateString();
      const expiryDate = "N/A";
      return <span className="whitespace-nowrap">{expiryDate}</span>;
    },
  },
  {
    accessorKey: "planDetails",
    header: "Plan Details",
    cell: ({}) => {
      const planDetails = "N/A";
      return <span className="whitespace-nowrap">{planDetails}</span>;
    },
  },
];
