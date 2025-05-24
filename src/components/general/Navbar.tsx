import { Link } from "react-router-dom";
import { useAdminContext } from "@/context/AdminContext";
import { Menu } from "lucide-react";
import NavbarStatesDropdown from "../NavbarStatesDropdown";
import { countryType, NavbarStateType, stateType } from "@/types/types";
import NavbarCountryDropdown from "../NavbarCountryDropdown";
import NavbarParentStatesDropdown from "../NavbarParentStatesDropdown";

type NavbarProps = {
  options: NavbarStateType[];
  countryOption: countryType[];
  isLoading: boolean;
  parentSatetOptions: stateType[];
};
const Navbar = ({
  options,
  countryOption,
  isLoading,
  parentSatetOptions,
}: NavbarProps) => {
  const { isSidebarOpen, toggleSidebar, isSmallScreen, country } =
    useAdminContext();

  return (
    <header className="flex-center fixed left-0 right-0 top-0 z-50 h-[4.84rem] border-b bg-white px-4 transition-all ease-in-out">
      <nav className="flex w-full items-center justify-between">
        <div className="flex-center w-fit gap-x-4">
          {isSmallScreen && (
            <button
              aria-label="Hamburger"
              className="flex-center group m-0 cursor-pointer border-none bg-transparent p-0 outline-none"
              onClick={toggleSidebar}
            >
              <Menu
                strokeWidth={3}
                className={`mb-1 h-[1.6rem] w-[1.6rem] transition-colors duration-100 ease-in group-hover:text-yellow`}
              />
            </button>
          )}
          <div className="w-fit p-0">
            <Link
              to={"/"}
              className="max-w-fit p-0 text-right text-sm text-gray-600"
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
            className="fixed left-0 top-0 z-[100] h-full w-full bg-black/30"
            onClick={toggleSidebar}
          />
        )}
        <div className="flex-center mr-6 gap-x-1">
          <NavbarCountryDropdown
            options={countryOption}
            isLoading={isLoading}
          />
          {country.countryValue === "India" && (
            <NavbarParentStatesDropdown
              options={parentSatetOptions}
              isLoading={isLoading}
            />
          )}
          <NavbarStatesDropdown
            options={options}
            isLoading={isLoading}
            isIndia={country.countryValue === "India"}
          />
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
