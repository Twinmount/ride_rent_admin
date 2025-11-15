import { useParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useQuery } from "@tanstack/react-query";

import { fetchCountryById, getHomePageBanner } from "@/api/states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";
import LazyLoader from "@/components/skelton/LazyLoader";
import HomepageBannerForm from "@/components/form/HomepageBannerForm";
import CountryForm from "@/components/form/CountryForm";
import RidePromotionForm from "@/components/form/RidePromotionForm";
import { fetchAllRidePromotions } from "@/api/ride-promotions";
import { ContentFor } from "@/types/types";
import PageLayout from "@/components/common/PageLayout";

type TabsTypes = "primary" | "faq" | "banner" | "ride-promotion";

export default function EditCountryPage() {
  const { countryId } = useParams<{ countryId: string }>();
  const [activeTab, setActiveTab] = useState<TabsTypes>("primary");

  const { data, isLoading } = useQuery({
    queryKey: ["country-by-id", countryId],
    queryFn: () => fetchCountryById(countryId as string),
    staleTime: 0,
  });

  let contentFor: ContentFor = "country";

  const { data: bannerData, isFetching: isBannerFetching } = useQuery({
    queryKey: ["banner-country", countryId],
    queryFn: () => getHomePageBanner(countryId as string, contentFor),
    enabled: !!countryId && activeTab === "banner",
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: promotionData, isFetching: isPromotionFetching } = useQuery({
    queryKey: ["ride-promotions", countryId],
    queryFn: () =>
      fetchAllRidePromotions({
        promotionForId: countryId as string,
        promotionFor: contentFor,
      }),
    enabled: !!countryId && activeTab === "ride-promotion",
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabsTypes);
  };

  return (
    <PageLayout heading="Update Country">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex-center mb-6 gap-x-2">
          <TabsTrigger
            value="primary"
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            Country Details
          </TabsTrigger>
          <TabsTrigger
            value="banner"
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            Homepage Banner
          </TabsTrigger>

          <TabsTrigger
            value="ride-promotion"
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            Ride Promotion
          </TabsTrigger>
        </TabsList>
        <TabsContent value="primary" className="flex-center">
          <Suspense fallback={<LazyLoader />}>
            {isLoading ? (
              <FormSkelton />
            ) : (
              <CountryForm
                key={JSON.stringify(data?.result)}
                type="Update"
                formData={data?.result}
              />
            )}
          </Suspense>
        </TabsContent>
        <TabsContent value="banner" className="flex-center">
          <Suspense fallback={<LazyLoader />}>
            {isBannerFetching ? (
              <FormSkelton />
            ) : (
              <HomepageBannerForm
                id={countryId as string}
                bannerFor={contentFor}
                data={bannerData?.result || []}
              />
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="ride-promotion" className="flex-center">
          <Suspense fallback={<LazyLoader />}>
            {isPromotionFetching ? (
              <FormSkelton />
            ) : (
              <RidePromotionForm
                id={countryId as string}
                promotionFor={contentFor}
                formData={promotionData?.result || null}
              />
            )}
          </Suspense>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
