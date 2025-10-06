import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SidebarAccordionType } from "./sidebar-config";

import { AccordionSidebarItem } from "./SidebarItem";

type SidebarAccordionProps = {
  item: SidebarAccordionType;
  location: any;
};

export default function SidebarAccordion({
  item,
  location,
}: SidebarAccordionProps) {
  // Helper function to check if sub-item matches current location with query params
  const isSubItemActive = (subItemLink: string) => {
    const [basePath, queryString] = subItemLink.split("?");

    // Check if pathname matches
    if (location.pathname !== basePath) return false;

    // If the link has query parameters, check if they match current URL
    if (queryString) {
      const expectedParams = new URLSearchParams(queryString);
      const currentParams = new URLSearchParams(location.search);

      // Check if all expected params are present in current URL
      for (const [key, value] of expectedParams.entries()) {
        if (currentParams.get(key) !== value) return false;
      }
    }

    return true;
  };

  return (
    <AccordionItem
      key={item.label}
      value={item.label}
      className="my-1 border-none no-underline"
    >
      <AccordionTrigger
        className={`h-11 min-h-11 w-full max-w-full rounded-lg pr-1 !no-underline transition-colors ${
          // Check if any sub-item is active for header highlighting
          item.items?.some((subItem) => isSubItemActive(subItem.link))
            ? "bg-slate-800 text-white"
            : "bg-white hover:bg-slate-100"
        }`}
      >
        <SidebarAccordionTrigger icon={item.icon} label={item.label} />
      </AccordionTrigger>
      <AccordionContent className="ml-auto mr-1 mt-1 flex !h-fit !max-h-fit !min-h-fit w-[86%] flex-col items-start justify-center rounded-r-lg border-l border-l-gray-400 bg-gray-100/50 pt-3">
        {item.items?.map((subItem) => (
          <AccordionSidebarItem
            key={subItem.link}
            item={subItem}
            isActive={isSubItemActive(subItem.link)} // Use enhanced function
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}


//  type for accordion trigger component
type SidebarAccordionTriggerProps = {
  icon?: any; // Optional icon
  label: string;
};

// Trigger component for Accordion with custom styling
const SidebarAccordionTrigger = ({
  icon,
  label,
}: SidebarAccordionTriggerProps) => {
  // Default class for regular sidebar options
  const classNames = `flex h-11 min-h-11 w-full items-center justify-start gap-2 whitespace-nowrap rounded-lg pl-2 w-full truncate text-ellipsis text-left cursor-pointer no-underline`;

  const Icon = icon;

  return (
    <div className={`${classNames} `}>
      {/* Render icon if available */}
      {Icon && <Icon className="text-xl" size={20} strokeWidth={3} />}

      {/* Sidebar item label */}
      <span className="">{label}</span>
    </div>
  );
};
