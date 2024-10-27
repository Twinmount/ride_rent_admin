import LinkForm from "@/components/form/LinkForm";

import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddRecommendedLinkPage() {
  const navigate = useNavigate();

  return (
    <section className="container pt-5 pb-32">
      <div className="gap-x-4 mb-5 ml-5 flex-center w-fit">
        <button
          onClick={() => navigate(-1)}
          className="border-none transition-colors outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h3 className="text-center h3-bold sm:text-left">
          Add New Recommended Link
        </h3>
      </div>
      <LinkForm type="Add" />
    </section>
  );
}
