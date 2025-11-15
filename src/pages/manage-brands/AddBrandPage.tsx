import { fetchCategoryById } from "@/api/vehicle-categories";
import PageLayout from "@/components/common/PageLayout";
import BrandForm from "@/components/form/BrandForm";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function AddBrandPage() {
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>();

  const { isLoading } = useQuery({
    queryKey: ["category", vehicleCategoryId],
    queryFn: () => fetchCategoryById(vehicleCategoryId as string),
    enabled: !!vehicleCategoryId,
  });

  return (
    <PageLayout heading="Add New Brands">
      {isLoading ? <FormSkelton /> : <BrandForm type="Add" />}
    </PageLayout>
  );
}
