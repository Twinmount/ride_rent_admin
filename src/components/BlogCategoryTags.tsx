import { categoryTags } from '@/constants'

type BlogCategoryTagsProps = {
  selectedCategory: string
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
}

export default function BlogCategoryTags({
  selectedCategory,
  setSelectedCategory,
}: BlogCategoryTagsProps) {
  // Function to handle category tag click
  const handleTagClick = (value: string) => {
    setSelectedCategory(value) // Update the selected category state
  }

  return (
    <div className="flex flex-wrap items-center w-full gap-2 my-6">
      {categoryTags.map((category, index) => (
        <div
          key={index}
          className={`px-2 py-[2px] rounded-xl border border-gray-300 cursor-pointer hover:bg-yellow hover:text-white transition-all hover:shadow-lg ${
            selectedCategory === category.value
              ? 'bg-yellow text-white'
              : 'bg-gray-200 border text-black'
          }`}
          onClick={() => handleTagClick(category.value)}
        >
          {category.label}
        </div>
      ))}
    </div>
  )
}
