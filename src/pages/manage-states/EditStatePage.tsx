import { useParams, useSearchParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import StateForm from "@/components/form/StateForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchStateById,
  getHomePageBanner,
  getStateFaqFn,
  upadteStateFaqFn,
} from "@/api/states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";
import LazyLoader from "@/components/skelton/LazyLoader";
import StateFaqForm from "@/components/form/main-form/StateFaqForm";
import { useAdminContext } from "@/context/AdminContext";
import HomepageBannerForm from "@/components/form/HomepageBannerForm";
import RidePromotionForm from "@/components/form/RidePromotionForm";
import { fetchAllRidePromotions } from "@/api/ride-promotions";
import { ContentFor } from "@/types/types";
import PageLayout from "@/components/common/PageLayout";

type TabsTypes = "primary" | "faq" | "banner" | "ride-promotion";

export default function EditLocationPage() {
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const parentStateId = searchParams.get("parentStateId") || null;
  const { country } = useAdminContext();
  const countryName = country.countryValue;
  const isIndia = countryName === "India";

  const { stateId } = useParams<{ stateId: string }>();
  const [activeTab, setActiveTab] = useState<TabsTypes>("primary");

  const { data, isLoading } = useQuery({
    queryKey: ["states", stateId],
    queryFn: () => fetchStateById(stateId as string),
    staleTime: 0,
  });

  const { data: faqData, isFetching: isFaqFetching } = useQuery({
    queryKey: ["faq-state", stateId],
    queryFn: () => getStateFaqFn(stateId as string),
    enabled: !!stateId && activeTab === "faq",
    retry: false,
    refetchOnWindowFocus: false,
  });

  let contentFor: ContentFor = "state";
  if (isIndia) {
    contentFor = parentStateId ? "state" : "parentState";
  }

  const { data: bannerData, isFetching: isBannerFetching } = useQuery({
    queryKey: ["banner-state", stateId],
    queryFn: () => getHomePageBanner(stateId as string, contentFor),
    enabled: !!stateId && activeTab === "banner",
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: promotionData, isFetching: isPromotionFetching } = useQuery({
    queryKey: ["ride-promotions", stateId],
    queryFn: () =>
      fetchAllRidePromotions({
        promotionForId: stateId as string,
        promotionFor: contentFor,
      }),
    enabled: !!stateId && activeTab === "ride-promotion",
    retry: false,
    refetchOnWindowFocus: false,
  });

  const updateFaqMutation = useMutation({
    mutationFn: upadteStateFaqFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-state", stateId] });
    },
    onError: (err) => {
      console.error("Error adding agent:", err);
    },
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabsTypes);
  };

  const defaultStateFaq = {
    stateId: stateId || "",
    faqs: [
      {
        question: "",
        answer: "",
      },
    ],
  };

  return (
    <PageLayout
      heading={`Update ${!!parentStateId ? "Location" : "State"}`}
      shouldRenderNavigation
    >
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
            {!!parentStateId ? "Location" : "State"} Details
          </TabsTrigger>
          <TabsTrigger
            value="banner"
            className="h-9 max-sm:px-2 max-sm:text-sm"
          >
            Homepage Banner
          </TabsTrigger>
          {!(!parentStateId && isIndia) && (
            <TabsTrigger value="faq" className={`max-sm:px-2`}>
              FAQ
            </TabsTrigger>
          )}
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
              <StateForm
                key={JSON.stringify(data?.result)}
                type="Update"
                formData={data?.result}
                parentStateId={parentStateId}
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
                id={stateId as string}
                bannerFor={contentFor}
                data={bannerData?.result || []}
              />
            )}
          </Suspense>
        </TabsContent>
        <TabsContent value="faq" className="flex-center">
          <Suspense fallback={<LazyLoader />}>
            {isFaqFetching ? (
              <FormSkelton />
            ) : (
              <StateFaqForm
                data={faqData?.result || defaultStateFaq}
                updateFaqMutation={updateFaqMutation}
                stateValue={data?.result?.stateValue || ""}
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
                id={stateId as string}
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
