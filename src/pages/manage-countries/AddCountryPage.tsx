import PageLayout from "@/components/common/PageLayout";
import CountryForm from "@/components/form/CountryForm";

export default function AddCountryPage() {
  return (
    <PageLayout heading="Add New Country">
      <CountryForm type="Add" />
    </PageLayout>
  );
}
