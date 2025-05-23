import React, { useMemo } from "react";
import { sidebarContent } from "../../constants/sidebar-items";
import { SidebarItem } from "./SidebarItem";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrollArea } from "@mantine/core";
import ExcelDataDownloadModal from "../modal/ExcelDataDownloadModal";
import LogoutModal from "../modal/LogoutModal";
import SidebarAccordion from "./SidebarAccordion";

export default function SidebarItemsContainer({
  isSmallScreen,
}: {
  isSmallScreen: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (link: string) => {
    navigate(link);
  };

  // Determine the default open accordion based on the current location
  const defaultOpenAccordion = useMemo(() => {
    return sidebarContent.find(
      (item) =>
        item.type === "accordion" &&
        item.items.some((subItem) => subItem.link === location.pathname),
    )?.label;
  }, [location.pathname]);

  // Function to determine if an item is active
  const isItemActive = (itemLink: string, label: string) => {
    // Special case for "Dashboard"
    if (label === "Dashboard") {
      return location.pathname === itemLink;
    }
    // General case
    return location.pathname.startsWith(itemLink);
  };
  return (
    <SidebarItemContainerWrapper
      isSmallScreen={isSmallScreen}
      defaultValue={defaultOpenAccordion}
    >
      {sidebarContent.map((item) =>
        item.type === "link" ? (
          <AccordionItem
            key={item.link}
            value={item.label}
            className="border-none no-underline"
          >
            <AccordionTrigger
              className={`h-11 min-h-11 w-full max-w-full rounded-lg pr-1 !no-underline transition-colors ${isItemActive(item.link, item.label) ? "bg-slate-800 text-white" : "hover:bg-slate-100"}`}
              showChevron={false}
            >
              {/* Wrap SidebarItem in AccordionItem */}
              <SidebarItem
                icon={item.icon}
                label={item.label}
                onClick={() => {
                  handleNavigation(item.link);
                }}
              />
            </AccordionTrigger>
          </AccordionItem>
        ) : (
          <SidebarAccordion key={item.label} item={item} location={location} />
        ),
      )}

      {/* Data download and logout modals */}
      <ExcelDataDownloadModal />
      <LogoutModal />
    </SidebarItemContainerWrapper>
  );
}

// wrapper for sidebar items which includes the Accordion* and ScrollArea component from shadcn
const SidebarItemContainerWrapper = ({
  isSmallScreen,
  children,
  defaultValue,
}: {
  isSmallScreen: boolean;
  children: React.ReactNode;
  defaultValue?: string;
}) => {
  return (
    <ScrollArea
      className={`flex h-full max-h-full min-h-full flex-col items-center gap-y-2 pb-3 pl-[0.6rem] ${
        !isSmallScreen && "shadow-md"
      }`}
      type="auto"
    >
      {/* shadcn accordion wrapper for all the child accordion items elements */}
      <Accordion
        type="single"
        defaultValue={defaultValue}
        collapsible
        className="w-[93%]"
      >
        {children}
      </Accordion>
    </ScrollArea>
  );
};
