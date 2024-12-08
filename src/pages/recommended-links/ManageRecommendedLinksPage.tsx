import { Link } from "react-router-dom";
import LinkSkelton from "@/components/skelton/LinksSkelton";
import { FilePenLine, Link as LinkIcon, Navigation, Plus } from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";
import { useQuery } from "@tanstack/react-query";
import NavigationTab from "@/components/NavigationTab";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { fetchAllRecommendedLinks } from "@/api/recommended-links";

export default function ManageRecommendedLinksPage() {
  const { state } = useAdminContext();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["recommended-links", state],
    queryFn: () =>
      fetchAllRecommendedLinks({
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
    <section className="container pb-16 h-auto min-h-screen">
      {/* navigate between quick links and promotions */}
      <NavigationTab
        navItems={[
          { label: "Quick", to: "/marketing/quick-links" },
          { label: "Recommended ", to: "/marketing/recommended-links" },
          { label: "Promotions", to: "/marketing/promotions" },
        ]}
      />

      <h1 className="mt-6 text-xl font-bold text-center md:text-2xl sm:text-left">
        Currently Active Recommended Links In{" "}
        <span className="text-yellow">{state.stateName}</span>
      </h1>
      <h3 className="mb-8 italic text-gray-600 text-center sm:text-left">
        This will appear as the "related links" in the vehicle details page.
      </h3>
      <div className="flex flex-col gap-3 max-w-[800px]">
        {isLoading ? (
          <LinkSkelton />
        ) : list.length > 0 ? (
          list.map((data) => (
            <div
              className="p-2 w-full bg-white rounded-2xl shadow flex-between"
              key={data.linkId}
            >
              <div className="flex flex-col gap-y-1 max-w-[90%]">
                <p className="flex gap-x-2 items-center font-semibold">
                  <Navigation size={16} className="mt-1" />
                  {data.label}
                </p>
                <Link
                  to={data.link}
                  target="_blank"
                  className="flex gap-x-3 items-center text-blue-500 line-clamp-1"
                >
                  <LinkIcon size={17} />
                  {data.link}
                </Link>
              </div>
              <div className="mr-3">
                <Link to={`/marketing/recommended-links/edit/${data.linkId}`}>
                  <FilePenLine className="hover:text-yellow" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="mt-20 text-xl font-semibold text-center text-gray-500">
            No Recommended links found under{" "}
            <span className="italic font-bold"> {state.stateName}</span>
          </p>
        )}
      </div>

      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all ">
        <Link
          className="gap-x-1 px-3 py-2 text-white flex-center bg-yellow"
          to={`/marketing/recommended-links/add`}
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
