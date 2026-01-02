import { useParams, useSearchParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesById } from "@/api/vehicle-series";
import { getSeriesFaqs } from "@/api/content-faq";
import VehicleSeriesForm from "@/components/form/VehicleSeriesForm";
import SeriesFaqForm from "@/components/form/SeriesFaqForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SeriesPriceTable from "@/components/form/SeriesPriceTable";
import { useState } from "react";
import PageLayout from "@/components/common/PageLayout";

type SeriesTabs = "primary" | "faq" | "price";

export default function EditBrandPage() {
  const { vehicleSeriesId } = useParams<{ vehicleSeriesId: string }>();
  const [searchParams] = useSearchParams();
  const tab = (searchParams?.get("tab") || "primary") as SeriesTabs;
  const [activeTab, setActiveTab] = useState<SeriesTabs>(tab);

  // Fetch series details
  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-series-by-id", vehicleSeriesId],
    queryFn: () => fetchSeriesById(vehicleSeriesId as string),
  });
  const formData = data?.result;

  // Fetch series FAQs
  const { data: faqData, isLoading: isFaqLoading } = useQuery({
    queryKey: ["series-faqs", vehicleSeriesId],
    queryFn: () => getSeriesFaqs(vehicleSeriesId as string),
    enabled: !!vehicleSeriesId,
  });

  // Default FAQ data structure
  // API returns: { status: 'SUCCESS', result: { success: true, data: [...] }, statusCode: 200 }
  const extractFaqs = () => {
    if (!faqData) return [];
    // The API wrapper adds result layer: faqData.result.data contains the FAQs
    if (Array.isArray((faqData as any)?.result?.data)) {
      return (faqData as any).result.data;
    }
    if (Array.isArray(faqData.data)) {
      return faqData.data;
    }
    return [];
  };

  const seriesFaqData = {
    seriesId: vehicleSeriesId as string,
    faqs: extractFaqs(),
  };

  return (
    <PageLayout heading="Edit Vehicle Series" shouldRenderNavigation>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SeriesTabs)}
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
          <TabsTrigger value="price" className="h-9 max-sm:px-2 max-sm:text-sm">
            Price Update
          </TabsTrigger>
        </TabsList>

        <TabsContent value="primary">
          {isLoading ? (
            <FormSkelton />
          ) : (
            <VehicleSeriesForm type="Update" formData={formData} />
          )}
        </TabsContent>

        <TabsContent value="faq" className="flex-center">
          {isFaqLoading ? (
            <FormSkelton />
          ) : (
            <SeriesFaqForm type="Update" data={seriesFaqData} />
          )}
        </TabsContent>

        <TabsContent value="price">
          <SeriesPriceTable />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
