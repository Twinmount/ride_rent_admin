import { Skeleton } from "../ui/skeleton";

export default function TableSkelton() {
  return Array(8)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="h-14 w-full overflow-hidden rounded-lg bg-white shadow-md"
      >
        <Skeleton className="h-full w-full bg-gray-200" />
      </div>
    ));
}
