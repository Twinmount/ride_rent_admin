import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";

import LinkForm from "@/components/form/LinkForm";
import { fetchRecommendedLinkById } from "@/api/recommended-links";

export default function EditRecommendedLinkPage() {
  const navigate = useNavigate();

  const { linkId } = useParams<{ linkId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["recommended-links", linkId],
    queryFn: () => fetchRecommendedLinkById(linkId as string),
  });

  // Destructure to get the 'list' array from 'data'
  const linkData = data?.result;

  return (
    <section className="container pt-5 pb-32 min-h-screen">
      <div className="gap-x-4 mb-5 ml-5 flex-center w-fit">
        <button
          onClick={() => navigate(-1)}
          className="border-none transition-colors outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-left h3-bold">Update Recommended Link</h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <LinkForm type="Update" formData={linkData} />
      )}
    </section>
  );
}
