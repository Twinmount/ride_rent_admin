import { useParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";

import VehicleBucketForm from "@/components/form/VehicleBucketForm";
import PageLayout from "@/components/common/PageLayout";
import { fetchVehicleBucketById } from "@/api/vehicle-bucket";

export default function EditVehicleBucketPage() {
  const { vehicleBucketId } = useParams<{ vehicleBucketId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-bucket", vehicleBucketId],
    queryFn: () => fetchVehicleBucketById(vehicleBucketId as string),
  });

  // Destructure to get the 'list' array from 'data'
  const vehicleBucketData = data?.result;

  return (
    <PageLayout shouldRenderNavigation={true} heading={`Update Vehicle Bucket`}>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <VehicleBucketForm type="Update" formData={vehicleBucketData} />
      )}
    </PageLayout>
  );
}
