// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { SRMOrderDetailsType } from "@/types/api-types/srm-api.types";
// import {
//   User,
//   Car,
//   CreditCard,
//   Calendar,
//   Phone,
//   Mail,
//   FileText,
//   MapPin,
// } from "lucide-react";
// import { Separator } from "@radix-ui/react-dropdown-menu";

// interface OrderDetailsModalProps {
//   order: SRMOrderDetailsType;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function OrderDetailsModal({
//   order,
//   isOpen,
//   onClose,
// }: OrderDetailsModalProps) {
//   const statusColors = {
//     ONGOING: "bg-blue-500",
//     COMPLETED: "bg-green-500",
//     INCOMPLETE: "bg-yellow-500",
//     CANCELLED: "bg-red-500",
//   };

//   const calculateTotalAmount = () => {
//     const advanceAmount = parseFloat(order.payment?.advanceAmount || "0");
//     const remainingAmount = parseFloat(order.payment?.remainingAmount || "0");
//     return (advanceAmount + remainingAmount).toFixed(2);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center justify-between">
//             <span className="text-2xl">Order Details</span>
//             <Badge className={`${statusColors[order.bookingStatus]} text-white`}>
//               {order.bookingStatus}
//             </Badge>
//           </DialogTitle>
//           <DialogDescription>
//             Complete information about order {order.bookingId}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Order Information */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
//               <FileText className="h-5 w-5" />
//               Order Information
//             </h3>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="text-muted-foreground">Order ID</p>
//                 <p className="font-medium">{order.bookingId}</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Levels Filled</p>
//                 <p className="font-medium">{order.levelsFilled} / 3</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Transaction Date</p>
//                 <p className="font-medium">
//                   {order.createdDate
//                     ? new Date(order.createdDate).toLocaleString()
//                     : "N/A"}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Last Updated</p>
//                 <p className="font-medium">
//                   {order.updatedDate
//                     ? new Date(order.updatedDate).toLocaleString()
//                     : "N/A"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <Separator />

//           {/* Customer Information */}
//           {order.customer && (
//             <>
//               <div>
//                 <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   Customer Information
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="text-muted-foreground">Customer ID</p>
//                     <p className="font-medium">
//                       {order.customer.customerId || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Name</p>
//                     <p className="font-medium">
//                       {order.customer.customerName || "N/A"}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Mail className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-muted-foreground">Email</p>
//                       <p className="font-medium">{order.customer.email || "N/A"}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Phone className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-muted-foreground">Mobile</p>
//                       <p className="font-medium">
//                         {order.customer.phoneNumber
//                           ? `+${order.customer.countryCode}${order.customer.phoneNumber}`
//                           : "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-muted-foreground">Nationality</p>
//                       <p className="font-medium">
//                         {order.customer.nationality || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Passport Number</p>
//                     <p className="font-medium">
//                       {order.customer.passportNumber || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">License Number</p>
//                     <p className="font-medium">
//                       {order.customer.drivingLicenseNumber || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <Separator />
//             </>
//           )}

//           {/* Vehicle Information */}
//           {order.vehicle && (
//             <>
//               <div>
//                 <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
//                   <Car className="h-5 w-5" />
//                   Vehicle Information
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="text-muted-foreground">Vehicle ID</p>
//                     <p className="font-medium">
//                       {order.vehicle.vehicleId || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Brand</p>
//                     <p className="font-medium">
//                       {order.vehicle.vehicleBrand?.brandName || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Registration Number</p>
//                     <p className="font-medium">
//                       {order.vehicle.vehicleRegistrationNumber || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Color</p>
//                     <p className="font-medium capitalize">
//                       {order.vehicle.vehicleColor || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Body Type</p>
//                     <p className="font-medium capitalize">
//                       {order.vehicle.bodyType?.replace("-", " ") || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Passengers</p>
//                     <p className="font-medium">
//                       {order.vehicle.numberOfPassengers || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Current Kilometre</p>
//                     <p className="font-medium">
//                       {order.vehicle.currentKilometre
//                         ? `${order.vehicle.currentKilometre} km`
//                         : "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground">Chassis Number</p>
//                     <p className="font-medium">
//                       {order.vehicle.chassisNumber || "N/A"}
//                     </p>
//                   </div>
//                 </div>

//                 {order.vehicle.vehiclePhoto && (
//                   <div className="mt-4">
//                     <p className="text-muted-foreground mb-2">Vehicle Photo</p>
//                     <img
//                       src={order.vehicle.vehiclePhoto}
//                       alt="Vehicle"
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                   </div>
//                 )}
//               </div>
//               <Separator />
//             </>
//           )}

//           {/* Trip Schedule */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               Trip Schedule
//             </h3>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="text-muted-foreground">Start Date</p>
//                 <p className="font-medium">
//                   {order.bookingStartDate
//                     ? new Date(order.bookingStartDate).toLocaleDateString()
//                     : "N/A"}
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   {order.bookingStartDate
//                     ? new Date(order.bookingStartDate).toLocaleTimeString()
//                     : ""}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">End Date</p>
//                 <p className="font-medium">
//                   {order.bookingEndDate
//                     ? new Date(order.bookingEndDate).toLocaleDateString()
//                     : "N/A"}
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   {order.bookingEndDate
//                     ? new Date(order.bookingEndDate).toLocaleTimeString()
//                     : ""}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <Separator />

//           {/* Payment Information */}
//           {order.payment && (
//             <div>
//               <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
//                 <CreditCard className="h-5 w-5" />
//                 Payment Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="text-muted-foreground">Advance Amount</p>
//                   <p className="font-medium text-lg">
//                     {order.payment.currency || "AED"}{" "}
//                     {order.payment.advanceAmount || "0"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">Remaining Amount</p>
//                   <p
//                     className={`font-medium text-lg ${
//                       parseFloat(order.payment.remainingAmount || "0") < 0
//                         ? "text-red-500"
//                         : ""
//                     }`}
//                   >
//                     {order.payment.currency || "AED"}{" "}
//                     {order.payment.remainingAmount || "0"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">Security Deposit</p>
//                   <p className="font-medium text-lg">
//                     {order.payment.currency || "AED"}{" "}
//                     {order.payment.securityDeposits?.enabled
//                       ? order.payment.securityDeposits.amountInAED
//                       : "0"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">Total Amount</p>
//                   <p className="font-medium text-lg text-green-600">
//                     {order.payment.currency || "AED"} {calculateTotalAmount()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BookingDetailsType } from "@/types/api-types/srm-api.types";
import {
  User,
  Car,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  FileText,
  MapPin,
  Building2,
  Clock,
} from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";


interface BookingDetailsModalProps {
  booking: BookingDetailsType;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingDetailsModal({
  booking,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const statusColors = {
    CONFIRMED: "bg-green-500",
    CANCELLED: "bg-red-500",
    PENDING: "bg-yellow-500",
    COMPLETED: "bg-blue-500",
  };

  const paymentStatusColors = {
    SUCCESS: "bg-green-500",
    FAILED: "bg-red-500",
    PENDING: "bg-yellow-500",
  };

  const calculateTripDuration = () => {
    if (booking.startDate && booking.endDate) {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
    return "N/A";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl">Booking Details</span>
            <Badge className={`${statusColors[booking.status]} text-white`}>
              {booking.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete information about booking {booking.bookingId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Booking Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Booking ID</p>
                <p className="font-medium text-xs break-all">{booking.bookingId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rental Type</p>
                <p className="font-medium capitalize">{booking.rentalType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trip Duration</p>
                <p className="font-medium">{calculateTripDuration()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Booking Date</p>
                <p className="font-medium">
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {booking.updatedAt
                    ? new Date(booking.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Vehicle URL</p>
                <a 
                  href={booking.vehicleUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-500 hover:underline text-xs break-all"
                >
                  View Vehicle
                </a>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer ID</p>
                <p className="font-medium text-xs break-all">{booking.userId || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{booking.customerName || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium break-all">{booking.customerEmail || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Mobile</p>
                  <p className="font-medium">{booking.customerMobile || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vehicle Information */}
          {booking.vehicleDetails && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vehicle Code</p>
                    <p className="font-medium">{booking.vehicleDetails.vehicleCode || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Brand</p>
                    <p className="font-medium">{booking.vehicleDetails.brand?.label || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{booking.vehicleDetails.state?.label || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium text-xs">{booking.vehicleDetails.location?.address || "N/A"}</p>
                  </div>
                </div>

                {booking.vehicleDetails.description && (
                  <div className="mt-4">
                    <p className="text-muted-foreground mb-2">Description</p>
                    <div 
                      className="text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: booking.vehicleDetails.description }}
                    />
                  </div>
                )}

                {/* Rental Details */}
                <div className="mt-4">
                  <p className="text-muted-foreground mb-2 font-semibold">Rental Rates</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {booking.vehicleDetails.rentalDetails.day.enabled && (
                      <div className="border rounded p-3">
                        <p className="text-muted-foreground">Daily Rate</p>
                        <p className="font-medium">INR {booking.vehicleDetails.rentalDetails.day.rentInAED}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.vehicleDetails.rentalDetails.day.unlimitedMileage 
                            ? "Unlimited Mileage" 
                            : `${booking.vehicleDetails.rentalDetails.day.mileageLimit} km/day`}
                        </p>
                      </div>
                    )}
                    {booking.vehicleDetails.rentalDetails.week.enabled && (
                      <div className="border rounded p-3">
                        <p className="text-muted-foreground">Weekly Rate</p>
                        <p className="font-medium">INR {booking.vehicleDetails.rentalDetails.week.rentInAED}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.vehicleDetails.rentalDetails.week.unlimitedMileage 
                            ? "Unlimited Mileage" 
                            : `${booking.vehicleDetails.rentalDetails.week.mileageLimit} km/week`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Company Information */}
          {booking.vehicleDetails?.company && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Rental Company
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Company Name</p>
                    <p className="font-medium">{booking.vehicleDetails.company.companyName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Company ID</p>
                    <p className="font-medium">{booking.vehicleDetails.company.companyId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{booking.vehicleDetails.company.contactDetails.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{booking.vehicleDetails.company.contactDetails.phone}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1">Payment Methods</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.vehicleDetails.company.companySpecs.isCashSupported && (
                        <Badge variant="outline">Cash</Badge>
                      )}
                      {booking.vehicleDetails.company.companySpecs.isUPISupported && (
                        <Badge variant="outline">UPI</Badge>
                      )}
                      {booking.vehicleDetails.company.companySpecs.isCreditOrDebitCardsSupported && (
                        <Badge variant="outline">Cards</Badge>
                      )}
                      {booking.vehicleDetails.company.companySpecs.isCryptoAccepted && (
                        <Badge variant="outline">Crypto</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Trip Schedule */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Trip Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Start Date & Time</p>
                <p className="font-medium">
                  {booking.startDate
                    ? new Date(booking.startDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.startDate
                    ? new Date(booking.startDate).toLocaleTimeString()
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date & Time</p>
                <p className="font-medium">
                  {booking.endDate
                    ? new Date(booking.endDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.endDate
                    ? new Date(booking.endDate).toLocaleTimeString()
                    : ""}
                </p>
              </div>
              {booking.pickupLocation && (
                <div>
                  <p className="text-muted-foreground">Pickup Location</p>
                  <p className="font-medium">{booking.pickupLocation}</p>
                </div>
              )}
              {booking.dropLocation && (
                <div>
                  <p className="text-muted-foreground">Drop Location</p>
                  <p className="font-medium">{booking.dropLocation}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          {booking.payment && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Payment Status</p>
                  <Badge className={`${paymentStatusColors[booking.payment.status]} text-white mt-1`}>
                    {booking.payment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Provider</p>
                  <p className="font-medium">{booking.payment.provider}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Intent ID</p>
                  <p className="font-medium text-xs break-all">{booking.payment.paymentIntentId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Currency</p>
                  <p className="font-medium uppercase">{booking.payment.currency}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm mb-1">Reservation Fees</p>
                  <p className="font-bold text-lg">
                    {booking.payment.currency.toUpperCase()} {booking.payment.reservationFees}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm mb-1">Pay on Pickup</p>
                  <p className="font-bold text-lg text-orange-500">
                    {booking.payment.currency.toUpperCase()} {booking.payment.payOnPickup}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm mb-1">Amount Paid</p>
                  <p className="font-bold text-lg text-blue-600">
                    {booking.payment.currency.toUpperCase()} {booking.payment.amount}
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-green-50">
                  <p className="text-muted-foreground text-sm mb-1">Total Amount</p>
                  <p className="font-bold text-xl text-green-600">
                    {booking.payment.currency.toUpperCase()} {booking.payment.totalAmount}
                  </p>
                </div>
              </div>

              {booking.coupon?.code && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-semibold">Coupon Applied</p>
                  <p className="text-sm">
                    Code: <span className="font-mono font-medium">{booking.coupon.code}</span>
                  </p>
                  <p className="text-sm text-green-600">
                    Discount: {booking.payment.currency.toUpperCase()} {booking.payment.discountAmount}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}