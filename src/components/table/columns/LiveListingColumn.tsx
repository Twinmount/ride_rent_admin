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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getOfferSummary,
  getOfferTimeRemaining,
  isOfferActive,
} from "@/helpers/price-offer.helper";

type LiveListingColumnsFn = (
  handleToggleVehicleStatus: (vehicleId: string, isDisabled: boolean) => void,
  isVehicleStatusPending?: boolean,
  handleToggleVehiclePriority?: (vehicleId: string) => void,
  vehiclePriorityPending?: boolean,
  onOpenOfferDialog?: (vehicle: LiveListingVehicleType) => void,
) => ColumnDef<LiveListingVehicleType>[];

export const LiveListingColumns: LiveListingColumnsFn = (
  handleToggleVehicleStatus,
  isVehicleStatusPending,
  handleToggleVehiclePriority,
  vehiclePriorityPending,
  onOpenOfferDialog,
) => [
  {
    accessorKey: "vehicleModel",
    header: "Model",
    cell: ({ row }) => {
      const { vehicleId, vehicleModel, company } = row.original;
      const MAX_LENGTH = 50;
      const displayText =
        vehicleModel.length > MAX_LENGTH
          ? `${vehicleModel.substring(0, MAX_LENGTH)}...`
          : vehicleModel;

      return (
        <Link
          to={`/listings/edit/${vehicleId}/${company.companyId}/${company.userId}`}
          className="font-semibold text-blue-600 hover:underline"
          title={vehicleModel.length > MAX_LENGTH ? vehicleModel : undefined}
        >
          {displayText}
        </Link>
      );
    },
  },

  {
    accessorKey: "priceOffer",
    header: "Price Offer (Beta)",
    cell: ({ row }) => {
      const vehicle = row.original;
      const hasActiveOffer = isOfferActive(vehicle);
      const timeRemaining = getOfferTimeRemaining(vehicle);
      const summary = getOfferSummary(vehicle);

      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={hasActiveOffer}
            onCheckedChange={() => onOpenOfferDialog?.(vehicle)}
            className="data-[state=checked]:bg-green-500"
          />

          {hasActiveOffer && timeRemaining && (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <span className="cursor-help rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {timeRemaining}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1 text-xs">
                    <p>
                      <strong>Start:</strong> {summary?.startTime}
                    </p>
                    <p>
                      <strong>End:</strong> {summary?.endTime}
                    </p>
                    <p>
                      <strong>Duration:</strong> {summary?.duration}
                    </p>
                    <p>
                      <strong>Loop:</strong> {summary?.loopDuration}
                    </p>
                    <p>
                      <strong>Progress:</strong> {summary?.currentCycle}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
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
    accessorKey: "isHighPriority",
    header: "High Priority",
    cell: ({ row }) => {
      const { vehicleId, isHighPriority } = row.original;
      return (
        <Switch
          checked={!!isHighPriority}
          onCheckedChange={() => handleToggleVehiclePriority?.(vehicleId)}
          disabled={vehiclePriorityPending}
          className={`${vehiclePriorityPending && "!cursor-wait"} ml-3 data-[state=checked]:bg-yellow`}
        />
      );
    },
  },

  {
    accessorKey: "company.companyName",
    header: "Company",
    cell: ({ row }) => {
      const {
        company: { companyName, companyId },
      } = row.original;
      return (
        <Link
          to={`/company/registrations/view/${companyId}`}
          className="line-clamp-1 font-semibold text-blue-600 hover:underline"
        >
          {companyName}
        </Link>
      );
    },
  },
  {
    accessorKey: "isDisabled",
    header: "Disabled Status",
    cell: ({ row }) => {
      const { vehicleId, isDisabled } = row.original;
      return (
        <Switch
          checked={isDisabled}
          onCheckedChange={(checked) =>
            handleToggleVehicleStatus(vehicleId, checked)
          }
          disabled={isVehicleStatusPending}
          className={`${isVehicleStatusPending && "!cursor-wait"} ml-3 data-[state=checked]:bg-red-500`}
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
