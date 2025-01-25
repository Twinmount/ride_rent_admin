import { SidebarHeader } from "./SidebarHeader";
import { useAdminContext } from "@/context/AdminContext";
import SidebarItemsContainer from "./SidebarItemsContainer";

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, isSmallScreen } = useAdminContext();

  return (
    <SidebarWrapper isOpen={isSidebarOpen} isSmallScreen={isSmallScreen}>
      <SidebarHeader
        isSmallScreen={isSmallScreen}
        toggleSidebar={toggleSidebar}
      />

      {/* sidebar items */}
      <SidebarItemsContainer isSmallScreen={isSmallScreen} />
    </SidebarWrapper>
  );
};

// type for SidebarWrapper component
type SidebarWrapperProps = {
  isOpen: boolean;
  isSmallScreen: boolean;
  children: React.ReactNode;
};

/**
 SidebarWrapper component with styling.
 */
const SidebarWrapper = ({
  isOpen,
  isSmallScreen,
  children,
}: SidebarWrapperProps) => (
  <aside
    className={`fixed bottom-0 top-0 z-[101] h-full w-56 bg-white pt-[5.4rem] transition-all duration-300 ease-in-out ${
      isOpen ? "left-0" : "-left-56"
    } ${!isSmallScreen && "!left-0"}`}
  >
    {children}
  </aside>
);
