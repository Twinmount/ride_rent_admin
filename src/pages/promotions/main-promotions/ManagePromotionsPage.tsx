import { useState } from "react";
import { useAdminContext } from "@/context/AdminContext";
import {
  fetchAllPromotions,
  deletePromotion,
  togglePromotionStatus,
} from "@/api/promotions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, FilePenLine, Plus, Trash2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PromotionType } from "@/types/api-types/API-types";
import Pagination from "@/components/Pagination";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import PromotionPreviewModal from "@/components/modal/PromotionPreviewModal";

export default function ManagePromotionsPage() {
  const { state, country } = useAdminContext();
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionType | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["promotions", state, page],
    queryFn: () =>
      fetchAllPromotions({
        page,
        limit: 10,
        sortOrder: "DESC",
        stateId: state.stateId as string,
      }),
  });

  const promotions = data?.result?.list || [];

  // Toggle active status mutation
  const { mutateAsync: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: async (promotionId: string) => {
      await togglePromotionStatus(promotionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast({
        title: "Status Updated",
        description: "Promotion status was updated successfully.",
        className: "bg-yellow text-white",
      });
    },
    onError: (error) => {
      console.error("Error toggling status:", error);
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "An error occurred while updating the promotion status.",
      });
    },
  });

  // Delete mutation
  const { mutateAsync: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: async (promotionId: string) => {
      await deletePromotion(promotionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast({
        title: "Promotion Deleted",
        description: "The promotion was deleted successfully.",
        className: "bg-yellow text-white",
      });
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      console.error("Error deleting:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: "An error occurred while deleting the promotion.",
      });
    },
  });

  const handleCardClick = (promotionId: string) => {
    navigate(`/marketing/promotions/edit/${promotionId}`);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await handleDelete(deleteConfirmId);
    }
  };

  return (
    <section className="container h-auto min-h-screen px-4 pb-16 sm:px-6">
      <h1 className="mt-6 text-center text-xl font-bold sm:text-left sm:text-2xl">
        {country.countryName} - Currently Published Ads In{" "}
        <span className="text-yellow">{state.stateName}</span>
      </h1>
      <h3 className="mb-6 text-center text-sm italic text-gray-600 sm:mb-8 sm:text-left">
        These will appear as ads/promotions on the home page.
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      ) : promotions.length > 0 ? (
        <div className="space-y-3">
          {promotions.map((promo) => (
            <div
              key={promo.promotionId}
              onClick={() => handleCardClick(promo.promotionId)}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-yellow hover:shadow-md sm:p-4"
            >
              {/* Mobile Layout: Stack vertically */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {/* Thumbnail + Info Row */}
                <div className="flex items-center gap-3 sm:flex-1">
                  {/* Thumbnail */}
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-24">
                    <img
                      src={promo.promotionImage}
                      alt="Promotion"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 sm:text-base">
                      {promo.title || "Untitled Promotion"}
                    </p>
                    <p className="truncate text-xs text-gray-500 sm:text-sm">
                      {promo.subtitle || promo.promotionLink}
                    </p>
                    <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 sm:text-xs">
                      {promo.type}
                    </span>
                  </div>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                  {/* Active Toggle */}
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-gray-600 sm:text-sm">
                      Active
                    </span>
                    <Switch
                      checked={promo.active !== false}
                      onCheckedChange={() => toggleStatus(promo.promotionId)}
                      disabled={isToggling}
                      className="data-[state=checked]:bg-yellow"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPromotion(promo);
                      }}
                      className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      title="Preview"
                    >
                      <Eye size={16} className="sm:h-[18px] sm:w-[18px]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/marketing/promotions/edit/${promo.promotionId}`,
                        );
                      }}
                      className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600"
                      title="Edit"
                    >
                      <FilePenLine
                        size={16}
                        className="sm:h-[18px] sm:w-[18px]"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(promo.promotionId);
                      }}
                      className="rounded-full p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} className="sm:h-[18px] sm:w-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-20 text-center text-lg font-semibold text-gray-500 sm:text-xl">
          No ads found under
          <span className="font-bold italic"> {state.stateName}</span>
        </p>
      )}

      {/* Add Button */}
      <button className="fixed bottom-6 right-6 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02] sm:bottom-10 sm:right-10">
        <Link
          className="flex-center gap-x-1 bg-yellow px-3 py-2 text-sm text-white sm:text-base"
          to={`/marketing/promotions/add`}
        >
          New Promotion <Plus size={18} />
        </Link>
      </button>

      {/* Pagination */}
      {promotions.length > 0 && (
        <div className="mt-6">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={data?.result.totalNumberOfPages || 1}
          />
        </div>
      )}

      {/* Preview Modal */}
      {selectedPromotion && (
        <PromotionPreviewModal
          selectedPromotion={selectedPromotion}
          setSelectedPromotion={setSelectedPromotion}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                Delete Promotion
              </h2>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="text-gray-400 hover:text-gray-600"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6 text-sm text-gray-600 sm:text-base">
              Are you sure you want to delete this promotion? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
