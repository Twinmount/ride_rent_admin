import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSearchCompanies } from "@/api/company";
import { promotedCompanyType } from "@/types/api-types/API-types";

type PropType = {
  onSelect: (company: promotedCompanyType) => void;
  selectedCompanyId: string | null | undefined;
};

export default function PromotedCompanySearchDropdown({
  onSelect,
  selectedCompanyId,
}: PropType) {
  const [search, setSearch] = useState(""); // Updates instantly as user types
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Updates after debounce delay

  // Handle input change (updates instantly)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Debounce logic: Updates `debouncedSearch` after 700ms delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 700);

    return () => clearTimeout(timeoutId); // Cleanup previous timeout
  }, [search]);

  // Fetch search results using `debouncedSearch`
  const { data, isFetching } = useQuery({
    queryKey: ["search-companies", debouncedSearch],
    queryFn: () => fetchSearchCompanies(debouncedSearch),
    enabled: debouncedSearch.length > 1, // Fetch only if input has 2+ chars
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

      <p className="text-sm text-gray-500">
        Search with company name, agent id, email or phone number
      </p>

      {isFetching && <p className="text-sm text-gray-500">Searching...</p>}

      {/* Search Results Dropdown */}
      {data?.result && data.result.length > 0 ? (
        <ul className="mt-2 max-h-40 overflow-y-auto rounded border bg-white shadow">
          {data.result.map((company) => (
            <li
              key={company.companyId}
              className={`h-16 cursor-pointer rounded-md border px-4 py-2 hover:bg-gray-100 ${
                selectedCompanyId === company.companyId ? "border-black" : ""
              }`}
              onClick={() => onSelect(company)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={company.companyLogo}
                  alt={company.companyName}
                  className="h-6 w-1/6 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm">{company.companyName}</span>
                  <span>{company.agentId}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        debouncedSearch.length > 1 &&
        !isFetching && (
          <p className="text-sm text-red-400">No companies found.</p>
        )
      )}
    </div>
  );
}
