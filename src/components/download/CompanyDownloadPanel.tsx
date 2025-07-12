import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { downloadCompanyData } from "@/api/excel-data";
import { CloudDownload } from "lucide-react";

const CompanyDownloadPanel = () => {
  const handleDownload = async () => {
    try {
      await downloadCompanyData();
      toast({
        title: "Company data downloaded successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error downloading company data",
      });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Click below to download company data:
      </p>
      <Button
        onClick={handleDownload}
        className="flex-center mt-4 w-full gap-x-2 rounded-md bg-yellow py-2 text-white shadow-md hover:bg-yellow"
      >
        Download Company Data <CloudDownload />
      </Button>
    </div>
  );
};

export default CompanyDownloadPanel;
