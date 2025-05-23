import { rideBlogCategoryTags, advisorBlogCategoryTags } from "@/constants";

type BlogCategoryTagsProps = {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  type: "ride" | "advisor";
};

export default function BlogCategoryTags({
  selectedCategory,
  setSelectedCategory,
  type,
}: BlogCategoryTagsProps) {
  // Function to handle category tag click
  const handleTagClick = (value: string) => {
    setSelectedCategory(value); // Update the selected category state
  };

  // tags array to map over
  const tags = type === "ride" ? rideBlogCategoryTags : advisorBlogCategoryTags;

  return (
    <div className="my-6 flex w-full flex-wrap items-center gap-2">
      {tags.map((category, index) => (
        <div
          key={index}
          className={`cursor-pointer rounded-xl border border-gray-300 px-2 py-[2px] transition-all hover:bg-yellow hover:text-white hover:shadow-lg ${
            selectedCategory === category.value
              ? "bg-yellow text-white"
              : "border bg-gray-200 text-black"
          }`}
          onClick={() => handleTagClick(category.value)}
        >
          {category.label}
        </div>
      ))}
    </div>
  );
}
