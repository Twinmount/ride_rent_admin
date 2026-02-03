import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "@/api/vehicle-categories";
import { useEffect } from "react";

type DropdownProps = {
  value?: string; // This will be categoryId
  onChangeHandler?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  setCategoryId?: (value: string) => void;
};

const VehicleCategoryDropdown = ({
  value,
  onChangeHandler,
  placeholder = "option",
  isDisabled = false,
  setCategoryId,
}: DropdownProps) => {
  // Fetch categories using react-query
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories({ page: 1, limit: 20, sortOrder: "ASC" }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const categories = categoryData?.result?.list || [];

  // Find the selected category to display its name
  const selectedCategory = categories.find(
    (category) => category.categoryId === value,
  );

  // setCategoryId on mount
  useEffect(() => {
    setCategoryId?.(value || "");
  }, [value, setCategoryId]);

  return (
    <Select
      onValueChange={(selectedCategoryId) => {
        onChangeHandler?.(selectedCategoryId);
        setCategoryId?.(selectedCategoryId);
      }}
      value={value}
      disabled={isDisabled || isCategoryLoading}
    >
      <SelectTrigger className="select-field input-fields ring-0 focus:ring-0">
        <SelectValue
          className="!font-bold !text-black"
          placeholder={`Choose ${placeholder}`}
        >
          {selectedCategory?.name || `Choose ${placeholder}`}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {categories.map((category) => (
          <SelectItem
            key={category.categoryId}
            value={category.categoryId}
            className="select-item p-regular-14"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VehicleCategoryDropdown;
