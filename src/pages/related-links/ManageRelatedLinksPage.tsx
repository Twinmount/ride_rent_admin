import { Link } from "react-router-dom";
import LinkSkelton from "@/components/skelton/LinksSkelton";
import { FilePenLine, Link as LinkIcon, Navigation, Plus } from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { fetchAllRelatedLinks } from "@/api/related-links";

export default function ManageRelatedLinksPage() {
  const { state } = useAdminContext();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["recommended-links", state],
    queryFn: () =>
      fetchAllRelatedLinks({
        page,
        limit: 10,
        sortOrder: "DESC",
        stateId: state.stateId as string,
      }),
    staleTime: 30000,
  });

  // Destructure to get the 'list' array from 'data'
  const list = data?.result?.list || [];

  return (
    <section className="container h-auto min-h-screen pb-16">
      <h1 className="mt-6 text-center text-xl font-bold sm:text-left md:text-2xl">
        Currently Active Related Links In{" "}
        <span className="text-yellow">{state.stateName}</span>
      </h1>
      <h3 className="mb-8 text-center italic text-gray-600 sm:text-left">
        This will appear as the "related links" in the vehicle details page.
      </h3>
      <div className="flex max-w-[800px] flex-col gap-3">
        {isLoading ? (
          <LinkSkelton />
        ) : list.length > 0 ? (
          list.map((data) => (
            <div
              className="flex-between w-full rounded-2xl bg-white p-2 shadow"
              key={data.linkId}
            >
              <div className="flex max-w-[90%] flex-col gap-y-1">
                <p className="flex items-center gap-x-2 font-semibold">
                  <Navigation size={16} className="mt-1" />
                  {data.label}
                </p>
                <Link
                  to={data.link}
                  target="_blank"
                  className="line-clamp-1 flex items-center gap-x-3 text-blue-500"
                >
                  <LinkIcon size={17} />
                  {data.link}
                </Link>
              </div>
              <div className="mr-3">
                <Link to={`/marketing/related-links/edit/${data.linkId}`}>
                  <FilePenLine className="hover:text-yellow" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="mt-20 text-center text-xl font-semibold text-gray-500">
            No Related links found under{" "}
            <span className="font-bold italic"> {state.stateName}</span>
          </p>
        )}
      </div>

      <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center gap-x-1 bg-yellow px-3 py-2 text-white"
          to={`/marketing/related-links/add`}
        >
          New Recommended Link <Plus />
        </Link>
      </button>

      {list.length > 0 && (
        <div className="mt-auto">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={data?.result.totalNumberOfPages || 1}
          />
        </div>
      )}
    </section>
  );
}
