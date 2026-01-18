import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";

type SearchBoxProps = {
  placeholder?: string;
  searchDescription?: string;
  className?: string;
};

function SearchBox({
  placeholder = "search..",
  searchDescription,
  className,
}: SearchBoxProps) {
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
    <div className={`mb-5 ${className}`}>
      <div
        className={`flex w-full min-w-96 max-w-[500px] flex-col justify-start gap-y-2`}
      >
        <Input
          type="search"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="p-regular-16 h-[40px] w-full rounded-2xl border bg-white px-4 py-3 placeholder:text-gray-500 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
      </div>
      {!!searchDescription && (
        <p className="ml-2 text-left text-sm italic text-gray-500">
          {searchDescription}
        </p>
      )}
    </div>
  );
}

export default SearchBox;
