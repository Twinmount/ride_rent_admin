import { useState } from "react";
import { useAdminContext } from "@/context/AdminContext";
import AdsSkelton from "@/components/skelton/AdsSkelton";
import PromotionPreviewModal from "@/components/modal/PromotionPreviewModal";
import { fetchAllPromotions } from "@/api/promotions";
import { useQuery } from "@tanstack/react-query";
import { Eye, FilePenLine, Plus } from "lucide-react";

import { Link } from "react-router-dom";
import { PromotionType } from "@/types/api-types/API-types";
import NavigationTab from "@/components/NavigationTab";
import Pagination from "@/components/Pagination";

export default function ManagePromotionsPage() {
  const { state } = useAdminContext();
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionType | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["promotions", state],
    queryFn: () =>
      fetchAllPromotions({
        page,
        limit: 10,
        sortOrder: "DESC",
        stateId: state.stateId as string,
      }),
  });

  // Destructure to get the 'list' array from 'data'
  const promotions = data?.result?.list || [];

  return (
    <section className="container pb-16 h-auto min-h-screen">
      {/* navigate between quick links and promotions */}
      <NavigationTab
        navItems={[
          { label: "Quick", to: "/marketing/quick-links" },
          { label: "Recommended ", to: "/marketing/recommended-links" },
          { label: "Promotions", to: "/marketing/promotions" },
        ]}
      />

      <h1 className="mt-6 text-2xl font-bold text-center sm:text-left">
        Currently Published Ads In{" "}
        <span className="text-yellow">{state.stateName}</span>
      </h1>
      <h3 className="mb-8 italic text-gray-600 text-center sm:text-left">
        This will appear ad/promotions appearing in the home page.
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AdsSkelton />
        </div>
      ) : promotions.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {promotions.map((data) => (
            <div
              key={data.promotionId}
              className="overflow-hidden relative w-full h-56 rounded-lg group"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 z-10 gap-x-4 opacity-0 transition-opacity duration-300 flex-center bg-black/80 group-hover:opacity-100">
                {/* preview Modal Trigger */}
                <div
                  className="z-20 gap-x-1 text-white cursor-pointer group/preview flex-center hover:text-yellow"
                  onClick={() => setSelectedPromotion(data)}
                >
                  <span className="opacity-0 group-hover/preview:opacity-100">
                    Preview
                  </span>{" "}
                  <Eye size={25} />
                </div>
                <Link
                  to={`/marketing/promotions/edit/${data.promotionId}`}
                  className="gap-x-1 text-white flex-center hover:text-yellow group/edit"
                >
                  <FilePenLine size={23} />{" "}
                  <span className="opacity-0 group-hover/edit:opacity-100">
                    Edit
                  </span>
                </Link>
              </div>

              {/* Image */}
              <img
                src={data.promotionImage}
                alt="promotion image"
                loading="lazy"
                className="object-cover z-0 w-full h-full rounded-lg"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-20 text-xl font-semibold text-center text-gray-500">
          No ads found under
          <span className="italic font-bold"> {state.stateName}</span>
        </p>
      )}

      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all ">
        <Link
          className="gap-x-1 px-3 py-2 text-white flex-center bg-yellow"
          to={`/marketing/promotions/add`}
        >
          New Promotion <Plus />
        </Link>
      </button>

      {promotions.length > 0 && (
        <div className="mt-auto">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={data?.result.totalNumberOfPages || 1}
          />
        </div>
      )}

      {/* Render the modal once, passing the selected ad image */}
      {selectedPromotion && (
        <PromotionPreviewModal
          selectedPromotion={selectedPromotion}
          setSelectedPromotion={setSelectedPromotion}
        />
      )}
    </section>
  );
}
