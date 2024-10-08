import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { fetchBlogById } from '@/api/blogs'
import LazyLoader from '@/components/skelton/LazyLoader'
import BlogForm from '@/components/form/main-form/BlogForm'

export default function EditBlogPage() {
  const navigate = useNavigate()

  const { blogId } = useParams<{ blogId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['blog-by-id', blogId],
    queryFn: () => fetchBlogById(blogId as string),
  })

  return (
    <section className="container min-h-screen pt-5 pb-32">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">Update Blog</h1>
      </div>
      {isLoading ? (
        <LazyLoader />
      ) : (
        <BlogForm type="Update" formData={data?.result} />
      )}
    </section>
  )
}
