import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Download } from "lucide-react";
import { adminEnquiryUtils, ENQUIRY_STATUSES } from "@/utils/adminEnquiryUtils";

interface EnquiryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  uniqueVehicleLocations: string[];
  clearFilters: () => void;
  onExport?: () => void;
  searchPlaceholder?: string;
}

export function EnquiryFilters({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  statusFilter,
  setStatusFilter,
  uniqueVehicleLocations,
  clearFilters,
  onExport,
  searchPlaceholder = "Search agents, cars or customers...",
}: EnquiryFiltersProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {uniqueVehicleLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(ENQUIRY_STATUSES).map((status) => (
              <SelectItem key={status} value={status}>
                {adminEnquiryUtils.formatStatus(status).label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={clearFilters}
          variant="outline"
          className="gap-2 bg-transparent"
        >
          <Filter className="h-4 w-4" />
          Clear Filters
        </Button>
        {onExport && (
          <Button onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
        )}
      </div>
    </div>
  );
}
