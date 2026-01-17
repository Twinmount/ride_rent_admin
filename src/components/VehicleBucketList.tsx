import LinkSkelton from "@/components/skelton/LinksSkelton";
import { VehicleBucketListType } from "@/types/api-types/API-types";
import VehicleBucketCard from "./VehicleBucketCard";

type VehicleBucketListProps = {
  vehicleBucketList: VehicleBucketListType[];
  isVehicleBucketLoading: boolean;
  search: string;
};

export const VehicleBucketList: React.FC<VehicleBucketListProps> = ({
  vehicleBucketList,
  isVehicleBucketLoading,
  search,
}) => {
  if (isVehicleBucketLoading) {
    return (
      <div className="flex max-w-[800px] flex-col gap-3">
        <LinkSkelton />
      </div>
    );
  }

  if (vehicleBucketList.length === 0) {
    return <NoVehicleBucketsFound search={search || ""} />;
  }

  return (
    <div className="mt-6 flex max-w-[800px] flex-col gap-3">
      {vehicleBucketList.map((data) => (
        <VehicleBucketCard key={data.id} data={data} />
      ))}
    </div>
  );
};

// Component to display a message when no vehicle buckets are found
const NoVehicleBucketsFound = ({ search }: { search: string }) => {
  return (
    <div className="flex-center col-span-full h-72 flex-col text-center">
      <p className="text-xl font-semibold text-gray-800">
        No vehicle buckets found {search && `for "${search}"`}
      </p>
    </div>
  );
};
