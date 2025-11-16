import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchBlogById, getRideBlogFaq, updateRideBlogFaq } from "@/api/blogs";
import RideBlogForm from "@/components/form/main-form/RideBlogForm";
import RideBlogFaqForm from "@/components/form/RideBlogFaqForm";
import { useAdminContext } from "@/context/AdminContext";
import PageLayout from "@/components/common/PageLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import FormSkelton from "@/components/skelton/FormSkelton";

type BlogTabs = "details" | "faq";

export default function EditRideBlogPage() {
  const { country } = useAdminContext();
  const { blogId } = useParams<{ blogId: string }>();
  const [activeTab, setActiveTab] = useState<BlogTabs>("details");
  const queryClient = useQueryClient();

  // Fetch blog details
  const { data: blogData, isLoading: isBlogLoading } = useQuery({
    queryKey: ["ride-blogs", blogId],
    queryFn: () => fetchBlogById(blogId as string),
  });

  // Fetch blog FAQ
  const { data: faqData, isLoading: isFaqLoading } = useQuery({
    queryKey: ["faq-blog", blogId],
    queryFn: () => getRideBlogFaq(blogId as string),
    enabled: !!blogId,
  });

  // Update FAQ mutation
  const updateBlogFaqMutation = useMutation({
    mutationFn: updateRideBlogFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-blog", blogId] });
      toast({
        title: "Blog FAQ updated successfully",
        className: "bg-yellow text-white",
      });
    },
    onError: (err) => {
      console.error("Error updating blog FAQ:", err);
      toast({
        variant: "destructive",
        title: "Error updating blog FAQ",
        description: "An error occurred while updating the blog FAQ.",
      });
    },
  });

  // Default FAQ data if none exists
  const defaultData = {
    blogId: blogId as string,
    faqs: faqData?.result?.faqs || [
      {
        question: "",
        answer: "",
      },
    ],
  };

  return (
    <PageLayout
      shouldRenderNavigation={true}
      heading={`Update Ride Blog under ${country.countryName}`}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as BlogTabs)}
        className="w-full"
      >
        <TabsList className="flex-center mb-6 gap-x-2 bg-transparent">
          <TabsTrigger
            value="details"
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            Blog Details
          </TabsTrigger>
          <TabsTrigger
            disabled={isFaqLoading}
            value="faq"
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="flex-center">
          {isBlogLoading ? (
            <FormSkelton />
          ) : (
            <RideBlogForm type="Update" formData={blogData?.result} />
          )}
        </TabsContent>

        <TabsContent value="faq" className="flex-center">
          {isFaqLoading ? (
            <FormSkelton />
          ) : (
            <RideBlogFaqForm
              type="Update"
              data={defaultData}
              mutateFunction={updateBlogFaqMutation}
            />
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
