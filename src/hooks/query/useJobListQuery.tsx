import { fetchJobs } from "@/api/careers";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const CAREER_JOBS = "CAREER_JOBS";

export const useJobListQuery = ({
  enabled,
  limit,
}: {
  enabled: boolean;
  limit: number;
}) => {
  const [page, setPage] = useState(1);

  return {
    query: useQuery({
      queryKey: [CAREER_JOBS, page],
      queryFn: () =>
        fetchJobs({
          page,
          limit,
        }),
      enabled,
    }),
    page,
    setPage,
  };
};
