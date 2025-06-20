import { fetchApplications } from "@/api/careers";
import { useQuery } from "@tanstack/react-query";

export const CAREER_APPLICATIONS = "CAREER_APPLICATIONS";

export const useCareerApplicationQuery = ({
  enabled,
  selectedCategory,
}: {
  enabled: boolean;
  selectedCategory: string;
}) => {
  return useQuery({
    queryKey: [CAREER_APPLICATIONS, selectedCategory],
    queryFn: () => fetchApplications(selectedCategory),
    enabled,
  });
};
