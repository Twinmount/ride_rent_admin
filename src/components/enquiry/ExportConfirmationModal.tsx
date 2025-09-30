import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileSpreadsheet, BarChart3 } from "lucide-react";

interface ExportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: ExportOptions) => void;
  enquiryCount: number;
}

export interface ExportOptions {
  exportEnquiries: boolean;
  exportStatistics: boolean;
}

export default function ExportConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  enquiryCount,
}: ExportConfirmationModalProps) {
  const [exportEnquiries, setExportEnquiries] = useState(true);
  const [exportStatistics, setExportStatistics] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleConfirm = async () => {
    setIsExporting(true);
    try {
      await onConfirm({
        exportEnquiries,
        exportStatistics,
      });
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export to Excel
          </DialogTitle>
          <DialogDescription>
            Configure your export options for {enquiryCount} enquiries.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Export Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="export-enquiries"
                checked={exportEnquiries}
                onCheckedChange={(checked) => setExportEnquiries(!!checked)}
                disabled={isExporting}
              />
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <label
                  htmlFor="export-enquiries"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Export Enquiries Data
                </label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Include all enquiry details, customer information, and vehicle data
            </p>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="export-statistics"
                checked={exportStatistics}
                onCheckedChange={(checked) => setExportStatistics(!!checked)}
                disabled={isExporting}
              />
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <label
                  htmlFor="export-statistics"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Export Summary Statistics
                </label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Include status counts and summary information
            </p>
          </div>

          {/* Export Summary */}
          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="text-sm font-medium mb-2">Export Summary:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• {enquiryCount} enquiries will be exported</li>
              <li>• Files will include timestamp</li>
              <li>• Format: Excel (.xlsx)</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isExporting || (!exportEnquiries && !exportStatistics)}
              className="min-w-[100px]"
            >
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Exporting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
