import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";

import { Form, FormField } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { CompanyFormDefaultValues } from "@/constants";
import { CompanyFormSchema } from "@/lib/validator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { updateCompany } from "@/api/company";
import { useState } from "react";
import { CompanyType } from "@/types/api-types/vehicleAPI-types";
import { useQueryClient } from "@tanstack/react-query";
import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import CompanyLanguagesDropdown from "../dropdowns/CompanyLanguagesDropdown";
import { Textarea } from "@/components/ui/textarea";
import { showFileUploadInProgressToast } from "@/utils/toastUtils";
import { FormContainer } from "../form-ui/FormContainer";
import { AgentContactInfo } from "../AgentContactInfo";
import { FormItemWrapper } from "../form-ui/FormItemWrapper";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";

type CompanyFormProps = {
  type: "Update";
  formData?: CompanyType | null;
};

export default function CompanyForm({ type, formData }: CompanyFormProps) {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const initialValues =
    formData && type === "Update"
      ? {
          ...formData,
          expireDate: formData.expireDate
            ? new Date(formData.expireDate)
            : undefined,
        }
      : CompanyFormDefaultValues;

  // creating form
  const form = useForm<z.infer<typeof CompanyFormSchema>>({
    resolver: zodResolver(CompanyFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof CompanyFormSchema>) {
    if (isFileUploading) {
      showFileUploadInProgressToast();
      return;
    }

    try {
      const data = await updateCompany(values, companyId as string);

      if (data) {
        // actually delete the images from the db, if any
        await deleteMultipleFiles(deletedImages);

        toast({
          title: `Company ${type}ed successfully`,
          className: "bg-yellow text-white",
        });
        navigate("/registrations/live");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Company failed`,
        description: "Something went wrong",
      });
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["company-details-page", companyId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["companies"],
        exact: false,
      });
    }
  }

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* displaying agent contact info such as agentId, email, and phone with copy buttons*/}
        <AgentContactInfo
          agentId={initialValues?.agentId}
          email={initialValues?.email}
          phoneNumber={initialValues?.phoneNumber}
        />

        {/* company name */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItemWrapper
              label="Company Name"
              description="Enter your company name."
            >
              <Input
                placeholder="Company Name"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* company logo */}
        <FormField
          control={form.control}
          name="companyLogo"
          render={({ field }) => (
            <SingleFileUpload
              name={field.name}
              label="Company Logo"
              description="Company logo can have a maximum size of 5MB."
              existingFile={formData?.companyLogo}
              maxSizeMB={5}
              setIsFileUploading={setIsFileUploading}
              bucketFilePath={GcsFilePaths.LOGOS}
              isDownloadable={true}
              downloadFileName={
                formData?.companyName
                  ? `[${formData.companyName}] - company-logo`
                  : "company-logo"
              }
              setDeletedImages={setDeletedImages}
            />
          )}
        />

        {/* trade license */}
        <FormField
          control={form.control}
          name="commercialLicense"
          render={({ field }) => (
            <SingleFileUpload
              name={field.name}
              label="Commercial License"
              description={
                <>
                  Please upload a <strong>PHOTO</strong> or a{" "}
                  <strong>SCREENSHOT</strong> of your commercial license,
                  maximum file size 5MB.
                </>
              }
              existingFile={formData?.commercialLicense}
              maxSizeMB={5}
              setIsFileUploading={setIsFileUploading}
              bucketFilePath={GcsFilePaths.DOCUMENTS}
              isDownloadable={true}
              downloadFileName={
                formData?.companyName
                  ? `[${formData.companyName}] - commercial-license`
                  : "commercial-license"
              }
              setDeletedImages={setDeletedImages}
            />
          )}
        />

        {/* expiry date */}
        <FormField
          control={form.control}
          name="expireDate"
          render={({ field }) => (
            <FormItemWrapper
              label="Expiry Date"
              description="Enter the expiry of your Commercial License/Trade License."
            >
              <DatePicker
                selected={field.value}
                onChange={(date: Date | null) => field.onChange(date)}
                dateFormat="MM/dd/yyyy"
                wrapperClassName="datePicker text-base -ml-4 "
              />
            </FormItemWrapper>
          )}
        />

        {/* registration number */}
        <FormField
          control={form.control}
          name="regNumber"
          render={({ field }) => (
            <FormItemWrapper
              label="Registration Number/Trade License Number"
              description="Enter your company registration number. The number should be a combination of letters and numbers, without any spaces or special characters, up to 15 characters."
            >
              <Input
                placeholder="Enter company registration number"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* company languages */}
        <FormField
          control={form.control}
          name="companyLanguages"
          render={({ field }) => (
            <FormItemWrapper
              label="Supported Languages"
              description="Select all the languages the staff can speak or understand.
                  These will be displayed on company's public profile page,
                  helping customers feel comfortable with communication."
            >
              <CompanyLanguagesDropdown
                value={field.value}
                onChangeHandler={field.onChange}
                placeholder="Languages"
              />
            </FormItemWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="companyAddress"
          render={({ field }) => {
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            ); // To track character count

            const handleInputChange = (
              e: React.ChangeEvent<HTMLTextAreaElement>,
            ) => {
              const newValue = e.target.value;
              if (newValue.length <= 150) {
                setCharCount(newValue.length);
                field.onChange(e);
              }
            };

            return (
              <FormItemWrapper
                label="Company Address"
                description={
                  <>
                    <span className="w-full max-w-[90%]">
                      Provide company address. This will be showed in the public
                      company profile page. 150 characters max.
                    </span>{" "}
                    <span className="ml-auto"> {`${charCount}/150`}</span>
                  </>
                }
              >
                <Textarea
                  placeholder="Company Address"
                  {...field}
                  className={`textarea h-28 rounded-xl transition-all duration-300`} // Dynamic height
                  onChange={handleInputChange} // Handle change to track character count
                />
              </FormItemWrapper>
            );
          }}
        />

        {/* Company  Meta Title */}
        <FormField
          control={form.control}
          name="companyMetaTitle"
          render={({ field }) => (
            <FormItemWrapper
              label="Vehicle Meta Title"
              description={
                <span>
                  Enter the meta title for this company. This will be used as
                  the Meta Title in the agent-portfolio-page in Nextjs.
                  <br /> Only alphanumeric characters are allowed.
                </span>
              }
            >
              <Input
                placeholder="Company Meta Title"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Company Meta Description */}
        <FormField
          control={form.control}
          name="companyMetaDescription"
          render={({ field }) => {
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            );
            const limit = 500;

            const handleInputChange = (
              e: React.ChangeEvent<HTMLTextAreaElement>,
            ) => {
              setCharCount(e.target.value.length);
              field.onChange(e);
            };

            return (
              <FormItemWrapper
                label="Company Meta Description"
                description={
                  <span className="flex flex-col">
                    <span>
                      Provide a meta description for this Company. This will be
                      used as the Meta Description in the agent-portfolio-page
                      in Nextjs.
                    </span>
                    <span className="ml-auto mt-1 text-sm text-gray-500">
                      {charCount}/{limit}
                    </span>
                  </span>
                }
              >
                <Textarea
                  placeholder="Vehicle  Meta Description"
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
          text={"Update Company"}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
