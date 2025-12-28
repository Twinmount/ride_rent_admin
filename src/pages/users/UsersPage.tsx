"use client";

import { useState } from "react";
import { UserList } from "./UserList";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportUsersToExcel } from "@/utils/excelExport";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "@/components/ui/use-toast";

export default function UsersPage() {
  const [isExporting, setIsExporting] = useState(false);
  
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

        {/* User Table */}
        <UserList />
      </div>
    </main>
  );
}
