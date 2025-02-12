import { X } from "lucide-react";
import { Link } from "react-router-dom";

type SidebarHeaderProps = {
  isSmallScreen: boolean;
  toggleSidebar: () => void;
};

export const SidebarHeader = ({
  isSmallScreen,
  toggleSidebar,
}: SidebarHeaderProps) => (
  <div className="absolute left-0 right-0 top-0 z-10 flex h-[4.84rem] items-center justify-between border-b border-b-slate-100 bg-white p-0 px-[0.6rem]">
    <Link to={"/"} className="p-0 text-right text-sm text-gray-600">
      <figure className="ml-2">
        <img
          src={"/assets/logo/header/admin.webp"}
          className="w-32"
          alt="Ride Rent Logo"
        />
      </figure>
    </Link>

    {isSmallScreen && (
      <button
        aria-label="Sidebar Toggle"
        className="group mb-1 inline-flex cursor-pointer items-center justify-center border-none bg-transparent p-0 outline-none"
        onClick={toggleSidebar}
      >
        <X
          strokeWidth={2.5}
          className="h-8 w-8 transition-colors group-hover:text-yellow"
        />
      </button>
    )}
  </div>
);
