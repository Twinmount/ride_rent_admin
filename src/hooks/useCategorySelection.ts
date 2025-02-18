import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "@/api/vehicle-categories";
import { CategoryType } from "@/types/api-types/vehicleAPI-types";
import { useAdminContext } from "@/context/AdminContext";

export const useCategorySelection = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );

  const { state } = useAdminContext();

  // Fetch categories
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories", state],
    queryFn: () => fetchAllCategories({ page: 1, limit: 20, sortOrder: "ASC" }),
  });

  // Set default category to "cars"
  useEffect(() => {
    if (categoryData?.result?.list) {
      const defaultCategory = categoryData.result.list.find(
        (category) => category.value === "cars",
      );
      if (defaultCategory) {
        setSelectedCategory(defaultCategory);
      }
    }
  }, [categoryData]);

  return {
    selectedCategory,
    setSelectedCategory,
    categoryList: categoryData?.result?.list || [],
    isCategoryLoading,
    stateValue: state.stateValue,
  };
};
