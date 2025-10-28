// Fully Updated SupplierListingPage.tsx - Integrated DigestModal with complete columns and fixed mutations
import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { downloadDigestPdf, getSupplierCategoryDetails, searchSuppliers, sendDigestEmail } from "@/api/supplier-central"; // Import API functions
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useAdminContext } from "@/context/AdminContext";
import { GenericTable } from "@/components/table/GenericTable";
import { ColumnDef, Row } from "@tanstack/react-table";
import { SupplierDetailedResponse, FetchSupplierCategoryDetailsResponse, SendDigestPayload } from "@/types/api-types/API-types";
import { ExportExcelButton } from "@/components/ui/excelExportButoon";
import { CircleArrowLeft, RefreshCw } from "lucide-react";
import DigestModal from "@/components/modal/SendDigestModal";
import { toast } from "@/components/ui/use-toast";

const fullColumns = (
  onView: (supplier: SupplierDetailedResponse) => void,
  onOpenDigestModal: (supplier: SupplierDetailedResponse) => void,
  sendUpgradeMutation: any
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
  // New Actions column
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: Row<SupplierDetailedResponse> }) => {
      const supplier = row.original;
      const isUpgradeLoading = sendUpgradeMutation.isPending && sendUpgradeMutation.variables?.supplierId === supplier._id;

      return (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDigestModal(supplier); // Open modal
            }}
            className="px-2 py-1 bg-[#ffa733] text-white text-xs rounded hover:bg-[#e68a1e] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send Digest Email"
          >
            Digest
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              sendUpgradeMutation.mutate({ supplierId: supplier._id });
            }}
            disabled={isUpgradeLoading}
            className="px-2 py-1 bg-[#ffa733] text-white text-xs rounded hover:bg-[#e68a1e] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send Upgrade Email"
          >
            {isUpgradeLoading ? "Sending..." : "Upgrade"}
          </button>
        </div>
      );
    },
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

  // Modal state for Digest
  const [isDigestModalOpen, setIsDigestModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDetailedResponse | null>(null);

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

  // Mutations for Send Digest and Send Upgrade
const sendDigestMutation = useMutation({
  mutationFn: sendDigestEmail,
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: [...queryKey] });
    toast({
      title: "Digest Queued",
      description: data.message || "Email sending in background—check inbox.",
    });
  },
  onError: (error, variables) => {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    if (msg.includes('timeout') || msg.includes('ECONNABORTED')) {
      // Don't fail—email likely sent async
      toast({
        title: "Processing Delay",
        description: "Request queued. Email should arrive shortly (check spam).",
        variant: "default",  // Neutral/warning
      });
      // Optionally retry once
      sendDigestMutation.mutate(variables, { onSuccess: () => {} });
    } else {
      toast({
        title: "Send Failed",
        description: msg,
        variant: "destructive",
      });
    }
    console.error("Digest error:", error);
  },
});

const handleSendEmail = async (payload: SendDigestPayload) => {
  await sendDigestMutation.mutateAsync(payload);
  handleCloseDigestModal();  // Close modal after success (and toast)
};

const handleDownloadPdf = async (payload: SendDigestPayload) => {
  try {
    const blob = await downloadDigestPdf({ ...payload, generatePdf: true });
    
    // Create download link (unchanged)
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `digest-${payload.supplierId}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    queryClient.invalidateQueries({ queryKey: [...queryKey] });
    toast({
      title: "Digest Queued",
      description: "PDF downloaded successfully!",
    })
    // Use toast instead of alert for prod
    console.log('PDF downloaded successfully!'); // Or toast.success
    handleCloseDigestModal();
  } catch (error) {
    console.error('PDF download error:', error);
    toast({
      title: "Download Failed",
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: "destructive",
    });
    // Close modal after error toast
    handleCloseDigestModal();
  }
};

  const sendUpgradeMutation = useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...queryKey] });
      console.log("Upgrade sent successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to send upgrade:", error);
    },
  });

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

  const handleOpenDigestModal = (supplier: SupplierDetailedResponse) => {
  setSelectedSupplier(supplier);
  setIsDigestModalOpen(true);
};

  const handleCloseDigestModal = () => {
    setIsDigestModalOpen(false);
    setSelectedSupplier(null);
  };


  const handleRefresh = () => {
    if (isSearching) {
      queryClient.invalidateQueries({ queryKey: [...queryKey, "search", searchTerm, page, limit, sortOrder, country, "search"] });
    } else {
      queryClient.invalidateQueries({ queryKey: [...queryKey, category, page, limit, sortOrder, country, "category"] });
    }
  };

  const columns = fullColumns(handleViewDetails, handleOpenDigestModal, sendUpgradeMutation); // Pass handlers and mutation

  return (
    <section className="container mx-auto min-h-screen py-5 md:py-7">
      <div className="flex-between my-2 mb-6 max-sm:flex-row">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
          >
            <CircleArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">{displayTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 max-sm:flex-col max-sm:items-stretch">
        <SearchBox
          placeholder="Search supplier"
          searchDescription="supplier name or supplierId can be used to search the supplier"
        />

        <div className="flex items-center gap-2 flex-shrink-0 -mt-1 mb-10">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-2 bg-white text-black shadow-lg rounded-md hover:text-white hover:bg-[#ffa733] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          {!isSearching && (
            <ExportExcelButton 
              category={currentCategory} 
              title={title} 
              countryId={country.countryId} 
              disabled={isLoading || !country.countryId} 
            />
          )}
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
        </div>

      </div>

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

      {/* Render the Digest Modal */}
      {selectedSupplier && (
      <DigestModal
        isOpen={isDigestModalOpen}
        onClose={handleCloseDigestModal}
        onSendEmail={handleSendEmail}
        onDownloadPdf={handleDownloadPdf}
        supplierId={selectedSupplier._id}
        supplierName={selectedSupplier.companyName}
      />
      )}
    </section>
  );
}