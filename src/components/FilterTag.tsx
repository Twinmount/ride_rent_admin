import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterTagProps {
  label: string;
  onClear: () => void;
  className?: string;
}

export default function FilterTag({
  label,
  onClear,
  className,
}: FilterTagProps) {
  return (
    <Badge
      variant="outline"
      className={`flex h-8 items-center gap-1 rounded-full border bg-primary/5 px-3 text-sm font-medium text-primary hover:bg-primary/10 ${className}`}
    >
      <span className="line-clamp-1 max-w-28 truncate">{label}</span>
      <X
        size={16}
        strokeWidth={3}
        className="cursor-pointer text-primary hover:text-primary/80"
        onClick={onClear}
      />
    </Badge>
  );
}
