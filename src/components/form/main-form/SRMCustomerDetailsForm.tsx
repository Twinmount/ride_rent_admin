import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormField } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { SRMCustomerDetailsFormDefaultValues } from "@/constants";
import { SRMCustomerDetailsFormSchema } from "@/lib/validator";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { deleteMultipleFiles } from "@/helpers/form";
import { toast } from "@/components/ui/use-toast";
import { GcsFilePaths } from "@/constants/enum";
import SingleFileUpload from "../file-uploads/SingleFileUpload";

import { useFormValidationToast } from "@/hooks/useFormValidationToast";

import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormContainer } from "../form-ui/FormContainer";
import MultipleFileUpload from "../file-uploads/MultipleFileUpload";
import { useQueryClient } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
import SRMNationalityDropdown from "../dropdowns/SRMNationalityDropdown";
import { FormItemWrapper } from "../form-ui/FormItemWrapper";
import { SRMCustomerDetailsFormType } from "@/types/formTypes";
import { createSRMCustomer } from "@/api/srm";

type SRMCustomerDetailsFormProps = {
  type: "Add" | "Update";
  formData?: SRMCustomerDetailsFormType | null;
};

export default function SRMCustomerDetailsForm({
  type,
  formData,
}: SRMCustomerDetailsFormProps) {
  const [countryCode, setCountryCode] = useState<string>("");
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // const { customerId } = useParams<{ customerId: string }>();

  //  initial default values for the form
  const initialValues = formData
    ? formData
    : SRMCustomerDetailsFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof SRMCustomerDetailsFormSchema>>({
    resolver: zodResolver(SRMCustomerDetailsFormSchema),
    defaultValues: initialValues as SRMCustomerDetailsFormType,
  });

  const handleNewCustomerBooking = async (
    values: SRMCustomerDetailsFormType,
    countryCode: string,
  ) => {
    // create new customer
    const customerData = await createSRMCustomer(values, countryCode);

    return customerData;
  };

  // Define a submit handler.
  async function onSubmit(
    values: z.infer<typeof SRMCustomerDetailsFormSchema>,
  ) {
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
        // Handle new customer booking
        data = await handleNewCustomerBooking(values, countryCode);
      }

      if (data) {
        await deleteMultipleFiles(deletedFiles);
        toast({
          title: `Customer ${type.toLowerCase()} successful`,
          className: "bg-yellow text-white",
        });

        queryClient.invalidateQueries({
          queryKey: ["srm-trips"],
        });
      }
    } catch (error: any) {
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.error?.message === "Customer already exists"
      ) {
        toast({
          variant: "destructive",
          title: "Customer Already Exists",
          description:
            "A customer with the same passport / driving license / phone number is already registered.",
          duration: 5000,
        });
      } else {
        toast({
          variant: "destructive",
          title: `${type} Customer failed`,
          description: "Something went wrong",
        });
      }
      console.error(error);
    }
  }

  // custom hook to validate form
  useFormValidationToast(form);

  return (
    <div className="flex flex-col">
      {/* Form container */}
      <Form {...form}>
        <FormContainer onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          {/* customer name */}
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItemWrapper
                label="Customer Name"
                description={
                  "Provide customer name. You can search existing customer also."
                }
              >
                <Input
                  placeholder="Enter customer name"
                  {...field}
                  className="input-field"
                  readOnly
                />
              </FormItemWrapper>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItemWrapper
                label="Customer Email"
                description="Enter customers email"
              >
                <Input
                  placeholder="Enter email"
                  {...field}
                  type="email"
                  className="input-field"
                />
              </FormItemWrapper>
            )}
          />

          {/* user profile */}
          <FormField
            control={form.control}
            name="customerProfilePic"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Customer Profile "
                description="Customer profile can have a maximum size of 5MB."
                existingFile={null}
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                isDownloadable={true}
                downloadFileName={"user profile"}
                setDeletedImages={setDeletedFiles}
              />
            )}
          />

          {/* Nationality */}
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItemWrapper
                label="Nationality"
                description="Select customer's nationality"
              >
                <SRMNationalityDropdown
                  value={field.value}
                  onChangeHandler={field.onChange}
                />
              </FormItemWrapper>
            )}
          />

          {/* Passport Number */}
          <FormField
            control={form.control}
            name="passportNumber"
            render={({ field }) => (
              <FormItemWrapper
                label="Passport Number"
                description="Enter customers passport number"
              >
                <Input
                  placeholder="Enter passport number"
                  {...field}
                  className="input-field"
                />
              </FormItemWrapper>
            )}
          />

          <FormField
            control={form.control}
            name="passport"
            render={() => {
              const watchedPassport = form.watch("passport") ?? [];
              const existingFiles =
                watchedPassport.length > 0
                  ? watchedPassport
                  : (initialValues.passport ?? []);

              return (
                <MultipleFileUpload
                  key={existingFiles.join(",")}
                  name="passport"
                  label="Passport Images"
                  existingFiles={existingFiles}
                  description="Upload both front and back of the passport."
                  maxSizeMB={5}
                  setIsFileUploading={setIsFileUploading}
                  bucketFilePath={GcsFilePaths.IMAGE}
                  isFileUploading={isFileUploading}
                  downloadFileName="passport"
                  setDeletedFiles={setDeletedFiles}
                />
              );
            }}
          />

          {/* Driving License Number */}
          <FormField
            control={form.control}
            name="drivingLicenseNumber"
            render={({ field }) => (
              <FormItemWrapper
                label="Driving License Number"
                description="Enter customers driving license number"
              >
                <Input
                  placeholder="Enter driving license number"
                  {...field}
                  className="input-field"
                />
              </FormItemWrapper>
            )}
          />

          <FormField
            control={form.control}
            name="drivingLicense"
            render={() => {
              const watchedDrivingLicense = form.watch("drivingLicense") ?? [];
              const existingFiles =
                watchedDrivingLicense.length > 0
                  ? watchedDrivingLicense
                  : (initialValues.drivingLicense ?? []);

              return (
                <MultipleFileUpload
                  key={existingFiles.join(",")}
                  name="drivingLicense"
                  label="Driving License Images"
                  existingFiles={existingFiles}
                  description="Upload both front and back of the driving license."
                  maxSizeMB={5}
                  setIsFileUploading={setIsFileUploading}
                  bucketFilePath={GcsFilePaths.IMAGE}
                  isFileUploading={isFileUploading}
                  downloadFileName="driving-license"
                  setDeletedFiles={setDeletedFiles}
                />
              );
            }}
          />

          {/* mobile */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItemWrapper
                label="Mobile Number"
                description="Enter the contact details of the customer"
              >
                <PhoneInput
                  defaultCountry="ae"
                  value={field.value}
                  onChange={(value, country) => {
                    field.onChange(value);
                    setCountryCode(country.country.dialCode);
                  }}
                  className="flex items-center"
                  inputClassName="input-field !w-full !text-base"
                  countrySelectorStyleProps={{
                    className:
                      "bg-white !border-none outline-none !rounded-xl  mr-1",
                    style: {
                      border: "none ",
                    },
                    buttonClassName:
                      "!border-none outline-none !h-[52px] !w-[50px] !rounded-xl !bg-gray-100",
                  }}
                />
              </FormItemWrapper>
            )}
          />

          {type === "Add" && (
            <p className="-mb-2 text-center text-sm font-semibold text-red-500">
              Warning: Please double check and ensure the accuracy of the
              details to avoid potential consequences.
            </p>
          )}

          {/* submit  */}

          <FormSubmitButton
            text={type === "Add" ? "Add Customer" : "Update Customer"}
            isLoading={form.formState.isSubmitting}
          />
        </FormContainer>
      </Form>
    </div>
  );
}
