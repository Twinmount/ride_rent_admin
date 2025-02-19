import { useAdminContext } from "@/context/AdminContext";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import StateSkelton from "@/components/skelton/StateSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStates } from "@/api/states";
import Pagination from "@/components/Pagination";
import { useState } from "react";

export default function ManageStatesPage() {
  const { org } = useAdminContext();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["states"],
    queryFn: fetchAllStates,
  });

  const statesResult = data?.result || [];

  return (
    <section className="container h-auto min-h-screen pb-10">
      <h1 className="mb-8 mt-6 text-center text-2xl font-bold sm:text-left">
        States Under <span className="text-yellow">{org.label}</span> Org
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <StateSkelton />
        </div>
      ) : statesResult.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.result.map((data) => (
            <Link
              to={`/locations/manage-States/edit/${data.stateId}`}
              key={data.stateId}
              className="group relative h-44 w-full overflow-hidden rounded-xl bg-white shadow-md"
            >
              <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-gradient-to-t from-black to-50%" />
              <div className="z-10 h-full w-full">
                {/* Image */}
                <img
                  src={data.stateImage}
                  alt="ad image"
                  loading="lazy"
                  className="z-20 h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                />
              </div>

              <p className="absolute bottom-0 left-1/2 z-10 mt-1 -translate-x-1/2 transform whitespace-nowrap p-0 text-center font-bold text-white">
                {data.stateName}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Locations Found!</div>
      )}

      <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center gap-x-1 bg-yellow px-3 py-2 text-white"
          to={`/locations/manage-states/add`}
        >
          New Location <Plus />
        </Link>
      </button>

      {statesResult.length > 0 && (
        <div className="mt-auto">
          <Pagination page={page} setPage={setPage} totalPages={1} />
        </div>
      )}
    </section>
  );
}
