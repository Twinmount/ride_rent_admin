import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSearchCompanies } from "@/api/company";
import { promotedCompanyType } from "@/types/api-types/API-types";

type PropType = {
  onSelect: (company: promotedCompanyType) => void;
};

export default function PromotedCompanySearchDropdown({ onSelect }: PropType) {
  const [search, setSearch] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Handle Debounced Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value); // Update input immediately

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeoutId = setTimeout(() => {
      if (value.length > 1) {
        // The state is already updated before the timeout, so no need to set it again
      }
    }, 700); // 700ms debounce delay

    setDebounceTimeout(timeoutId);
  };

  // Fetch search results
  const { data, isFetching } = useQuery({
    queryKey: ["search-companies", search],
    queryFn: () => fetchSearchCompanies(search),
    enabled: search.length > 1, // Only fetch if input has 3+ chars
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });

  return (
    <div className="w-full">
      <input
        type="text"
        value={search}
        onChange={handleInputChange}
        placeholder="Search for a company..."
        className="w-full rounded border px-3 py-2 text-sm"
      />

      {isFetching && <p className="text-sm text-gray-500">Searching...</p>}

      {/* Search Results Dropdown */}
      {data?.result && data.result.length > 0 ? (
        <ul className="mt-2 max-h-40 overflow-y-auto rounded border bg-white shadow">
          {data.result.map((company) => (
            <li
              key={company.companyId}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => onSelect(company)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={company.companyLogo}
                  alt={company.companyName}
                  className="h-6 w-6 rounded-full"
                />
                <span className="text-sm">{company.companyName}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        search.length > 1 &&
        !isFetching && (
          <p className="text-sm text-gray-500">No companies found.</p>
        )
      )}
    </div>
  );
}
