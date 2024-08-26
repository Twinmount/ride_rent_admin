import { useNavigate, useParams } from 'react-router-dom'
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

interface CategoryDropdownProps {
  selectedCategory?: CategoryType
  setSelectedCategory: (category: CategoryType) => void
  type: 'brand' | 'type'
  categories: CategoryType[]
  isLoading: boolean
}

export default function CategoryDropdown({
  selectedCategory,
  setSelectedCategory,
  type,
  categories,
  isLoading,
}: CategoryDropdownProps) {
  const params = useParams()
  const navigate = useNavigate()

  // setting selected category and navigating to respective url
  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category)
    if (type === 'type') {
      navigate(`/manage-types/${category.categoryId}`)
    } else if (type === 'brand') {
      navigate(`/manage-brands/${category.categoryId}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="!h-10 text-white outline-none cursor-pointer w-36 !rounded-3xl bg-slate-900"
        disabled={isLoading || categories.length === 0}
      >
        <div className="flex items-center h-12 pl-4 pr-1 font-semibold tracking-wider rounded-lg whitespace-nowrap">
          {isLoading
            ? 'Loading...'
            : categories.length > 0
            ? selectedCategory?.name || 'Select Category'
            : 'No Categories'}
          <ChevronDown className="ml-auto" />
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
                  category.categoryId === params.vehicleCategoryId
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
