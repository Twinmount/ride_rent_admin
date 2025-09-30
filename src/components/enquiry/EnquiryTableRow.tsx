import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { MapPin, Phone, Mail, ExternalLink, ArrowUpDown } from "lucide-react";
import { adminEnquiryUtils, ENQUIRY_STATUSES } from "@/utils/adminEnquiryUtils";
import { AdminEnquiry } from "@/types/api-types/API-types";

interface EnquiryTableRowProps {
  enquiry: AdminEnquiry;
  isPhoneRevealed: boolean;
  onTogglePhoneVisibility: (enquiryId: string) => void;
  onVehicleClick?: (enquiry: AdminEnquiry) => void;
  onStatusChange?: (enquiry: AdminEnquiry) => void;
}

export function EnquiryTableRow({
  enquiry,
  // isPhoneRevealed,
  onTogglePhoneVisibility,
  onVehicleClick,
  onStatusChange,
}: EnquiryTableRowProps) {
  const userInfo = adminEnquiryUtils.formatUserInfo(enquiry);


  // Generate avatar initials from user name
  const getAvatarInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // const maskPhoneNumber = (phone: string) => {
  //   const cleaned = phone.replace(/\D/g, "");
  //   const lastFour = cleaned.slice(-4);
  //   return `***-***-${lastFour}`;
  // };

  const getStatusBadge = (status: string) => {
    console.log("status: [getStatusBadge]", status);
    const statusInfo = adminEnquiryUtils.formatStatus(status);

    switch (status) {
      case ENQUIRY_STATUSES.NEW:
        return (
          <Badge 
            className="!bg-blue-100 !text-blue-800 hover:!bg-blue-200 !border-blue-200"
            style={{ backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.ACCEPTED:
        return (
          <Badge 
            className="!bg-green-100 !text-green-800 hover:!bg-green-200 !border-green-200"
            style={{ backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.CONTACTED:
        return (
          <Badge 
            className="!bg-purple-100 !text-purple-800 hover:!bg-purple-200 !border-purple-200"
            style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.EXPIRED:
        return (
          <Badge 
            className="!bg-orange-100 !text-orange-800 hover:!bg-orange-200 !border-orange-200"
            style={{ backgroundColor: '#fed7aa', color: '#9a3412', borderColor: '#fde68a' }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.CANCELLED:
        return (
          <Badge 
            className="!bg-gray-100 !text-gray-800 hover:!bg-gray-200 !border-gray-200"
            style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#e5e7eb' }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.REJECTED:
        return (
          <Badge 
            className="!bg-red-100 !text-red-800 hover:!bg-red-200 !border-red-200"
            style={{ backgroundColor: '#fecaca', color: '#991b1b', borderColor: '#fca5a5' }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.DECLINED:
        return (
          <Badge 
            className="!bg-rose-100 !text-rose-800 hover:!bg-rose-200 !border-rose-200"
            style={{ backgroundColor: '#ffe4e6', color: '#9f1239', borderColor: '#fecdd3' }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.AGENTVIEW:
        return (
          <Badge 
            className="!bg-amber-100 !text-amber-800 hover:!bg-amber-200 !border-amber-200"
            style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}
          >
            {statusInfo.label}
          </Badge>
        );
      default:
        return <Badge variant="outline">{statusInfo.label}</Badge>;
    }
  };

  return (
    <TableRow
      className={`${
        enquiry.status === ENQUIRY_STATUSES.CANCELLED ? "opacity-60" : ""
      } transition-all duration-300 hover:bg-muted/50`}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium">{enquiry.agent.companyName}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 bg-foreground text-background">
            <AvatarFallback className="bg-foreground text-xs font-medium text-background">
              {getAvatarInitials(userInfo.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{userInfo.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span>{userInfo.email || 'N/A'}</span>
        </div>
      </TableCell>
      <TableCell>
        <div
          className="flex cursor-pointer items-center gap-1 text-sm transition-colors hover:text-primary"
          onClick={() => onTogglePhoneVisibility(enquiry._id)}
          title="Click to reveal phone number"
        >
          <Phone className="h-3 w-3" />
          <span className="select-none">
            {userInfo.phone}
            {/* {isPhoneRevealed ? userInfo.phone : maskPhoneNumber(userInfo.phone)} */}
          </span>
          {/* {!isPhoneRevealed && (
            <span className="ml-1 text-xs text-primary">(click to view)</span>
          )} */}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{enquiry.vehicle.location}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {adminEnquiryUtils.formatDate(enquiry.createdAt)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span
              className="cursor-pointer text-sm font-medium text-primary hover:underline"
              onClick={() => {
                if (enquiry.vehicle.carLink) {
                  adminEnquiryUtils.openCarLink(enquiry);
                } else {
                  onVehicleClick?.(enquiry);
                }
              }}
            >
              {enquiry.vehicle.name}
            </span>
            {enquiry.vehicle.vehicleCode && (
              <span className="text-xs text-muted-foreground">
                Code: {enquiry.vehicle.vehicleCode}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => {
              if (enquiry.vehicle.carLink) {
                adminEnquiryUtils.openCarLink(enquiry);
              } else {
                onVehicleClick?.(enquiry);
              }
            }}
            title="View Car Details"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {getStatusBadge(enquiry.status)}
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => onStatusChange?.(enquiry)}
          >
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
