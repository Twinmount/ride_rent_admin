import { fetchCategoryById } from "@/api/vehicle-categories";
import BrandForm from "@/components/form/BrandForm";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";

import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddBrandPage() {
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>();

  const navigate = useNavigate();

  const { isLoading } = useQuery({
    queryKey: ["category", vehicleCategoryId],
    queryFn: () => fetchCategoryById(vehicleCategoryId as string),
    enabled: !!vehicleCategoryId,
  });

  return (
    <section className="container pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h3 className="h3-bold text-center sm:text-left">Add New Series</h3>
      </div>
      {isLoading ? <FormSkelton /> : <BrandForm type="Add" />}
    </section>
  );
}
