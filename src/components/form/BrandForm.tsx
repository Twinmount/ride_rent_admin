import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BrandFormType } from "@/types/types";
import { BrandFormSchema } from "@/lib/validator";
import { BrandFormDefaultValues } from "@/constants";
import { addBrand, updateBrand } from "@/api/brands";
import { toast } from "../ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import VehicleCategoryDropdown from "./dropdowns/VehicleCategoryDropdown";
import { useState } from "react";
import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import SingleFileUpload from "./file-uploads/SingleFileUpload";
import { Textarea } from "../ui/textarea";
import { FormContainer, FormItemWrapper, FormSubmitButton } from "./form-ui";
import { useQueryClient } from "@tanstack/react-query";
import { useFormValidationToast } from "@/hooks/useFormValidationToast";

type BrandFormProps = {
  type: "Add" | "Update";
  formData?: BrandFormType | null;
};

export default function BrandForm({ type, formData }: BrandFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const initialValues =
    formData && type === "Update" ? formData : BrandFormDefaultValues;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { vehicleCategoryId, brandId } = useParams<{
    vehicleCategoryId: string;
    brandId: string;
  }>();

  // 1. Define your form.
  const form = useForm<z.infer<typeof BrandFormSchema>>({
    resolver: zodResolver(BrandFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof BrandFormSchema>) {
    if (isFileUploading) {
      toast({
        title: "File Upload in Progress",
        description:
          "Please wait until the file upload completes before submitting the form.",
        duration: 3000,
        className: "bg-orange",
      });
      return;
    }

    try {
      let data;
      if (type === "Add") {
        data = await addBrand(values, vehicleCategoryId as string);
      } else if (type === "Update") {
        data = await updateBrand(values, brandId as string);
      }

      if (data) {
        // actually delete the images from the db, if any
        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
        toast({
          title: `${type} Brand successfully`,
          className: "bg-yellow text-white",
        });
        navigate("/manage-brands");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Brand failed`,
        description: "Something went wrong",
      });
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      });
    }
  }

  // custom hook to validate complex form fields
  useFormValidationToast(form);

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItemWrapper
              label={`Brand Name`}
              description={`Add brand name`}
            >
              <Input
                placeholder={`eg: 'Land Rover'`}
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* brand value */}
        <FormField
          control={form.control}
          name="brandValue"
          render={({ field }) => (
            <FormItemWrapper
              label={`Brand value`}
              description={`This value will be used for URL / API interaction. Eg: for "Land Rover", value will be "land-rover"`}
            >
              <Input
                placeholder={`eg: 'land-rover'`}
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleCategoryId"
          render={({ field }) => (
            <FormItemWrapper
              label={`Vehicle Category`}
              description={`Category of the vehicle`}
            >
              <VehicleCategoryDropdown
                onChangeHandler={field.onChange}
                value={field.value}
                placeholder=" category"
              />
            </FormItemWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="brandLogo"
          render={({ field }) => (
            <SingleFileUpload
              name={field.name}
              label="Brand Logo"
              description="Upload a brand logo with a maximum file size of 1MB. "
              existingFile={formData?.brandLogo}
              maxSizeMB={1}
              setIsFileUploading={setIsFileUploading}
              bucketFilePath={GcsFilePaths.LOGOS}
              setDeletedImages={setDeletedImages}
            />
          )}
        />

        <FormField
          control={form.control}
          name="brandH1"
          render={({ field }) => (
            <FormItemWrapper
              label="Listing H1"
              description={"Provide the H1 for the selected brand listing page"}
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
          name="brandH2"
          render={({ field }) => (
            <FormItemWrapper
              label="Listing H2"
              description={"Provide the H2 for the selected brand listing page"}
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
          name="brandMetaTitle"
          render={({ field }) => (
            <FormItemWrapper
              label={`Meta Title`}
              description={`Provide the meta title for the selected brand listing page`}
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
          name="brandMetaDescription"
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
                  <span className="flex">
                    <span>
                      Meta description for the selected brand listing page
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

        {/* submit  */}
        <FormSubmitButton
          text={type === "Add" ? "Add Brand" : "Update Update"}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
