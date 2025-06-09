import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import LazyLoader from "@/components/skelton/LazyLoader";
import AdvisorBlogForm from "@/components/form/main-form/AdvisorBlogForm";
import { fetchAdvisorBlogById } from "@/api/advisor";
import { useAdminContext } from "@/context/AdminContext";

export default function EditAdvisorBlogPage() {
  const navigate = useNavigate();
  const { country } = useAdminContext();

  const { blogId } = useParams<{ blogId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["advisor-blogs", blogId],
    queryFn: () => fetchAdvisorBlogById(blogId as string),
  });

  return (
    <section className="container min-h-screen pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="h3-bold text-center sm:text-left">
          Update Advisor Blog under {country.countryName}
        </h1>
      </div>
      {isLoading ? (
        <LazyLoader />
      ) : (
        <AdvisorBlogForm type="Update" formData={data?.result} />
      )}
    </section>
  );
}
