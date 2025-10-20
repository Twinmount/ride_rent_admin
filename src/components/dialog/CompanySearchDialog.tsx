import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCompany } from "@/api/company";
import { CompanyType } from "@/types/api-types/vehicleAPI-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminContext } from "@/context/AdminContext";
import SearchBox from "@/components/SearchBox";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface CompanySearchDialogProps {
  onSelect: (company: CompanyType) => void;
}

export default function CompanySearchDialog({
  onSelect,
}: CompanySearchDialogProps) {
  const [open, setOpen] = useState(false);
  const { country } = useAdminContext();

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["company-search", searchTerm, country.countryId],
    queryFn: () =>
      getAllCompany({
        page: 1,
        limit: 20,
        sortOrder: "ASC",
        search: searchTerm.trim(),
        approvalStatus: "APPROVED",
        countryId: country.countryId,
      }),
    enabled: open && !!country.countryId,
  });

  const handleSelect = (company: CompanyType) => {
    onSelect(company);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-center gap-x-2 shadow-lg">
          Company <SlidersHorizontal size={17} className="my-auto ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter by Company</DialogTitle>
          <DialogDescription>
            Search and select a company to filter vehicle listings.
          </DialogDescription>
        </DialogHeader>

        {/* Reused debounced SearchBox */}
        <SearchBox placeholder="Search company name or agent ID..." />

        <ScrollArea className="h-60 rounded border p-2">
          {isLoading && (
            <p className="flex-center h-24 text-sm text-muted-foreground">
              Loading...
            </p>
          )}
          {!isLoading && data?.result?.list?.length === 0 && (
            <p className="flex-center h-24 text-sm text-muted-foreground">
              No companies found.
            </p>
          )}
          <div className="space-y-2">
            {data?.result?.list?.map((company: CompanyType) => (
              <div
                key={company.companyId}
                className="cursor-pointer rounded p-2 hover:bg-muted"
                onClick={() => handleSelect(company)}
              >
                <p className="font-medium">{company.companyName}</p>
                <p className="text-xs text-muted-foreground">
                  Agent ID: {company.userId}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
