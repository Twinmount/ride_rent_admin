import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyFormDefaultValues } from "@/constants";
import { CompanyFormSchema } from "@/lib/validator";
import { ShieldCheck, Copy } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { updateCompany } from "@/api/company";
import Spinner from "@/components/general/Spinner";
import { useState } from "react";
import { CompanyType } from "@/types/api-types/vehicleAPI-types";
import { useQueryClient } from "@tanstack/react-query";
import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import SingleFileUpload from "../file-uploads/SingleFileUpload";
import CompanyLanguagesDropdown from "../dropdowns/CompanyLanguagesDropdown";
import { Textarea } from "@/components/ui/textarea";

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
      const data = await updateCompany(values, companyId as string);

      if (data) {
        // actually delete the images from the db, if any

        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
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
        queryKey: ["all-companies", "companies"],
      });
    }
  }

  const handleCopy = (value: string, label: string) => {
    // Add '+' if copying a phone number
    const textToCopy = label === "Phone Number" ? `+${value}` : value;

    navigator.clipboard.writeText(textToCopy || "");
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
      className: "bg-green-500 text-white",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[800px] flex-col gap-5 rounded-3xl border-t bg-white p-2 py-8 !pb-8 shadow-md md:p-4"
      >
        <div className="mx-auto flex w-full flex-col gap-5 rounded-3xl p-3">
          {/* Agent ID */}
          {initialValues?.agentId && (
            <div className="mb-2 flex w-full max-sm:flex-col">
              <div className="ml-2 mt-4 flex w-72 justify-between text-base max-sm:w-fit lg:text-lg">
                Your Agent ID <span className="mr-5 max-sm:hidden">:</span>
              </div>
              <div className="mt-4 flex w-full cursor-default items-center text-lg font-semibold text-gray-500">
                {initialValues.agentId}{" "}
                <ShieldCheck className="ml-3 text-green-500" size={20} />
                <Button
                  type="button"
                  onClick={() =>
                    handleCopy(initialValues.agentId as string, "Agent ID")
                  }
                  className="ml-8 h-fit bg-slate-600 p-1 text-gray-500 hover:bg-slate-900 hover:shadow-md"
                >
                  <Copy className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          )}

          {/* Email */}
          {initialValues?.email && (
            <div className="mb-2 flex w-full max-sm:flex-col">
              <div className="ml-2 mt-4 flex w-72 justify-between text-base max-sm:w-fit lg:text-lg">
                Email <span className="mr-5 max-sm:hidden">:</span>
              </div>
              <div className="mt-4 flex w-full cursor-pointer items-center text-lg font-semibold text-gray-500">
                <a
                  href={`mailto:${initialValues?.email}`}
                  className="underline hover:text-blue-600"
                  title="Send an email"
                >
                  {initialValues?.email}
                </a>
                <ShieldCheck className="ml-3 text-green-500" size={20} />
                <Button
                  type="button"
                  onClick={() =>
                    handleCopy(initialValues.email as string, "Email")
                  }
                  className="ml-8 h-fit bg-slate-600 p-1 text-gray-500 hover:bg-slate-900 hover:shadow-md"
                >
                  <Copy className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          )}

          {/* Phone Number */}
          {initialValues?.phoneNumber && (
            <div className="mb-2 flex w-full max-sm:flex-col">
              <div className="ml-2 mt-4 flex w-72 justify-between text-base max-sm:w-fit lg:text-lg">
                Phone Number <span className="mr-5 max-sm:hidden">:</span>
              </div>
              <div className="mt-4 flex w-full cursor-pointer items-center text-lg font-semibold tracking-widest text-gray-500">
                <a
                  href={`tel:+${initialValues?.phoneNumber}`}
                  className="underline hover:text-blue-600"
                  title="Call this number"
                >
                  +{initialValues?.phoneNumber}
                </a>
                <ShieldCheck className="ml-3 text-green-500" size={20} />
                <Button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      initialValues.phoneNumber as string,
                      "Phone Number",
                    )
                  }
                  className="ml-8 h-fit bg-slate-600 p-1 text-gray-500 hover:bg-slate-900 hover:shadow-md"
                >
                  <Copy className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          )}

          {/* company name */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base max-sm:w-fit lg:text-lg">
                  Company Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="Company Name"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-1 mt-1">
                    Enter your company name.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
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
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-52 justify-between text-base max-sm:w-fit lg:text-lg">
                  Expiry Date <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-fit flex-col items-start">
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="MM/dd/yyyy"
                      wrapperClassName="datePicker text-base -ml-4 "
                    />
                  </FormControl>
                  <FormDescription className="ml-1 mt-1">
                    Enter the expiry of your Commercial License/Trade License.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* registration number */}
          <FormField
            control={form.control}
            name="regNumber"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base max-sm:w-fit lg:text-lg">
                  Registration Number/Trade License Number{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="Enter company registration number"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-1 mt-1">
                    Enter your company registration number. The number should be
                    a combination of letters and numbers, without any spaces or
                    special characters, up to 15 characters.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyLanguages"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base max-sm:w-fit lg:text-lg">
                  Supported Languages{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <CompanyLanguagesDropdown
                      value={field.value}
                      onChangeHandler={field.onChange}
                      placeholder="Languages"
                    />
                  </FormControl>
                  <FormDescription className="ml-1 mt-1">
                    Select all the languages the staff can speak or understand.
                    These will be displayed on company's public profile page,
                    helping customers feel comfortable with communication.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
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
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex h-fit w-52 min-w-52 justify-between text-base lg:text-lg">
                    Company Address
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <Textarea
                        placeholder="Company Address"
                        {...field}
                        className={`textarea h-28 rounded-xl transition-all duration-300`} // Dynamic height
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="flex-between ml-2 mt-1 w-full">
                      <span className="w-full max-w-[90%]">
                        Provide company address. This will be showed in the
                        public company profile page. 150 characters max.
                      </span>{" "}
                      <span className="ml-auto"> {`${charCount}/150`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />
        </div>

        {/* submit */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="flex-center h-12 w-full bg-yellow text-lg font-semibold text-white hover:bg-yellow hover:text-white hover:shadow-lg"
        >
          Update
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
