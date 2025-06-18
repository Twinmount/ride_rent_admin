type Status = {
  value: string;
  label: string;
};

const applicationStatusList: Status[] = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "accepted",
    label: "Accepted",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
];

type BlogCategoryTagsProps = {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
};

export default function CareerApplicationTags({
  selectedCategory,
  setSelectedCategory,
}: BlogCategoryTagsProps) {
  // Function to handle application status tag click
  const handleTagClick = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <div className="my-6 flex w-full flex-wrap items-center gap-2">
      {applicationStatusList?.map(({ value, label }) => (
        <div
          key={value}
          className={`cursor-pointer rounded-xl border border-gray-300 px-2 py-[2px] transition-all hover:bg-yellow hover:text-white hover:shadow-lg ${
            selectedCategory === value
              ? "bg-yellow text-white"
              : "border bg-gray-200 text-black"
          }`}
          onClick={() => handleTagClick(value)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
