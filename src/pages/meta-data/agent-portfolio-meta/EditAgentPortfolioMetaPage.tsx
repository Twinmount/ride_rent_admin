import { fetchListingMetaDataById } from "@/api/meta-data";
import ListingMetaForm from "@/components/form/ListingMetaForm";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";

import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditAgentPortfolioMetaPage() {
  const navigate = useNavigate();

  const { agentId } = useParams<{ agentId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["promotions", agentId],
    queryFn: () => fetchListingMetaDataById(agentId as string),
  });

  const metaData = data?.result;

  return (
    <section className="container pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h2 className="h3-bold text-center sm:text-left">
          Edit Agent Portfolio Meta Data
        </h2>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <ListingMetaForm type="Update" formData={metaData} />
      )}
    </section>
  );
}
