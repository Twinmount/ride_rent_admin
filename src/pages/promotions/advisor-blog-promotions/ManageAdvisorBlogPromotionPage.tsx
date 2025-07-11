import { useState } from "react";
import AdsSkelton from "@/components/skelton/AdsSkelton";
import PromotionPreviewModal from "@/components/modal/PromotionPreviewModal";
import { useQuery } from "@tanstack/react-query";
import { PromotionType } from "@/types/api-types/API-types";
import Pagination from "@/components/Pagination";
import { fetchAllAdvisorBlogPromotions } from "@/api/advisor";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import BlogPromotionCard from "@/components/card/BlogPromotionCard";
import { useAdminContext } from "@/context/AdminContext";
import PageLayout from "@/components/common/PageLayout";

export default function ManageRideBlogPromotionsPage() {
  const [page, setPage] = useState(1);
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionType | null>(null);
  const { country } = useAdminContext();

  const { data, isLoading } = useQuery({
    queryKey: ["advisor-promotions", page],
    queryFn: () =>
      fetchAllAdvisorBlogPromotions({
        page,
        limit: 10,
        sortOrder: "DESC",
      }),
  });

  // Destructure to get the 'list' array from 'data'
  const promotions = data?.result?.list || [];

  return (
    <PageLayout
      heading={`Manage Advisor Blog Promotions - ${country.countryName}`}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AdsSkelton />
        </div>
      ) : promotions.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {promotions.map((promotion) => (
            // Promotion Card
            <BlogPromotionCard
              key={promotion.promotionId}
              type="advisor"
              promotion={promotion}
              onPreview={setSelectedPromotion}
            />
          ))}
        </div>
      ) : (
        <p className="mt-20 text-center text-xl font-semibold text-gray-500">
          No Advisor Blog Promotions Found!
        </p>
      )}

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.result.totalNumberOfPages || 1}
      />

      <FloatingActionButton
        href="/advisor/promotions/add"
        label="New Advisor Blog Promotion"
      />

      {/* Render the modal once, passing the selected ad image */}
      {selectedPromotion && (
        <PromotionPreviewModal
          selectedPromotion={selectedPromotion}
          setSelectedPromotion={setSelectedPromotion}
        />
      )}
    </PageLayout>
  );
}
