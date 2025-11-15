import PageLayout from "@/components/common/PageLayout";
import VehicleSeriesForm from "@/components/form/VehicleSeriesForm";

export default function AddVehicleSeriesPage() {
  return (
    <PageLayout heading="Add New Series" shouldRenderNavigation>
      <VehicleSeriesForm type="Add" />
    </PageLayout>
  );
}
