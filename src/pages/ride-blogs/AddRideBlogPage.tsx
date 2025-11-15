import PageLayout from "@/components/common/PageLayout";
import RideBlogForm from "@/components/form/main-form/RideBlogForm";
import { useAdminContext } from "@/context/AdminContext";

export default function AddRideBlogPage() {
  const { country } = useAdminContext();

  return (
    <PageLayout heading={`Add New Ride Blog under ${country.countryName}`}>
      <RideBlogForm type="Add" />
    </PageLayout>
  );
}
