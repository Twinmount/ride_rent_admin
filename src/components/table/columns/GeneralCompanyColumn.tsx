import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CompanyType } from "@/types/api-types/vehicleAPI-types";
import { Link } from "react-router-dom";

// Define function type for handleOpenModal
type HandleOpenModalType = (company: CompanyType) => void;

export const companyColumns = (
  handleOpenModal: HandleOpenModalType,
): ColumnDef<CompanyType>[] => [
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => (
      <Link
        to={`/company/registrations/view/${row.original.companyId}`}
        className="font-semibold text-blue-600"
      >
        {row.original.companyName}
      </Link>
    ),
  },
  {
    accessorKey: "agentId",
    header: "Agent ID",
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "approvalStatus",
    header: "Status",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <Button
          onClick={() => handleOpenModal(company)}
          className={`${
            company.approvalStatus === "APPROVED"
              ? "!bg-green-500 text-white"
              : company.approvalStatus === "PENDING"
                ? "!bg-blue-500 text-white"
                : "!bg-red-500 text-white"
          }`}
        >
          {company.approvalStatus}
        </Button>
      );
    },
  },
];
