import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import StateSkelton from "@/components/skelton/StateSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCountries } from "@/api/states";
import Pagination from "@/components/Pagination";
import { useState } from "react";

export default function ManageCountryPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["countries-list-and-edit"],
    queryFn: () => fetchAllCountries(),
    enabled: true,
  });

  const countriesResult = data?.result || [];

  return (
    <section className="container h-auto min-h-screen pb-10">
      <div className="flex items-center justify-between">
        <h1 className="mb-8 mt-6 text-center text-2xl font-bold sm:text-left">
          Countries
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <StateSkelton />
        </div>
      ) : countriesResult.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.result.map((data) => (
            <Link
              to={`/locations/manage-countries/edit/${data.countryId}`}
              key={data.countryId}
              className="group relative h-44 w-full overflow-hidden rounded-xl bg-white shadow-md"
            >
              <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-gradient-to-t from-black to-50%" />
              <p className="absolute bottom-0 left-1/2 z-10 mt-1 -translate-x-1/2 transform whitespace-nowrap p-0 text-center font-bold text-white">
                {data.countryName}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Countries Found!</div>
      )}

      <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center gap-x-1 bg-yellow px-3 py-2 text-white"
          to={"/locations/manage-countries/add"}
        >
          New Country <Plus />
        </Link>
      </button>

      {countriesResult.length > 0 && (
        <div className="mt-auto">
          <Pagination page={page} setPage={setPage} totalPages={1} />
        </div>
      )}
    </section>
  );
}
