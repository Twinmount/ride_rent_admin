import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

type FloatingActionButtonProps = {
  href: string;
  label: string;
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  href,
  label,
}) => {
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
