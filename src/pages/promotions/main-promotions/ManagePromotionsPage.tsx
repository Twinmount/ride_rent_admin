import { useState } from "react";
import { useAdminContext } from "@/context/AdminContext";
import AdsSkelton from "@/components/skelton/AdsSkelton";
import PromotionPreviewModal from "@/components/modal/PromotionPreviewModal";
import { fetchAllPromotions } from "@/api/promotions";
import { useQuery } from "@tanstack/react-query";
import { Eye, FilePenLine, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { PromotionType } from "@/types/api-types/API-types";
import Pagination from "@/components/Pagination";
import { toast } from "@/components/ui/use-toast";

export default function ManagePromotionsPage() {
  const { state } = useAdminContext();
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionType | null>(null);
  const [page, setPage] = useState(1);
  const { country } = useAdminContext();

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

  const handleToast = () => {
    toast({
      title: "Limit of 5 promotions exceeded",
      description: `At a time, only a maximum of 5 promotions is allowed per state. Delete some to add more `,
      className: "bg-orange text-white",
    });
  };

  return (
    <section className="container h-auto min-h-screen pb-16">
      <h1 className="mt-6 text-center text-2xl font-bold sm:text-left">
        {country.countryName} - Currently Published Ads In{" "}
        <span className="text-yellow">{state.stateName}</span>
      </h1>
      <h3 className="mb-8 text-center italic text-gray-600 sm:text-left">
        This will appear as ad/promotions in the home page. At a time, maximum 5
        promotions per state allowed.
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
              className="group relative h-56 w-full overflow-hidden rounded-lg"
            >
              {/* Gradient Background */}
              <div className="flex-center absolute inset-0 z-10 gap-x-4 bg-black/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {/* preview Modal Trigger */}
                <div
                  className="group/preview flex-center z-20 cursor-pointer gap-x-1 text-white hover:text-yellow"
                  onClick={() => setSelectedPromotion(data)}
                >
                  <span className="opacity-0 group-hover/preview:opacity-100">
                    Preview
                  </span>{" "}
                  <Eye size={25} />
                </div>
                <Link
                  to={`/marketing/promotions/edit/${data.promotionId}`}
                  className="flex-center group/edit gap-x-1 text-white hover:text-yellow"
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
                className="z-0 h-full w-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-20 text-center text-xl font-semibold text-gray-500">
          No ads found under
          <span className="font-bold italic"> {state.stateName}</span>
        </p>
      )}

      {promotions.length > 5 ? (
        <button
          className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]"
          onClick={handleToast}
        >
          <span className="flex-center gap-x-1 bg-gray-500 px-3 py-2 text-white">
            New Promotion <Plus />
          </span>
        </button>
      ) : (
        <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
          <Link
            className="flex-center gap-x-1 bg-yellow px-3 py-2 text-white"
            to={`/marketing/promotions/add`}
          >
            New Promotion <Plus />
          </Link>
        </button>
      )}

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
