import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { ListingMetaFormType } from "@/types/types";
import { ListingMetaFormDefaultValue } from "@/constants";
import { ListingMetaFormSchema } from "@/lib/validator";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { addListingMetaData, updateListingMetaData } from "@/api/meta-data";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import StatesDropdown from "./dropdowns/StatesDropdown";
import VehicleTypesDropdown from "./dropdowns/VehicleTypesDropdown";
import MetaCategoryDropdownField from "./dropdowns/MetaCategoryDropdownField";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { ListingMetaTabType } from "../ListingMetaTab";
import { FormContainer, FormItemWrapper, FormSubmitButton } from "./form-ui";
import BrandsDropdown from "./dropdowns/BrandsDropdown";

type ListingMetaFormProps = {
  type: "Add" | "Update";
  activeTab: ListingMetaTabType;
  formData?: ListingMetaFormType | null;
};

export default function ListingMetaForm({
  type,
  activeTab,
  formData,
}: ListingMetaFormProps) {
  const initialValues =
    formData && type === "Update" ? formData : ListingMetaFormDefaultValue;

  const navigate = useNavigate();
  const { metaDataId } = useParams<{ metaDataId: string }>();

  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof ListingMetaFormSchema>>({
    resolver: zodResolver(ListingMetaFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ListingMetaFormSchema>) {
    try {
      const cleanedValues = {
        ...values,
        typeId: activeTab === "vehicleType" ? values.typeId : undefined,
        brandId: activeTab === "brand" ? values.brandId : undefined,
        stateId: activeTab === "brand" ? undefined : values.stateId,
      };

      let data;
      if (type === "Add") {
        data = await addListingMetaData(cleanedValues);
      } else if (type === "Update") {
        data = await updateListingMetaData(cleanedValues, metaDataId as string);
      }

      if (data) {
        toast({
          title: `${type} Meta Data successfully`,
          className: "bg-yellow text-white",
        });
        navigate(`/meta-data/listing?tab=${activeTab}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${type} meta data failed`,
        description:
          error?.response?.data?.error?.message || "Something went wrong",
      });
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["listing-meta-data", metaDataId],
      });
      queryClient.invalidateQueries({
        queryKey: ["listing-meta-data"],
      });
    }
  }

  const shouldShowField = (field: "stateId" | "typeId" | "brandId") => {
    switch (field) {
      case "stateId":
        return activeTab !== "brand";
      case "typeId":
        return activeTab === "vehicleType";
      case "brandId":
        return activeTab === "brand";
      default:
        return false;
    }
  };

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {shouldShowField("stateId") && (
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItemWrapper label="State" description="Select state">
                <StatesDropdown
                  onChangeHandler={(value) => {
                    field.onChange(value.stateId);
                  }}
                  value={initialValues.stateId}
                  placeholder="state"
                  isDisabled={type === "Update"}
                />
              </FormItemWrapper>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItemWrapper
              label="Vehicle Category"
              description="Select vehicle category"
            >
              <MetaCategoryDropdownField
                onChangeHandler={(value) => {
                  field.onChange(value);
                  form.setValue("typeId", "");
                }}
                value={initialValues.categoryId}
                isDisabled={type === "Update"}
              />
            </FormItemWrapper>
          )}
        />

        {/* type of the vehicle */}
        {shouldShowField("typeId") && (
          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItemWrapper
                label="Vehicle Type"
                description="Select vehicle type"
              >
                <VehicleTypesDropdown
                  vehicleCategoryId={form.watch("categoryId")}
                  value={field.value}
                  onChangeHandler={field.onChange}
                  isDisabled={!form.watch("categoryId") || type === "Update"}
                />
              </FormItemWrapper>
            )}
          />
        )}

        {shouldShowField("brandId") && (
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItemWrapper
                label="Brand Name"
                description="Select your vehicle's brand"
              >
                <BrandsDropdown
                  vehicleCategoryId={form.watch("categoryId")}
                  value={field.value}
                  onChangeHandler={(value) => {
                    field.onChange(value);
                  }}
                  isDisabled={!form.watch("categoryId")}
                />
              </FormItemWrapper>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="h1"
          render={({ field }) => (
            <FormItemWrapper
              label="Listing H1"
              description={"Provide the H1 for the selected listing page"}
            >
              <Input
                placeholder="Best Affordable vehicle in Dubai"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="h2"
          render={({ field }) => (
            <FormItemWrapper
              label="Listing H2"
              description={"Provide the H2 for the selected listing page"}
            >
              <Input
                placeholder="Best Affordable vehicle in Dubai"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/*meta title*/}
        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItemWrapper
              label={`Meta Title`}
              description={`Provide the meta title for the selected  listing page`}
            >
              <Input
                placeholder="Best Affordable vehicle in  Dubai"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* meta description */}
        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => {
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            );
            const limit = 300;

            const handleInputChange = (
              e: React.ChangeEvent<HTMLTextAreaElement>,
            ) => {
              setCharCount(e.target.value.length);
              field.onChange(e);
            };

            return (
              <FormItemWrapper
                label="Meta Description"
                description={
                  <span className="flex-between">
                    <span>Meta description for the selected listing page</span>
                    <span className="mt-1 text-sm text-gray-500">
                      {charCount}/{limit}
                    </span>
                  </span>
                }
              >
                <Textarea
                  placeholder="Vehicle Series Info Description"
                  value={field.value}
                  onChange={handleInputChange}
                  className="textarea h-44 rounded-2xl border-none outline-none ring-0 transition-all duration-300 focus:ring-0"
                />
              </FormItemWrapper>
            );
          }}
        />

        {/* submit  */}
        <FormSubmitButton
          text={`${type} Listing Meta`}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
