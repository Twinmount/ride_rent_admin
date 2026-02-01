import { Link } from "react-router-dom";
import { SidebarFeatureStatusType, SidebarSubItemType } from "./sidebar-config";

type SidebarItemProps = {
  icon?: any; // Optional icon
  label: string;
  onClick?: () => void;
  featureStatus?: SidebarFeatureStatusType;
};

// sidebar general item which acts like a link
export const SidebarItem = ({
  icon,
  label,
  onClick,
  featureStatus,
}: SidebarItemProps) => {
  // Default class for regular sidebar options
  const classNames = `flex h-11 min-h-11 w-full items-center justify-start gap-2 whitespace-nowrap rounded-lg pl-2 w-full truncate text-ellipsis text-left cursor-pointer no-underline`;

  const Icon = icon;

  return (
    <div className={`${classNames} relative`} onClick={onClick}>
      {Icon && <Icon className="text-xl" size={20} strokeWidth={3} />}

      <span className="truncate">{label}</span>

      {featureStatus && (
        <span className="pointer-events-none absolute right-2 top-3 rounded px-1.5 py-0.5 text-[9px] font-semibold leading-none text-yellow">
          {featureStatus}
        </span>
      )}
    </div>
  );
};

// sidebar accordion sub items link
export const AccordionSidebarItem = ({
  item,
  isActive,
  featureStatus,
}: {
  item: SidebarSubItemType;
  isActive: boolean;
  featureStatus?: SidebarFeatureStatusType;
}) => {
  const activeClassNames = `${
    isActive ? "text-black font-semibold" : "text-gray-600 hover:text-gray-800 "
  }`;

  return (
    <Link
      to={item.link}
      className={`relative flex h-9 min-h-9 w-full max-w-[98%] items-center truncate rounded-lg pl-6 pr-6 text-left text-sm no-underline ${activeClassNames}`}
    >
      &#187;&nbsp;
      <span className="truncate">{item.label}</span>
      {featureStatus && (
        <span className="pointer-events-none absolute right-1 top-2 rounded px-1 text-[8px] font-semibold leading-none text-orange">
          {featureStatus}
        </span>
      )}
    </Link>
  );
};
