import { useJobListQuery } from "./query/useJobListQuery";

export const useJobList = ({ enabled }: { enabled: boolean }) => {
  const { query, page, setPage } = useJobListQuery({
    enabled,
    limit: 10,
  });
  const { isLoading, data } = query;
  const jobsResult = data?.result?.list || [];
  const totalNumberOfPages = data?.result?.totalNumberOfPages;

  return {
    isLoading,
    jobsResult,
    totalNumberOfPages,
    page,
    setPage,
  };
};
