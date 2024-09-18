import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { CategoryType } from '@/types/api-types/API-types'

interface MetaCategoryDropdownProps {
  selectedCategory?: CategoryType | null
  setSelectedCategory: (category: CategoryType | null) => void
  categories: CategoryType[]
  isLoading: boolean
}

export default function MetaCategoryDropdown({
  selectedCategory,
  setSelectedCategory,
  categories,
  isLoading,
}: MetaCategoryDropdownProps) {
  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="!h-8 text-white bg-slate-800 text-lg outline-none cursor-pointer mx-auto my-4 w-fit max-w-fit !rounded-lg hover:bg-slate-900 hover:text-yellow transition-colors md:mr-20"
        disabled={isLoading || categories.length === 0}
      >
        <div className="flex items-center pl-2 font-bold tracking-wider rounded-lg whitespace-nowrap">
          {isLoading
            ? 'Loading...'
            : categories.length > 0
            ? selectedCategory?.name || 'Select Category'
            : 'No Categories'}
          <ChevronDown className="relative ml-auto top-2" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-8 w-44">
        <DropdownMenuLabel className="mb-2 font-bold bg-slate-100">
          Choose Category
        </DropdownMenuLabel>
        {isLoading ? (
          <DropdownMenuGroup>
            <DropdownMenuItem className="text-gray-500">
              Loading...
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : categories.length === 0 ? (
          <DropdownMenuGroup>
            <DropdownMenuItem className="text-gray-500">
              No Categories Found
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          categories.map((category) => (
            <DropdownMenuGroup key={category.categoryId}>
              <DropdownMenuItem
                onClick={() => handleCategorySelect(category)}
                className={`${
                  selectedCategory?.categoryId === category.categoryId
                    ? 'bg-slate-800 hover:bg-slate-800 text-white'
                    : 'hover:bg-slate-200 text-black'
                } font-semibold cursor-pointer`}
              >
                {category.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
