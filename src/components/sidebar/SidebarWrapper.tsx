type SidebarWrapperProps = {
  isOpen: boolean;
  isSmallScreen: boolean;
  children: React.ReactNode;
};

/**
 * SidebarWrapper component renders a sidebar panel.
 *
 * @param {boolean} isOpen - Determines if the sidebar is open or closed.

 * @param {React.ReactNode} children - The content to be displayed inside the sidebar.
 */

export const SidebarWrapper = ({
  isOpen,
  isSmallScreen,
  children,
}: SidebarWrapperProps) => (
  <aside
    className={`fixed bottom-0 top-0 z-[101] h-full w-56 bg-white pt-[4.87rem] transition-all duration-300 ease-in-out ${
      isOpen ? "left-0" : "-left-56"
    } ${!isSmallScreen && "!left-0"}`}
  >
    {children}
  </aside>
);
