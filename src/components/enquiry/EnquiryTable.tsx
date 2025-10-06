import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { AdminEnquiry } from "@/types/api-types/API-types";
import { EnquiryTableRow } from "./EnquiryTableRow";

interface EnquiryTableProps {
  enquiries: AdminEnquiry[];
  revealedPhones: { [key: string]: boolean };
  onTogglePhoneVisibility: (enquiryId: string) => void;
  onVehicleClick?: (enquiry: AdminEnquiry) => void;
  onStatusChange?: (enquiry: AdminEnquiry) => void;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  className?: string;
}

export function EnquiryTable({
  enquiries,
  revealedPhones,
  onTogglePhoneVisibility,
  onVehicleClick,
  onStatusChange,
  onSort,
  sortField,
  sortDirection,
  className = "",
}: EnquiryTableProps) {
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return (
        <ArrowUpDown
          className={`h-3 w-3 ${sortDirection === "desc" ? "rotate-180" : ""}`}
        />
      );
    }
    return <ArrowUpDown className="h-3 w-3" />;
  };

  return (
    <div className={`rounded-lg border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-primary">
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => handleSort("agent")}
              >
                Agent Name
                {getSortIcon("agent")}
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => handleSort("customer")}
              >
                Customer Name
                {getSortIcon("customer")}
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              Customer Email
            </TableHead>
            <TableHead className="font-semibold text-primary">
              Customer Phone
            </TableHead>
            <TableHead className="font-semibold text-primary">
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => handleSort("location")}
              >
                Location
                {getSortIcon("location")}
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => handleSort("date")}
              >
                Enquiry Date
                {getSortIcon("date")}
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              Enquired Vehicle
              <div className="text-xs font-normal text-muted-foreground">
                Enquired vehicle name with hyperlink to see the page
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => handleSort("status")}
              >
                Enquiry Status
                {getSortIcon("status")}
              </div>
              <div className="text-xs font-normal text-muted-foreground">
                Current status of the booking: Pending, accepted, cancelled
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries.length > 0 ? (
            enquiries.map((enquiry) => (
              <EnquiryTableRow
                key={enquiry._id}
                enquiry={enquiry}
                isPhoneRevealed={revealedPhones[enquiry._id]}
                onTogglePhoneVisibility={onTogglePhoneVisibility}
                onVehicleClick={onVehicleClick}
                onStatusChange={onStatusChange}
              />
            ))
          ) : (
            <TableRow>
              <td
                colSpan={8}
                className="py-8 text-center text-muted-foreground"
              >
                No enquiries found
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
