import { fetchListingMetaDataById } from "@/api/meta-data";
import ListingMetaForm from "@/components/form/ListingMetaForm";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useListingMetaTab } from "@/hooks/useListingMetaTab";
import { useQuery } from "@tanstack/react-query";
import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditListingMetaPage() {
  const navigate = useNavigate();
  const { activeTab, getFormPageTitle } = useListingMetaTab({});

  const { metaDataId } = useParams<{ metaDataId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["listing-meta-data", metaDataId],
    queryFn: () => fetchListingMetaDataById(metaDataId as string),
  });

  const metaData = data?.result
    ? {
        ...data.result,
        stateId: activeTab === "brand" ? "" : data.result.stateId,
        typeId: activeTab === "vehicleType" ? data.result.typeId || "" : "",
        brandId: activeTab === "brand" ? data.result.brandId || "" : "",
        h1: data.result.h1 || "",
        h2: data.result.h2 || "",
      }
    : null;

  const heading = getFormPageTitle("Update");

  return (
    <section className="container pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h3 className="h3-bold text-center sm:text-left">{heading}</h3>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <ListingMetaForm
          type="Update"
          activeTab={activeTab}
          formData={metaData}
        />
      )}
    </section>
  );
}
