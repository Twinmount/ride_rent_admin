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
        navigate("/registrations");
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
        queryKey: ["company-details-page", { exact: true }],
      });
    }
  }

  const handleCopyAgentId = () => {
    navigator.clipboard.writeText(initialValues.agentId || "");
    toast({
      title: "Copied to clipboard",
      description: "Agent ID has been copied to your clipboard.",
      className: "bg-green-500 text-white",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[800px] mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8 border-t shadow-md"
      >
        <div className="flex flex-col gap-5 p-3 mx-auto w-full rounded-3xl">
          {/* agent id */}
          <div className="flex mb-2 w-full max-sm:flex-col">
            <div className="flex justify-between mt-4 ml-2 w-72 text-base font-semibold max-sm:w-fit lg:text-lg">
              Your Agent Id <span className="mr-5 max-sm:hidden">:</span>
            </div>
            <div className="flex items-center mt-4 w-full text-lg font-semibold text-gray-500 cursor-default">
              {initialValues.agentId}{" "}
              <ShieldCheck className="ml-3 text-green-500" size={20} />
              <Button
                type="button"
                onClick={handleCopyAgentId} // Call the copy handler
                className="p-1 ml-8 text-gray-500 h-fit bg-slate-600 hover:bg-slate-900 hover:shadow-md"
              >
                <Copy className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>

          {/* company name */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  Company Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="Company Name"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
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
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-52 text-base max-sm:w-fit lg:text-lg">
                  Expiry Date <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-fit">
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="MM/dd/yyyy"
                      wrapperClassName="datePicker text-base -ml-4 "
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
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
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base max-sm:w-fit lg:text-lg">
                  Registration Number{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="Enter company registration number"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="mt-1 ml-1">
                    Enter your company registration number. The number should be
                    a combination of letters and numbers, without any spaces or
                    special characters, up to 15 characters.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* submit */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full h-12 text-lg font-semibold text-white flex-center bg-yellow hover:bg-yellow hover:text-white hover:shadow-lg"
        >
          Update
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
