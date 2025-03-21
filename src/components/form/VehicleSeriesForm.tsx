import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { VehicleSeriesSchema } from "@/lib/validator";
import { VehicleSeriesType } from "@/types/types";
import { FormItemWrapper } from "./form-ui/FormItemWrapper";
import StatesDropdown from "./dropdowns/StatesDropdown";
import BrandsDropdown from "./dropdowns/BrandsDropdown";
import { FormSubmitButton } from "./form-ui/FormSubmitButton";
import { Textarea } from "../ui/textarea";
import { sanitizeStringToSlug } from "@/lib/utils";
import { FormContainer } from "./form-ui/FormContainer";
import VehicleCategoryDropdown from "./dropdowns/VehicleCategoryDropdown";
import { VehicleSeriesFormDefaultValues } from "@/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { addVehicleSeries, updateVehicleSeries } from "@/api/vehicle-series";
// import { addVehicleSeries, updateVehicleSeries } from "@/api/vehicle-series";

type VehicleSeriesFormProps = {
  type: "Add" | "Update";
  formData?: VehicleSeriesType | null;
};

export default function VehicleSeriesForm({
  type,
  formData,
}: VehicleSeriesFormProps) {
  const initialValues = formData || VehicleSeriesFormDefaultValues;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { vehicleSeriesId } = useParams<{
    vehicleSeriesId: string;
  }>();

  const form = useForm<z.infer<typeof VehicleSeriesSchema>>({
    resolver: zodResolver(VehicleSeriesSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof VehicleSeriesSchema>) {
    try {
      let data;
      if (type === "Add") {
        data = await addVehicleSeries(values);
      } else if (type === "Update") {
        data = await updateVehicleSeries(values, vehicleSeriesId as string);
      }

      if (data) {
        toast({
          title: `${type} Vehicle Series successful`,
          description: `The vehicle series has been ${type === "Add" ? "added" : "updated"} successfully.`,
          className: "bg-green-500 text-white",
        });

        navigate("/manage-series");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Vehicle Series failed`,
        description: "Something went wrong. Please try again.",
      });
    } finally {
      // invalidating cached data in the series listing page and in form fetch
      queryClient.invalidateQueries({
        queryKey: ["vehicle-series", vehicleSeriesId],
      });
    }
  }

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* Location (State) */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItemWrapper
              label="Location"
              description="Choose your state/location"
            >
              <StatesDropdown
                onChangeHandler={(value) => {
                  field.onChange(value);
                }}
                value={initialValues.state}
                placeholder="location"
              />
            </FormItemWrapper>
          )}
        />

        {/* Location (State) */}
        <FormField
          control={form.control}
          name="vehicleCategoryId"
          render={({ field }) => (
            <FormItemWrapper
              label="Category"
              description="Choose your state/location"
            >
              <VehicleCategoryDropdown
                onChangeHandler={field.onChange}
                value={field.value}
                placeholder=" category"
              />
            </FormItemWrapper>
          )}
        />

        {/* Brand Name */}
        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItemWrapper
              label="Brand Name"
              description="Select your vehicle's brand"
            >
              <BrandsDropdown
                vehicleCategoryId={form.watch("vehicleCategoryId")}
                value={field.value}
                onChangeHandler={field.onChange}
                isDisabled={!form.watch("vehicleCategoryId")}
              />
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Series (label) */}
        <FormField
          control={form.control}
          name="vehicleSeriesLabel"
          render={({ field }) => (
            <FormItemWrapper
              label={
                <span>
                  Vehicle Series <br />
                  <span className="text-sm text-gray-500">(label)</span>
                </span>
              }
              description={
                <span>
                  Enter or search the vehicle series (max 80 characters).
                  <br />
                  {form.watch("vehicleSeries") && (
                    <span className="mt-2 text-sm text-gray-500">
                      Public URL will be:{" "}
                      <span className="font-semibold">
                        /{sanitizeStringToSlug(form.watch("vehicleSeries"))}
                      </span>
                    </span>
                  )}
                </span>
              }
            >
              <Input
                placeholder="e.g., 'Rent BMW S Series'"
                {...field}
                className="input-field"
                onChange={(e) => {
                  const updatedLabel = e.target.value;

                  // Update vehicleSeriesLabel
                  field.onChange(updatedLabel);

                  // Generate sanitized vehicleSeries
                  const sanitizedSeries = updatedLabel
                    .replace(/[^a-zA-Z0-9-\s]/g, "") // Remove invalid characters
                    .replace(/\s+/g, " ") // Normalize spaces
                    .trim(); // Trim leading/trailing spaces

                  form.setValue(
                    "vehicleSeries",
                    sanitizeStringToSlug(sanitizedSeries) ?? "",
                  );
                }}
              />
            </FormItemWrapper>
          )}
        />

        {/* Series "value" (hidden field)*/}
        <FormField
          control={form.control}
          name="vehicleSeries"
          render={({ field }) => (
            <Input type="hidden" {...field} className="hidden" />
          )}
        />

        {/* Series Page Heading */}
        <FormField
          control={form.control}
          name="vehicleSeriesPageHeading"
          render={({ field }) => (
            <FormItemWrapper
              label="Series Page Heading"
              description={
                <span>
                  This will be displayed as the <strong>heading</strong> of the
                  series listing page.
                  <br />
                  100 characters max.
                </span>
              }
            >
              <Input
                placeholder="e.g., 'Rent BMW S Series'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Series Page Subheading */}
        <FormField
          control={form.control}
          name="vehicleSeriesPageSubheading"
          render={({ field }) => (
            <FormItemWrapper
              label="Series Page Subheading"
              description={
                <span>
                  This will be displayed as the <strong>sub-heading</strong> of
                  the series listing page.
                  <br />
                  200 characters max.
                </span>
              }
            >
              <Textarea
                placeholder="Enter the series page subheading"
                {...field}
                className="textarea h-28 rounded-2xl border-none outline-none ring-0 transition-all duration-300 focus:ring-0"
              />
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Series Info Title */}
        <FormField
          control={form.control}
          name="vehicleSeriesInfoTitle"
          render={({ field }) => (
            <FormItemWrapper
              label="Series Info Title"
              description={
                <span>
                  Enter the series info title for this series.
                  <br />
                  It will be displayed in the info box on the Next.js series
                  listing page.
                </span>
              }
            >
              <Input
                placeholder="e.g., 'BMW S Series'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Series Info Description */}
        <FormField
          control={form.control}
          name="vehicleSeriesInfoDescription"
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
                label="Series Info Description"
                description={
                  <span className="flex">
                    <span>
                      Enter the series info description for this series. It will
                      be displayed as the info box description in the Next.js
                      series listing page.
                    </span>
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

        {/* Vehicle Series Meta Title */}
        <FormField
          control={form.control}
          name="vehicleSeriesMetaTitle"
          render={({ field }) => (
            <FormItemWrapper
              label="Series Meta Title"
              description={
                <span>
                  Enter the meta title for this series.
                  <br /> Only alphanumeric characters are allowed.
                </span>
              }
            >
              <Input
                placeholder="e.g., 'BMW S Series'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Series Meta Description */}
        <FormField
          control={form.control}
          name="vehicleSeriesMetaDescription"
          render={({ field }) => {
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            );
            const limit = 1000;

            const handleInputChange = (
              e: React.ChangeEvent<HTMLTextAreaElement>,
            ) => {
              setCharCount(e.target.value.length);
              field.onChange(e);
            };

            return (
              <FormItemWrapper
                label="Series Meta Description"
                description={
                  <span className="flex flex-col">
                    <span>Provide a meta description for this Series.</span>
                    <span className="mt-1 text-sm text-gray-500">
                      {charCount}/{limit} characters used
                    </span>
                  </span>
                }
              >
                <Textarea
                  placeholder="Vehicle Series Meta Description"
                  value={field.value}
                  onChange={handleInputChange}
                  className="textarea h-44 rounded-2xl border-none outline-none ring-0 transition-all duration-300 focus:ring-0"
                />
              </FormItemWrapper>
            );
          }}
        />

        {/* Submit */}
        <FormSubmitButton
          text={type === "Add" ? "Add Series" : "Update Series"}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
