import CityForm from '@/components/form/CityForm'
import PageLayout from "@/components/common/PageLayout";

export default function AddCityPage() {
  return (
    <PageLayout heading="Add New City" shouldRenderNavigation>
      <CityForm type="Add" />
    </PageLayout>
  );
}
