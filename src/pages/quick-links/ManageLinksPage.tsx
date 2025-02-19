import { Link } from "react-router-dom";
import LinkSkelton from "@/components/skelton/LinksSkelton";
import { FilePenLine, Link as LinkIcon, Navigation, Plus } from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";
import { useQuery } from "@tanstack/react-query";
import { fetchAllLinks } from "@/api/links";
import { useState } from "react";
import Pagination from "@/components/Pagination";

export default function ManageLinksPage() {
  const { state } = useAdminContext();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["links", state],
    queryFn: () =>
      fetchAllLinks({
        page,
        limit: 10,
        sortOrder: "DESC",
        stateId: state.stateId as string,
      }),
  });

  // Destructure to get the 'list' array from 'data'
  const list = data?.result?.list || [];

  return (
    <section className="container h-auto min-h-screen pb-16">
      <h1 className="mt-6 text-center text-2xl font-bold sm:text-left">
        Currently Active Links In{" "}
        <span className="text-yellow">{state.stateName}</span>
      </h1>
      <h3 className="mb-8 text-center italic text-gray-600 sm:text-left">
        This will appear as the quick links in navbar and the footer of the
        official website
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
                <Link to={`/marketing/quick-links/edit/${data.linkId}`}>
                  <FilePenLine className="hover:text-yellow" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="mt-20 text-center text-xl font-semibold text-gray-500">
            No links found under{" "}
            <span className="font-bold italic"> {state.stateName}</span>
          </p>
        )}
      </div>

      <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center gap-x-1 bg-yellow px-3 py-2 text-white"
          to={`/marketing/quick-links/add`}
        >
          New Link <Plus />
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
