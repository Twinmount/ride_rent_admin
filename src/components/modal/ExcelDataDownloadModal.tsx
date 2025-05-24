import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { downloadCompanyData, downloadVehicleData } from "@/api/excel-data";
import { toast } from "../ui/use-toast";
import { CloudDownload } from "lucide-react";
import StatesDropdown from "../form/dropdowns/StatesDropdown";

const ExcelDataDownloadModal = () => {
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedStateName, setSelectedStateName] = useState<string | null>(
    null,
  );
  // const [isEabled, setIsEnabled] = useState<boolean>(false);

  const handleDownloadVehicleData = async () => {
    if (selectedStateId && selectedStateName) {
      try {
        await downloadVehicleData(selectedStateId, selectedStateName);
      } catch (error) {
        alert("Error downloading vehicle data");
      }
    } else {
      toast({
        variant: "destructive",
        title: "Choose a state to download",
      });
    }
  };

  const handleDownloadCompanyData = async () => {
    try {
      await downloadCompanyData();
    } catch (error) {
      alert("Error downloading company data");
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        tabIndex={-1}
        // onClick={() => setIsEnabled(true)}
        className={`flex h-11 min-h-11 w-full max-w-full cursor-pointer items-center justify-start gap-2 truncate text-ellipsis whitespace-nowrap rounded-lg pl-2 pr-1 text-left text-black no-underline hover:bg-slate-800 hover:text-white`}
      >
        <CloudDownload />
        Download
      </DialogTrigger>
      <DialogContent className="mx-auto h-fit max-w-lg transform rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 ease-out max-sm:max-w-[95%]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Excel Data Download
          </DialogTitle>
        </DialogHeader>

        {/* Tabs for Vehicle Data and Company Data */}
        <Tabs defaultValue="vehicle-data" className="mt-1 w-full">
          <TabsList className="mb-6 h-12 w-full overflow-hidden rounded-xl border border-gray-200 bg-transparent p-0">
            <TabsTrigger
              value="vehicle-data"
              className="h-full w-full rounded-none rounded-r-lg font-semibold text-gray-700 focus:bg-blue-100 focus:text-blue-700"
            >
              Vehicle
            </TabsTrigger>
            <TabsTrigger
              value="company-data"
              className="h-full w-full rounded-none rounded-l-lg font-semibold text-gray-700 focus:bg-blue-100 focus:text-blue-700"
            >
              Company
            </TabsTrigger>
          </TabsList>

          {/* Vehicle Data Tab Content */}
          <TabsContent value="vehicle-data">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select a state to download vehicle data:
              </p>
              {/* States Dropdown */}
              <StatesDropdown
                onChangeHandler={(value) => {
                  setSelectedStateId(value?.stateId || null);
                  setSelectedStateName(value?.stateName || null);
                }}
                value={""}
              />

              {/* Download Button for Vehicle Data */}
              <Button
                onClick={handleDownloadVehicleData}
                className="flex-center mt-4 w-full gap-x-2 rounded-md bg-yellow py-2 text-white shadow-md hover:bg-yellow"
              >
                Download Vehicle Data <CloudDownload />
              </Button>
            </div>
          </TabsContent>

          {/* Company Data Tab Content */}
          <TabsContent value="company-data">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Click below to download company data:
              </p>
              {/* Download Button for Company Data */}
              <Button
                onClick={handleDownloadCompanyData}
                className="flex-center mt-4 w-full gap-x-2 rounded-md bg-yellow py-2 text-white shadow-md hover:bg-yellow"
              >
                Download Company Data <CloudDownload />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelDataDownloadModal;
