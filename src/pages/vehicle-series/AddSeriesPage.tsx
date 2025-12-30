import PageLayout from "@/components/common/PageLayout";
import VehicleSeriesForm from "@/components/form/VehicleSeriesForm";
import SeriesFaqForm from "@/components/form/SeriesFaqForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type SeriesTabs = "primary" | "faq";

export default function AddVehicleSeriesPage() {
  const [activeTab, setActiveTab] = useState<SeriesTabs>("primary");
  const [searchParams, setSearchParams] = useSearchParams();

  const seriesId = searchParams.get("seriesId");

  useEffect(() => {
    if (seriesId) {
      setActiveTab("faq");
    }
  }, [seriesId]);

  // Default FAQ data structure for new series
  const defaultSeriesFaqData = {
    seriesId: seriesId as string,
    faqs: [],
  };

  return (
    <PageLayout heading="Add New Series" shouldRenderNavigation>
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
            Series Details
          </TabsTrigger>
          <TabsTrigger value="faq" className="h-9 max-sm:px-2 max-sm:text-sm">
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="primary" className="flex-center">
          <VehicleSeriesForm type="Add" setSearchParams={setSearchParams} />
        </TabsContent>

        <TabsContent value="faq" className="flex-center">
          {!!seriesId ? (
            <SeriesFaqForm type="Add" data={defaultSeriesFaqData} />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-6">
              <p className="text-center text-gray-500">
                Please create the series first to add FAQs
              </p>
              <button
                onClick={() => setActiveTab("primary")}
                className="button hover:bg-darkYellow rounded-md bg-yellow px-6 py-2 font-semibold text-white"
              >
                Create series first
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
