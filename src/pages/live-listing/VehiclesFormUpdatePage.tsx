import { CircleArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense } from "react";
import LazyLoader from "@/components/skelton/LazyLoader";
import FormSkelton from "@/components/skelton/FormSkelton";
import { useVehicleUpdateForm } from "@/hooks/useVehicleUpdateForm";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "@/api/company";

// Lazy-loaded components
const PrimaryDetailsForm = lazy(
  () => import("@/components/form/main-form/PrimaryDetailsForm"),
);
const SpecificationsForm = lazy(
  () => import("@/components/form/main-form/SpecificationsForm"),
);
const FeaturesForm = lazy(
  () => import("@/components/form/main-form/FeaturesForm"),
);

const VehicleFaqForm = lazy(
  () => import("@/components/form/main-form/VehicleFaqForm"),
);

type TabsTypes = "primary" | "specifications" | "features" | "faq";

export default function VehiclesFormUpdatePage() {
  const navigate = useNavigate();
  const { vehicleId, companyId } = useParams<{
    vehicleId: string;
    companyId: string;
  }>();

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabsTypes);
  };

  const { data: companyData, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompanyById(companyId as string),
    enabled: !!companyId,
  });

  const isIndia = companyData?.result?.countryName === "India";
  const countryId = companyData?.result?.countryId || "";
  const companyLocation = companyData?.result?.location || null;

  // Using custom hook
  const {
    activeTab,
    setActiveTab,
    formData,
    isLoading,
    levelsFilled,
    isLevelsFetching,
    refetchLevels,
    isAddOrIncompleteSpecifications,
    isAddOrIncompleteFeatures,
    initialCountryCode,
    isFaqFetching,
    faqData,
    updateFaqMutation,
    resetFaqMutation,
  } = useVehicleUpdateForm(vehicleId, isIndia);

  const isAddOrIncomplete =
    isAddOrIncompleteSpecifications || isAddOrIncompleteFeatures;

  return (
    <section className="container h-auto min-h-screen py-8 pb-10">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="h3-bold text-center sm:text-left">
          Vehicle Details Form
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
              Primary Details
            </TabsTrigger>
            <TabsTrigger
              disabled={isLoading || isLevelsFetching || isCompanyLoading}
              value="specifications"
              className="max-sm:px-2"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="features"
              disabled={
                isLoading ||
                isLevelsFetching ||
                isAddOrIncompleteSpecifications ||
                isCompanyLoading
              }
              className={`max-sm:px-2`}
            >
              Features
            </TabsTrigger>
            <TabsTrigger value="faq" className={`max-sm:px-2`}>
              FAQ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="primary" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isLoading || isCompanyLoading ? (
                <FormSkelton />
              ) : (
                <PrimaryDetailsForm
                  type="Update"
                  formData={formData}
                  levelsFilled={levelsFilled}
                  initialCountryCode={initialCountryCode}
                  isIndia={isIndia}
                  countryId={countryId}
                  companyLocation={companyLocation}
                  isAddOrIncomplete={isAddOrIncomplete}
                />
              )}
            </Suspense>
          </TabsContent>
          <TabsContent value="specifications" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isLevelsFetching ? (
                <FormSkelton />
              ) : (
                <SpecificationsForm
                  type="Update"
                  refetchLevels={refetchLevels}
                  isAddOrIncomplete={isAddOrIncompleteSpecifications}
                />
              )}
            </Suspense>
          </TabsContent>
          <TabsContent value="features" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isLevelsFetching ? (
                <FormSkelton />
              ) : (
                <FeaturesForm
                  type="Update"
                  refetchLevels={refetchLevels}
                  isAddOrIncomplete={isAddOrIncompleteFeatures}
                />
              )}
            </Suspense>
          </TabsContent>
          <TabsContent value="faq" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isFaqFetching ? (
                <FormSkelton />
              ) : (
                <VehicleFaqForm
                  data={faqData?.result?.data}
                  updateFaqMutation={updateFaqMutation}
                  resetFaqMutation={resetFaqMutation}
                />
              )}
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
