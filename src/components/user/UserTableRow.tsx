import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Mail, Phone, CheckCircle2, XCircle, Shield } from "lucide-react";
import { User } from "@/types/api-types/API-types";

interface UserTableRowProps {
  user: User;
}

export function UserTableRow({ user }: UserTableRowProps) {
  // Generate avatar initials from user name
  const getAvatarInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format phone number with country code
  const formatPhoneNumber = (
    phone: string | null,
    countryCode: string | null,
  ) => {
    if (!phone) return "N/A";
    return countryCode ? `${countryCode} ${phone}` : phone;
  };

  // Get OAuth provider badges
  const getOAuthProviders = () => {
    if (!user.oauthProviders || user.oauthProviders.length === 0) {
      return null;
    }
    return user.oauthProviders.map((provider) => (
      <Badge
        key={provider.providerAccountId}
        variant="outline"
        className="mr-1 capitalize"
      >
        {provider.provider}
      </Badge>
    ));
  };

  return (
    <TableRow className="transition-all duration-300 hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center gap-2">
          {user.avatar ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
            </Avatar>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              {getAvatarInitials(user.name)}
            </span>
          )}
          <span className="font-medium">{user.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span>{user.email}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span>{formatPhoneNumber(user.phoneNumber, user.countryCode)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {user.isEmailVerified ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm">
            {user.isEmailVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {user.isPhoneVerified ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm">
            {user.isPhoneVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {user.isOAuthUser ? (
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-blue-600" />
              <span className="text-xs">OAuth User</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Regular User</span>
          )}
          {user.isPasswordSet && (
            <span className="text-xs text-muted-foreground">Password Set</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {getOAuthProviders() || (
            <span className="text-xs text-muted-foreground">N/A</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{formatDate(user.createdAt)}</div>
      </TableCell>
    </TableRow>
  );
}
