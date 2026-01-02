import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableRow } from "@/components/user";
import { useUserData } from "@/hooks/useUserData";
import { ArrowUpDown } from "lucide-react";

interface UserListProps {
  className?: string;
}

export const UserList: React.FC<UserListProps> = ({ className = "" }) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Use React Query hook to fetch users
  const { users, isLoading, isError, error, refetch } = useUserData({
    page: 1,
    limit: 100, // Fetch all users for now, can be paginated later
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return (
        <ArrowUpDown
          className={`h-3 w-3 ${sortDirection === "desc" ? "rotate-180" : ""}`}
        />
      );
    }
    return <ArrowUpDown className="h-3 w-3 opacity-50" />;
  };

  // Client-side sorting
  const sortedUsers = useMemo(() => {
    if (!sortField) return users;

    return [...users].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, sortField, sortDirection]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <h3 className="font-medium text-red-800">Error loading users</h3>
        <p className="mt-1 text-sm text-red-600">
          {error?.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-primary">
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => handleSort("name")}
              >
                Name
                {getSortIcon("name")}
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => handleSort("email")}
              >
                Email
                {getSortIcon("email")}
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              Phone Number
            </TableHead>
            <TableHead className="font-semibold text-primary">
              Email Verification
              <div className="text-xs font-normal text-muted-foreground">
                Email verification status
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              Phone Verification
              <div className="text-xs font-normal text-muted-foreground">
                Phone verification status
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              Account Type
              <div className="text-xs font-normal text-muted-foreground">
                OAuth or regular user account
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              OAuth Providers
              <div className="text-xs font-normal text-muted-foreground">
                Connected OAuth providers
              </div>
            </TableHead>
            <TableHead className="font-semibold text-primary">
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => handleSort("createdAt")}
              >
                Created Date
                {getSortIcon("createdAt")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <UserTableRow key={user.userId} user={user} />
            ))
          ) : (
            <TableRow>
              <td
                colSpan={8}
                className="py-8 text-center text-muted-foreground"
              >
                No users found
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
