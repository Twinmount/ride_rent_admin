import StateSkelton from "@/components/skelton/StateSkelton";
import PageHeading from "@/components/general/PageHeading";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import { useAdminContext } from "@/context/AdminContext";
import JobCard from "@/components/card/JobCard";
import { useJobList } from "@/hooks/useJobList";
import Pagination from "@/components/Pagination";

export default function JobsListPage() {
  const { country } = useAdminContext();

  const { isLoading, jobsResult, totalNumberOfPages, page, setPage } =
    useJobList({
      enabled: true,
    });

  return (
    <section className="container h-auto min-h-screen pb-10">
      <PageHeading heading={`Jobs List - ${country.countryName}`} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StateSkelton />
        </div>
      ) : jobsResult?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {jobsResult?.map((data: any) => (
            <JobCard job={data} key={data?._id} />
          ))}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Jobs Found!</div>
      )}

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages || 1}
      />

      {/* New Job Link Button */}
      <FloatingActionButton href={`/careers/jobs/add`} label="New Job" />
    </section>
  );
}
