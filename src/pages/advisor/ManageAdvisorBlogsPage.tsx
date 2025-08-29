import StateSkelton from "@/components/skelton/StateSkelton";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/card/BlogCard";
import Pagination from "@/components/Pagination";
import { useState } from "react";

import BlogCategoryTags from "@/components/BlogCategoryTags";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import { fetchAllAdvisorBlogs } from "@/api/advisor";
import { useAdminContext } from "@/context/AdminContext";
import PageLayout from "@/components/common/PageLayout";

export default function ManageAdvisorBlogsPage() {
  const { country } = useAdminContext();
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
    queryKey: ["advisor-blogs", selectedCategory, page],
    queryFn: () => fetchAllAdvisorBlogs(requestBody),
  });

  const blogsResult = data?.result.list || [];

  return (
    <PageLayout heading={`Manage Advisor Blogs - ${country.countryName}`}>
      {/* Category filter component */}
      <BlogCategoryTags
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        type="advisor"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StateSkelton />
        </div>
      ) : blogsResult.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {blogsResult.map((data) => (
            <BlogCard blog={data} key={data.blogId} type="advisor" />
          ))}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Blogs Found!</div>
      )}

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.result.totalNumberOfPages || 1}
      />

      {/* New Blog Link Button */}
      <FloatingActionButton
        href={`/advisor/blogs/add`}
        label="New Advisor Blog"
      />
    </PageLayout>
  );
}
