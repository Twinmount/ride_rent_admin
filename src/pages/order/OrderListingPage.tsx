// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useSearchParams } from "react-router-dom";
// import { Download } from "lucide-react";
// import { orderDetailsColumns } from "@/components/table/columns/SrmOrderListingColumn";
// import { fetchAllSRMOrders, downloadSRMOrderDetailsExcel } from "@/api/srm/srmOrderApi";
// import { SortDropdown } from "@/components/SortDropdown";
// import { LimitDropdown } from "@/components/LimitDropdown";
// import Pagination from "@/components/Pagination";
// import { SRMOrderDetailsType } from "@/types/api-types/srm-api.types";
// import SearchBox from "@/components/SearchBox";
// import { GenericTable } from "@/components/table/GenericTable";
// import OrderDetailsModal from "@/components/modal/SrmOrderDetailModal";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";

// interface OrderDetailsListingPageProps {
//   queryKey: string[];
//   title: string;
// }

// export default function OrderDetailsListingPage({
//   queryKey,
//   title,
// }: OrderDetailsListingPageProps) {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
//   const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
//   const [selectedOrder, setSelectedOrder] = useState<SRMOrderDetailsType | null>(
//     null,
//   );
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [searchParams] = useSearchParams();
//   const searchTerm = searchParams.get("search") || "";

//   // Fetch orders data
//   const { data, isLoading } = useQuery({
//     queryKey: [...queryKey, page, limit, sortOrder, searchTerm],
//     queryFn: () =>
//       fetchAllSRMOrders({
//         page: page - 1, // API uses 0-based indexing
//         limit,
//         sortOrder,
//         search: searchTerm.trim(),
//       }),
//   });

//   const handleViewDetails = (order: SRMOrderDetailsType) => {
//     setSelectedOrder(order);
//   };

//   const handleCloseModal = () => {
//     setSelectedOrder(null);
//   };

//   const handleDownloadExcel = async () => {
//     try {
//       setIsDownloading(true);

//       // Download all records with comprehensive details
//       await downloadSRMOrderDetailsExcel({
//         page: 0,
//         limit: 10000, // Download all records
//         sortOrder,
//         search: searchTerm.trim(),
//       });

//       toast({
//         title: "Download successful",
//         description: `Successfully downloaded ${data?.result?.total || 0} order details to Excel.`,
//         className: "bg-green-500 text-white",
//       });
//     } catch (error) {
//       console.error("Download failed:", error);
//       toast({
//         variant: "destructive",
//         title: "Download failed",
//         description: "Failed to download order details. Please try again.",
//       });
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   return (
//     <section className="container mx-auto min-h-screen py-5 md:py-7">
//       {/* Header */}
//       <div className="flex-between mb-6 max-sm:flex-col">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
//           <p className="text-muted-foreground mt-1">
//             Comprehensive view of all booking transactions and order details
//           </p>
//         </div>

        
//       </div>

//       {/* Controls */}
//       <div className="flex-between my-4 mb-6 max-sm:flex-col gap-4">
//         <div className="flex-1 max-w-md">
//           <SearchBox
//             placeholder="Search orders"
//             searchDescription="Search by Order ID, Customer Name, Email, or Vehicle Registration"
//           />
//         </div>

//         <div className="flex-between w-fit gap-x-2 mb-10">
//           <SortDropdown
//             sortOrder={sortOrder}
//             setSortOrder={setSortOrder}
//             isLoading={isLoading}
//           />
//           <LimitDropdown
//             limit={limit}
//             setLimit={setLimit}
//             isLoading={isLoading}
//           />

//           <Button
//           onClick={handleDownloadExcel}
//           disabled={isDownloading || isLoading || !data?.result?.total}
//           className="flex items-center gap-2"
//         >
//           <Download className="h-4 w-4" />
//           {isDownloading ? "Downloading..." : "Download Excel"}
//         </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <GenericTable<SRMOrderDetailsType>
//         columns={orderDetailsColumns(handleViewDetails)}
//         data={data?.result?.list || []}
//         loading={isLoading}
//         loadingText="Fetching order details..."
//       />

//       {/* Pagination */}
//       <Pagination
//         page={page}
//         setPage={setPage}
//         totalPages={data?.result.totalNumberOfPages || 1}
//       />

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <OrderDetailsModal
//           order={selectedOrder}
//           isOpen={!!selectedOrder}
//           onClose={handleCloseModal}
//         />
//       )}
//     </section>
//   );
// }

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Download } from "lucide-react";
// import { bookingDetailsColumns } from "@/components/table/columns/BookingListingColumn";
// import { fetchAllBookings, downloadBookingDetailsExcel } from "@/api/riderent/riderentBookingApi";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import { BookingDetailsType } from "@/types/api-types/srm-api.types";
import SearchBox from "@/components/SearchBox";
import { GenericTable } from "@/components/table/GenericTable";
// import BookingDetailsModal from "@/components/modal/BookingDetailModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { bookingDetailsColumns } from "@/components/table/columns/SrmOrderListingColumn";
import BookingDetailsModal from "@/components/modal/SrmOrderDetailModal";
import { downloadBookingDetailsExcel, fetchAllBookings } from "@/api/srm/srmOrderApi";

interface BookingDetailsListingPageProps {
  queryKey: string[];
  title: string;
}

export default function BookingDetailsListingPage({
  queryKey,
  title,
}: BookingDetailsListingPageProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedBooking, setSelectedBooking] = useState<BookingDetailsType | null>(
    null,
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  // Fetch bookings data
  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, page, limit, sortOrder, searchTerm],
    queryFn: () =>
      fetchAllBookings({
        page, // API uses 1-based indexing based on the response
        limit,
        sortOrder,
        search: searchTerm.trim(),
      }),
  });

  const handleViewDetails = (booking: BookingDetailsType) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);

      // Download all records with comprehensive details
      await downloadBookingDetailsExcel({
        page: 1,
        limit: 10000, // Download all records
        sortOrder,
        search: searchTerm.trim(),
      });

      toast({
        title: "Download successful",
        description: `Successfully downloaded ${data?.result?.result?.total || 0} booking details to Excel.`,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download booking details. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="container mx-auto min-h-screen py-5 md:py-7">
      {/* Header */}
      <div className="flex-between mb-6 max-sm:flex-col">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive view of all vehicle rental bookings and transaction details
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-between my-4 mb-6 max-sm:flex-col gap-4">
        <div className="flex-1 max-w-md">
          <SearchBox
            placeholder="Search bookings"
            searchDescription="Search by Booking ID, Customer Name, Email, or Vehicle Code"
          />
        </div>

        <div className="flex-between w-fit gap-x-2 mb-10">
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

          <Button
            onClick={handleDownloadExcel}
            disabled={isDownloading || isLoading || !data?.result?.result?.total}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download Excel"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <GenericTable<BookingDetailsType>
        columns={bookingDetailsColumns(handleViewDetails)}
        data={data?.result?.result?.list || []}
        loading={isLoading}
        loadingText="Fetching booking details..."
      />

      {/* Pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.result?.result?.totalPages || 1}
      />

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}