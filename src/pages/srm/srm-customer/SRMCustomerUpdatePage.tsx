import { getSRMCustomerFormDetails } from "@/api/srm";
import PageLayout from "@/components/common/PageLayout";
import SRMCustomerDetailsForm from "@/components/form/main-form/SRMCustomerDetailsForm";
import FormSkelton from "@/components/skelton/FormSkelton";
import { SRMCustomerDetailsFormType } from "@/types/formTypes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function SRMCustomerUpdatePage() {
  const { customerId } = useParams<{ customerId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["srm", "srm-customer", customerId],
    queryFn: () => getSRMCustomerFormDetails(customerId as string),
    enabled: !!customerId,
  });

  const formData = {
    ...data?.result,
    customerProfilePic: data?.result?.customerProfilePicPath,
  };

  return (
    <PageLayout heading="Update SRM Customer" shouldRenderNavigation>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <SRMCustomerDetailsForm
          type="Update"
          formData={formData as SRMCustomerDetailsFormType}
        />
      )}
    </PageLayout>
  );
}
