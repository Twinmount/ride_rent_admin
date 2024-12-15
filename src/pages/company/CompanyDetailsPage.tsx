import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import CompanyForm from "@/components/form/main-form/CompanyForm";
import { Link, useParams } from "react-router-dom";
import { getCompany } from "@/api/company";

export default function CompanyDetailsPage() {
  const { companyId } = useParams<{ companyId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["company-details-page", companyId],
    queryFn: () => getCompany(companyId as string),
    enabled: !!companyId,
  });

  return (
    <section className="py-5 pt-10">
      <h1 className="mb-4 text-3xl font-bold text-center">Company Details</h1>

      {data?.result.approvalStatus === "REJECTED" && (
        <div className="p-2 text-white bg-red-400 rounded-2xl mb-4 w-full  max-w-[800px] mx-auto ">
          <h4 className="font-semibold">
            Company status is currently REJECTED,
          </h4>
          &bull; REASON : {data.result.rejectionReason}
        </div>
      )}

      {isLoading ? (
        <FormSkelton />
      ) : (
        <CompanyForm type="Update" formData={data?.result} />
      )}

      {data?.result.approvalStatus === "APPROVED" && (
        <div className="mt-5 mb-10 ml-12 text-lg font-semibold text-blue-500 hover:underline">
          <Link
            to={`/listings/add/${data?.result.userId}/${data?.result.companyId}`}
          >
            Manually add new vehicle under this company?
          </Link>
        </div>
      )}
    </section>
  );
}
