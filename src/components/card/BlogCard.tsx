import { BlogType } from "@/types/api-types/blogApi-types";
import { Link } from "react-router-dom";

type BlogCardProps = {
  blog: BlogType;
};

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="group bg-white min-w-[265px] w-full max-w-full shadow-lg rounded-lg overflow-hidden mx-auto transform transition duration-300 hover:shadow-xl h-full hover:scale-[1.02]">
      <Link
        to={`/happenings/blogs/edit/${blog.blogId}`}
        className="flex flex-col h-full"
      >
        <div className="overflow-hidden">
          {/* Image with zoom effect on card hover */}
          <img
            src={blog.blogImage}
            alt={blog.blogTitle}
            className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="h-48 p-4 ">
          <div className="text-sm tracking-wide text-gray-600 uppercase">
            <span className="px-2 rounded-md shadow-md bg-slate-100 text-yellow">
              {blog.blogCategory}
            </span>{" "}
            &middot;{" "}
            {new Date(blog.updatedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <h3 className="mt-2 text-lg font-semibold line-clamp-2">
            {blog.blogTitle}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {blog.blogDescription}
          </p>
        </div>
      </Link>
    </div>
  );
}
