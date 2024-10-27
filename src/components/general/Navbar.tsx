import { Link } from "react-router-dom";
import { useAdminContext } from "@/context/AdminContext";
import { Menu } from "lucide-react";

import StatesDropdown from "../GeneralStatesDropdown";
import { NavbarStateType } from "@/types/types";

type NavbarProps = {
  options: NavbarStateType[];
  isLoading: boolean;
};
const Navbar = ({ options, isLoading }: NavbarProps) => {
  const { isSidebarOpen, toggleSidebar, isSmallScreen } = useAdminContext();

  return (
    <header className="px-4 fixed top-0 left-0 right-0 h-[4.84rem] border-b bg-white z-50 transition-all ease-in-out flex-center">
      <nav className="flex justify-between items-center w-full">
        <div className="gap-x-4 w-fit flex-center">
          {isSmallScreen && (
            <button
              aria-label="Hamburger"
              className="p-0 m-0 bg-transparent border-none cursor-pointer outline-none flex-center group"
              onClick={toggleSidebar}
            >
              <Menu
                strokeWidth={3}
                className={`w-[1.6rem] h-[1.6rem] transition-colors duration-100 ease-in mb-1  group-hover:text-yellow`}
              />
            </button>
          )}
          <div className="p-0 w-fit">
            <Link
              to={"/"}
              className="p-0 text-sm text-right text-gray-600 max-w-fit"
            >
              <figure className="m-0 max-sm:hidden">
                <img
                  src={"/assets/logo/header/admin.webp"}
                  className="w-32"
                  alt="Ride Rent Logo"
                />
              </figure>
            </Link>
          </div>
        </div>

        {/* sidebar */}
        {isSidebarOpen && isSmallScreen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/30 z-[100] "
            onClick={toggleSidebar}
          />
        )}

        <div className="gap-x-4 mr-6 flex-center">
          <StatesDropdown options={options} isLoading={isLoading} />
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
