"use client";

import { useState } from "react";
import { UserList, UserFilters } from "./UserList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, X } from "lucide-react";
import { exportUsersToExcel } from "@/utils/excelExport";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "@/components/ui/use-toast";

export default function UsersPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    emailVerified: "all",
    phoneVerified: "all",
    accountType: "all",
  });

  // Fetch users for export
  const { users, isLoading } = useUserData({
    page: 1,
    limit: 1000, // Fetch more users for export
    enabled: true,
    staleTime: 0, // Don't cache for export
  });

  const handleExportToExcel = async () => {
    // Check if there's data to export
    if (!users || users.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data to Export",
        description: "No users to export. Please wait for data to load.",
      });
      return;
    }

    setIsExporting(true);
    try {
      const result = exportUsersToExcel(users, {
        filename: "users-export",
        includeTimestamp: true,
      });

      if (result.success) {
        toast({
          title: "Export Completed Successfully",
          description: `Successfully exported ${result.recordCount} users to ${result.filename}`,
          variant: "default",
        });
      } else {
        throw new Error(result.error || "Export failed");
      }
    } catch (error) {
      console.error("❌ Export error:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description:
          "An unexpected error occurred during export. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      emailVerified: "all",
      phoneVerified: "all",
      accountType: "all",
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.search !== "" ||
      filters.emailVerified !== "all" ||
      filters.phoneVerified !== "all" ||
      filters.accountType !== "all"
    );
  };

  return (
    <main className="flex-1 p-6">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all registered users.
            </p>
          </div>
          <Button
            onClick={handleExportToExcel}
            disabled={isExporting || isLoading || !users || users.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export to Excel"}
          </Button>
        </div>

        {/* Filters Section */}
        <div className="rounded-lg border bg-card p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Search
              </label>
              <Input
                placeholder="Search by name, email, phone..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            {/* Email Verification Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email Verification
              </label>
              <Select
                value={filters.emailVerified}
                onValueChange={(value) =>
                  setFilters({ ...filters, emailVerified: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Not Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone Verification Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone Verification
              </label>
              <Select
                value={filters.phoneVerified}
                onValueChange={(value) =>
                  setFilters({ ...filters, phoneVerified: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Not Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Account Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Account Type
              </label>
              <Select
                value={filters.accountType}
                onValueChange={(value) =>
                  setFilters({ ...filters, accountType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="oauth">OAuth User</SelectItem>
                  <SelectItem value="regular">Regular User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters()}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* User Table */}
        <UserList filters={filters} />
      </div>
    </main>
  );
}
