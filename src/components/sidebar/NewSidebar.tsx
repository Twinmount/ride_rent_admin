import { SidebarWrapper } from "./SidebarWrapper";
import { SidebarHeader } from "./SidebarHeader";
import { useAdminContext } from "@/context/AdminContext";
import SidebarItemsContainer from "./SidebarItemsContainer";

export const NewSidebar = () => {
  const { isSidebarOpen, toggleSidebar, isSmallScreen } = useAdminContext();

  return (
    <SidebarWrapper isOpen={isSidebarOpen} isSmallScreen={isSmallScreen}>
      {/* side bar header component with logo */}
      <SidebarHeader
        isSmallScreen={isSmallScreen}
        toggleSidebar={toggleSidebar}
      />

      {/* sidebar items */}
      <SidebarItemsContainer isSmallScreen={isSmallScreen} />
    </SidebarWrapper>
  );
};
