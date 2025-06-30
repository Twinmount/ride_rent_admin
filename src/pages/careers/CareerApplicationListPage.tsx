import { useState } from "react";
import PageHeading from "@/components/general/PageHeading";
import { useAdminContext } from "@/context/AdminContext";
import CareerApplicationTags from "@/components/CareerApplicationTags";
import { useCareerApplication } from "@/hooks/useCareerApplication";
import Pagination from "@/components/Pagination";
import ApplicationDeleteModal from "@/components/modal/ApplicationDeleteModal";
import { CommonListingTable } from "@/components/table/CommonListingTable";
import { ApplicationTypeDropdown } from "@/components/ApplicationTypeDropdown";
import { ApplicationTypes } from "@/types/types";
import { Link } from "react-router-dom";

export default function CareerApplicationListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("new");
  const { country } = useAdminContext();

  const {
    isLoading,
    applicationList,
    statusUpdate,
    removeApplication,
    totalNumberOfPages,
    page,
    setPage,
    type,
    setType,
  } = useCareerApplication({
    enabled: true,
    selectedCategory,
  });

  const ActionButtons = ({ row }: { row: any }) => {
    const isNewList = selectedCategory === "new";
    const isAcceptedList = selectedCategory === "accepted";
    const isRejectedList = selectedCategory === "rejected";

    return (
      <div className="flex gap-2">
        {(isRejectedList || isNewList) && (
          <button
            onClick={() =>
              statusUpdate.mutate({
                id: row.original._id,
                status: "accepted",
              })
            }
            disabled={statusUpdate?.isPending}
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md !bg-yellow bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Accept
          </button>
        )}
        {(isAcceptedList || isNewList) && (
          <button
            onClick={() =>
              statusUpdate.mutate({
                id: row.original._id,
                status: "rejected",
              })
            }
            disabled={statusUpdate?.isPending}
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md !bg-gray-800 bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Reject
          </button>
        )}

        <ApplicationDeleteModal
          onDelete={() => removeApplication.mutate(row.original._id)}
          title="Delete application?"
          description="Are you sure you want to delete this application? This cannot be undone"
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={removeApplication?.isPending}
          navigateTo="/careers/applications"
        />
      </div>
    );
  };

  type ApplicationType = "intern" | "career";

  const ApplicationTypeBadge = (value: ApplicationType): JSX.Element | null => {
    const badgeMap: Record<ApplicationType, JSX.Element> = {
      intern: (
        <span className="select-none rounded bg-rose-100 px-2 py-1 text-rose-700">
          Intern
        </span>
      ),
      career: (
        <span className="select-none rounded bg-green-100 px-2 py-1 text-green-700">
          Career
        </span>
      ),
    };

    return badgeMap[value] ?? null;
  };

  const Links = ({ row }: { row: any }) => {
    return (
      <div className="flex items-center gap-6">
        <a
          className="flex items-center gap-1 underline"
          href={row.original.fileUrl}
          download
          target="_blank"
        >
          <img
            className="h-[20px] w-[20px]"
            src="/assets/icons/file-download.svg"
          />
          <span>Resume</span>
        </a>
        {row.original.linkedinprofile && (
          <a
            className="flex items-center gap-1 underline"
            href={row.original.linkedinprofile}
            target="_blank"
          >
            <img
              className="h-[20px] w-[20px]"
              src="/assets/icons/linkedin.svg"
            />
            <span>Linkedin</span>
          </a>
        )}
      </div>
    );
  };

  const jobDetails = ({ row }: { row: any }) => {
    return (
      <>
        {row.original.jobTitle && row.original.jobId ? (
          <div>
            <p className="w-full max-w-[160px] overflow-hidden overflow-ellipsis whitespace-nowrap">
              {row.original.jobTitle}
            </p>
            <p className="text-sm font-normal text-gray-500">
              JobId:{" "}
              <Link
                className="text-blue-600 hover:underline"
                to={`/careers/jobs/edit/${row.original.jobId}`}
              >
                {row.original.jobId}
              </Link>
            </p>
          </div>
        ) : (
          "N/A"
        )}
      </>
    );
  };

  const columns = [
    {
      id: "candidatename",
      header: "Candidate Name",
      cell: ({ row }: { row: any }) => (
        <span>
          {`${row.original.firstname} ${row.original.lastname ?? ""}`}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Application Type",
      cell: (e: any) => ApplicationTypeBadge(e.getValue()),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: (e: any) => <span>{e.getValue() ? e.getValue() : "N/A"}</span>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "expectedCTC",
      header: "Asked CTC",
      cell: (e: any) => <span>{e.getValue() ? e.getValue() : "N/A"}</span>,
    },
    {
      accessorKey: "experience",
      header: "Experience CTC",
      cell: (e: any) => <span>{e.getValue() ? e.getValue() : "N/A"}</span>,
    },
    {
      accessorKey: "country",
      header: "Preferred Country",
    },
    {
      id: "links",
      header: "Links",
      cell: Links,
    },
    {
      id: "jobdetails",
      header: "Job Details",
      cell: jobDetails,
    },
    {
      accessorKey: "collegename",
      header: "College Name",
      cell: (e: any) => <span>{e.getValue() ? e.getValue() : "N/A"}</span>,
    },
    {
      accessorKey: "placementofficer",
      header: "Placement Officer Contact",
      cell: (e: any) => <span>{e.getValue() ? e.getValue() : "N/A"}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ActionButtons,
    },
  ];

  return (
    <section className="container h-auto min-h-screen pb-10">
      <PageHeading heading={`Application List - ${country.countryName}`} />

      <div className="flex w-full items-center justify-between">
        {/* Category filter component */}
        <CareerApplicationTags
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <ApplicationTypeDropdown
          type={type as ApplicationTypes}
          setType={setType}
          isLoading={isLoading}
        />
      </div>

      <CommonListingTable
        columns={columns}
        data={applicationList || []}
        loading={isLoading}
        cellMaxWidth="max-w-auto"
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages || 1}
      />
    </section>
  );
}
