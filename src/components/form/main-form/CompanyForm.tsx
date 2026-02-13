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
import { useEffect, useState } from "react";
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
import { CompanyFormType } from "@/types/types";
import LocationPicker from "../LocationPicker";
import { FormCheckbox } from "../form-ui";
import { FormFieldLayout } from "../form-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type CompanyFormProps = {
  type: "Update";
  formData?: CompanyFormType | null;
  updateId?: string;
  isSupplierPage?: boolean;
};

export default function CompanyForm({
  type,
  formData,
  updateId,
  isSupplierPage = false,
}: CompanyFormProps) {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const isIndividual = formData?.accountType === "individual";
  const isIndia = formData?.countryName === "India";
  const isBasicPlan = formData?.plan === "BASIC";

  const initialValues =
    formData && type === "Update"
      ? {
          ...formData,
          expireDate: formData.expireDate
            ? new Date(formData.expireDate)
            : undefined,
        }
      : CompanyFormDefaultValues;

  type CompanySchemaType = z.infer<ReturnType<typeof CompanyFormSchema>>;

  const form = useForm<CompanySchemaType>({
    resolver: zodResolver(CompanyFormSchema(isIndia)),
    defaultValues: initialValues as any,
  });

  async function onSubmit(values: CompanySchemaType) {
    if (isFileUploading) {
      showFileUploadInProgressToast();
      return;
    }

    const idToUse = updateId || companyId;

    if (!idToUse) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Missing ID for update. Please refresh and try again.",
      });
      return;
    }

    try {
      const data = await updateCompany(values, idToUse);

      if (data) {
        await deleteMultipleFiles(deletedImages);

        const entityName = isSupplierPage ? "Supplier" : "Company";
        toast({
          title: `${entityName} ${type}ed successfully`,
          className: "bg-yellow text-white",
        });

        revalidateCompanyQueryCache(idToUse);

        if (isSupplierPage) {
          navigate(-1);
        } else {
          navigate("/company/registrations/live");
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${isSupplierPage ? "Update" : type} ${isSupplierPage ? "Supplier" : "Company"} failed`,
        description: "Something went wrong",
      });
    } finally {
      revalidateCompanyQueryCache(idToUse);
    }
  }

  function revalidateCompanyQueryCache(idToUse: string) {
    queryClient.invalidateQueries({
      queryKey: ["company-details-page", idToUse],
      exact: true,
    });
    queryClient.invalidateQueries({
      queryKey: ["supplier-details-page", idToUse],
      exact: true,
    });
    queryClient.invalidateQueries({
      queryKey: ["companies"],
      exact: false,
    });
  }

  const buttonText = isSupplierPage ? "Update Supplier" : "Update Company";
useEffect(() => {
  if (!isBasicPlan) {
    form.setValue("commissionPercentage", 0, {
      shouldValidate: false,
      shouldDirty: false,
    });
  }
}, [isBasicPlan, form]);
  // Commission percentage options
  const commissionOptions = [
    { value: "0", label: "0%" },
    { value: "5", label: "5%" },
    { value: "10", label: "10%" },
    { value: "15", label: "15%" },
    { value: "20", label: "20%" },
    { value: "25", label: "25%" },
    { value: "30", label: "30%" },
  ];

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>

        {/* Subscription & Commission – ONLY FOR BASIC PLAN */}
        {isBasicPlan && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Subscription & Commission
            </h3>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Plan Status:
              </span>
              <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                {formData?.plan} Plan
              </Badge>
            </div>

            {/* Commission Dropdown */}
            <FormField
              control={form.control}
              name="commissionPercentage"
              render={({ field }) => (
                <FormItemWrapper
                  label="Commission Percentage"
                  description="Select the commission percentage you want to charge from this company on each booking."
                >
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() ?? "0"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select commission percentage" />
                    </SelectTrigger>
                    <SelectContent>
                      {commissionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItemWrapper>
              )}
            />
          </div>
        )}
        {!isBasicPlan && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Subscription
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Plan Status:
              </span>
              <Badge variant="default" className="bg-green-600 text-white">
                {formData?.plan} Subscribed
              </Badge>
            </div>
          </div>
        )}


        {/* Agent Contact Info */}
        <AgentContactInfo
          agentId={initialValues?.agentId}
          email={initialValues?.email}
          phoneNumber={initialValues?.phoneNumber}
        />

        {/* Company Name */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItemWrapper
              label={`${!isIndividual ? "Company" : ""} Name`}
              description={`Enter your ${!isIndividual ? "company" : ""} name`}
            >
              <Input
                placeholder={`${!isIndividual ? "Company" : ""} Name`}
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Company Logo */}
        <FormField
          control={form.control}
          name="companyLogo"
          render={({ field }) => (
            <SingleFileUpload
              name={field.name}
              label={isIndividual ? "Photo" : "Company Logo"}
              description={
                isIndividual
                  ? "Photo can have a maximum size of 5MB."
                  : "Company Logo can have a maximum size of 5MB."
              }
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

        {/* Trade License */}
        <FormField
          control={form.control}
          name="commercialLicense"
          render={({ field }) => (
            <SingleFileUpload
              name={field.name}
              label={
                isIndia && !isIndividual
                  ? "Registration Details"
                  : isIndia && isIndividual
                    ? "Commercial Registration"
                    : "Commercial License"
              }
              description={
                <>
                  Please upload a <strong>PHOTO</strong> or a{" "}
                  <strong>SCREENSHOT</strong> of your{" "}
                  {isIndia && !isIndividual
                    ? `Company Registration / GST Registration / Trade License,`
                    : isIndia && isIndividual
                      ? "Commercial Registration / Tourist Permit"
                      : `commercial license,`}{" "}
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

        {/* Expiry Date */}
        {!isIndia && (
          <FormField
            control={form.control}
            name="expireDate"
            render={({ field }) => (
              <FormFieldLayout
                label="Expiry Date"
                description={
                  <span>
                    Enter the expiry of your{" "}
                    {isIndia
                      ? `Company Registration / GST Registration / Trade License`
                      : "Commercial License/Trade License"}{" "}
                    &#40;DD/MM/YYYY&#41;.
                  </span>
                }
              >
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date | null) => field.onChange(date)}
                  dateFormat="dd/MM/yyyy"
                  wrapperClassName="datePicker text-base"
                  placeholderText="DD/MM/YYYY"
                />
              </FormFieldLayout>
            )}
          />
        )}

        {/* Registration Number */}
        <FormField
          control={form.control}
          name="regNumber"
          render={({ field }) => (
            <FormItemWrapper
              label={`${
                isIndia && !isIndividual
                  ? "GST Number"
                  : isIndia && isIndividual
                    ? "PAN Number"
                    : "Registration Number / Trade License Number"
              }`}
              description={`${
                isIndia && !isIndividual
                  ? `Enter your company GST number. The number should be a combination of letters and numbers, without any spaces or special characters.`
                  : isIndia && isIndividual
                    ? "Enter your company PAN. The number should be a combination of letters and numbers, without any spaces or special characters."
                    : `Enter your company registration number. The number should be a combination of letters and numbers, without any spaces or special characters, up to 15 characters.`
              }`}
            >
              <Input
                placeholder={
                  isIndia
                    ? "Enter your company GST number"
                    : "Enter your company registration number"
                }
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* No Registration Checkbox for India */}
        {isIndia && !isIndividual && (
          <FormField
            control={form.control}
            name="noRegNumber"
            render={({ field }) => (
              <FormFieldLayout
                label="No GST / Registration Number"
                description="Check if your company does not have a GST number."
              >
                <FormCheckbox
                  id={field.name}
                  checked={!!field.value}
                  onChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      form.setValue("regNumber", "");
                    }
                  }}
                  label={"I do not have a GST number"}
                />
              </FormFieldLayout>
            )}
          />
        )}

        {/* Company Languages */}
        <FormField
          control={form.control}
          name="companyLanguages"
          render={({ field }) => (
            <FormItemWrapper
              label="Supported Languages"
              description={`${
                isIndividual
                  ? "Select all the languages you can speak or understand. These will be shown on your public profile to help customers communicate comfortably with you."
                  : "Select all the languages your staff can speak or understand. These will be displayed on your company's public profile page, helping customers feel comfortable with communication."
              }`}
            >
              <CompanyLanguagesDropdown
                isIndia={isIndia}
                value={field.value}
                onChangeHandler={field.onChange}
                placeholder="Languages"
              />
            </FormItemWrapper>
          )}
        />

        {/* Office Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItemWrapper
              label="Office Location"
              description={
                <span>
                  Enter the GPS location where the company is registered or
                  operates.
                </span>
              }
            >
              <LocationPicker
                onChangeHandler={field.onChange}
                initialLocation={field.value}
                buttonText="Choose Location"
                showDetails={true}
                buttonClassName="w-full cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900"
              />
            </FormItemWrapper>
          )}
        />

        {/* Company Address */}
        <FormField
          control={form.control}
          name="companyAddress"
          render={({ field }) => {
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            );

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
                label={isIndividual ? "Address" : "Company Address"}
                description={
                  <>
                    <span className="w-full max-w-[90%]">
                      {isIndividual
                        ? "Provide your address. It will appear on your public profile and must match your registered details"
                        : "Provide company address. This will be showed in your public company profile page. 150 characters max."}
                    </span>{" "}
                    <span className="ml-auto"> {`${charCount}/150`}</span>
                  </>
                }
              >
                <Textarea
                  placeholder="Company Address"
                  {...field}
                  className={`textarea h-28 rounded-xl transition-all duration-300`}
                  onChange={handleInputChange}
                />
              </FormItemWrapper>
            );
          }}
        />

        {/* Display Address */}
        <FormField
          control={form.control}
          name="displayAddress"
          render={({ field }) => {
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            );

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
                label="Address to Display"
                description={
                  <>
                    <span className="w-full max-w-[90%]">
                      Provide the address to display publicly. This address will
                      be shown on vehicle cards and listings instead of your
                      company address. 150 characters max.
                    </span>{" "}
                    <span className="ml-auto">{`${charCount}/150`}</span>
                  </>
                }
              >
                <Textarea
                  placeholder="Address to Display"
                  {...field}
                  className={`textarea h-28 rounded-xl transition-all duration-300`}
                  onChange={handleInputChange}
                />
              </FormItemWrapper>
            );
          }}
        />

        {/* Company Meta Title */}
        <FormField
          control={form.control}
          name="companyMetaTitle"
          render={({ field }) => (
            <FormItemWrapper
              label="Company Meta Title"
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
                  placeholder="Company Meta Description"
                  value={field.value}
                  onChange={handleInputChange}
                  className="textarea h-44 rounded-2xl border-none outline-none ring-0 transition-all duration-300 focus:ring-0"
                />
              </FormItemWrapper>
            );
          }}
        />

        {/* Submit Button */}
        <FormSubmitButton
          text={buttonText}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}