import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { LiveListingVehicleType } from "@/types/api-types/vehicleAPI-types";
import { generateModelDetailsUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { useAdminContext } from "@/context/AdminContext";

export const LiveListingColumns: (
  onToggle: (vehicleId: string, isDisabled: boolean) => void,
  isPending?: boolean,
) => ColumnDef<LiveListingVehicleType>[] = (onToggle, isPending) => [
  {
    accessorKey: "vehicleModel",
    header: "Model",
    cell: ({ row }) => {
      const { vehicleId, vehicleModel, company } = row.original;
      return (
        <Link
          to={`/listings/edit/${vehicleId}/${company.companyId}/${company.userId}`}
          className="font-semibold text-blue-600 hover:underline"
        >
          {vehicleModel}
        </Link>
      );
    },
  },
  {
    accessorKey: "vehicleCode",
    header: "Vehicle Code",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.vehicleCode}</span>
    ),
  },
  {
    accessorKey: "company.companyName",
    header: "Company Name",
  },
  {
    accessorKey: "isDisabled",
    header: "Vehicle Status",
    cell: ({ row }) => {
      const { vehicleId, isDisabled } = row.original;
      return (
        <Switch
          checked={!isDisabled}
          onCheckedChange={(checked) => onToggle(vehicleId, !checked)}
          disabled={isPending}
          className={`${isPending && "!cursor-wait"} ml-3`}
        />
      );
    },
  },
  {
    accessorKey: "vehicleId",
    header: "Published URL",
    cell: ({ row }) => {
      const {
        vehicleTitle,
        vehicleCode,
        vehicleStateValue,
        vehicleCategoryValue,
      } = row.original;
      const modelDetails = generateModelDetailsUrl(vehicleTitle);
      const appCountry = localStorage.getItem("appCountry") || "ae";
      const apiBaseUrl =
        appCountry === "in"
          ? import.meta.env.VITE_API_URL_INDIA
          : import.meta.env.VITE_API_URL_UAE;
      const { country } = useAdminContext();
      const countryName = country.countryValue;
      const isIndia = countryName === "India";
      const appUrl = apiBaseUrl.includes("prod")
        ? "https://ride.rent"
        : "https://dev.ride.rent";
      const url = `${appUrl}/${isIndia ? "in" : "ae"}/${vehicleStateValue}/${vehicleCategoryValue}/${modelDetails}-for-rent/${vehicleCode.toLowerCase()}`;

      // Inline Toast + Copy Component
      const CopyButton = () => {
        const [open, setOpen] = useState(false);

        const handleCopy = async () => {
          await navigator.clipboard.writeText(url);
          setOpen(true);
        };

        return (
          <>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy size={16} />
            </Button>

            <Toast.Provider swipeDirection="right">
              <Toast.Root
                open={open}
                onOpenChange={setOpen}
                className="rounded bg-black px-4 py-2 text-white shadow"
              >
                <Toast.Title className="text-sm">
                  Copied to clipboard!
                </Toast.Title>
              </Toast.Root>
              <Toast.Viewport className="fixed bottom-4 right-4 z-50" />
            </Toast.Provider>
          </>
        );
      };

      return (
        <div className="flex items-center gap-2">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink />
          </a>
          <CopyButton />
        </div>
      );
    },
  },
];
