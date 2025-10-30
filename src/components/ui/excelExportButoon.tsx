// components/ExportExcelButton.tsx

import { useState } from "react";
import { exportSupplierSheet } from "@/api/supplier-central"; // Adjust path as needed
import { Download } from "lucide-react";

interface ExportExcelButtonProps {
  category: string;
  title: string;
  countryId: string;
  disabled?: boolean;
  onExport?: () => void;
}

export const ExportExcelButton = ({ 
  category, 
  title, 
  countryId, 
  disabled = false, 
  onExport 
}: ExportExcelButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (disabled) return;
    
    setIsExporting(true);
    try {
      const blob = await exportSupplierSheet(category, countryId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      if (onExport) onExport();
    } catch (error) {
      console.error('Export failed:', error);
      // Optionally, show a toast or alert for error
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={disabled || isExporting}
      className="flex items-center gap-1 px-3 py-2 bg-white shadow-lg text-black rounded-md hover:bg-[#ffa733] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Export Data"
    >
      <Download className="h-4 w-4" />
      Export Data
    </button>
  );
};