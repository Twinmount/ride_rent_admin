import { useSearchParams } from "react-router-dom";

export const useGetSearchParams = ({ key = "search" }: { key: string }) => {
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get(key) || "";

  return searchQuery;
};
