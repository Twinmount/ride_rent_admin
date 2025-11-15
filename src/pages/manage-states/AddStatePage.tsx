import PageLayout from "@/components/common/PageLayout";
import StateForm from "@/components/form/StateForm";
import { useAdminContext } from "@/context/AdminContext";
import { useSearchParams } from "react-router-dom";

export default function AddLocationPage() {
  const [searchParams] = useSearchParams();

  const { country } = useAdminContext();
  const countryName = country.countryName;

  const parentState = searchParams.get("parentStateName") || null;
  const parentStateId = searchParams.get("parentStateId") || null;

  return (
    <PageLayout
      heading={`Add New Location ${!!parentState && `in ${parentState}`} under ${countryName}`}
      shouldRenderNavigation
    >
      <StateForm type="Add" parentStateId={parentStateId} />
    </PageLayout>
  );
}
