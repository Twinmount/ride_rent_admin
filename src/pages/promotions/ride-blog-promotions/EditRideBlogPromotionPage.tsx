import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import BlogPromotionForm from "@/components/form/BlogPromotionForm";
import { fetchBlogPromotionById } from "@/api/blogs";
import { useAdminContext } from "@/context/AdminContext";

export default function EditRideBlogPromotionPage() {
  const navigate = useNavigate();
  const { country } = useAdminContext();
  const { promotionId } = useParams<{ promotionId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["blog-promotions", promotionId],
    queryFn: () => fetchBlogPromotionById(promotionId as string),
  });

  // Destructure to get the 'list' array from 'data'
  const promotionData = data?.result;

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
          Update Blog Promotion under {country.countryName}
        </h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <BlogPromotionForm type="Update" formData={promotionData} />
      )}
    </section>
  );
}
