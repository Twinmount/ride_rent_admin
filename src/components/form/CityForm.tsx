import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from "react";
import * as z from "zod";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "../ui/use-toast";
import { CityFormSchema } from "@/lib/validator";
import { CityFormType } from "@/types/types";
import { CityFormDefaultValues } from "@/constants";
import { FormItemWrapper } from "./form-ui/FormItemWrapper";
import { FormContainer, FormSubmitButton } from "./form-ui";
import { Textarea } from "../ui/textarea";
import RichTextEditorComponent from "./RichTextEditorComponent";

import { useNavigate, useParams } from "react-router-dom";
import { addCity, updateCity } from "@/api/cities";
import { useAdminContext } from "@/context/AdminContext";

type CityFormProps = {
  type: "Add" | "Update";
  formData?: CityFormType | null;
  setSearchParams?: (
    params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
  ) => void;
};

export default function CityForm({
  type,
  formData,
  setSearchParams,
}: CityFormProps) {
  const initialValues =
    formData && type === "Update" ? formData : CityFormDefaultValues;

  const { cityId } = useParams<{ cityId: string }>();

  const navigate = useNavigate();
  const { state } = useAdminContext();

  // 1. Define your form.
  const form = useForm<z.infer<typeof CityFormSchema>>({
    resolver: zodResolver(CityFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof CityFormSchema>) {
    try {
      let data;
      if (type === "Add") {
        data = await addCity(values, state.stateId as string);
      } else if (type === "Update") {
        data = await updateCity(values, cityId as string);
      }

      if (data) {
        toast({
          title: `${type} City successfully`,
          className: "bg-yellow text-white",
        });

        if (
          type === "Add" &&
          setSearchParams &&
          (data as any)?.result?.cityId
        ) {
          // Set the cityId in URL params so FAQ tab can be enabled
          setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set("cityId", (data as any).result.cityId);
            return newParams;
          });
        } else {
          navigate("/locations/manage-cities");
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} City failed`,
        description: "Something went wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* City Name */}
        <FormField
          control={form.control}
          name="cityName"
          render={({ field }) => (
            <FormItemWrapper label="City Name" description="Add your City Name">
              <Input
                placeholder="eg: 'Al Bateen'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* City Value */}
        <FormField
          control={form.control}
          name="cityValue"
          render={({ field }) => (
            <FormItemWrapper
              label="City Value"
              description="This value will be used for API interaction. Eg: for 'Abu Dhabi', value will be 'abu-dhabi'"
            >
              <Input
                placeholder="eg: 'al-bateen'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* City Page Heading */}
        <FormField
          control={form.control}
          name="cityPageHeading"
          render={({ field }) => (
            <FormItemWrapper
              label="City Page Heading"
              description={
                <span>
                  This will be displayed as the <strong>heading</strong> of the
                  city listing page.
                  <br />
                  100 characters max.
                </span>
              }
            >
              <Input
                placeholder="e.g., 'Rent Vehicles in Al Bateen'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* City Page Subheading */}
        <FormField
          control={form.control}
          name="cityPageSubheading"
          render={({ field }) => (
            <FormItemWrapper
              label="City Page Subheading"
              description={
                <span>
                  This will be displayed as the <strong>sub-heading</strong> of
                  the city listing page.
                  <br />
                  200 characters max.
                </span>
              }
            >
              <Textarea
                placeholder="Enter the city page subheading"
                {...field}
                className="textarea h-28 rounded-2xl border-none outline-none ring-0 transition-all duration-300 focus:ring-0"
              />
            </FormItemWrapper>
          )}
        />

        {/* City Body Content - Rich Text Editor */}
        <FormField
          control={form.control}
          name="cityBodyContent"
          render={({ field }) => (
            <FormItemWrapper
              label="City Body Content"
              description="Provide rich text content for the city page. This will be displayed on the frontend."
            >
              <RichTextEditorComponent
                content={field.value || ""}
                onUpdate={(updatedContent) => field.onChange(updatedContent)}
              />
            </FormItemWrapper>
          )}
        />

        {/* City Meta Title */}
        <FormField
          control={form.control}
          name="cityMetaTitle"
          render={({ field }) => (
            <FormItemWrapper
              label="City Meta Title"
              description={
                <span>
                  Enter the meta title for this city.
                  <br />
                  80 characters max.
                </span>
              }
            >
              <Input
                placeholder="e.g., 'Rent Cars in Al Bateen'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* City Meta Description */}
        <FormField
          control={form.control}
          name="cityMetaDescription"
          render={({ field }) => {
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            );
            const limit = 5000;

            const handleInputChange = (
              e: React.ChangeEvent<HTMLTextAreaElement>,
            ) => {
              setCharCount(e.target.value.length);
              field.onChange(e);
            };

            return (
              <FormItemWrapper
                label="City Meta Description"
                description={
                  <span className="flex flex-col">
                    <span>Provide a meta description for this City.</span>
                    <span className="mt-1 text-sm text-gray-500">
                      {charCount}/{limit} characters used
                    </span>
                  </span>
                }
              >
                <Textarea
                  placeholder="City Meta Description"
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
          text={type === "Add" ? "Add City" : "Update City"}
          isLoading={form.formState.isSubmitting}
        />
        <p className="m-0 -mt-3 p-0 text-center text-xs text-red-500">
          Make sure appropriate state is selected before adding a city.
          Currently adding city under {state.stateName}
        </p>
      </FormContainer>
    </Form>
  );
}
