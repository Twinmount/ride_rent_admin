import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Copy, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import { toast } from "@/components/ui/use-toast";
import SearchBox from "@/components/SearchBox";
import { useSearchParams } from "react-router-dom";
import { useAdminContext } from "@/context/AdminContext";
import { GenericTable } from "@/components/table/GenericTable";
import { Plus, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CouponStatusModal from "@/components/modal/CoupenStatusModal";
import CouponViewModal from "@/components/modal/CoupenViewModal";
import CouponFormModal from "@/components/modal/CouponFormModal";
import {
  getAllCoupons,
  updateCouponStatus,
  deleteCoupon,
  CouponType,
} from "@/api/coupen";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CouponColumnsProps {
  onEdit: (coupon: CouponType) => void;
  onDelete: (coupon: CouponType) => void;
  onView: (coupon: CouponType) => void;
  onStatusChange: (coupon: CouponType) => void;
  currencySymbol: string; // ✅ ADDED: Pass currency symbol to columns
}

export const couponColumns = ({
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  currencySymbol, // ✅ ADDED: Receive currency symbol
}: CouponColumnsProps): ColumnDef<CouponType>[] => [
  {
    accessorKey: "couponCode",
    header: "Coupon Code",
    cell: ({ row }) => {
      const code = row.getValue("couponCode") as string;
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-primary">{code}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              navigator.clipboard.writeText(code);
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "couponName",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("couponName") as string;
      const isVisible = row.original.isVisibleOnCard;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          {isVisible && (
            <Badge variant="secondary" className="w-fit text-xs mt-1">
              Visible on Cards
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "discountType",
    header: "Discount",
    cell: ({ row }) => {
      const type = row.original.discountType;
      const value = row.original.discountValue;
      const maxDiscount = row.original.maxDiscountAmount;

      return (
        <div className="flex flex-col">
          <span className="font-semibold">
            {/* ✅ FIXED: Use dynamic currency symbol instead of hardcoded ₹ */}
            {type === "PERCENTAGE" ? `${value}%` : `${currencySymbol}${value}`}
          </span>
          {type === "PERCENTAGE" && maxDiscount && (
            <span className="text-xs text-muted-foreground">
              {/* ✅ FIXED: Use dynamic currency symbol */}
              Max: {currencySymbol}{maxDiscount}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "minOrderValue",
    header: "Min Order",
    cell: ({ row }) => {
      const value = row.getValue("minOrderValue") as number;
      // ✅ FIXED: Use dynamic currency symbol
      return <span className="text-sm">{currencySymbol}{value}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors = {
        ACTIVE: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
        INACTIVE: "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20",
        EXPIRED: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
      };

      return (
        <Badge
          className={statusColors[status as keyof typeof statusColors]}
          variant="outline"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "usage",
    header: "Usage",
    cell: ({ row }) => {
      const usageCount = row.original.usageCount;
      const usageLimit = row.original.usageLimit;

      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {usageCount}
            {usageLimit ? ` / ${usageLimit}` : " / ∞"}
          </span>
          {usageLimit && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{
                  width: `${Math.min((usageCount / usageLimit) * 100, 100)}%`,
                }}
              />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "validity",
    header: "Validity Period",
    cell: ({ row }) => {
      const startDate = new Date(row.original.startDate);
      const endDate = new Date(row.original.endDate);
      const now = new Date();

      const isActive = now >= startDate && now <= endDate;
      const isExpired = now > endDate;
      // const isUpcoming = now < startDate;

      return (
        <div className="flex flex-col text-xs">
          <span className="text-muted-foreground">
            {format(startDate, "MMM dd, yyyy")}
          </span>
          <span className="text-muted-foreground">
            {format(endDate, "MMM dd, yyyy")}
          </span>
          <Badge
            variant="outline"
            className={`w-fit mt-1 ${
              isActive
                ? "bg-green-50 text-green-600"
                : isExpired
                  ? "bg-red-50 text-red-600"
                  : "bg-yellow-50 text-yellow-600"
            }`}
          >
            {isActive ? "Active" : isExpired ? "Expired" : "Upcoming"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "stateAvailability",
    header: "States",
    cell: ({ row }) => {
      const states = row.original.stateAvailability;
      const enabledStates = states.filter((s) => s.isEnabled);

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {enabledStates.length} State{enabledStates.length !== 1 ? "s" : ""}
          </span>
          {enabledStates.length > 0 && (
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
              {enabledStates.map((s) => s.stateName).join(", ")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as number;
      return (
        <Badge variant="outline" className="font-mono">
          {priority}
        </Badge>
      );
    },
  },
{
  accessorKey: "createdAt",
  header: "Created",
  cell: ({ row }) => {
    const createdAt = row.getValue("createdAt") as any;

    const date = createdAt?.$date
      ? new Date(createdAt.$date)
      : new Date(createdAt);

    if (isNaN(date.getTime())) {
      return <span className="text-xs text-muted-foreground">—</span>;
    }

    return (
      <span className="text-xs text-muted-foreground">
        {format(date, "MMM dd, yyyy")}
      </span>
    );
  },
},
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const coupon = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(coupon.couponCode)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(coupon)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(coupon)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Coupon
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(coupon)}>
              <Badge className="mr-2 h-4 w-4" />
              Change Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(coupon)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];




interface CouponListingPageProps {
  queryKey: string[];
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  title: string;
}

export default function CouponListingPage({
  queryKey,
  status,
  title,
}: CouponListingPageProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>(status || "all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const { country } = useAdminContext();

  const queryClient = useQueryClient();

  // ✅ ADDED: Get currency symbol based on country value (same as CouponFormModal)
  const getCurrencySymbol = () => {
    return country.countryValue === "UAE" ? "AED" : "₹";
  };

  const currencySymbol = getCurrencySymbol();

  const { data, isLoading } = useQuery({
    queryKey: [
      ...queryKey,
      page,
      limit,
      sortOrder,
      searchTerm,
      country,
      statusFilter,
      visibilityFilter,
    ],
    queryFn: () =>
      getAllCoupons({
        page,
        limit,
        sortOrder,
        status: statusFilter !== "all" ? (statusFilter as any) : undefined,
        search: searchTerm.trim(),
        countryId: country.countryId,
        isVisibleOnCard:
          visibilityFilter !== "all"
            ? visibilityFilter === "visible"
            : undefined,
      }),
    enabled: !!country.countryId,
  });

  // Calculate stats from data
  const stats = {
    total: data?.result?.count || 0,
    active:
      data?.result?.list?.filter((c) => c.status === "ACTIVE").length || 0,
    inactive:
      data?.result?.list?.filter((c) => c.status === "INACTIVE").length || 0,
    expired:
      data?.result?.list?.filter((c) => c.status === "EXPIRED").length || 0,
  };

  const handleCreate = () => {
    setSelectedCoupon(null);
    setFormModalOpen(true);
  };

  const handleEdit = (coupon: CouponType) => {
    setSelectedCoupon(coupon);
    setFormModalOpen(true);
  };

  const handleView = (coupon: CouponType) => {
    setSelectedCoupon(coupon);
    setViewModalOpen(true);
  };

  const handleDelete = (coupon: CouponType) => {
    setSelectedCoupon(coupon);
    setDeleteModalOpen(true);
  };

  const handleStatusChange = (coupon: CouponType) => {
    setSelectedCoupon(coupon);
    setStatusModalOpen(true);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey });
    setFormModalOpen(false);
    setSelectedCoupon(null);
  };

  const handleStatusSubmit = async (
    newStatus: "ACTIVE" | "INACTIVE" | "EXPIRED"
  ) => {
    if (!selectedCoupon) return;

    try {
      await updateCouponStatus({
        couponId: selectedCoupon._id,
        status: newStatus,
      });

      queryClient.invalidateQueries({
        queryKey,
      });

      toast({
        title: "Status Updated",
        description: `Coupon ${selectedCoupon.couponCode} is now ${newStatus}`,
        className: "bg-green-500 text-white",
      });

      setStatusModalOpen(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error("Failed to update coupon status:", error);
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "Something went wrong while updating the coupon status.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCoupon) return;

    try {
      await deleteCoupon(selectedCoupon._id);

      queryClient.invalidateQueries({
        queryKey,
      });

      toast({
        title: "Coupon Deleted",
        description: `Coupon ${selectedCoupon.couponCode} has been deleted successfully`,
        className: "bg-green-500 text-white",
      });

      setDeleteModalOpen(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error("Failed to delete coupon:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete coupon",
        description: "Something went wrong while deleting the coupon.",
      });
      throw error;
    }
  };

  return (
    <section className="container mx-auto min-h-screen py-5 md:py-7">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track all your promotional coupons
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Coupons</p>
                <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">
                  {stats.active}
                </h3>
              </div>
              <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                ACTIVE
              </Badge>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-600">
                  {stats.inactive}
                </h3>
              </div>
              <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20">
                INACTIVE
              </Badge>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <h3 className="text-2xl font-bold mt-1 text-red-600">
                  {stats.expired}
                </h3>
              </div>
              <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
                EXPIRED
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBox
            placeholder="Search by coupon name or code"
            searchDescription="Enter coupon name or code to search"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>

          {/* Visibility Filter */}
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coupons</SelectItem>
              <SelectItem value="visible">Visible on Cards</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>

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

      {/* Table - ✅ FIXED: Pass currencySymbol to columns */}
      <GenericTable<CouponType>
        columns={couponColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
          onView: handleView,
          onStatusChange: handleStatusChange,
          currencySymbol, // ✅ Pass the dynamic currency symbol
        })}
        data={data?.result?.list || []}
        loading={isLoading}
        loadingText="Fetching Coupons..."
      />

      {/* Pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.result?.totalNumberOfPages || 1}
      />

      {/* Modals */}
      
      {/* Create/Edit Form Modal */}
      <CouponFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedCoupon(null);
        }}
        onSuccess={handleFormSuccess}
        coupon={selectedCoupon || undefined}
        countryId={country.countryId}
        countryValue={country.countryValue}
      />

      {/* Status Change Modal */}
      {selectedCoupon && statusModalOpen && (
        <CouponStatusModal
          coupon={selectedCoupon}
          isOpen={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false);
            setSelectedCoupon(null);
          }}
          onSubmit={handleStatusSubmit}
        />
      )}

      {/* View Details Modal */}
      {selectedCoupon && viewModalOpen && (
        <CouponViewModal
          coupon={selectedCoupon}
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedCoupon(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedCoupon && deleteModalOpen && (
        <Dialog 
          open={deleteModalOpen} 
          onOpenChange={(open) => {
            setDeleteModalOpen(open);
            if (!open) setSelectedCoupon(null);
          }}
        >
          <DialogContent className="mx-auto w-fit !rounded-3xl max-sm:w-[95%]">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                Delete Coupon
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete coupon{" "}
                <span className="font-mono font-semibold text-primary">
                  {selectedCoupon.couponCode}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
              <div>
                <div className="mt-4 flex justify-center gap-3">
                  <Button
                    onClick={handleDeleteConfirm}
                    className="bg-red-500 !font-semibold !text-white hover:bg-red-600"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setSelectedCoupon(null);
                    }}
                    className="bg-gray-400 !text-white hover:bg-gray-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}