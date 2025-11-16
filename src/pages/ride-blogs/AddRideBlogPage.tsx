import PageLayout from "@/components/common/PageLayout";
import RideBlogForm from "@/components/form/main-form/RideBlogForm";
import { useAdminContext } from "@/context/AdminContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import RideBlogFaqForm from "@/components/form/RideBlogFaqForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addRideBlogFaq } from "@/api/blogs";
import { toast } from "@/components/ui/use-toast";

export default function AddRideBlogPage() {
  const [activeTab, setActiveTab] = useState("blog");

  const { country } = useAdminContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const blogId = searchParams.get("blogId");

  useEffect(() => {
    if (blogId) {
      setActiveTab("faq");
    }
  }, [blogId]);

  const addBlogFaqMutation = useMutation({
    mutationFn: addRideBlogFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-blog", blogId] });

      toast({
        title: "Blog FAQ added successfully",
        className: "bg-yellow text-white",
      });

      navigate("/ride-blogs/list");
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
    <PageLayout
      shouldRenderNavigation={true}
      heading={`Add New Ride Blog under ${country.countryName}`}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex-center mb-6 gap-x-2 bg-transparent">
          <TabsTrigger value="blog" className="h-9 max-sm:px-2 max-sm:text-sm">
            Ride Blog
          </TabsTrigger>
          <TabsTrigger value="faq" className="h-9 max-sm:px-2 max-sm:text-sm">
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="flex-center">
          <RideBlogForm type="Add" setSearchParams={setSearchParams} />
        </TabsContent>

        <TabsContent value="faq" className="flex-center">
          {!!blogId ? (
            <RideBlogFaqForm
              type="Add"
              data={defaultRideBlogFaqData}
              mutateFunction={addBlogFaqMutation}
            />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-6">
              <p className="text-center text-gray-500">
                Please create the blog first to add FAQs
              </p>
              <button
                onClick={() => setActiveTab("series")}
                className="button hover:bg-darkYellow rounded-md bg-yellow px-6 py-2 font-semibold text-white"
              >
                Create blog first
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
