import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

type LinkButtonProps = {
  link: string;
  label: string;
  className?: string;
};

export default function LinkButton({
  link,
  label,
  className,
}: LinkButtonProps) {
  return (
    <Link
      to={link}
      className={`flex-center group flex h-10 items-center gap-x-2 rounded-lg bg-white px-3 text-yellow shadow-lg transition-colors duration-300 ease-in-out hover:bg-yellow hover:text-white ${className}`}
      aria-label={label}
    >
      <span className="text-gray-800 transition-colors group-hover:text-white">
        {label}
      </span>{" "}
      <Plus />
    </Link>
  );
}
