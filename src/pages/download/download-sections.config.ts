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
    title: "Vehicles",
    triggers: [
      {
        triggerLabel: "Download Vehicle Data",
        dialogTitle: "Download Vehicle Data",
        Component: VehicleDownloadPanel,
      },
    ],
  },
  {
    title: "Companies",
    triggers: [
      {
        triggerLabel: "Download Company Data",
        dialogTitle: "Download Company Data",
        Component: CompanyDownloadPanel,
      },
    ],
  },
  {
    title: "SRM",
    triggers: [
      {
        triggerLabel: "Download SRM Data",
        dialogTitle: "Download SRM Data",
        Component: SRMDownloadPanel,
      },
    ],
  },
];
