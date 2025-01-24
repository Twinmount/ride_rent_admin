import { ChevronDown, ChevronRight } from "lucide-react";

type SidebarItemProps = {
  item: any;
  isActive: boolean;
  onClick: () => void;
  variant?: "default" | "accordionChild"; // Add a prop for variant
  isAccordionTrigger?: boolean;
  isExpanded?: boolean;
};

export const SidebarItem = ({
  item,
  isActive,
  onClick,
  variant = "default",
  isAccordionTrigger = false,
  isExpanded = false,
}: SidebarItemProps) => {
  const defaultVariantClasses = `${isActive ? "bg-slate-800 text-white" : ""}`;
  const accordionChildVariantClasses = `text-sm pl-6 ${
    isActive ? "text-black font-semibold" : "text-gray-600 hover:text-gray-800"
  }`;

  const className = [
    variant === "default"
      ? defaultVariantClasses
      : accordionChildVariantClasses,
  ].join(" ");

  const Icon = item.icon;

  return (
    <div
      className={`mx-auto flex h-11 min-h-11 w-full items-center justify-start gap-2 whitespace-nowrap rounded-lg px-4 transition-all duration-100 ease-out ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {Icon && <Icon className="text-xl" size={20} strokeWidth={3} />}
      <div className="line-clamp-1 w-full truncate">{item.label}</div>
      {isAccordionTrigger && (
        <div className="ml-auto">
          {isExpanded ? (
            <ChevronDown className="text-lg" />
          ) : (
            <ChevronRight className="text-lg" />
          )}
        </div>
      )}
    </div>
  );
};
