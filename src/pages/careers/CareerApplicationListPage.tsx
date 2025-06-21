import { useState } from "react";
import PageHeading from "@/components/general/PageHeading";
import { useAdminContext } from "@/context/AdminContext";
import CareerApplicationTags from "@/components/CareerApplicationTags";
import TableSkelton from "@/components/skelton/TableSkeleton";
import { useCareerApplication } from "@/hooks/useCareerApplication";
import Pagination from "@/components/Pagination";
import ApplicationDeleteModal from "@/components/modal/ApplicationDeleteModal";

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
  } = useCareerApplication({
    enabled: true,
    selectedCategory,
  });

  const ActionButtons = ({ id, status }: { id: string; status: string }) => {
    const isNewList = status === "new";
    const isAcceptedList = status === "accepted";
    const isRejectedList = status === "rejected";

    return (
      <div className="flex gap-2">
        {(isRejectedList || isNewList) && (
          <button
            onClick={() =>
              statusUpdate.mutate({
                id,
                status: "accepted",
              })
            }
            disabled={statusUpdate?.isPending}
            className="rounded bg-green-600 px-2 py-1 text-white"
          >
            Accept
          </button>
        )}
        {(isAcceptedList || isNewList) && (
          <button
            onClick={() =>
              statusUpdate.mutate({
                id,
                status: "rejected",
              })
            }
            disabled={statusUpdate?.isPending}
            className="rounded bg-blue-800 px-2 py-1 text-white"
          >
            Reject
          </button>
        )}

        <ApplicationDeleteModal
          onDelete={() => removeApplication.mutate(id)}
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

  const applicationTypeBadge = (type: ApplicationType): JSX.Element | null => {
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

    return badgeMap[type] ?? null;
  };

  return (
    <section className="container h-auto min-h-screen pb-10">
      <PageHeading heading={`Application List - ${country.countryName}`} />

      {/* Category filter component */}
      <CareerApplicationTags
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <TableSkelton />
        </div>
      ) : applicationList?.length > 0 ? (
        <div className="">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border bg-slate-300 px-4 py-2">Sl.</th>
                <th className="border bg-slate-300 px-4 py-2">Name</th>
                <th className="border bg-slate-300 px-4 py-2">
                  Application Type
                </th>
                <th className="border bg-slate-300 px-4 py-2">Phone</th>
                <th className="border bg-slate-300 px-4 py-2">Email</th>
                <th className="border bg-slate-300 px-4 py-2">
                  Preferred Country
                </th>
                <th className="border bg-slate-300 px-4 py-2">Links</th>
                <th className="border bg-slate-300 px-4 py-2">Job Details</th>
                <th className="border bg-slate-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicationList?.map((data: any, i: number) => {
                const {
                  _id,
                  firstname,
                  lastname,
                  phone,
                  email,
                  type,
                  fileUrl,
                  jobTitle,
                  jobId,
                  linkedinprofile,
                  country,
                } = data;
                return (
                  <tr key={_id}>
                    <td className="border bg-white px-4 py-2">{++i}</td>
                    <td className="border bg-white px-4 py-2">
                      {`${firstname} ${lastname ?? ""}`}
                    </td>
                    <td className="border bg-white px-4 py-2">
                      {applicationTypeBadge(type)}
                    </td>
                    <td className="border bg-white px-4 py-2">{phone}</td>
                    <td className="border bg-white px-4 py-2">{email}</td>
                    <td className="border bg-white px-4 py-2">{country}</td>
                    <td className="border bg-white px-4 py-2">
                      <div className="flex items-center gap-6">
                        <a
                          className="flex items-center gap-1 underline"
                          href={fileUrl}
                          download
                          target="_blank"
                        >
                          <img
                            className="h-[20px] w-[20px]"
                            src="/assets/icons/file-download.svg"
                          />
                          <span>Resume</span>
                        </a>
                        {linkedinprofile && (
                          <a
                            className="flex items-center gap-1 underline"
                            href={linkedinprofile}
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
                    </td>
                    <td className="border bg-white px-4 py-2">
                      {jobTitle && jobId ? (
                        <div>
                          <p className="w-full max-w-[160px] overflow-hidden overflow-ellipsis whitespace-nowrap">
                            {jobTitle}
                          </p>
                          <p className="text-xs font-medium text-gray-500">
                            {jobId}
                          </p>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="border bg-white px-4 py-2">
                      <ActionButtons id={_id} status={selectedCategory} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-36 text-center text-2xl">No Applications Found!</div>
      )}

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages || 1}
      />
    </section>
  );
}
