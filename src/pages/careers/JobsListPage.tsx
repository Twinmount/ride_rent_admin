import StateSkelton from "@/components/skelton/StateSkelton";
import { useQuery } from "@tanstack/react-query";
import PageHeading from "@/components/general/PageHeading";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import { useAdminContext } from "@/context/AdminContext";
import { fetchJobs } from "@/api/careers";

const CAREER_JOBS = "CAREER_JOBS";

export default function JobsListPage() {
  const { country } = useAdminContext();

  const { data, isLoading } = useQuery({
    queryKey: [CAREER_JOBS],
    queryFn: () => fetchJobs(),
  });

  const jobsResult = data?.result || [];

  return (
    <section className="container h-auto min-h-screen pb-10">
      <PageHeading heading={`Jobs List - ${country.countryName}`} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StateSkelton />
        </div>
      ) : jobsResult?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {jobsResult?.map((data: any) => <h1>hi</h1>)}
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Jobs Found!</div>
      )}

      {/* New Job Link Button */}
      <FloatingActionButton href={`/careers/jobs/add`} label="New Job" />
    </section>
  );
}
