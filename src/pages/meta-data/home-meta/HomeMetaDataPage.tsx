import { useQuery } from "@tanstack/react-query";
import { fetchHomeMetaList } from "@/api/meta-data";
import LazyLoader from "@/components/skelton/LazyLoader";
import SeoData from "@/components/general/SeoData";
import { useAdminContext } from "@/context/AdminContext";

export default function HomeMetaData() {
  const { state } = useAdminContext();

  // Fetch meta data using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["home-meta-data", state.stateId],
    queryFn: () =>
      fetchHomeMetaList({
        page: 1,
        limit: 20,
        sortOrder: "ASC",
        stateId: state.stateId,
      }),
  });

  const seoData = data?.result?.list || [];

  return (
    <section className="h-auto min-h-screen w-full bg-gray-100 py-10">
      <h1 className="mb-5 text-center text-2xl font-semibold lg:ml-6 lg:text-left lg:text-3xl">
        Showing HomePage meta-data under {state.stateName} for all 11 categories
      </h1>
      <div className="container max-w-4xl space-y-3">
        {isLoading ? (
          <LazyLoader />
        ) : seoData.length === 0 ? (
          <div className="flex h-screen justify-center pt-36 text-2xl font-semibold">
            No Data Found !
          </div>
        ) : (
          seoData.map((item) => (
            <SeoData
              key={item.metaDataId}
              item={item}
              link="/meta-data/home/edit"
            />
          ))
        )}
      </div>

      {/* <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
        <Link
          className="flex-center flex-center gap-x-1 bg-yellow px-3 py-2 text-white shadow-xl transition-all hover:scale-[1.02]"
          to={`/meta-data/home/add`}
        >
          New Home Meta <Plus />
        </Link>
      </button> */}
    </section>
  );
}
