import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  MapPin,
  // Phone,
  // Copy,
  Mail,
  ExternalLink,
  ArrowUpDown,
  CopyIcon,
  // MessageCircle,
} from "lucide-react";
import { adminEnquiryUtils, ENQUIRY_STATUSES } from "@/utils/adminEnquiryUtils";
import { AdminEnquiry } from "@/types/api-types/API-types";
import { Link } from "react-router-dom";
import { generateWhatsappUrl } from "@/utils/helper";

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
  // onTogglePhoneVisibility,
  onVehicleClick,
  onStatusChange,
}: EnquiryTableRowProps) {
  const [copied, setCopied] = useState(false);

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

  const WhatsAppIcon = ({ className = "h-4 w-4" }) => (
    <div className="text-green-600">
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </div>
  );

  const getStatusBadge = (status: string) => {
    const statusInfo = adminEnquiryUtils.formatStatus(status);

    switch (status) {
      case ENQUIRY_STATUSES.NEW:
        return (
          <Badge
            className="!border-blue-200 !bg-blue-100 !text-blue-800 hover:!bg-blue-200"
            style={{
              backgroundColor: "#dbeafe",
              color: "#1e40af",
              borderColor: "#bfdbfe",
            }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.CONTACTED:
        return (
          <Badge
            className="!border-purple-200 !bg-purple-100 !text-purple-800 hover:!bg-purple-200"
            style={{
              backgroundColor: "#f3e8ff",
              color: "#6b21a8",
              borderColor: "#e9d5ff",
            }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.EXPIRED:
        return (
          <Badge
            className="!bg-orange-100 !text-orange-800 hover:!bg-orange-200 !border-orange-200"
            style={{
              backgroundColor: "#fed7aa",
              color: "#9a3412",
              borderColor: "#fde68a",
            }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.CANCELLED:
        return (
          <Badge
            className="!border-gray-200 !bg-gray-100 !text-gray-800 hover:!bg-gray-200"
            style={{
              backgroundColor: "#f3f4f6",
              color: "#374151",
              borderColor: "#e5e7eb",
            }}
          >
            {statusInfo.label}
          </Badge>
        );
      case ENQUIRY_STATUSES.AGENTVIEW:
        return (
          <Badge
            className="!border-amber-200 !bg-amber-100 !text-amber-800 hover:!bg-amber-200"
            style={{
              backgroundColor: "#fef3c7",
              color: "#92400e",
              borderColor: "#fde68a",
            }}
          >
            {statusInfo.label}
          </Badge>
        );
      default:
        return <Badge variant="outline">{statusInfo.label}</Badge>;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userInfo.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
  };

  const whatsappUrl = generateWhatsappUrl({
    whatsappPhone: userInfo.phone,
    whatsappCountryCode: userInfo.countryCode,
    model: enquiry.vehicle.name,
    vehicleDetailsPageLink: "",
  });

  console.log("whatsappUrl: ", whatsappUrl);

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
          <span>{userInfo.email || "N/A"}</span>
        </div>
      </TableCell>
      <TableCell>
        {whatsappUrl ? (
          <Link
            to={whatsappUrl}
            className="relative inline-flex items-center gap-2 transition-colors hover:text-green-700 hover:underline"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{userInfo.phone}</span>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent navigating when clicking the copy button
                handleCopy();
              }}
              title="Copy phone number"
            >
              {copied ? (
                <div className="animate-fade-in-out absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg">
                  Copied!
                </div>
              ) : (
                <CopyIcon className="h-3 w-3 text-gray-600" />
              )}
            </button>
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2">
            {/* <MessageCircle className="h-4 w-4" /> */}
            <WhatsAppIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {userInfo.phone || "N/A"}
            </span>
          </div>
        )}
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
