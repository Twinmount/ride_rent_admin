import { useParams, useSearchParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesById } from "@/api/vehicle-series";
import VehicleSeriesForm from "@/components/form/VehicleSeriesForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SeriesPriceTable from "@/components/form/SeriesPriceTable";
import { useState } from "react";
import PageLayout from "@/components/common/PageLayout";

export default function EditBrandPage() {
  const { vehicleSeriesId } = useParams<{ vehicleSeriesId: string }>();
  const [searchParams] = useSearchParams();
  const tab = searchParams?.get("tab") || "primary";
  const [activeTab, setActiveTab] = useState(tab);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-series-by-id", vehicleSeriesId],
    queryFn: () => fetchSeriesById(vehicleSeriesId as string),
  });
  const formData = data?.result;

  return (
    <PageLayout heading="Edit Vehicle Series" shouldRenderNavigation>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex-center mb-6 gap-x-2">
          <TabsTrigger
            value="primary"
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            Primary Details
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
        <TabsContent value="price">
          <SeriesPriceTable />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
