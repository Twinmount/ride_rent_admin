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
  isPhoneRevealed,
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

  const maskPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const lastFour = cleaned.slice(-4);
    return `***-***-${lastFour}`;
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = adminEnquiryUtils.formatStatus(status);

    switch (status) {
      case ENQUIRY_STATUSES.NEW:
        return (
          <Badge className="bg-primary text-primary-foreground">Pending</Badge>
        );
      case ENQUIRY_STATUSES.ACCEPTED:
        return <Badge variant="secondary">Accepted</Badge>;
      case ENQUIRY_STATUSES.CANCELLED:
        return <Badge variant="destructive">Cancelled</Badge>;
      case ENQUIRY_STATUSES.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
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
          <span className="font-medium">{enquiry.agent.name}</span>
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
          <span>{userInfo.email}</span>
        </div>
      </TableCell>
      <TableCell>
        <div
          className="flex cursor-pointer items-center gap-1 text-sm transition-colors hover:text-primary"
          onClick={() => onTogglePhoneVisibility(enquiry._id)}
          title="Click to reveal phone number"
        >
          <Phone className="h-3 w-3" />
          <span className="select-none">{userInfo.phone}</span>
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
          <span
            className="cursor-pointer text-sm font-medium text-primary hover:underline"
            onClick={() => onVehicleClick?.(enquiry)}
          >
            {enquiry.vehicle.name}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => onVehicleClick?.(enquiry)}
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
