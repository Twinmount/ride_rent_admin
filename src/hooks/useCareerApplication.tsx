import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CAREER_APPLICATIONS,
  useCareerApplicationQuery,
} from "./query/useCareerApplicationQuery";
import { toast } from "@/components/ui/use-toast";
import { removeApplicationById, updateApplicationStatus } from "@/api/careers";

export const useCareerApplication = ({
  enabled,
  selectedCategory,
}: {
  enabled: boolean;
  selectedCategory: string;
}) => {
  const queryClient = useQueryClient();

  const { query, page, setPage, type, setType } = useCareerApplicationQuery({
    enabled,
    selectedCategory,
    limit: 10,
  });
  const { isLoading, data } = query;
  const applicationList = data?.result?.list || [];
  const totalNumberOfPages = data?.result?.totalNumberOfPages;

  const statusUpdate = useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      toast({
        title: "Application status updated successfully",
        className: "bg-yellow text-white",
      });
      queryClient.invalidateQueries({
        queryKey: [CAREER_APPLICATIONS, selectedCategory],
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Application status updation failed",
      });
    },
  });

  const removeApplication = useMutation({
    mutationFn: removeApplicationById,
    onSuccess: () => {
      toast({
        title: "Application deleted successfully",
        className: "bg-yellow text-white",
      });
      queryClient.invalidateQueries({
        queryKey: [CAREER_APPLICATIONS, selectedCategory],
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Application delete failed",
      });
    },
  });

  return {
    isLoading,
    applicationList,
    statusUpdate,
    removeApplication,
    totalNumberOfPages,
    page,
    setPage,
    type,
    setType,
  };
};
