import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import CompanyForm from "@/components/form/main-form/CompanyForm";
import { Link, useParams } from "react-router-dom";
import { getCompany } from "@/api/company";
import { useState } from "react";
import { Users, Plus } from "lucide-react";
import { useManagers, useDeleteManager } from "@/hooks/useManagers";
import ManagerCard from "@/components/cards/ManagerCard";
import AddManagerDialog from "@/components/dialog/AddManagerDialog";
import type { Manager } from "@/types/manager-types";
import { MAX_MANAGERS } from "@/types/manager-types";
import { toast } from "@/components/ui/use-toast";

export default function CompanyDetailsPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);
  const [managerToEdit, setManagerToEdit] = useState<Manager | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["company-details-page", companyId],
    queryFn: () => getCompany(companyId as string),
    enabled: !!companyId,
    staleTime: 0,
    gcTime: 0,
  });

  const agentId = data?.result?.agentId;

  const { data: managers = [], isLoading: isManagersLoading } =
    useManagers(agentId);

  const {
    mutate: deleteManager,
    isPending: isDeletingManager,
    variables: deletingManagerId,
  } = useDeleteManager(agentId ?? "");

  const handleDeleteManager = (manager: Manager) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${manager.name}" from your managers?`,
      )
    )
      return;
    deleteManager(manager.id, {
      onError: () =>
        toast({ title: "Failed to delete manager", variant: "destructive" }),
    });
  };

  if (isError) {
    throw new Error("error fetching company info");
  }

  const formData = data?.result
    ? {
        ...data?.result,
        updatedAt:
          data?.result?.updatedAt ||
          (data?.result as any)?.updatedDate ||
          (data?.result as any)?.modifiedAt,
        expireDate: data?.result?.expireDate
          ? new Date(data.result.expireDate)
          : undefined,
      }
    : null;

  return (
    <section className="py-5 pt-10">
      <h1 className="mb-4 text-center text-3xl font-bold">
        {formData?.accountType === "individual" ? "Owner" : "Company"} Details
      </h1>

      {data?.result.approvalStatus === "REJECTED" && (
        <div className="mx-auto mb-4 w-full max-w-[800px] rounded-2xl bg-red-400 p-2 text-white">
          <h4 className="font-semibold">
            Company status is currently REJECTED,
          </h4>
          &bull; REASON : {data.result.rejectionReason}
        </div>
      )}

      {isLoading ? (
        <FormSkelton />
      ) : (
        <CompanyForm type="Update" formData={formData} />
      )}

      {data?.result.approvalStatus === "APPROVED" && (
        <div className="mb-10 ml-12 mt-5 text-lg font-semibold text-blue-500 hover:underline text-center">
          <Link
            to={`/listings/add/${data?.result.userId}/${data?.result.companyId}`}
          >
            Manually add new vehicle under this company?
          </Link>
        </div>
      )}

      {/* ── Managers Section ── */}
      {agentId && (
        <div className="w-full max-w-[800px] mx-auto mb-10 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start text-left">
          <div className="flex w-full items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow/10">
                <Users className="h-4 w-4 text-yellow" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-semibold text-gray-900 leading-tight">
                  Managers
                </h3>
                <p className="text-xs text-gray-400">
                  {managers.length}/{MAX_MANAGERS} managers
                </p>
              </div>
            </div>
            {managers.length < MAX_MANAGERS && (
              <button
                onClick={() => {
                  setManagerToEdit(null);
                  setIsManagerDialogOpen(true);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-yellow hover:text-darkYellow transition-colors border-none outline-none bg-transparent"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Manager
              </button>
            )}
          </div>

          {isManagersLoading ? (
            <div className="flex w-full justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow border-t-transparent" />
            </div>
          ) : managers.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-8 text-center">
              <Users className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No managers added yet.</p>
              <p className="text-xs text-gray-300 mt-1">
                Managers can be assigned to vehicles.
              </p>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-3">
              {managers.map((manager) => (
                <ManagerCard
                  key={manager.id}
                  manager={manager}
                  onEdit={(m) => {
                    setManagerToEdit(m);
                    setIsManagerDialogOpen(true);
                  }}
                  onDelete={handleDeleteManager}
                  isDeleting={
                    isDeletingManager && deletingManagerId === manager.id
                  }
                />
              ))}
            </div>
          )}

          <AddManagerDialog
            open={isManagerDialogOpen}
            onOpenChange={setIsManagerDialogOpen}
            agentId={agentId}
            managerToEdit={managerToEdit}
          />
        </div>
      )}
    </section>
  );
}
