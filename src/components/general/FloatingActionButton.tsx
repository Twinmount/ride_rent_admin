import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

type FloatingActionButtonProps = {
  href: string;
  label: string;
  disabled?: boolean;
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  href,
  label,
  disabled = false,
}) => {
  if (disabled) {
    return (
      <div className="fixed bottom-10 right-10 z-30 flex h-fit w-fit cursor-not-allowed items-center gap-x-1 overflow-hidden rounded-xl bg-gray-400 px-4 py-3 text-sm font-medium text-white opacity-90 shadow-xl">
        {label}
      </div>
    );
  }

  return (
    <button className="fixed bottom-10 right-10 z-30 h-fit w-fit cursor-pointer overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.02]">
      <Link
        className="flex-center flex-center gap-x-1 bg-yellow px-3 py-2 text-white shadow-xl transition-all hover:scale-[1.02]"
        to={href}
      >
        {label} <Plus />
      </Link>
    </button>
  );
};

export default FloatingActionButton;
