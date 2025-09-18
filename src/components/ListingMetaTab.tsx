export type ListingMetaTabType = "category" | "brand" | "vehicleType";

interface TabProps {
  activeTab: ListingMetaTabType;
  onTabChange: (tab: ListingMetaTabType) => void;
}

export const LISTING_META_TAB_CONFIG: Record<
  ListingMetaTabType,
  { label: string; description: string }
> = {
  category: {
    label: "Category",
    description: "MetaData for category-based listing pages",
  },
  vehicleType: {
    label: "Vehicle Type",
    description: "MetaData for vehicle type-based listing pages",
  },
  brand: {
    label: "Brand",
    description: "MetaData for brand-based listing pages",
  },
} as const;

export function ListingMetaTab({ activeTab, onTabChange }: TabProps) {
  const tabsLength = Object.keys(LISTING_META_TAB_CONFIG).length;

  return (
    <div className="mb-6 flex justify-center">
      <div className="inline-flex rounded-lg bg-white p-1 shadow-md">
        {Object.entries(LISTING_META_TAB_CONFIG).map(([key, config], index) => (
          <button
            key={key}
            onClick={() => onTabChange(key as ListingMetaTabType)}
            className={`rounded-md px-4 py-2 text-base font-medium transition-all duration-200 ${
              activeTab === key
                ? "bg-yellow text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            } ${index < tabsLength - 1 ? "border-r" : ""} `}
          >
            {config.label}
          </button>
        ))}
      </div>
    </div>
  );
}
