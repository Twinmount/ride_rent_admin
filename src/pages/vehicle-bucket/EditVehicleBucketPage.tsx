import { useParams, useSearchParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";

import VehicleBucketForm from "@/components/form/VehicleBucketForm";
import VehicleBucketFaqForm from "@/components/form/VehicleBucketFaqForm";
import PageLayout from "@/components/common/PageLayout";
import { fetchVehicleBucketById } from "@/api/vehicle-bucket";
import { getContentFaqsByTarget } from "@/api/content-faq/contentFaqApi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

type VehicleBucketTabs = "primary" | "faq";

export default function EditVehicleBucketPage() {
  const { vehicleBucketId } = useParams<{ vehicleBucketId: string }>();
  const [searchParams] = useSearchParams();
  const tab = (searchParams?.get("tab") || "primary") as VehicleBucketTabs;
  const [activeTab, setActiveTab] = useState<VehicleBucketTabs>(tab);

  // Fetch vehicle bucket details
  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-bucket", vehicleBucketId],
    queryFn: () => fetchVehicleBucketById(vehicleBucketId as string),
  });

  const vehicleBucketData = data?.result;

  // Fetch vehicle bucket FAQs
  const { data: faqData, isLoading: isFaqLoading } = useQuery({
    queryKey: ["vehicle-bucket-faqs", vehicleBucketId],
    queryFn: () => getContentFaqsByTarget(vehicleBucketId as string),
    enabled: !!vehicleBucketId,
  });

  const extractFaqs = () => {
    if (!faqData) return [];
    if (Array.isArray((faqData as any)?.result?.data)) {
      return (faqData as any).result.data;
    }
    if (Array.isArray(faqData.data)) {
      return faqData.data;
    }
    return [];
  };

  const vehicleBucketFaqData = {
    vehicleBucketId: vehicleBucketId as string,
    faqs: extractFaqs(),
  };

  return (
    <PageLayout heading="Edit Vehicle Bucket" shouldRenderNavigation>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as VehicleBucketTabs)}
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
          {isLoading ? (
            <FormSkelton />
          ) : (
            <VehicleBucketForm type="Update" formData={vehicleBucketData} />
          )}
        </TabsContent>

        <TabsContent value="faq" className="flex-center">
          {isFaqLoading ? (
            <FormSkelton />
          ) : (
            <VehicleBucketFaqForm type="Update" data={vehicleBucketFaqData} />
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
