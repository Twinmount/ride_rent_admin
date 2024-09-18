import { Link } from 'react-router-dom'
import LinkSkelton from '@/components/skelton/LinksSkelton'
import { FilePenLine, Link as LinkIcon, Navigation, Plus } from 'lucide-react'
import { useAdminContext } from '@/context/AdminContext'
import { useQuery } from '@tanstack/react-query'
import { fetchAllLinks } from '@/api/links'

export default function ManageLinksPage() {
  const { state } = useAdminContext()

  const { data, isLoading } = useQuery({
    queryKey: ['links', state],
    queryFn: () =>
      fetchAllLinks({
        page: 1,
        limit: 20,
        sortOrder: 'ASC',
        stateId: state.stateId as string,
      }),
  })

  // useEffect(() => console.log(data), [isLoading])

  // Destructure to get the 'list' array from 'data'
  const list = data?.result?.list || []

  return (
    <section className="container h-auto min-h-screen pb-10">
      <h1 className="mt-6 mb-8 text-2xl font-bold text-center sm:text-left">
        Currently Active Links In{' '}
        <span className="text-yellow">{state.stateName}</span>
      </h1>
      <div className="flex flex-col gap-3 max-w-[800px]">
        {isLoading ? (
          <LinkSkelton />
        ) : list.length > 0 ? (
          list.map((data) => (
            <div
              className="p-2 bg-white shadow flex-between rounded-2xl"
              key={data.linkId}
            >
              <div className="flex flex-col gap-y-1 ">
                <p className="flex items-center font-semibold gap-x-2">
                  <Navigation size={16} className="mt-1" />
                  {data.label}
                </p>
                <Link
                  to={data.link}
                  target="_blank"
                  className="flex items-center text-blue-500 gap-x-3"
                >
                  <LinkIcon size={17} />
                  {data.link}
                </Link>
              </div>
              <div className="mr-3">
                <Link to={`/manage-links/edit/${data.linkId}`}>
                  <FilePenLine className="hover:text-yellow" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="mt-20 text-xl font-semibold text-center text-gray-500">
            No links found under{' '}
            <span className="italic font-bold"> {state.stateName}</span>
          </p>
        )}
      </div>

      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all ">
        <Link
          className="px-3 py-2 text-white flex-center gap-x-1 bg-yellow"
          to={`/manage-links/add`}
        >
          New Link <Plus />
        </Link>
      </button>
    </section>
  )
}
