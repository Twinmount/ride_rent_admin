import StateSkelton from "@/components/skelton/StateSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "@/api/blogs";
import BlogCard from "@/components/card/BlogCard";
import Pagination from "@/components/Pagination";
import { useState } from "react";
import BlogCategoryTags from "@/components/BlogCategoryTags";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import { useAdminContext } from "@/context/AdminContext";
import PageWrapper from "@/components/common/PageWrapper";

export default function ManageRideBlogsPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { country } = useAdminContext();

  // Prepare the request body
  const requestBody: any = {
    page: page.toString(),
    limit: "10",
    sortOrder: "DESC",
  };

  // Conditionally add blogCategory if selectedTag is valid
  if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
    requestBody.blogCategory = [selectedCategory];
  }

  const { data, isLoading } = useQuery({
    queryKey: ["ride-blogs", selectedCategory, page],
    queryFn: () => fetchAllBlogs(requestBody),
  });

  const blogsResult = data?.result.list || [];

  return (
    <PageWrapper
      heading={`Manage Ride Blogs - ${country.countryName}`}
      shouldRenderNavigation={false}
    >
      {/* Category filter component */}
      <BlogCategoryTags
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        type="ride"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StateSkelton />
        </div>
      ) : blogsResult.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {blogsResult.map((data) => (
            <BlogCard blog={data} key={data.blogId} type="ride" />
          ))}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Ride Blogs Found!</div>
      )}

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.result.totalNumberOfPages || 1}
      />

      {/* New Blog Link Button */}
      <FloatingActionButton href={`/ride-blogs/add`} label="New Blog" />
    </PageWrapper>
  );
}
