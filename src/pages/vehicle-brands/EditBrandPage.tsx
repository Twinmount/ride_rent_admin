import { useParams, useSearchParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import BrandForm from "@/components/form/BrandForm";
import BrandFaqForm from "@/components/form/BrandFaqForm";
import { useQuery } from "@tanstack/react-query";
import { fetchBrandById } from "@/api/brands";
import { getContentFaqsByTarget } from "@/api/content-faq/contentFaqApi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { TabsTypes } from "@/types/types";
import PageLayout from "@/components/common/PageLayout";

export default function EditBrandPage() {
  const { brandId } = useParams<{
    brandId: string;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();

  const tab = (searchParams?.get("tab") || "primary") as TabsTypes | "faq";
  const [activeTab, setActiveTab] = useState<TabsTypes | "faq">(tab);

  const { data: brandData, isLoading: isBrandLoading } = useQuery({
    queryKey: ["brands", brandId],
    queryFn: () => fetchBrandById(brandId as string),
  });

  const { data: faqData, isLoading: isFaqLoading } = useQuery({
    queryKey: ["brand-faqs", brandId],
    queryFn: () => getContentFaqsByTarget(brandId as string),
    enabled: !!brandId,
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabsTypes | "faq");
    setSearchParams({ tab: value });
  };

  return (
    <PageLayout heading="Update Brand" shouldRenderNavigation>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex-center mb-6 gap-x-2 bg-transparent">
          <TabsTrigger
            value="primary"
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            Primary Details
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            disabled={isFaqLoading}
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="primary">
          {isBrandLoading ? (
            <FormSkelton />
          ) : (
            <BrandForm type="Update" formData={brandData?.result} />
          )}
        </TabsContent>

        <TabsContent value="faq" className="flex-center">
          {isFaqLoading ? (
            <FormSkelton />
          ) : (
            <BrandFaqForm
              type="Update"
              data={{
                faqs: faqData?.result?.data || [],
                brandId: brandId as string,
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
