import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { companyColumns } from "../../components/table/columns/GeneralCompanyColumn";
import { CompanyTable } from "@/components/table/CompanyTable";
import { getAllCompany, updateCompanyStatus } from "@/api/company";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import Pagination from "@/components/Pagination";
import CompanyStatusModal from "@/components/CompanyStatusModal"; // Modal for updating company status
import { toast } from "@/components/ui/use-toast";
import { CompanyType } from "@/types/api-types/vehicleAPI-types";
import SearchComponent from "@/components/Search";
import { useSearchParams } from "react-router-dom";
import CompanyPageHeading from "./CompanyPageHeading";

interface CompanyListingPageProps {
  queryKey: string[];
  approvalStatus?: "APPROVED" | "PENDING" | "REJECTED" | "UNDER_REVIEW";
  isModified?: boolean;
  title: string;
}

export default function CompanyListingPage({
  queryKey,
  approvalStatus,
  isModified = false,
}: CompanyListingPageProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(
    null,
  );
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, page, limit, sortOrder, searchTerm],
    queryFn: () =>
      getAllCompany({
        page,
        limit,
        sortOrder,
        approvalStatus,
        edited: isModified,
        search: searchTerm.trim(),
      }),
  });

  const handleOpenModal = (company: CompanyType) => {
    setSelectedCompany(company);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
  };

  const handleSubmitModal = async (values: {
    approvalStatus: "APPROVED" | "PENDING" | "REJECTED";
    rejectionReason?: string;
  }) => {
    if (values.approvalStatus === "PENDING") {
      toast({
        variant: "destructive",
        title: "Invalid Status Change",
        description: "Cannot change status back to PENDING.",
      });
      return;
    }
    if (selectedCompany) {
      try {
        const data = await updateCompanyStatus(
          {
            approvalStatus: values.approvalStatus,
            rejectionReason: values.rejectionReason,
          },
          selectedCompany.companyId, // Pass the companyId separately
        );

        if (data) {
          queryClient.invalidateQueries({
            queryKey: [...queryKey, page, limit, sortOrder],
          });
          queryClient.invalidateQueries({
            queryKey: ["company-listing-count"],
            exact: true,
          });
          toast({
            title: "Company status updated successfully",
            className: "bg-green-500 text-white",
          });
        }

        handleCloseModal();
      } catch (error) {
        console.error("Failed to update company status:", error);
        toast({
          variant: "destructive",
          title: "Failed to update status",
          description:
            "Something went wrong while updating the company status.",
        });
      }
    }
  };

  return (
    <section className="container mx-auto min-h-screen py-5 md:py-7">
      <div className="flex-between my-2 mb-6 max-sm:flex-col">
        <CompanyPageHeading status={approvalStatus || "APPROVED"} />

        <div className="flex-between w-fit gap-x-2">
          <SortDropdown
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
          />
          <LimitDropdown
            limit={limit}
            setLimit={setLimit}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* search component */}
      <div className="mb-6">
        <SearchComponent placeholder="Search company" />
        <p className="ml-2 text-left text-sm italic text-gray-500">
          <span className="font-semibold text-gray-600">
            company name or agent id
          </span>{" "}
          can be used to search the company
        </p>
      </div>

      <CompanyTable
        columns={companyColumns(handleOpenModal)}
        data={data?.result?.list || []}
        loading={isLoading}
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.result.totalNumberOfPages as number}
      />

      {selectedCompany && (
        <CompanyStatusModal
          rejectionReason={selectedCompany.rejectionReason || ""}
          companyName={selectedCompany.companyName}
          currentStatus={selectedCompany.approvalStatus}
          isOpen={!!selectedCompany}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
        />
      )}
    </section>
  );
}
