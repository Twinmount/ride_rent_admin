import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import StateSkelton from '@/components/skelton/StateSkelton'
import { useQuery } from '@tanstack/react-query'
import { fetchAllBlogs } from '@/api/blogs'
import BlogCard from '@/components/card/BlogCard'
import Pagination from '@/components/Pagination'
import { useState } from 'react'
import NavigationTab from '@/components/NavigationTab'
import BlogCategoryTags from '@/components/BlogCategoryTags'

export default function ManageBlogsPage() {
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Prepare the request body
  const requestBody: any = {
    page: page.toString(),
    limit: '10',
    sortOrder: 'DESC',
  }

  // Conditionally add blogCategory if selectedTag is valid
  if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
    requestBody.blogCategory = [selectedCategory]
  }

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', selectedCategory],
    queryFn: () => fetchAllBlogs(requestBody),
  })

  const blogsResult = data?.result.list || []

  return (
    <section className="container h-auto min-h-screen pb-10">
      {/* navigate between blogs and promotions */}
      <NavigationTab
        navItems={[
          { label: 'Blogs', to: '/happenings/blogs' },
          { label: 'Promotions', to: '/happenings/promotions' },
        ]}
      />
      <h1 className="mt-6 mb-4 text-2xl font-bold text-center sm:text-left">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
          {blogsResult.map((data) => (
            <BlogCard blog={data} key={data.blogId} />
          ))}
        </div>
      ) : (
        <div className="text-2xl text-center mt-36">No Blogs Found!</div>
      )}

      {blogsResult.length > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages || 1}
        />
      )}

      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all ">
        <Link
          className="px-3 py-2 text-white flex-center gap-x-1 bg-yellow"
          to={`/happenings/blogs/add`}
        >
          New Blog <Plus />
        </Link>
      </button>
    </section>
  )
}
