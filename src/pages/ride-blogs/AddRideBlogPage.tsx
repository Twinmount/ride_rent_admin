import PageLayout from "@/components/common/PageLayout";
import RideBlogForm from "@/components/form/main-form/RideBlogForm";
import { useAdminContext } from "@/context/AdminContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import RideBlogFaqForm from "@/components/form/RideBlogFaqForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { addRideBlogFaq } from "@/api/blogs";
import { toast } from "@/components/ui/use-toast";

type SeriesTabs = "series" | "faq";

export default function AddRideBlogPage() {
  const { country } = useAdminContext();
  const [activeTab, setActiveTab] = useState("series");
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const blogId = searchParams.get("blogId");

  const addBlogFaqMutation = useMutation({
    mutationFn: addRideBlogFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-blog", blogId] });

      toast({
        title: "Blog FAQ added successfully",
        className: "bg-yellow text-white",
      });
    },
    onError: (err) => {
      console.error("Error adding blog FAQ:", err);
      toast({
        variant: "destructive",
        title: "Error adding blog FAQ",
        description: "An error occurred while adding the blog FAQ.",
      });
    },
  });

  const defaultRideBlogFaqData = {
    blogId: blogId as string,
    faqs: [
      {
        question: "",
        answer: "",
      },
    ],
  };

  return (
    <PageLayout heading={`Add New Ride Blog under ${country.countryName}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex-center mb-6 gap-x-2 bg-transparent">
          <TabsTrigger
            value="series"
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            Series
          </TabsTrigger>
          <TabsTrigger value="faq" className="h-9 max-sm:px-2 max-sm:text-sm">
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="series" className="flex-center">
          <RideBlogForm type="Add" />
        </TabsContent>

        <TabsContent value="faq" className="flex-center">
          <RideBlogFaqForm
            type="Add"
            data={defaultRideBlogFaqData}
            mutateFunction={addBlogFaqMutation}
          />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
