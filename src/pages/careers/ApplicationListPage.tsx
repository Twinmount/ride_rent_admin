import StateSkelton from "@/components/skelton/StateSkelton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApplications, updateApplicationStatus } from "@/api/careers";
import { useState } from "react";
import PageHeading from "@/components/general/PageHeading";
import { useAdminContext } from "@/context/AdminContext";
import CareerApplicationTags from "@/components/CareerApplicationTags";
import { toast } from "@/components/ui/use-toast";

const CAREER_APPLICATIONS = "CAREER_APPLICATIONS";

export default function ApplicationListPage() {
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<string>("new");
  const { country } = useAdminContext();

  const { data, isLoading } = useQuery({
    queryKey: [CAREER_APPLICATIONS, selectedCategory],
    queryFn: () => fetchApplications(selectedCategory),
  });

  const statusUpdate = useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      toast({
        title: "Application status updated successfully",
        className: "bg-yellow text-white",
      });
      queryClient.invalidateQueries({
        queryKey: [CAREER_APPLICATIONS, selectedCategory],
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Application status updation failed",
      });
    },
  });

  const ActionButtons = ({ id, status }: { id: string; status: string }) => {
    const isNewList = status === "new";
    const isAcceptedList = status === "accepted";
    const isRejectedList = status === "rejected";

    return (
      <>
        {(isRejectedList || isNewList) && (
          <button
            onClick={() =>
              statusUpdate.mutate({
                id,
                status: "accepted",
              })
            }
            disabled={statusUpdate?.isPending}
            className="mr-2 rounded bg-green-600 p-1 text-white"
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
            className="rounded bg-red-600 p-1 text-white"
          >
            Reject
          </button>
        )}
      </>
    );
  };

  const applicationList = data?.result || [];

  return (
    <section className="container h-auto min-h-screen pb-10">
      <PageHeading heading={`Application List - ${country.countryName}`} />

      {/* Category filter component */}
      <CareerApplicationTags
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StateSkelton />
        </div>
      ) : applicationList?.length > 0 ? (
        <div className="">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border bg-gray-200 px-4 py-2">Sl.</th>
                <th className="border bg-gray-200 px-4 py-2">Name</th>
                <th className="border bg-gray-200 px-4 py-2">Type</th>
                <th className="border bg-gray-200 px-4 py-2">Phone</th>
                <th className="border bg-gray-200 px-4 py-2">Email</th>
                <th className="border bg-gray-200 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicationList?.map((data: any, i: number) => {
                const { _id, firstname, lastname, phone, email, type } = data;
                return (
                  <tr>
                    <td className="border px-4 py-2">{++i}</td>
                    <td className="border px-4 py-2">{`${firstname} ${lastname ?? ""}`}</td>
                    <td className="border px-4 py-2">{type}</td>
                    <td className="border px-4 py-2">{phone}</td>
                    <td className="border px-4 py-2">{email}</td>
                    <td className="border px-4 py-2">
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
    </section>
  );
}
