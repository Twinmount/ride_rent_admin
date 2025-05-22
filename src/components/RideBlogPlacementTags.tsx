import { blogPromotionPlacement } from "@/constants";

type RideBlogPlacementTagsProps = {
  selectedPlacementFilter: string;
  setSelectedPlacementFilter: React.Dispatch<React.SetStateAction<string>>;
};

export default function RideBlogPlacementTags({
  selectedPlacementFilter,
  setSelectedPlacementFilter,
}: RideBlogPlacementTagsProps) {
  // Function to handle category tag click
  const handleTagClick = (value: string) => {
    setSelectedPlacementFilter(value); // Update the selected category state
  };

  // map over the blogPromotionPlacement array and remove the parentheses "(...)" part from the label.
  const formattedTags = blogPromotionPlacement.map(({ label, value }) => {
    const parenIndex = label.indexOf(" (");
    return {
      label: parenIndex !== -1 ? label.slice(0, parenIndex) : label,
      value,
    };
  });

  // final array of tags
  const tags = [{ label: "All", value: "all" }, ...formattedTags];

  return (
    <>
      <div className="my-6 flex w-full flex-wrap items-center gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-xl border border-gray-300 px-2 py-[2px] transition-all hover:bg-yellow hover:text-white hover:shadow-lg ${
              selectedPlacementFilter === tag.value
                ? "bg-yellow text-white"
                : "border bg-gray-200 text-black"
            }`}
            onClick={() => handleTagClick(tag.value)}
          >
            {tag.label}
          </div>
        ))}
      </div>
    </>
  );
}
