import { Eye, FilePenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPromotionType } from "@/types/api-types/API-types";

interface BlogPromotionCardProps {
  promotion: BlogPromotionType;
  onPreview: (promotion: BlogPromotionType) => void;
  type: "ride" | "advisor";
}

export default function BlogPromotionCard({
  promotion,
  onPreview,
  type,
}: BlogPromotionCardProps) {
  const src =
    type === "ride"
      ? `/ride-blogs/promotions/edit/${promotion.promotionId}`
      : `/advisor/promotions/edit/${promotion.promotionId}`;

  return (
    <div
      key={promotion.promotionId}
      className="group relative h-72 w-full overflow-hidden rounded-lg border shadow"
    >
      {/* Hover Overlay */}
      <div className="flex-center absolute inset-0 z-10 gap-x-4 bg-black/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* Preview Trigger */}
        <div
          className="group/preview flex-center z-20 cursor-pointer gap-x-1 text-white hover:text-yellow"
          onClick={() => onPreview(promotion)}
        >
          <span className="opacity-0 group-hover/preview:opacity-100">
            Preview
          </span>
          <Eye size={25} />
        </div>
        <Link
          to={src}
          className="flex-center group/edit gap-x-1 text-white hover:text-yellow"
        >
          <FilePenLine size={23} />
          <span className="opacity-0 group-hover/edit:opacity-100">Edit</span>
        </Link>
      </div>

      <img
        src={promotion.promotionImage}
        alt="promotion image"
        loading="lazy"
        className="z-0 h-full w-full rounded-lg object-cover"
      />
    </div>
  );
}
