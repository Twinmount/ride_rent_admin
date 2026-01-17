import { VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS } from "@/constants";
import { VehicleBucketListType } from "@/types/api-types/API-types";
import { generateVehicleBucketPublicSiteLink } from "@/utils/helper";
import {
  CarFront,
  ExternalLink,
  MapPin,
  Pencil,
  LayoutGrid,
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
      return "Popular Rental Searches";
    }
    if (value === POPULAR_VEHICLE_PAGES) {
      return "Popular Vehicle Pages";
    }
    return "";
  };

  const displayGroupName = getDisplayGroupName(data.displayGroup);
  const isPopularSearch =
    data.displayGroup ===
    VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS.POPULAR_RENTAL_SEARCHES;

  return (
    <div className="group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Link
            to={`/manage-vehicle-bucket/edit/${data.id}`}
            className="group/title block"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-lg font-bold leading-tight text-gray-900 transition-colors group-hover/title:text-primary">
                  {data.vehicleBucketName}
                </h3>

                {/* Display Group Badge */}
                <div
                  className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isPopularSearch
                      ? "border-blue-100 bg-blue-50 text-blue-600"
                      : "border-purple-100 bg-purple-50 text-purple-600"
                  }`}
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

                {/* Vehicle Count */}
                <div
                  className="flex items-center gap-1.5"
                  title="Number of vehicles"
                >
                  <div className="flex items-center justify-center rounded-full bg-gray-100 p-1">
                    <CarFront className="h-4 w-4 text-yellow" />
                  </div>
                  <span className="font-medium">
                    {data.vehicleCodes?.length || 0} Vehicles
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Link Text Display if exists */}

          <div className="flex items-center justify-start gap-2">
            <span className="mt-1 line-clamp-1 w-fit rounded-md bg-slate-200 p-1 px-4 text-sm text-gray-600">
              {data.linkText}
            </span>

            <span className="mt-1 line-clamp-1 w-fit rounded-md bg-slate-200 p-1 px-4 text-sm text-gray-600">
              Total Visits: {data.pageVisitCount}
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
          to={`/manage-vehicle-bucket/edit/${data.id}`}
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
