import { useSearchParams } from "react-router-dom";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import PageLayout from "@/components/common/PageLayout";
import { VehicleBucketList } from "@/components/VehicleBucketList";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllVehicleBucket } from "@/api/vehicle-bucket";
import { useAdminContext } from "@/context/AdminContext";
import { VehicleBucketDisplayGroupType } from "@/types/types";
import { SingleSelectDropdown } from "@/components/form/dropdowns/SingleSelectDropdown";
import {
  VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS,
  VEHICLE_BUCKET_DISPLAY_GROUP_FILTER_DROPDOWN_OPTIONS,
  VEHICLE_BUCKET_MODE_FILTER_DROPDOWN_OPTIONS,
  VehicleBucketModeType,
} from "@/constants";

export default function ManageVehicleBucketPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const { state } = useAdminContext();
  const [displayGroup, setDisplayGroup] = useState<
    VehicleBucketDisplayGroupType | "all"
  >("all");
  const [vehicleBucketMode, setVehicleBucketMode] = useState<
    VehicleBucketModeType | "all"
  >("all");

  const searchQuery = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: [
      "vehicle-bucket",
      state?.stateId,
      page,
      searchQuery,
      displayGroup,
      vehicleBucketMode,
    ],
    queryFn: async () =>
      await fetchAllVehicleBucket({
        search: searchQuery,
        state: state?.stateId as string,
        page,
        displayGroup,
        vehicleBucketMode,
      }),
    enabled: !!state?.stateId,
    staleTime: 0,
  });

  const vehicleBucketList = data?.result?.list || [];
  const totalItems = data?.result?.total || 0;
  const totalNumberOfPages = data?.result?.totalNumberOfPages || 1;

  const { POPULAR_RENTAL_SEARCHES, POPULAR_VEHICLE_PAGES } =
    VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS;

  const description =
    displayGroup === POPULAR_RENTAL_SEARCHES ? (
      <>
        <strong className="font-semibold">
          Popular Rental Searches (Left Side Box)
        </strong>{" "}
      </>
    ) : displayGroup === POPULAR_VEHICLE_PAGES ? (
      <>
        <strong className="font-semibold">
          Popular Vehicle Pages (Right Side Box)
        </strong>{" "}
      </>
    ) : (
      <>
        <strong className="font-semibold">
          Both Popular Rental Searches and Popular Vehicle Pages (Left and Right
          Side Box)
        </strong>{" "}
      </>
    );

  const displayGroupDropdownOptions = [
    { label: "All", value: "all" },
    ...VEHICLE_BUCKET_DISPLAY_GROUP_FILTER_DROPDOWN_OPTIONS,
  ];

  return (
    <PageLayout heading={`Manage Vehicle Bucket in ${state?.stateName}`}>
      <div className="flex flex-wrap items-center gap-3 pl-2 pr-10">
        {/* search component */}
        <SearchBox
          placeholder="search  bucket name or link text"
          className="!mb-0"
          searchDescription="Vehicle bucket name, value or link text can be searched"
        />

        {/* display group dropdown */}
        <SingleSelectDropdown
          options={displayGroupDropdownOptions}
          value={displayGroup}
          onChange={(val) =>
            setDisplayGroup(val as VehicleBucketDisplayGroupType)
          }
          className="mb-4 w-44"
        />

        {/* vehicle bucket mode dropdown */}
        <SingleSelectDropdown
          options={VEHICLE_BUCKET_MODE_FILTER_DROPDOWN_OPTIONS}
          value={vehicleBucketMode}
          onChange={(val) =>
            setVehicleBucketMode(val as VehicleBucketModeType | "all")
          }
          className="mb-4 w-44"
        />
      </div>

      <p className="ml-4 mt-4 text-left text-sm text-gray-700">
        Vehicle Buckets which appear on {description} in the public site footer
      </p>

      {/* brand grid and loading skeleton */}
      <VehicleBucketList
        vehicleBucketList={vehicleBucketList}
        isVehicleBucketLoading={isLoading}
        search={searchQuery}
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages}
      />

      <FloatingActionButton
        href={`/manage-vehicle-bucket/add`}
        label={
          totalItems >= 20
            ? `Max Limit Reached (${totalItems})`
            : "New Vehicle Bucket"
        }
        disabled={totalItems >= 20}
      />
    </PageLayout>
  );
}
