import { motion } from "framer-motion";
import { SidebarItem } from "./SidebarItem";
import { useNavigate, useLocation } from "react-router-dom";

type SidebarAccordionProps = {
  item: any;
  isExpanded: boolean;
  onToggle: () => void;
};

export const SidebarAccordion = ({
  item,
  isExpanded,
  onToggle,
}: SidebarAccordionProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if any child link is active
  const isChildActive = location.pathname.startsWith(item.baseLink);

  return (
    <div>
      {/* Accordion Header */}
      <SidebarItem
        item={item}
        isActive={isChildActive}
        onClick={() => {
          const firstChildLink = item?.items[0]?.link;
          if (firstChildLink && location.pathname !== firstChildLink) {
            navigate(firstChildLink); // Navigate to the first child
          }
          onToggle();
        }}
        isAccordionTrigger={true}
        isExpanded={isExpanded}
      />

      {/* Accordion Content */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="ml-auto mt-2 w-[90%] border-l border-slate-300"
      >
        {item.items.map((subItem: any) => (
          <SidebarItem
            key={subItem.link}
            item={subItem}
            isActive={location.pathname.startsWith(subItem.link)}
            onClick={() => {
              // Navigate to the child link and close the accordion
              if (location.pathname !== subItem.link) {
                navigate(subItem.link);
              }
            }}
            variant="accordionChild"
          />
        ))}
      </motion.div>
    </div>
  );
};
