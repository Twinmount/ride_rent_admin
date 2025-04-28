import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FormSkelton from "@/components/skelton/FormSkelton";
import StateForm from "@/components/form/StateForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchStateById, getStateFaqFn, upadteStateFaqFn } from "@/api/states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";
import LazyLoader from "@/components/skelton/LazyLoader";
import StateFaqForm from "@/components/form/main-form/StateFaqForm";
import { useAdminContext } from "@/context/AdminContext";

type TabsTypes = "primary" | "faq";

export default function EditLocationPage() {
  const navigate = useNavigate();
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
    <section className="container min-h-screen pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="h3-bold text-center sm:text-left">
          Update {!!parentStateId ? "Location" : "State"}
        </h1>
      </div>
      <div>
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
            {!(!parentStateId && isIndia) && (
              <TabsTrigger value="faq" className={`max-sm:px-2`}>
                FAQ
              </TabsTrigger>
            )}
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
        </Tabs>
      </div>
    </section>
  );
}
