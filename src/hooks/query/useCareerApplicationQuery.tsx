import { fetchApplications } from "@/api/careers";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const CAREER_APPLICATIONS = "CAREER_APPLICATIONS";

export const useCareerApplicationQuery = ({
  enabled,
  selectedCategory,
  limit,
}: {
  enabled: boolean;
  selectedCategory: string;
  limit: number;
}) => {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>("all");

  return {
    query: useQuery({
      queryKey: [CAREER_APPLICATIONS, selectedCategory, page, type],
      queryFn: () =>
        fetchApplications({
          status: selectedCategory,
          page,
          limit,
          type,
        }),
      enabled,
    }),
    page,
    setPage,
    type,
    setType,
  };
};
