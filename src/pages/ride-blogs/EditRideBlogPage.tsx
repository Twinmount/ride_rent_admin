import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchBlogById } from "@/api/blogs";
import LazyLoader from "@/components/skelton/LazyLoader";
import RideBlogForm from "@/components/form/main-form/RideBlogForm";
import { useAdminContext } from "@/context/AdminContext";
import PageLayout from "@/components/common/PageLayout";

export default function EditRideBlogPage() {
  const { country } = useAdminContext();

  const { blogId } = useParams<{ blogId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["ride-blogs", blogId],
    queryFn: () => fetchBlogById(blogId as string),
  });

  return (
    <PageLayout heading={`Update Ride Blog under ${country.countryName}`}>
      {isLoading ? (
        <LazyLoader />
      ) : (
        <RideBlogForm type="Update" formData={data?.result} />
      )}
    </PageLayout>
  );
}
