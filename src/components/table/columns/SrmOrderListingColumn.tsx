// import { ColumnDef } from "@tanstack/react-table";
// import { SRMOrderDetailsType } from "@/types/api-types/srm-api.types";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Eye } from "lucide-react";

// export const orderDetailsColumns = (
//   onViewDetails?: (order: SRMOrderDetailsType) => void,
// ): ColumnDef<SRMOrderDetailsType>[] => [
//   {
//     accessorKey: "bookingId",
//     header: "Order ID",
//     cell: ({ row }) => (
//       <div className="font-medium">{row.original.bookingId}</div>
//     ),
//   },
//   {
//     accessorKey: "bookingStatus",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.original.bookingStatus;
//       const statusColors = {
//         ONGOING: "bg-blue-500",
//         COMPLETED: "bg-green-500",
//         INCOMPLETE: "bg-yellow-500",
//         CANCELLED: "bg-red-500",
//       };
//       return (
//         <Badge className={`${statusColors[status]} text-white`}>
//           {status}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "customer.customerName",
//     header: "Customer Name",
//     cell: ({ row }) => (
//       <div>{row.original.customer?.customerName || "N/A"}</div>
//     ),
//   },
//   {
//     accessorKey: "customer.email",
//     header: "Email",
//     cell: ({ row }) => (
//       <div className="text-sm">{row.original.customer?.email || "N/A"}</div>
//     ),
//   },
//   {
//     accessorKey: "customer.phoneNumber",
//     header: "Mobile Number",
//     cell: ({ row }) => {
//       const customer = row.original.customer;
//       return (
//         <div>
//           {customer?.phoneNumber
//             ? `+${customer.countryCode}${customer.phoneNumber}`
//             : "N/A"}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "vehicle.vehicleBrand.brandName",
//     header: "Vehicle",
//     cell: ({ row }) => {
//       const vehicle = row.original.vehicle;
//       return (
//         <div className="space-y-1">
//           <div className="font-medium">
//             {vehicle?.vehicleBrand?.brandName || "N/A"}
//           </div>
//           <div className="text-xs text-gray-500">
//             {vehicle?.vehicleRegistrationNumber || "N/A"}
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "payment.advanceAmount",
//     header: "Amount Paid",
//     cell: ({ row }) => {
//       const payment = row.original.payment;
//       return (
//         <div className="font-medium">
//           {payment?.advanceAmount
//             ? `${payment.currency || "AED"} ${payment.advanceAmount}`
//             : "N/A"}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "payment.remainingAmount",
//     header: "Remaining Amount",
//     cell: ({ row }) => {
//       const payment = row.original.payment;
//       const remaining = parseFloat(payment?.remainingAmount || "0");
//       return (
//         <div className={remaining < 0 ? "text-red-500 font-medium" : ""}>
//           {payment?.remainingAmount
//             ? `${payment.currency || "AED"} ${payment.remainingAmount}`
//             : "N/A"}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "bookingStartDate",
//     header: "Trip Start",
//     cell: ({ row }) => {
//       const startDate = row.original.bookingStartDate;
//       return (
//         <div className="space-y-1">
//           <div className="text-sm">
//             {startDate ? new Date(startDate).toLocaleDateString() : "N/A"}
//           </div>
//           <div className="text-xs text-gray-500">
//             {startDate ? new Date(startDate).toLocaleTimeString() : ""}
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "bookingEndDate",
//     header: "Trip End",
//     cell: ({ row }) => {
//       const endDate = row.original.bookingEndDate;
//       return (
//         <div className="space-y-1">
//           <div className="text-sm">
//             {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
//           </div>
//           <div className="text-xs text-gray-500">
//             {endDate ? new Date(endDate).toLocaleTimeString() : ""}
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "createdDate",
//     header: "Transaction Date",
//     cell: ({ row }) => {
//       const createdDate = row.original.createdDate;
//       return (
//         <div className="space-y-1">
//           <div className="text-sm">
//             {createdDate ? new Date(createdDate).toLocaleDateString() : "N/A"}
//           </div>
//           <div className="text-xs text-gray-500">
//             {createdDate ? new Date(createdDate).toLocaleTimeString() : ""}
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => (
//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={() => onViewDetails?.(row.original)}
//       >
//         <Eye className="h-4 w-4 mr-2" />
//         View
//       </Button>
//     ),
//   },
// ];

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { BookingDetailsType } from "@/types/api-types/srm-api.types";

export const bookingDetailsColumns = (
  onViewDetails?: (booking: BookingDetailsType) => void,
): ColumnDef<BookingDetailsType>[] => [
  {
    accessorKey: "bookingId",
    header: "Booking ID",
    cell: ({ row }) => (
      <div className="font-medium text-xs max-w-[120px] truncate" title={row.original.bookingId}>
        {row.original.bookingId.substring(0, 13)}...
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors = {
        CONFIRMED: "bg-green-500",
        CANCELLED: "bg-red-500",
        PENDING: "bg-yellow-500",
        COMPLETED: "bg-blue-500",
      };
      return (
        <Badge className={`${statusColors[status]} text-white`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => (
      <div>{row.original.customerName || "N/A"}</div>
    ),
  },
  {
    accessorKey: "customerEmail",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm max-w-[180px] truncate" title={row.original.customerEmail}>
        {row.original.customerEmail || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "customerMobile",
    header: "Mobile Number",
    cell: ({ row }) => (
      <div>{row.original.customerMobile || "N/A"}</div>
    ),
  },
  {
    accessorKey: "vehicleDetails.brand.label",
    header: "Vehicle",
    cell: ({ row }) => {
      const vehicle = row.original.vehicleDetails;
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {vehicle?.brand?.label || "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            {vehicle?.vehicleCode || "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "vehicleDetails.state.label",
    header: "Location",
    cell: ({ row }) => (
      <div>{row.original.vehicleDetails?.state?.label || "N/A"}</div>
    ),
  },
  {
    accessorKey: "payment.amount",
    header: "Paid Amount",
    cell: ({ row }) => {
      const payment = row.original.payment;
      return (
        <div className="font-medium">
          {payment?.currency?.toUpperCase() || "INR"} {payment?.amount || "0"}
        </div>
      );
    },
  },
  {
    accessorKey: "payment.totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const payment = row.original.payment;
      return (
        <div className="font-medium text-green-600">
          {payment?.currency?.toUpperCase() || "INR"} {payment?.totalAmount || "0"}
        </div>
      );
    },
  },
  {
    accessorKey: "payment.payOnPickup",
    header: "Pay on Pickup",
    cell: ({ row }) => {
      const payment = row.original.payment;
      const payOnPickup = payment?.payOnPickup || 0;
      return (
        <div className={payOnPickup > 0 ? "text-orange-500 font-medium" : ""}>
          {payment?.currency?.toUpperCase() || "INR"} {payOnPickup}
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Trip Start",
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      return (
        <div className="space-y-1">
          <div className="text-sm">
            {startDate ? new Date(startDate).toLocaleDateString() : "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            {startDate ? new Date(startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "Trip End",
    cell: ({ row }) => {
      const endDate = row.original.endDate;
      return (
        <div className="space-y-1">
          <div className="text-sm">
            {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            {endDate ? new Date(endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "rentalType",
    header: "Rental Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.rentalType}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Booking Date",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <div className="space-y-1">
          <div className="text-sm">
            {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            {createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewDetails?.(row.original)}
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
    ),
  },
];