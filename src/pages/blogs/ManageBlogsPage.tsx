import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import StateSkelton from "@/components/skelton/StateSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "@/api/blogs";
import BlogCard from "@/components/card/BlogCard";
import Pagination from "@/components/Pagination";
import { useState } from "react";

import BlogCategoryTags from "@/components/BlogCategoryTags";

export default function ManageBlogsPage() {
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
    queryKey: ["blogs", selectedCategory, page],
    queryFn: () => fetchAllBlogs(requestBody),
  });

  const blogsResult = data?.result.list || [];

  return (
    <section className="container h-auto min-h-screen pb-10">
      <h1 className="mb-4 mt-6 text-center text-2xl font-bold sm:text-left">
        Manage Blogs
      </h1>

      {/* Category filter component */}
      <BlogCategoryTags
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StateSkelton />
        </div>
      ) : blogsResult.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {blogsResult.map((data) => (
            <BlogCard blog={data} key={data.blogId} />
          ))}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Blogs Found!</div>
      )}

      {blogsResult.length > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages || 1}
        />
      )}

      <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center gap-x-1 bg-yellow px-3 py-2 text-white"
          to={`/happenings/blogs/add`}
        >
          New Blog <Plus />
        </Link>
      </button>
    </section>
  );
}
