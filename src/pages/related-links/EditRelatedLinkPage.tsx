import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";

import { fetchRelatedLinkById } from "@/api/related-links";
import RelatedLinkForm from "@/components/form/RelatedLinkForm";

export default function EditRelatedLinkPage() {
  const navigate = useNavigate();

  const { linkId } = useParams<{ linkId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["recommended-links", linkId],
    queryFn: () => fetchRelatedLinkById(linkId as string),
  });

  // Destructure to get the 'list' array from 'data'
  const linkData = data?.result;

  return (
    <section className="container min-h-screen pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="h3-bold text-left">Update Recommended Link</h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <RelatedLinkForm type="Update" formData={linkData} />
      )}
    </section>
  );
}
