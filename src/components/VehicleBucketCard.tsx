import { VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS } from "@/constants";
import { VehicleBucketListType } from "@/types/api-types/API-types";
import { generateVehicleBucketPublicSiteLink } from "@/utils/helper";
import {
  CarFront,
  ExternalLink,
  MapPin,
  Pencil,
  LayoutGrid,
  Hand,
  Sparkles,
  Navigation,
} from "lucide-react";
import { Link } from "react-router-dom";

interface VehicleBucketCardProps {
  data: VehicleBucketListType;
}

const VehicleBucketCard = ({ data }: VehicleBucketCardProps) => {
  const offerLink = generateVehicleBucketPublicSiteLink(
    data.stateValue,
    data.vehicleBucketValue,
  );

  const getDisplayGroupName = (value: string) => {
    const { POPULAR_RENTAL_SEARCHES, POPULAR_VEHICLE_PAGES } =
      VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS;

    if (value === POPULAR_RENTAL_SEARCHES) {
      return "Popular Rental Searches (Left box)";
    }
    if (value === POPULAR_VEHICLE_PAGES) {
      return "Popular Vehicle Pages (Right box)";
    }
    return "";
  };

  // Get bucket mode display info
  const getBucketModeInfo = () => {
    switch (data.vehicleBucketMode) {
      case "VEHICLE_CODE":
        return {
          label: "VEHICLE CODE MODE",
          icon: Hand,
          color: "emerald",
          bgClass: "bg-emerald-50 border-emerald-200",
          textClass: "text-emerald-700",
          iconClass: "text-emerald-600",
        };
      case "VEHICLE_TYPE":
        return {
          label: "VEHICLE TYPE MODE",
          icon: Sparkles,
          color: "blue",
          bgClass: "bg-blue-50 border-blue-200",
          textClass: "text-blue-700",
          iconClass: "text-blue-600",
        };
      case "LOCATION_COORDINATES":
        return {
          label: "LOCATION COORDINATES MODE",
          icon: Navigation,
          color: "purple",
          bgClass: "bg-purple-50 border-purple-200",
          textClass: "text-purple-700",
          iconClass: "text-purple-600",
        };
      default:
        return {
          label: "Unknown",
          icon: CarFront,
          color: "gray",
          bgClass: "bg-gray-50 border-gray-200",
          textClass: "text-gray-700",
          iconClass: "text-gray-600",
        };
    }
  };

  const bucketModeInfo = getBucketModeInfo();
  const BucketModeIcon = bucketModeInfo.icon;

  const displayGroupName = getDisplayGroupName(data.displayGroup);

  const vehicleBucketEditPageLink = `/manage-vehicle-bucket/edit/${data.id}?state=${data.stateValue}`;

  // Show vehicle count only for VEHICLE_CODE mode
  const showVehicleCount = data.vehicleBucketMode === "VEHICLE_CODE";
  const vehicleCount = data.vehicleCodes?.length || 0;

  return (
    <div className="group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Link to={vehicleBucketEditPageLink} className="group/title block">
            <div className="space-y-2">
              {/* Title and Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-lg font-bold leading-tight text-gray-900 transition-colors group-hover/title:text-primary">
                  {data.vehicleBucketName}
                </h3>

                {/* Bucket Mode Badge - PRIMARY */}
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${bucketModeInfo.bgClass} ${bucketModeInfo.textClass}`}
                >
                  <BucketModeIcon
                    size={12}
                    className={bucketModeInfo.iconClass}
                  />
                  {bucketModeInfo.label}
                </div>

                {/* Display Group Badge - SECONDARY */}
                <div
                  className={`flex items-center gap-1 rounded-full border border-blue-100 bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-300`}
                >
                  <LayoutGrid size={10} />
                  {displayGroupName}
                </div>
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                {/* State/Location */}
                <div className="flex items-center gap-1.5" title="Location">
                  <MapPin className="h-4 w-4 text-yellow" />
                  <span className="font-medium">{data.stateValue}</span>
                </div>

                {/* Vehicle Count - Only for VEHICLE_CODE mode */}
                {showVehicleCount && (
                  <div
                    className="flex items-center gap-1.5"
                    title="Number of manually selected vehicles"
                  >
                    <div className="flex items-center justify-center rounded-full bg-gray-100 p-1">
                      <CarFront className="h-4 w-4 text-yellow" />
                    </div>
                    <span className="font-medium">
                      {vehicleCount} Vehicle{vehicleCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {/* Auto-fetch indicator for VEHICLE_TYPE mode */}
                {data.vehicleBucketMode === "VEHICLE_TYPE" && (
                  <div
                    className="flex items-center gap-1.5"
                    title="Automatically fetches vehicles by type"
                  >
                    <div className="flex items-center justify-center rounded-full bg-blue-50 p-1">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-600">
                      Auto-fetch by Type
                    </span>
                  </div>
                )}

                {/* Location-based indicator for LOCATION_COORDINATES mode */}
                {data.vehicleBucketMode === "LOCATION_COORDINATES" && (
                  <div
                    className="flex items-center gap-1.5"
                    title="Automatically fetches nearest vehicles by GPS location"
                  >
                    <div className="flex items-center justify-center rounded-full bg-purple-50 p-1">
                      <Navigation className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-purple-600">
                      Geo-proximity Sort
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* Link Text & Visit Count */}
          <div className="flex items-center justify-start gap-2">
            <span className="mt-1 line-clamp-1 w-fit rounded-md bg-slate-200 p-1 px-4 text-sm text-gray-600">
              {data.linkText}
            </span>

            <span className="mt-1 line-clamp-1 w-fit rounded-md bg-slate-200 p-1 px-4 text-sm text-gray-600">
              Visits: {data.pageVisitCount}
            </span>
          </div>

          {/* External Link */}
          <a
            href={offerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg py-1 pr-2 text-xs text-gray-400 transition-colors hover:text-primary group-hover:text-blue-500"
          >
            <ExternalLink size={12} className="mb-1" />
            <span className="max-w-full truncate font-mono underline-offset-2 hover:underline sm:max-w-[400px]">
              {offerLink}
            </span>
          </a>
        </div>

        {/* Edit Button */}
        <Link
          to={vehicleBucketEditPageLink}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 text-orange transition-all hover:bg-orange hover:text-white"
          title="Edit Vehicle Bucket"
        >
          <Pencil size={18} />
        </Link>
      </div>
    </div>
  );
};

export default VehicleBucketCard;
