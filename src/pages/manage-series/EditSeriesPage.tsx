import { CircleArrowLeft } from "lucide-react";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesById } from "@/api/vehicle-series";
import VehicleSeriesForm from "@/components/form/VehicleSeriesForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SeriesPriceTable from "@/components/form/SeriesPriceTable";
import { useState } from "react";

export default function EditBrandPage() {
  const { vehicleSeriesId } = useParams<{ vehicleSeriesId: string }>();
  const [searchParams] = useSearchParams();
  const tab = searchParams?.get("tab") || "primary";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-series-by-id", vehicleSeriesId],
    queryFn: () => fetchSeriesById(vehicleSeriesId as string),
  });
  const formData = data?.result;

  return (
    <section className="container min-h-screen pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="h3-bold text-center sm:text-left">Update Series</h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex-center mb-6 gap-x-2">
          <TabsTrigger value="primary" className="h-9 max-sm:px-2 max-sm:text-sm">
            Primary Details
          </TabsTrigger>
          <TabsTrigger value="price" className="h-9 max-sm:px-2 max-sm:text-sm">
            Price Update
          </TabsTrigger>
        </TabsList>
        <TabsContent value="primary">
          {isLoading ? <FormSkelton /> : <VehicleSeriesForm type="Update" formData={formData} />}
        </TabsContent>
        <TabsContent value="price">
          <SeriesPriceTable />
        </TabsContent>
      </Tabs>
    </section>
  );
}
