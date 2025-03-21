import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "@/api/vehicle-categories";
import { CategoryType } from "@/types/api-types/API-types";

type DropdownProps = {
  value?: string; // This will be categoryId
  onChangeHandler?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

const VehicleCategoryDropdown = ({
  value,
  onChangeHandler,
  placeholder = "option",
  isDisabled = false,
}: DropdownProps) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  // Fetch categories using react-query
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAllCategories({ page: 1, limit: 20, sortOrder: "ASC" }),
  });

  const categoryList = categoryData?.result?.list || [];

  useEffect(() => {
    if (isSuccess && categoryData) {
      setCategories(categoryList);

      // If initial value exists, use it; otherwise, select the "cars" as the default category or simply the first one
      const initialCategoryId =
        value ||
        categoryList.find((c) => c.value === "cars")?.categoryId ||
        categoryList[0]?.categoryId;

      setSelectedCategoryId(initialCategoryId);
      if (onChangeHandler) {
        onChangeHandler(initialCategoryId);
      }
    }
  }, [categoryData, isSuccess, value, onChangeHandler]);

  // Find the selected category's name based on the selectedCategoryId
  const selectedCategoryName = categories.find(
    (category) => category.categoryId === selectedCategoryId,
  )?.name;

  return (
    <Select
      onValueChange={(selectedValue) => {
        // Find the selected category by name
        const selectedCategory = categories.find(
          (category) => category.name === selectedValue,
        );
        // Pass the categoryId to the form handler
        if (selectedCategory) {
          setSelectedCategoryId(selectedCategory.categoryId);
          if (onChangeHandler) {
            onChangeHandler(selectedCategory.categoryId);
          }
        }
      }}
      value={selectedCategoryName || ""}
      disabled={isDisabled || isCategoryLoading}
    >
      <SelectTrigger className="select-field input-fields ring-0 focus:ring-0">
        <SelectValue
          className="!font-bold !text-black"
          placeholder={`Choose ${placeholder}`}
        >
          {selectedCategoryName || `Choose ${placeholder}`}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category.categoryId}
              value={category.name} // Display the name in the dropdown
              className="select-item p-regular-14"
            >
              {category.name} {/* Show the name in the UI */}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default VehicleCategoryDropdown;
