import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import CompanyForm from "@/components/form/main-form/CompanyForm";
import { Link, useParams } from "react-router-dom";
import { getCompany } from "@/api/company";

export default function SupplierDetailsPage() {
  const { supplierId } = useParams<{ supplierId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["supplier-details-page", supplierId],
    queryFn: () => getCompany(supplierId as string),
    enabled: !!supplierId,
  });

  if (isError) {
    throw new Error("error fetching supplier info");
  }

  const formData = data?.result
    ? {
        ...data?.result,
        expireDate: data?.result?.expireDate
          ? new Date(data.result.expireDate)
          : undefined,
      }
    : null;

  return (
    <section className="py-5 pt-10">
      <h1 className="mb-4 text-center text-3xl font-bold">
        {formData?.accountType === "individual" ? "Owner" : "Supplier"} Details
      </h1>

      {data?.result.approvalStatus === "REJECTED" && (
        <div className="mx-auto mb-4 w-full max-w-[800px] rounded-2xl bg-red-400 p-2 text-white">
          <h4 className="font-semibold">
            Supplier status is currently REJECTED,
          </h4>
          &bull; REASON : {data?.result.rejectionReason}
        </div>
      )}

      {isLoading ? (
        <FormSkelton />
      ) : (
        <CompanyForm 
          type="Update" 
          formData={formData} 
          updateId={supplierId}
          isSupplierPage={true} // Add this to enable supplier-specific button text and navigation
        />
      )}

      {data?.result.approvalStatus === "APPROVED" && (
        <div className="mb-10 ml-12 mt-5 text-lg font-semibold text-blue-500 hover:underline">
          <Link
            to={`/listings/add/${data?.result.userId}/${data?.result.companyId}`}
          >
            Manually add new vehicle under this supplier?
          </Link>
        </div>
      )}
    </section>
  );
}