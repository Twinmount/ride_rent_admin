// Updated component (SupplierListingPage.tsx) - Fixed data extraction and pagination for both category and search
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupplierCategoryDetails, searchSuppliers } from "@/api/supplier-central";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useAdminContext } from "@/context/AdminContext";
import { GenericTable } from "@/components/table/GenericTable";
import { ColumnDef, Row } from "@tanstack/react-table";
import { SupplierDetailedResponse, FetchSupplierCategoryDetailsResponse } from "@/types/api-types/API-types";
import { ExportExcelButton } from "@/components/ui/excelExportButoon";
import { RefreshCw } from "lucide-react";

const fullColumns = (
  onView: (supplier: SupplierDetailedResponse) => void
): ColumnDef<SupplierDetailedResponse>[] => [
  {
    accessorKey: "agentId",
    header: "Agent ID",
    cell: ({ row }: { row: Row<SupplierDetailedResponse> }) => (
      <button
        className="text-blue-500 hover:underline cursor-pointer font-bold"
        onClick={(e) => {
          e.stopPropagation(); // Prevent any row click if present
          onView(row.original);
        }}
      >
        {row.original.agentId}
      </button>
    ),
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }: { row: Row<SupplierDetailedResponse> }) => 
      row.original.lastLogin === "1970-01-01T00:00:00.000Z" 
        ? "Never" 
        : new Date(row.original.lastLogin).toLocaleString(),
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }: { row: Row<SupplierDetailedResponse> }) => 
      row.original.lastActivity === "1970-01-01T00:00:00.000Z" 
        ? "Never" 
        : new Date(row.original.lastActivity).toLocaleString(),
  },
  {
    accessorKey: "lastEnquiry",
    header: "Last Enquiry",
    cell: ({ row }: { row: Row<SupplierDetailedResponse> }) => 
      row.original.lastEnquiry === "1970-01-01T00:00:00.000Z" 
        ? "Never" 
        : new Date(row.original.lastEnquiry).toLocaleString(),
  },
  {
    accessorKey: "monthlyEnquiries",
    header: "Monthly Enquiries",
  },
  {
    accessorKey: "lifetimeEnquiries",
    header: "Lifetime Enquiries",
  },
  {
    accessorKey: "monthlyUnlocks",
    header: "Monthly Unlocks",
  },
  {
    accessorKey: "lifetimeUnlocks",
    header: "Lifetime Unlocks",
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "monthlyMissed",
    header: "Monthly Missed",
  },
  {
    accessorKey: "lifetimeMissed",
    header: "Lifetime Missed",
  },
  {
    accessorKey: "monthlyCancelled",
    header: "Monthly Cancelled",
  },
  {
    accessorKey: "lifetimeCancelled",
    header: "Lifetime Cancelled",
  },
  {
    accessorKey: "regNumber",
    header: "Reg Number",
  },
  {
    accessorKey: "joinedDate",
    header: "Joined Date",
    cell: ({ row }: { row: Row<SupplierDetailedResponse> }) => new Date(row.original.joinedDate).toLocaleDateString(),
  },
  {
    accessorKey: "countryName",
    header: "Country",
  },
  {
    accessorKey: "expireDate",
    header: "Expire Date",
    cell: ({ row }: { row: Row<SupplierDetailedResponse> }) => new Date(row.original.expireDate).toLocaleDateString(),
  },
  {
    accessorKey: "missedQueriesCount",
    header: "Missed Queries Count",
  },
];

interface SupplierListingPageProps {
  queryKey: string[];
}

export default function SupplierListingPage({ queryKey }: SupplierListingPageProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const { country } = useAdminContext();
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const titleMap: Record<string, string> = {
    "total-suppliers": "Total Suppliers",
    subscribed: "Subscribed Suppliers",
    "missed-subscriptions": "Missed Subscriptions",
    inactive: "Inactive Suppliers",
    "order-missed": "Order Missed Suppliers",
  };

  const title = titleMap[category || ""] || "Suppliers";
  const isSearching = !!searchTerm.trim();
  const currentCategory = category || "total-suppliers";
  const displayTitle = isSearching ? `Search Results for "${searchTerm}"` : title;

  // Query for category details (when not searching)
  const { data: categoryData, isLoading: categoryLoading } = useQuery<FetchSupplierCategoryDetailsResponse>({
    queryKey: [...queryKey, category, page, limit, sortOrder, country, "category"],
    queryFn: () =>
      getSupplierCategoryDetails({
        category: currentCategory as any,
        page,
        limit,
        sortOrder,
        search: "", // No search when using category
        countryId: country.countryId,
      }),
    enabled: !!country.countryId && !!category && !isSearching,
  });

  // Query for search API (when searching) - Now supports pagination
  const { data: searchData, isLoading: searchLoading } = useQuery<FetchSupplierCategoryDetailsResponse>({
    queryKey: [...queryKey, "search", searchTerm, page, limit, sortOrder, country, "search"],
    queryFn: () => searchSuppliers({ 
      search: searchTerm.trim(), 
      page, 
      limit,
      agentId: undefined  // Or from params if needed
    }),
    enabled: !!searchTerm.trim() && !!country.countryId,
  });

  const apiData = isSearching ? searchData : categoryData;
  const isLoading = isSearching ? searchLoading : categoryLoading;

  // Extract suppliers - Always from .result.data for consistency
  const suppliers: SupplierDetailedResponse[] = apiData?.result?.data || [];

  // Extract total and pages - Consistent for both
  const total = apiData?.result?.total || 0;
  const totalPages = apiData?.result?.totalNumberOfPages || Math.ceil(total / limit);

  // Reset page to 1 when search or other filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, category, country]);

  const handleViewDetails = (supplier: SupplierDetailedResponse) => {
    console.log("Navigating to details for ID:", supplier._id); // Debug log
    navigate(`/supplier/registrations/view/${supplier._id}`);
  };

  const handleRefresh = () => {
    if (isSearching) {
      queryClient.invalidateQueries({ queryKey: [...queryKey, "search", searchTerm, page, limit, sortOrder, country, "search"] });
    } else {
      queryClient.invalidateQueries({ queryKey: [...queryKey, category, page, limit, sortOrder, country, "category"] });
    }
  };

  const columns = fullColumns(handleViewDetails);

  return (
    <section className="container mx-auto min-h-screen py-5 md:py-7">
      <div className="flex-between my-2 mb-6 max-sm:flex-col">
        <h1 className="text-2xl font-bold">{displayTitle}</h1>

        <div className="flex-between w-fit gap-x-2">
          <SortDropdown
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
          />
          <LimitDropdown
            limit={limit}
            setLimit={setLimit}
            isLoading={isLoading}
          />
          <div className="relative inline-block group">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-3 py-1 text-black rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Get fresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              Get fresh data
            </span>
          </div>
          {!isSearching && (
            <ExportExcelButton 
              category={currentCategory} 
              title={title} 
              countryId={country.countryId} 
              disabled={isLoading || !country.countryId} 
            />
          )}
        </div>
      </div>

      <SearchBox
        placeholder="Search supplier"
        searchDescription="supplier name or supplierId can be used to search the supplier"
      />

      <GenericTable<SupplierDetailedResponse>
        columns={columns}
        data={suppliers}
        loading={isLoading}
        loadingText="Fetching Suppliers..."
      />

      {totalPages > 1 && (  // Show pagination only if more than 1 page
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </section>
  );
}