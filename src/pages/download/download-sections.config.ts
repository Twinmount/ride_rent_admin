import VehicleDownloadPanel from "@/components/download/VehicleDownloadPanel";
import CompanyDownloadPanel from "@/components/download/CompanyDownloadPanel";
import SRMDownloadPanel from "@/components/download/SRMDownloadPanel";

type DownloadTriggerConfig = {
  triggerLabel: string;
  dialogTitle: string;
  Component: React.FC<any>;
  props?: Record<string, any>; // optional props for flexibility
};

type DownloadSectionConfig = {
  title: string;
  triggers: DownloadTriggerConfig[];
};

export const downloadSections: DownloadSectionConfig[] = [
  {
    title: "Vehicle Listing Data",
    triggers: [
      {
        triggerLabel: "Vehicle Data",
        dialogTitle: "Download Vehicle Data",
        Component: VehicleDownloadPanel,
      },
    ],
  },
  {
    title: "Company Data",
    triggers: [
      {
        triggerLabel: "Company Data",
        dialogTitle: "Download Company Data",
        Component: CompanyDownloadPanel,
      },
    ],
  },
  {
    title: "SRM data",
    triggers: [
      {
        triggerLabel: "SRM Data",
        dialogTitle: "Download SRM Data",
        Component: SRMDownloadPanel,
      },
    ],
  },
];
