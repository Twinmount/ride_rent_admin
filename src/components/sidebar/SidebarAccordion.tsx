import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SidebarAccordionType } from "../../constants/sidebar-items";
import { AccordionSidebarItem } from "./SidebarItem";

type SidebarAccordionProps = {
  item: SidebarAccordionType;
  location: any;
};

export default function SidebarAccordion({
  item,
  location,
}: SidebarAccordionProps) {
  return (
    <AccordionItem
      key={item.label}
      value={item.label}
      className="my-1 border-none no-underline"
    >
      <AccordionTrigger
        className={`h-11 min-h-11 w-full max-w-full rounded-lg pr-1 !no-underline transition-colors ${location.pathname.startsWith(item.baseLink!) ? "bg-slate-800 text-white" : "bg-white hover:bg-slate-100"}`}
      >
        <SidebarAccordionTrigger
          icon={item.icon}
          label={item.label}
          // onClick={() => handleNavigation(item?.items?.[0]?.link)}
        />
      </AccordionTrigger>
      <AccordionContent className="ml-auto mr-1 mt-1 flex !h-fit !max-h-fit !min-h-fit w-[86%] flex-col items-start justify-center rounded-r-lg border-l border-l-gray-400 bg-gray-100/50 pt-3">
        {item.items?.map((subItem) => (
          <AccordionSidebarItem
            key={subItem.link}
            item={subItem}
            isActive={location.pathname.startsWith(subItem.link)}
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
