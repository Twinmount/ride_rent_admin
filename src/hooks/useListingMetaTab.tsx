import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LISTING_META_TAB_CONFIG,
  ListingMetaTabType,
} from "@/components/ListingMetaTab";

// Type guard function
function isValidTabType(tab: string | null): tab is ListingMetaTabType {
  if (!tab) return false;
  return Object.keys(LISTING_META_TAB_CONFIG).includes(tab);
}

type Args = {
  defaultTab?: ListingMetaTabType;
  isStateOrCategoryLoading?: boolean;
  selectedState?: string;
  selectedCategory?: string;
};
export function useListingMetaTab(args: Args) {
  const {
    defaultTab = "category",
    isStateOrCategoryLoading,
    selectedState,
    selectedCategory,
  } = args;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get and validate tab parameter
  const rawTab = searchParams.get("tab");
  const activeTab: ListingMetaTabType = isValidTabType(rawTab)
    ? rawTab
    : defaultTab;

  // Auto-redirect if invalid tab
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (!isValidTabType(urlTab)) {
      navigate(`/meta-data/listing?tab=${defaultTab}`);
    }
  }, [searchParams, setSearchParams, defaultTab]);

  // Function to change tabs
  const handleTabChange = (tab: ListingMetaTabType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    setSearchParams(newParams);
  };

  // Get page title based on active tab
  const pageTitle = (() => {
    const config = LISTING_META_TAB_CONFIG[activeTab];
    const arrow = String.fromCharCode(8652); // ↔ symbol

    if (isStateOrCategoryLoading) {
      return `${config.label} MetaData Listings`;
    }

    // Different title logic based on tab type
    switch (activeTab) {
      case "brand":
        // Brand is global - no state dependency
        return `${config.label} MetaData for ${selectedCategory} Listings`;

      case "category":
        return `${config.label} MetaData for ${selectedState} Listings`;

      case "vehicleType":
        // Category and Vehicle Type are state-specific
        return `${config.label} MetaData for ${selectedState} ${arrow} ${selectedCategory} Listings`;

      default:
        return `${config.label} MetaData Listings`;
    }
  })();

  // get form page title
  const getFormPageTitle = (prefix: "Add" | "Update") => {
    const config = LISTING_META_TAB_CONFIG[activeTab];
    return `${prefix} ${config.label} Listing Meta Data`;
  };

  // Get tab configuration
  const getTabConfig = () => LISTING_META_TAB_CONFIG[activeTab];

  return {
    activeTab,
    handleTabChange,
    pageTitle,
    getFormPageTitle,
    getTabConfig,
    isValidTab: isValidTabType,
  };
}
