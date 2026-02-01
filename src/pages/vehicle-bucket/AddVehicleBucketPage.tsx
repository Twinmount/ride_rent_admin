import PageLayout from "@/components/common/PageLayout";
import VehicleBucketForm from "@/components/form/VehicleBucketForm";
import VehicleBucketFaqForm from "@/components/form/VehicleBucketFaqForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getContentFaqsByTarget } from "@/api/content-faq";
import { useQuery } from "@tanstack/react-query";

type VehicleBucketTabs = "primary" | "faq";

export default function AddVehicleBucketPage() {
  const [activeTab, setActiveTab] = useState<VehicleBucketTabs>("primary");
  const [searchParams, setSearchParams] = useSearchParams();

  const vehicleBucketId = searchParams.get("vehicleBucketId");

  // Fetch vehicle bucket FAQs
  const { data: faqData } = useQuery({
    queryKey: ["vehicle-bucket-faqs", vehicleBucketId],
    queryFn: () => getContentFaqsByTarget(vehicleBucketId as string),
    enabled: !!vehicleBucketId,
  });

  useEffect(() => {
    if (vehicleBucketId) {
      setActiveTab("faq");
    }
  }, [vehicleBucketId]);

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

  const defaultVehicleBucketFaqData = {
    vehicleBucketId: vehicleBucketId as string,
    faqs: extractFaqs() || [],
  };

  return (
    <PageLayout heading="Add New Vehicle Bucket" shouldRenderNavigation>
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
            Bucket Details
          </TabsTrigger>
          <TabsTrigger value="faq" className="h-9 max-sm:px-2 max-sm:text-sm">
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="primary" className="flex-center">
          <VehicleBucketForm type="Add" setSearchParams={setSearchParams} />
        </TabsContent>

        <TabsContent value="faq" className="flex-center">
          {!!vehicleBucketId ? (
            <VehicleBucketFaqForm
              type="Add"
              data={defaultVehicleBucketFaqData}
            />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-6">
              <p className="text-center text-gray-500">
                Please create the vehicle bucket first to add FAQs
              </p>
              <button
                onClick={() => setActiveTab("primary")}
                className="button hover:bg-darkYellow rounded-md bg-yellow px-6 py-2 font-semibold text-white"
              >
                Create vehicle bucket first
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
