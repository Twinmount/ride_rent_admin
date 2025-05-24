import { BlogType } from "@/types/api-types/blogApi-types";
import { Link } from "react-router-dom";

type BlogCardProps = {
  blog: BlogType;
  type: "ride" | "advisor";
};

export default function BlogCard({ blog, type }: BlogCardProps) {
  // dynamically set link source based on blog type "ride" or "advisor"
  const linkSrc =
    type === "ride"
      ? `/ride-blogs/edit/${blog.blogId}`
      : `/advisor/blogs/edit/${blog.blogId}`;

  return (
    <div className="group mx-auto h-full w-full min-w-[265px] max-w-full transform overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-xl">
      <Link to={linkSrc} className="flex h-full flex-col">
        <div className="overflow-hidden">
          {/* Image with zoom effect on card hover */}
          <img
            src={blog.blogImage}
            alt={blog.blogTitle}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="h-48 p-4">
          <div className="text-sm uppercase tracking-wide text-gray-600">
            <span className="rounded-md bg-slate-100 px-2 text-yellow shadow-md">
              {blog.blogCategory}
            </span>{" "}
            &middot;{" "}
            {new Date(blog.updatedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold">
            {blog.blogTitle}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
            {blog.blogDescription}
          </p>
        </div>
      </Link>
    </div>
  );
}
