import { useParams, useSearchParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchCityById } from "@/api/cities";
import { getContentFaqsByTarget } from "@/api/content-faq";
import CityForm from "@/components/form/CityForm";
import CityFaqForm from "@/components/form/CityFaqForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import PageLayout from "@/components/common/PageLayout";

type CityTabs = "primary" | "faq";

export default function EditCityPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const [searchParams] = useSearchParams();
  const tab = (searchParams?.get("tab") || "primary") as CityTabs;
  const [activeTab, setActiveTab] = useState<CityTabs>(tab);

  // Fetch city details
  const { data, isLoading } = useQuery({
    queryKey: ["cities", cityId],
    queryFn: () => fetchCityById(cityId as string),
  });
  const formData = data?.result;

  // Fetch city FAQs - retry false to avoid spamming 404 if endpoint not ready
  const {
    data: faqData,
    isLoading: isFaqLoading,
    isError: isFaqError,
  } = useQuery({
    queryKey: ["city-faqs", cityId],
    queryFn: () => getContentFaqsByTarget(cityId as string),
    enabled: !!cityId,
    retry: false, // Don't retry on 404
  });

  // Default FAQ data structure
  // API returns: { status: 'SUCCESS', result: { success: true, data: [...] }, statusCode: 200 }
  const extractFaqs = () => {
    if (!faqData || isFaqError) return [];
    // The API wrapper adds result layer: faqData.result.data contains the FAQs
    if (Array.isArray(faqData.result?.data)) {
      return faqData.result.data;
    }

    return [];
  };

  const cityFaqData = {
    cityId: cityId as string,
    faqs: extractFaqs(),
  };

  // FAQ tab should only be disabled while actively loading (not on error)
  const isFaqTabDisabled = isFaqLoading && !isFaqError;

  return (
    <PageLayout heading="Update City" shouldRenderNavigation>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as CityTabs)}
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
            disabled={isFaqTabDisabled}
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="primary">
          {isLoading ? (
            <FormSkelton />
          ) : (
            <CityForm type="Update" formData={formData} />
          )}
        </TabsContent>

        <TabsContent value="faq" className="flex-center">
          {isFaqLoading && !isFaqError ? (
            <FormSkelton />
          ) : (
            <CityFaqForm type="Update" data={cityFaqData} />
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
