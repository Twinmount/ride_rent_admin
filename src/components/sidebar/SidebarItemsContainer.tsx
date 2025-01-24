import { sidebarContent } from "./sidebar-items";
import { SidebarItem } from "./SidebarItem";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrollArea } from "@mantine/core";
import ExcelDataDownloadModal from "../modal/ExcelDataDownloadModal";
import LogoutModal from "../modal/LogoutModal";

export default function SidebarItemsContainer({
  isSmallScreen,
}: {
  isSmallScreen: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (link: string) => {
    if (location.pathname !== link) {
      navigate(link);
    }
  };

  return (
    <SidebarItemContainerWrapper isSmallScreen={isSmallScreen}>
      {sidebarContent.map((item) =>
        item.type === "link" ? (
          <SidebarItem
            key={item.link}
            item={item}
            isActive={location.pathname === item.link}
            onClick={() => handleNavigation(item.link as string)}
          />
        ) : (
          <AccordionItem
            key={item.label}
            value={item.label}
            className="border-none no-underline"
          >
            <AccordionTrigger className="w-full max-w-full !no-underline">
              <SidebarAccordionTrigger
                item={item}
                isActive={location.pathname.startsWith(item.baseLink!)}
                onClick={() => handleNavigation(item.link as string)}
              />
            </AccordionTrigger>
            <AccordionContent>
              {item.items?.map((subItem) => (
                <SidebarItem
                  key={subItem.link}
                  item={subItem}
                  isActive={location.pathname === subItem.link}
                  onClick={() => handleNavigation(subItem.link as string)}
                  variant="accordionChild"
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ),
      )}

      {/* Data download and logout modals */}
      <ExcelDataDownloadModal />
      <LogoutModal />
    </SidebarItemContainerWrapper>
  );
}

const SidebarItemContainerWrapper = ({
  isSmallScreen,
  children,
}: {
  isSmallScreen: boolean;
  children: React.ReactNode;
}) => {
  return (
    <ScrollArea
      className={`flex h-full max-h-full min-h-full flex-col items-center gap-y-1 pl-[0.6rem] ${
        !isSmallScreen && "shadow-md"
      }`}
    >
      <Accordion type="single" collapsible className="w-[93%]">
        {children}
      </Accordion>
    </ScrollArea>
  );
};

type SidebarAccordionTriggerProps = {
  item: any;
  isActive: boolean;
  onClick: () => void;
  variant?: "default" | "accordionChild";
  isAccordionTrigger?: boolean;
};

export const SidebarAccordionTrigger = ({
  item,
  isActive,
  onClick,
  variant = "default",
}: SidebarAccordionTriggerProps) => {
  const defaultClasses = `${isActive ? "bg-slate-800 text-white" : ""}`;
  const accordionChildClasses = `text-sm pl-6 ${
    isActive ? "text-black font-semibold" : "text-gray-600 hover:text-gray-800"
  }`;

  const className =
    variant === "default" ? defaultClasses : accordionChildClasses;

  const Icon = item.icon;

  return (
    <span
      className={`flex h-11 min-h-11 w-full max-w-[90%] items-center gap-2 rounded-lg pl-2`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {Icon && <Icon className="w-5 text-xl" size={20} strokeWidth={3} />}

      {/* truncate text using javascript */}
      <span className="w-36 min-w-36 max-w-36 truncate text-ellipsis text-left no-underline">
        {item.label}
      </span>
    </span>
  );
};
