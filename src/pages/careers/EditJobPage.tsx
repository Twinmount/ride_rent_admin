import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchBlogById } from "@/api/blogs";
import LazyLoader from "@/components/skelton/LazyLoader";
import RideBlogForm from "@/components/form/main-form/RideBlogForm";
import { useAdminContext } from "@/context/AdminContext";

const CAREER_JOB_BY_ID = "CAREER_JOB_BY_ID";

export default function EditJobPage() {
  const navigate = useNavigate();
  const { country } = useAdminContext();

  const { jobId } = useParams<{ jobId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: [CAREER_JOB_BY_ID, jobId],
    queryFn: () => fetchBlogById(jobId as string),
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
          Update Job {country.countryName}
        </h1>
      </div>
      {isLoading ? (
        <LazyLoader />
      ) : (
        <RideBlogForm type="Update" formData={data?.result} />
      )}
    </section>
  );
}
