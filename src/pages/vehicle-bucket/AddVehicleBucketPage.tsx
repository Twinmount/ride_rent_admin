import PageLayout from "@/components/common/PageLayout";
import VehicleBucketForm from "@/components/form/VehicleBucketForm";

export default function AddVehicleBucketPage() {
  return (
    <PageLayout
      shouldRenderNavigation={true}
      heading={`Add New Vehicle Bucket`}
    >
      <VehicleBucketForm type="Add" />
    </PageLayout>
  );
}
