import { ScrollArea } from "@mantine/core";
import { sidebarContent } from "./sidebar-items";
import { SidebarItem } from "./SidebarItem";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarAccordion } from "./SidebarAccordion";
import ExcelDataDownloadModal from "../modal/ExcelDataDownloadModal";
import LogoutModal from "../modal/LogoutModal";
import { useState } from "react";

export default function SidebarItemsContainer({
  isSmallScreen,
}: {
  isSmallScreen: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Centralized navigation handler
  const handleNavigation = (link: string) => {
    if (location.pathname !== link) {
      navigate(link); // Only navigate if the link differs from the current location
    }
  };

  return (
    <SidebarItemContainerWrapper isSmallScreen={isSmallScreen}>
      {sidebarContent.map((item) => {
        const isActive =
          item.link === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(
                item.link || (item.items?.[0]?.link as string),
              );
        return item.type === "link" ? (
          <SidebarItem
            key={item.link}
            item={item}
            isActive={isActive}
            onClick={() => {
              setOpenAccordion(null); // Close all accordions
              handleNavigation(item.link as string); // Navigate to the link
            }}
          />
        ) : (
          <SidebarAccordion
            key={item.label}
            item={item}
            isExpanded={openAccordion === item.label}
            onToggle={() => {
              const isExpanding = openAccordion !== item.label;
              setOpenAccordion(isExpanding ? item.label : null); // Toggle accordion
            }}
          />
        );
      })}

      {/* <download data /> */}
      <ExcelDataDownloadModal />

      {/* logout modal */}
      <LogoutModal />
    </SidebarItemContainerWrapper>
  );
}

/**
 * A wrapper component for the sidebar item container that adds a scroll area,
 * appropriate styles, and a small screen flag.
 */
const SidebarItemContainerWrapper = ({
  isSmallScreen,
  children,
}: {
  isSmallScreen: boolean;
  children: React.ReactNode;
}) => {
  return (
    <ScrollArea
      className={`flex h-full max-h-full min-h-full flex-col items-center gap-y-1 p-2 px-[0.6rem] ${
        !isSmallScreen && "shadow-md"
      }`}
    >
      {children}
    </ScrollArea>
  );
};
