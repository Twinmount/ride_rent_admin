import PageLayout from "@/components/common/PageLayout";
import SRMCustomerDetailsForm from "@/components/form/main-form/SRMCustomerDetailsForm";

export default function SRMCustomerAddPage() {
  return (
    <PageLayout heading="Add SRM Customer" shouldRenderNavigation>
      <SRMCustomerDetailsForm type="Add" />
    </PageLayout>
  );
}
