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
    <div className="relative inline-block group">
      <button 
        onClick={handleExport} 
        disabled={disabled || isExporting}
        className="px-3 py-1 text-black rounded disabled:opacity-50 disabled:cursor-not-allowed font-bold"
        aria-label="Download the data"
      >
        <Download className="h-4 w-4" />
      </button>
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
        Download the data
      </span>
    </div>
  );
};