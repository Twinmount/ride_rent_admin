import { FC, useMemo, useState } from "react";
import { RefreshCw, Check, AlertCircle } from "lucide-react";
import { CACHE_TAGS } from "@/constants/cache.constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertToLabel } from "@/helpers";

interface TagRevalidationTabProps {
  tagInput: string;
  setTagInput: (value: string) => void;
  onRevalidate: (tag: string) => void;
  isLoading: boolean;
}

export const TagRevalidationTab: FC<TagRevalidationTabProps> = ({
  tagInput,
  setTagInput,
  onRevalidate,
  isLoading,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("");
  // const [vehiclePrefix, setVehiclePrefix] = useState<string>("RDVH");
  // const [vehicleNumber, setVehicleNumber] = useState<string>("");

  const handleQuickRevalidate = () => {
    if (selectedTag) {
      onRevalidate(selectedTag);
    }
  };

  // Handle vehicle number input (only allow numbers and hyphens)
  // const handleVehicleNumberChange = (value: string) => {
  //   // Allow only numbers and hyphens
  //   const sanitized = value.replace(/[^0-9-]/g, "");
  //   setVehicleNumber(sanitized);
  // };

  // Handle vehicle code revalidation
  // const handleVehicleRevalidate = () => {
  //   if (!vehicleNumber.trim()) return;

  //   // Construct full vehicle code: RDVH-123 or ADVH-456
  //   const formattedVehicleCode = `${vehiclePrefix}-${vehicleNumber}`;

  //   onRevalidate(CACHE_TAGS.byVehicleCode(formattedVehicleCode));

  //   // Clear input after revalidation
  //   setVehicleNumber("");
  // };

  // Options for quick revalidation
  const revalidateTagOptions = useMemo(() => {
    return Object.entries(CACHE_TAGS)
      .filter(
        ([key]) =>
          typeof CACHE_TAGS[key as keyof typeof CACHE_TAGS] === "string",
      ) // Exclude functions
      .map(([key, value]) => ({
        label: convertToLabel(key), // Format: HOMEPAGE_BANNER → Homepage Banner
        value: value as string,
      }));
  }, []);

  // Vehicle prefix options
  // const vehiclePrefixOptions = [
  //   { label: "RDVH (UAE)", value: "RDVH" },
  //   { label: "ADVH (India)", value: "ADVH" },
  // ];

  return (
    <div className="space-y-6">
      {/*  Info Box */}
      <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
        <div className="text-sm text-blue-800">
          <p className="mb-1 font-semibold">How cache tag works?</p>
          <p className="mb-2">
            Tags group related content across multiple pages. Revalidating a tag
            refreshes all pages that use it.
          </p>
          <p className="mb-1 font-semibold">Examples:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Homepage Banner</strong> → Refreshes banners on all
              homepage variations
            </li>
            <li>
              <strong>Vehicle Details FAQ</strong> → Refreshes FAQs on all
              vehicle pages
            </li>
            <li>
              <strong>Specific Vehicle (RDVH-123)</strong> → Refreshes only that
              vehicle's page
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Tag Selection */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Select Tag to Revalidate
        </label>
        <div className="flex gap-2">
          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
            disabled={isLoading}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose a cache tag..." />
            </SelectTrigger>
            <SelectContent>
              {revalidateTagOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={handleQuickRevalidate}
            disabled={!selectedTag || isLoading}
            className="flex items-center gap-2 rounded-lg bg-yellow px-6 py-2 font-semibold text-white hover:bg-yellow/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Revalidate
          </button>
        </div>
      </div>

      {/* Divider */}
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-gray-500">
            Vehicle Details Page
          </span>
        </div>
      </div> */}

      {/* <div className="pb-12">
        <label className="mb-2 block text-sm font-semibold text-gray-800">
          Revalidate Specific Vehicle{" "}
          <span className="italic text-slate-600">
            &#40;Currently Not Cached Any&#41;
          </span>
        </label>
        <div className="flex gap-2">
          <Select
            value={vehiclePrefix}
            onValueChange={setVehiclePrefix}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {vehiclePrefixOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center text-lg font-semibold text-gray-400">
            -
          </div>

          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => handleVehicleNumberChange(e.target.value)}
            placeholder="123"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow"
            disabled={isLoading}
          />

          <button
            onClick={handleVehicleRevalidate}
            disabled={!vehicleNumber.trim() || isLoading}
            className="flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Revalidate
          </button>
        </div>

        {vehicleNumber && (
          <p className="mt-2 text-xs text-gray-600">
            Will revalidate:{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">
              {vehiclePrefix.toLowerCase()}-{vehicleNumber}
            </code>
          </p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          Select vehicle type (UAE or India) and enter the number part only
        </p>
      </div> */}

      {/* Custom Tag */}
      <div className="relative mt-20">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-gray-500">
            Custom Tag (Advanced)
          </span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Enter Custom Tag
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="e.g., homepage-banner, vehicle-details"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow"
            disabled={isLoading}
          />
          <button
            onClick={() => onRevalidate(tagInput)}
            disabled={!tagInput.trim() || isLoading}
            className="flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Revalidate
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          For advanced users: Enter any cache tag manually
        </p>
      </div>
    </div>
  );
};
