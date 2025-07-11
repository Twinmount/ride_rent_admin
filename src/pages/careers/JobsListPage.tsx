import PageHeading from "@/components/general/PageHeading";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import { useAdminContext } from "@/context/AdminContext";
import { useJobList } from "@/hooks/useJobList";
import Pagination from "@/components/Pagination";

import { Link } from "react-router-dom";
import { GenericTable } from "@/components/table/GenericTable";
import { JobFormType } from "@/types/types";
import PageWrapper from "@/components/common/PageWrapper";

export default function JobsListPage() {
  const { country } = useAdminContext();

  const { isLoading, jobsResult, totalNumberOfPages, page, setPage } =
    useJobList({
      enabled: true,
    });

  const columns = [
    {
      accessorKey: "jobId",
      header: "Job Id",
      cell: (e: any) => (
        <Link
          className="font-semibold text-blue-600 hover:underline"
          to={`/careers/jobs/edit/${e.getValue()}`}
        >
          {e.getValue()}
        </Link>
      ),
    },
    {
      accessorKey: "jobtitle",
      header: "Job Title",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "experience",
      header: "Experience",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
  ];

  return (
    <PageWrapper
      heading={`Jobs List - ${country.countryName}`}
      shouldRenderNavigation={false}
    >
      <GenericTable<JobFormType>
        columns={columns}
        data={jobsResult || []}
        loading={isLoading}
        loadingText="Fetching Jobs..."
      />
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages || 1}
      />

      {/* New Job Link Button */}
      <FloatingActionButton href={`/careers/jobs/add`} label="New Job" />
    </PageWrapper>
  );
}
