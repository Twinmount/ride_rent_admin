import { useState } from "react";
import AdsSkelton from "@/components/skelton/AdsSkelton";
import PromotionPreviewModal from "@/components/modal/PromotionPreviewModal";
import { useQuery } from "@tanstack/react-query";
import { PromotionType } from "@/types/api-types/API-types";
import { fetchAllBlogPromotions } from "@/api/blogs";
import Pagination from "@/components/Pagination";
import FloatingActionButton from "@/components/general/FloatingActionButton";
import BlogPromotionCard from "@/components/card/BlogPromotionCard";
import RideBlogPlacementTags from "@/components/RideBlogPlacementTags";
import { useAdminContext } from "@/context/AdminContext";
import PageLayout from "@/components/common/PageLayout";

export default function ManageRideBlogPromotionsPage() {
  const [page, setPage] = useState(1);
  const [selectedPlacementFilter, setSelectedPlacementFilter] =
    useState<string>("all");
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionType | null>(null);

  const { country } = useAdminContext();

  // Prepare the request body
  const requestBody: any = {
    page: page.toString(),
    limit: "10",
    sortOrder: "DESC",
  };

  // Conditionally add blogCategory if selectedTag is valid
  if (
    selectedPlacementFilter &&
    selectedPlacementFilter.toLowerCase() !== "all"
  ) {
    requestBody.blogPromotionPlacement = [selectedPlacementFilter];
  }

  const { data, isLoading } = useQuery({
    queryKey: ["blog-promotions", selectedPlacementFilter, page],
    queryFn: () => fetchAllBlogPromotions(requestBody),
  });

  // Destructure to get the 'list' array from 'data'
  const promotions = data?.result?.list || [];

  return (
    <PageLayout
      heading={`Manage Ride Blog Promotions - ${country.countryName}`}
    >
      <RideBlogPlacementTags
        selectedPlacementFilter={selectedPlacementFilter}
        setSelectedPlacementFilter={setSelectedPlacementFilter}
      />

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
              type="ride"
              promotion={promotion}
              onPreview={setSelectedPromotion}
            />
          ))}
        </div>
      ) : (
        <p className="mt-20 text-center text-xl font-semibold text-gray-500">
          No Ride Blog Promotions Found!
        </p>
      )}

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.result.totalNumberOfPages || 1}
      />

      {/* Render the modal once, passing the selected ad image */}
      {selectedPromotion && (
        <PromotionPreviewModal
          selectedPromotion={selectedPromotion}
          setSelectedPromotion={setSelectedPromotion}
        />
      )}

      <FloatingActionButton
        href="/ride-blogs/promotions/add"
        label="New Blog Promotion"
      />
    </PageLayout>
  );
}
