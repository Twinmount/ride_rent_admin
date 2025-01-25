import { useAdminContext } from "@/context/AdminContext";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCities } from "@/api/cities";

import GridSkelton from "@/components/skelton/GridSkelton";

export default function ManageCitiesPage() {
  const { state } = useAdminContext();

  const { data, isLoading } = useQuery({
    queryKey: ["cities", state],
    queryFn: () => fetchAllCities(state.stateId as string),
  });

  const cities = data?.result || [];

  return (
    <section className="container h-auto min-h-screen pb-10">
      <h1 className="mb-8 mt-6 text-center text-2xl font-bold sm:text-left">
        Cities Under <span className="text-yellow">{state.stateName}</span>
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <GridSkelton type="brand" />
        </div>
      ) : cities.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cities.map((data) => (
            <Link
              to={`/locations/manage-cities/edit/${data.cityId}`}
              key={data.cityId}
              className="flex-center h-14 w-full overflow-hidden rounded-xl border bg-white text-center text-base shadow-md hover:border-yellow hover:text-yellow"
            >
              {data.cityName}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Cities Found!</div>
      )}

      <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center gap-x-1 bg-yellow px-3 py-2 text-white"
          to={`/locations/manage-cities/add`}
        >
          New City <Plus />
        </Link>
      </button>
    </section>
  );
}
