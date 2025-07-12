import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import StatesDropdown from "@/components/form/dropdowns/StatesDropdown";
import { downloadVehicleData } from "@/api/excel-data";
import { CloudDownload } from "lucide-react";

const VehicleDownloadPanel = () => {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedStateName, setSelectedStateName] = useState<string | null>(
    null,
  );

  const handleDownload = async () => {
    if (selectedStateId && selectedStateName) {
      try {
        await downloadVehicleData(selectedStateId, selectedStateName);
        toast({
          title: "Vehicle data downloaded successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error downloading vehicle data",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Please select a state first",
      });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Select a state to download vehicle data:
      </p>
      <StatesDropdown
        onChangeHandler={(value) => {
          setSelectedStateId(value?.stateId || null);
          setSelectedStateName(value?.stateName || null);
        }}
        value=""
      />
      <Button
        onClick={handleDownload}
        className="flex-center mt-4 w-full gap-x-2 rounded-md bg-yellow py-2 text-white shadow-md hover:bg-yellow"
      >
        Download Vehicle Data <CloudDownload />
      </Button>
    </div>
  );
};

export default VehicleDownloadPanel;
