import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";

function SearchComponent({
  placeholder = "search..",
}: {
  placeholder?: string;
}) {
  const [searchValue, setSearchValue] = useState(""); // Update input value immediately
  const [searchParams, setSearchParams] = useSearchParams();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  ); // Store timeout ID

  // Initialize search value from the URL if available when the component mounts
  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearchValue(initialSearch); // Sync initial input value with URL
  }, [searchParams]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value); // Immediate input update

    // Clear previous timeout if it exists
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout
    const timeoutId = setTimeout(() => {
      if (value) {
        setSearchParams({ search: value }); // Update URL with search value
      } else {
        searchParams.delete("search");
        setSearchParams(searchParams); // Remove search param if input is empty
      }
    }, 500); // 5000ms debounce delay

    setDebounceTimeout(timeoutId); // Save the new timeout ID
  };

  return (
    <div
      className={`ml-3 flex w-full max-w-[500px] flex-col justify-start gap-y-2`}
    >
      <div className="flex items-center justify-start gap-x-1">
        <Input
          type="search"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="p-regular-16 h-[40px] w-full rounded-2xl border bg-white px-4 py-3 placeholder:text-gray-500 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}

export default SearchComponent;
