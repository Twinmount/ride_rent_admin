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
import VehicleBucketGroupDropdown from "@/components/form/dropdowns/VehicleBucketGroupDropdown";
import { VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS } from "@/constants";

export default function ManageVehicleBucketPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const { state } = useAdminContext();
  const [displayGroup, setDisplayGroup] =
    useState<VehicleBucketDisplayGroupType>(
      VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS.POPULAR_RENTAL_SEARCHES,
    );

  const searchQuery = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: [
      "vehicle-bucket",
      state?.stateId,
      page,
      searchQuery,
      displayGroup,
    ],
    queryFn: async () =>
      await fetchAllVehicleBucket({
        search: searchQuery,
        state: state?.stateId as string,
        page,
        displayGroup,
      }),
    enabled: !!state?.stateId,
    staleTime: 0,
  });

  const vehicleBucketList = data?.result?.list || [];
  const totalItems = data?.result?.total || 0;
  const totalNumberOfPages = data?.result?.totalNumberOfPages || 1;

  const description =
    displayGroup ===
    VEHICLE_BUCKET_DISPLAY_GROUP_OPTIONS.POPULAR_RENTAL_SEARCHES ? (
      <>
        <strong className="font-semibold">
          Popular Rental Searches (Left Side Box)
        </strong>{" "}
      </>
    ) : (
      <>
        <strong className="font-semibold">
          Popular Vehicle Pages (Right Side Box)
        </strong>{" "}
      </>
    );

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
        <VehicleBucketGroupDropdown
          onChangeHandler={setDisplayGroup}
          value={displayGroup}
          className={"mb-4 w-44"}
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
