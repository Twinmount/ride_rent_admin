import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Type,
  AlignLeft,
  FilePenLine,
} from "lucide-react";
import { Link } from "react-router-dom";
import { truncateText } from "@/helpers";
import {
  HomeMetaListData,
  ListingMetaListData,
} from "@/types/api-types/API-types";

// Define props for the SeoData component
interface SeoDataProps {
  item: HomeMetaListData | ListingMetaListData;
  link: string;
}

export default function SeoData({ item, link }: SeoDataProps) {
  // Local state for expanding/collapsing
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expand/collapse state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      key={item.metaDataId}
      className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-4 shadow-md"
    >
      {/* state and category tags */}
      <div className="mb-3 flex items-center gap-x-3">
        {item.state && (
          <span className="rounded-[0.5rem] bg-gray-800 px-3 py-0 text-sm text-white">
            {item.state}
          </span>
        )}
        <span className="rounded-[0.5rem] bg-gray-800 px-3 py-0 text-sm text-white">
          {item.category}
        </span>
        {(item as ListingMetaListData).type && (
          <span className="rounded-[0.5rem] bg-gray-800 px-3 py-0 text-sm text-white">
            {(item as ListingMetaListData).type}
          </span>
        )}

        {(item as ListingMetaListData).brand && (
          <span className="rounded-[0.5rem] bg-gray-800 px-3 py-0 text-sm text-white">
            {(item as ListingMetaListData).brand}
          </span>
        )}
      </div>

      {/* meta title and meta description */}
      <div className="flex w-full flex-col items-start rounded-lg md:flex-row">
        <div className="w-full">
          {/* Meta Title Section */}
          <div className="mb-4 flex items-start justify-start">
            <div className="w-6">
              <Type className="mr-3 h-5 w-5 text-gray-800" />
            </div>
            <p className="text-gray-800">
              {isExpanded ? item.metaTitle : truncateText(item.metaTitle, 80)}
            </p>
          </div>

          {/* Meta Description Section */}
          <div className="flex items-start justify-start">
            <div className="w-6">
              <AlignLeft className="mr-3 h-5 w-5 text-gray-800" />
            </div>
            <p
              className={`text-wrap text-sm text-gray-600 ${!isExpanded && "line-clamp-1"}`}
            >
              {isExpanded
                ? item.metaDescription
                : truncateText(item.metaDescription, 100)}{" "}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <div className="flex h-20 w-7 flex-col items-center justify-between rounded-full p-0 max-md:ml-auto max-md:mt-2 max-md:h-7 max-md:w-fit max-md:flex-row md:ml-4 md:mt-0">
          <Link to={link}>
            <FilePenLine className="hover:text-yellow" />
          </Link>

          <ExpandCollapseButton
            isExpanded={isExpanded}
            toggleExpand={toggleExpand}
            item={item}
            link={link}
          />
        </div>
      </div>
    </div>
  );
}

// Component for expand/collapse button + edit link
const ExpandCollapseButton = ({
  isExpanded,
  toggleExpand,
}: {
  isExpanded: boolean;
  toggleExpand: () => void;
  item: HomeMetaListData;
  link: string;
}) => {
  return (
    <button
      className="hover:bg-yellow-600 flex items-center rounded-md px-4 py-2 font-semibold text-black transition"
      onClick={toggleExpand}
      aria-label={isExpanded ? "Collapse content" : "Expand content"}
    >
      {isExpanded ? (
        <ChevronUp className="h-7 w-7 rounded-full bg-slate-800 text-white hover:bg-slate-900" />
      ) : (
        <ChevronDown className="h-7 w-7 rounded-full bg-slate-800 text-white hover:bg-slate-900" />
      )}
    </button>
  );
};
