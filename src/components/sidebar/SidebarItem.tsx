type SidebarItemProps = {
  item: any;
  isActive: boolean;
  onClick: () => void;
  variant?: "default" | "accordionChild";
  isAccordionTrigger?: boolean;
};

export const SidebarItem = ({
  item,
  isActive,
  onClick,
  variant = "default",
}: SidebarItemProps) => {
  const defaultClasses = `${isActive ? "bg-slate-800 text-white" : ""}`;
  const accordionChildClasses = `text-sm pl-6 ${
    isActive ? "text-black font-semibold" : "text-gray-600 hover:text-gray-800"
  }`;

  const className =
    variant === "default" ? defaultClasses : accordionChildClasses;

  const Icon = item.icon;

  return (
    <div
      className={`flex h-11 min-h-11 w-full items-center justify-start gap-2 whitespace-nowrap rounded-lg px-4 transition-all duration-100 ease-out ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {Icon && <Icon className="text-xl" size={20} strokeWidth={3} />}
      <div className="line-clamp-1 w-full truncate">{item.label}</div>
    </div>
  );
};
