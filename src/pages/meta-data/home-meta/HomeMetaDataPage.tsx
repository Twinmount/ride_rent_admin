import { useQuery } from "@tanstack/react-query";
import { fetchHomeMetaList } from "@/api/meta-data";
import LazyLoader from "@/components/skelton/LazyLoader";
import SeoData from "@/components/general/SeoData";
import { useAdminContext } from "@/context/AdminContext";
import PageHeading from "@/components/general/PageHeading";

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
      <PageHeading
        heading={`Showing HomePage meta-data under ${state.stateName} for all 11 categories`}
      />

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
    </section>
  );
}
