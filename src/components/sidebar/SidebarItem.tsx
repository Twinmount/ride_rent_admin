import { Link } from "react-router-dom";
import { SidebarSubItemType } from "./sidebar-items";

type SidebarItemProps = {
  icon?: any; // Optional icon
  label: string;
  onClick?: () => void;
};

// sidebar general item which acts like a link
export const SidebarItem = ({ icon, label, onClick }: SidebarItemProps) => {
  // Default class for regular sidebar options
  const classNames = `flex h-11 min-h-11 w-full items-center justify-start gap-2 whitespace-nowrap rounded-lg pl-2 w-full truncate text-ellipsis text-left cursor-pointer no-underline`;

  const Icon = icon;

  return (
    <div className={`${classNames} `} onClick={onClick}>
      {/* Render icon if available */}
      {Icon && <Icon className="text-xl" size={20} strokeWidth={3} />}

      {/* Sidebar item label */}
      <span className="">{label}</span>
    </div>
  );
};

// sidebar accordion sub items link
export const AccordionSidebarItem = ({
  item,
  isActive,
}: {
  item: SidebarSubItemType;
  isActive: boolean;
}) => {
  const activeClassNames = `${
    isActive ? "text-black font-semibold" : "text-gray-600 hover:text-gray-800 "
  }`;

  return (
    <Link
      to={item.link}
      className={`h-9 min-h-9 w-36 min-w-36 max-w-36 items-center justify-start gap-2 truncate text-ellipsis whitespace-nowrap rounded-lg pl-6 text-left text-sm no-underline ${activeClassNames}`}
    >
      &#187; &nbsp;{item.label}
    </Link>
  );
};
