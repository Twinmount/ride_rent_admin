import { useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { CategoryType } from "@/types/api-types/API-types";
import { useCategories } from "@/hooks/useCategories";

interface SeriesCategoryDropdownProps {
  selectedCategory?: CategoryType | null;
  setSelectedCategory: (category: CategoryType) => void;
}

export default function SeriesCategoryDropdown({
  selectedCategory,
  setSelectedCategory,
}: SeriesCategoryDropdownProps) {
  const params = useParams();

  const { categoryList: categories, isCategoryLoading: isLoading } =
    useCategories();

  // setting selected category and navigating to respective url
  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="!h-8 w-fit max-w-fit cursor-pointer !rounded-lg bg-slate-800 text-white outline-none transition-colors hover:bg-slate-900"
        disabled={isLoading || categories.length === 0}
      >
        <div className="flex items-center whitespace-nowrap rounded-lg pl-2 text-sm tracking-wider">
          {isLoading
            ? "Loading..."
            : categories.length > 0
              ? selectedCategory?.name || "Select Category"
              : "No Categories"}
          <ChevronDown className="relative ml-auto" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-8 w-44">
        <DropdownMenuLabel className="mb-2 bg-slate-100 font-bold">
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
                    ? "bg-slate-800 text-white hover:bg-slate-800"
                    : "text-black hover:bg-slate-200"
                } cursor-pointer font-semibold`}
              >
                {category.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
