import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PrimaryFormDefaultValues } from "@/constants";
import { PrimaryFormSchema } from "@/lib/validator";
import { PrimaryFormType } from "@/types/formTypes";
import YearPicker from "../YearPicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import RentalDetailsFormField from "../RentalDetailsFormField";
import MultipleFileUpload from "../file-uploads/MultipleFileUpload";
import { validateRentalDetailsAndSecurityDeposit } from "@/helpers/form";
import BrandsDropdown from "../dropdowns/BrandsDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CitiesDropdown from "../dropdowns/CitiesDropdown";
import CategoryDropdown from "../dropdowns/CategoryDropdown";
import VehicleTypesDropdown from "../dropdowns/VehicleTypesDropdown";
import StatesDropdown from "../dropdowns/StatesDropdown";
import { save, StorageKeys } from "@/utils/storage";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { useParams } from "react-router-dom";
import { ApiError } from "@/types/types";
import { Textarea } from "@/components/ui/textarea";
import { GcsFilePaths } from "@/constants/enum";
import AdditionalTypesDropdown from "../dropdowns/AdditionalTypesDropdown";
import SecurityDepositField from "../SecurityDepositField";
import { useQueryClient } from "@tanstack/react-query";
import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import {
  showFileUploadInProgressToast,
  showSuccessToast,
} from "@/utils/toastUtils";
import { handleLevelOneFormSubmission } from "@/utils/form-utils";
import VehicleSeriesSearch from "../dropdowns/VehicleSeriesSearch";
import { sanitizeStringToSlug } from "@/lib/utils";

type PrimaryFormProps = {
  type: "Add" | "Update";
  formData?: PrimaryFormType | null;
  onNextTab?: () => void;
  initialCountryCode?: string;
  levelsFilled?: number;
};

export default function PrimaryDetailsForm({
  type,
  onNextTab,
  formData,
  levelsFilled,
  initialCountryCode,
}: PrimaryFormProps) {
  const [countryCode, setCountryCode] = useState<string>(
    initialCountryCode || "+971",
  );
  const [isPhotosUploading, setIsPhotosUploading] = useState(false);
  const [isLicenseUploading, setIsLicenseUploading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [isCarsCategory, setIsCarsCategory] = useState(false);
  const [hideCommercialLicenses, setHideCommercialLicenses] = useState(false);

  const { vehicleId, userId } = useParams<{
    vehicleId: string;
    userId: string;
  }>();

  const queryClient = useQueryClient();

  const initialValues = formData ? formData : PrimaryFormDefaultValues;

  // Define your form.
  const form = useForm<z.infer<typeof PrimaryFormSchema>>({
    resolver: zodResolver(PrimaryFormSchema),
    defaultValues: initialValues as PrimaryFormType,
    shouldFocusError: true,
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof PrimaryFormSchema>) {
    const validationError = validateRentalDetailsAndSecurityDeposit(values);

    if (validationError) {
      form.setError(validationError.fieldName, {
        type: "manual",
        message: validationError.errorMessage,
      });
      form.setFocus(validationError.fieldName);
      return;
    }

    if (isPhotosUploading || isLicenseUploading) {
      showFileUploadInProgressToast();
      return;
    }

    // Append other form data
    try {
      const data = await handleLevelOneFormSubmission(
        type,
        values as PrimaryFormType,
        {
          countryCode,
          userId,
          vehicleId,
          isCarsCategory,
          deletedFiles,
        },
      );

      if (data) {
        showSuccessToast(type);

        if (type === "Add") {
          save(StorageKeys.VEHICLE_ID, data.result.vehicleId);
          save(StorageKeys.CATEGORY_ID, data.result.vehicleCategory.categoryId);
          save(StorageKeys.VEHICLE_TYPE_ID, data.result.vehicleType.typeId);

          if (onNextTab) onNextTab();
        }
      }
    } catch (error) {
      const apiError = error as ApiError;

      if (
        apiError.response?.data?.error?.message ===
        "We already have a vehicle registered with this registration number"
      ) {
        form.setError("vehicleRegistrationNumber", {
          type: "manual",
          message:
            "This registration number is already registered. Please use a different one.",
        });
        form.setFocus("vehicleRegistrationNumber");
      } else {
        toast({
          variant: "destructive",
          title: `${type} Vehicle failed`,
          description: "Something went wrong",
        });
      }
      console.error(error);
    } finally {
      // invalidating cached data in the listing page
      queryClient.invalidateQueries({
        queryKey: ["listings", vehicleId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["primary-details-form", vehicleId],
        exact: true,
      });
    }
  }

  // custom hook to validate complex form fields
  useFormValidationToast(form);

  const vehicleCategoryId = form.watch("vehicleCategoryId");

  // boolean to check whether custom label should show or not
  const isCustomCommercialLicenseLabel = [
    "ff31e5e3-9879-464f-a0dd-97ead07a9f67", // Yachts
    "dd7b3369-688c-471a-b2dc-585d60a757f2", // Leisure Boats
    "3f249138-f0ee-48f2-bc70-db5dcf20f0f3", // Charters
  ].includes(vehicleCategoryId);

  // category dropdown is disabled if levels filled is 3
  const isCategoryDisabled = levelsFilled === 3;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full flex-col gap-5 rounded-3xl bg-white p-2 py-8 !pb-8 md:p-4"
      >
        <div className="mx-auto flex w-full max-w-full flex-col gap-5 md:max-w-[800px]">
          {/* Vehicle Category */}
          <FormField
            control={form.control}
            name="vehicleCategoryId"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base max-sm:w-fit lg:text-lg">
                  Vehicle Category <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="w-full flex-col items-start">
                  <FormControl>
                    <CategoryDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value);
                        form.setValue("vehicleTypeId", "");
                        form.setValue("vehicleBrandId", "");

                        // Reset `commercialLicenses` if the category is bicycles or buggies
                        if (
                          [
                            "b21e0a75-37bc-430b-be3a-c8c0939ef3ec", //buggies
                            "0ad5ac71-5f8f-43c3-952f-a325e362ad87", //bicycles
                          ].includes(value)
                        ) {
                          form.setValue("commercialLicenses", []);
                        }
                      }}
                      value={initialValues.vehicleCategoryId}
                      setIsCarsCategory={setIsCarsCategory}
                      setHideCommercialLicenses={setHideCommercialLicenses}
                      isDisabled={isCategoryDisabled}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    {isCategoryDisabled
                      ? "Cannot change category of published vehicle"
                      : "select vehicle category"}
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vehicle Type  */}
          <FormField
            control={form.control}
            name="vehicleTypeId"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Vehicle Type <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="w-full flex-col items-start">
                  <FormControl>
                    <VehicleTypesDropdown
                      vehicleCategoryId={form.watch("vehicleCategoryId")}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      isDisabled={!form.watch("vehicleCategoryId")}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    select vehicle type
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* services dropdown for cars */}
          {isCarsCategory && (
            <FormField
              control={form.control}
              name="additionalVehicleTypes"
              render={({ field }) => (
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                    <div>
                      Services Offered <br />
                      <span>&#40;optional&#41;</span>
                    </div>

                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <AdditionalTypesDropdown
                        value={field.value || []}
                        onChangeHandler={field.onChange}
                        vehicleTypeId={form.watch("vehicleTypeId")}
                        isDisabled={!form.watch("vehicleTypeId")}
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      &#40;optional&#41; Select additional services for this
                      vehicle if available
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />
          )}

          {/* Brand Name */}
          <FormField
            control={form.control}
            name="vehicleBrandId"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Brand Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <BrandsDropdown
                      vehicleCategoryId={form.watch("vehicleCategoryId")}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      isDisabled={!form.watch("vehicleCategoryId")}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Select your vehicle's Brand
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Vehicle Series */}
          <FormField
            control={form.control}
            name="vehicleSeries"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Vehicle Series <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <VehicleSeriesSearch
                      value={field.value}
                      vehicleBrandId={form.watch("vehicleBrandId")}
                      onChangeHandler={(
                        series,
                        heading,
                        subHeading,
                        metaTitle,
                        metaDescription,
                      ) => {
                        const sanitizedSeries = series
                          .replace(/[^a-zA-Z0-9-\s]/g, "") // Remove invalid characters
                          .replace(/\s+/g, " ") // Normalize spaces
                          .trim(); // Trim leading/trailing spaces

                        field.onChange(sanitizedSeries); // Set vehicleSeries

                        // Reset or set meta fields to empty strings if not provided
                        form.setValue(
                          "vehicleSeriesPageHeading",
                          heading ?? "",
                        );

                        form.setValue(
                          "vehicleSeriesPageSubheading",
                          subHeading ?? "",
                        );

                        form.setValue(
                          "vehicleSeriesMetaTitle",
                          metaTitle ?? "",
                        );
                        form.setValue(
                          "vehicleSeriesMetaDescription",
                          metaDescription ?? "",
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter or Search the vehicle series. 80 characters max.
                  </FormDescription>
                  <FormMessage />

                  {form.watch("vehicleSeries") && (
                    <div className="ml-2 mt-2 text-sm text-gray-500">
                      public site URL will be:{" "}
                      <span className="ml-2 font-semibold italic">
                        /{sanitizeStringToSlug(form.watch("vehicleSeries"))}
                      </span>
                    </div>
                  )}
                </div>
              </FormItem>
            )}
          />

          {/* Series page title */}
          <FormField
            control={form.control}
            name="vehicleSeriesPageHeading"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Series Page Heading{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: 'Rent BMW S Series'"
                      {...field}
                      className={`input-field`}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    This will be showed as the heading the Nextjs series page.
                    100 characters max.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Series Page Subtitle */}
          <FormField
            control={form.control}
            name="vehicleSeriesPageSubheading"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Series Page Subheading{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="vehicle series page sub heading"
                      {...field}
                      className={`input-field`}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    This will be showed as the sub heading in the Nextjs series
                    page. 200 characters max.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* vehicle series meta title */}
          <FormField
            control={form.control}
            name="vehicleSeriesMetaTitle"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Series Meta Title{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: 'BMW S Series'"
                      {...field}
                      className={`input-field`}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the meta title for this particular series, e.g.,
                    "Mercedes-Benz C-Class 2024. Only alpha numeric characters
                    are allowed.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Series Meta Description */}
          <FormField
            control={form.control}
            name="vehicleSeriesMetaDescription"
            render={({ field }) => {
              const [charCount, setCharCount] = useState(
                field.value?.length || 0,
              ); // To track character count

              const limit = 1000;

              const handleInputChange = (
                e: React.ChangeEvent<HTMLTextAreaElement>,
              ) => {
                setCharCount(e.target.value.length);
                field.onChange(e);
              };
              return (
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                    Series Meta Description{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <Textarea
                        placeholder="Vehicle Series Meta Description"
                        {...field}
                        onChange={handleInputChange}
                        className={`textarea h-20 rounded-2xl border-none outline-none ring-0 transition-all duration-300 focus:ring-0`}
                      />
                    </FormControl>
                    <FormDescription className="flex-between ml-2 w-full">
                      <span className="w-full max-w-[90%]">
                        Provide meta description for this vehicle.{limit}{" "}
                        characters max.
                      </span>{" "}
                      <span className="ml-auto">
                        {" "}
                        {`${charCount}/${limit}`}
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          {/* Model Name */}
          <FormField
            control={form.control}
            name="vehicleModel"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Model Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: 'Model'"
                      {...field}
                      className={`input-field`}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the model name, e.g., "Mercedes-Benz C-Class 2024
                    Latest Model.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Vehicle Title */}
          <FormField
            control={form.control}
            name="vehicleTitle"
            render={({ field }) => {
              const [charCount, setCharCount] = useState(
                field.value?.length || 0,
              ); // To track character count

              const handleInputChange = (
                e: React.ChangeEvent<HTMLTextAreaElement>,
              ) => {
                setCharCount(e.target.value.length);
                field.onChange(e);
              };

              return (
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                    Vehicle Title<span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <Textarea
                        placeholder="Vehicle Title"
                        {...field}
                        className={`textarea h-20 rounded-2xl border-none outline-none ring-0 transition-all duration-300 focus:ring-0`} // Dynamic height
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="flex-between ml-2 w-full">
                      <span className="w-full max-w-[90%]">
                        Provide vehicle title. This will be used for showing the
                        vehicle{" "}
                        <strong>title of the vehicle details page</strong>, and
                        also for the <strong>SEO meta data</strong> purposes.
                        150 characters max
                      </span>{" "}
                      <span className="ml-auto"> {`${charCount}/150`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />

          {/* Registration Number */}
          <FormField
            control={form.control}
            name="vehicleRegistrationNumber"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Registration Number{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: ABC12345"
                      {...field}
                      className={`input-field`}
                      type="text"
                      onKeyDown={(e) => {
                        // Allow only alphanumeric characters and control keys like Backspace, Delete, and Arrow keys
                        if (
                          !/[a-zA-Z0-9]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab", // To allow tabbing between fields
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter your vehicle registration number (e.g., ABC12345). The
                    number should be a combination of letters and numbers,
                    without any spaces or special characters, up to 15
                    characters.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Vehicle Photos */}
          <FormField
            control={form.control}
            name="vehiclePhotos"
            render={() => (
              <MultipleFileUpload
                name="vehiclePhotos"
                label="Vehicle Photos"
                existingFiles={initialValues.vehiclePhotos || []}
                description="Add Vehicle Photos. Up to 8 photos can be added."
                maxSizeMB={30}
                setIsFileUploading={setIsPhotosUploading}
                bucketFilePath={GcsFilePaths.IMAGE_VEHICLES}
                isFileUploading={isPhotosUploading}
                downloadFileName={
                  formData?.vehicleModel
                    ? ` ${formData.vehicleModel}`
                    : "vehicle-image"
                }
                setDeletedFiles={setDeletedFiles}
              />
            )}
          />

          {/* Registration Card / Certificate / Mulkia */}
          {!hideCommercialLicenses && (
            <FormField
              control={form.control}
              name="commercialLicenses"
              render={() => (
                <MultipleFileUpload
                  name="commercialLicenses"
                  label={
                    isCustomCommercialLicenseLabel
                      ? "Registration Card / Certificate"
                      : "Registration Card / Mulkia"
                  }
                  existingFiles={initialValues.commercialLicenses || []}
                  description={
                    <>
                      Upload{" "}
                      <span className="font-bold text-yellow">front</span> &{" "}
                      <span className="font-bold text-yellow">back</span> images
                      of the Registration Card /{" "}
                      {isCustomCommercialLicenseLabel
                        ? "Certificate"
                        : "Mulkia"}
                    </>
                  }
                  maxSizeMB={15}
                  setIsFileUploading={setIsLicenseUploading}
                  bucketFilePath={GcsFilePaths.COMMERCIAL_LICENSES}
                  isFileUploading={isLicenseUploading}
                  downloadFileName={
                    formData?.vehicleModel
                      ? `[commercial-license] - ${formData.vehicleModel}`
                      : "[commercial-license]"
                  }
                  setDeletedFiles={setDeletedFiles}
                />
              )}
            />
          )}

          {/*  Registration Card / Mulkia Expiry Date */}
          <FormField
            control={form.control}
            name="commercialLicenseExpireDate"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Registration Card / Mulkia Expiry Date{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="datePicker text-base -ml-4 "
                      placeholderText="DD/MM/YYYY"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter Registration Card/Mulkia expiry date
                    &#40;DD/MM/YYYY&#41;.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Registered Year */}
          <FormField
            control={form.control}
            name="vehicleRegisteredYear"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Registered Year <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <YearPicker
                      onChangeHandler={field.onChange}
                      value={initialValues.vehicleRegisteredYear}
                      placeholder="year"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter registered year
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Specification */}
          <FormField
            control={form.control}
            name="specification"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Specification <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl className="mt-2">
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex items-center gap-x-5"
                      defaultValue="UAE_SPEC"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="UAE_SPEC" id="UAE_SPEC" />
                        <Label htmlFor="UAE">UAE</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="USA_SPEC" id="USA_SPEC" />
                        <Label htmlFor="USA_SPEC">USA</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OTHERS" id="others" />
                        <Label htmlFor="others">Others</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription className="ml-2 mt-1">
                    Select the regional specification of the vehicle
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Whatsapp/Mobile */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Whatsapp/Mobile <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
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
                  </FormControl>
                  <FormDescription className="ml-2">
                    Enter the{" "}
                    <span className="font-semibold text-green-400">
                      WhatsApp
                    </span>{" "}
                    mobile number. This number will receive the direct booking
                    details.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Rental Details */}
          <FormField
            control={form.control}
            name="rentalDetails"
            render={() => {
              return (
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                    Rental Details <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <RentalDetailsFormField />
                    </FormControl>
                    <FormDescription className="ml-2">
                      Provide rent details. At least one of "day," "week," or
                      "month" must be selected.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />

          {/* Location (state) */}
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Location <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <StatesDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value);
                        form.setValue("cityIds", []); //
                      }}
                      value={initialValues.stateId}
                      placeholder="location"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Choose your state/location
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* City / Serving areas */}
          <FormField
            control={form.control}
            name="cityIds"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  City / Serving areas{" "}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <CitiesDropdown
                      stateId={form.watch("stateId")}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      placeholder="cities"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Select all the cities of operation/serving areas.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Lease */}
          <FormField
            control={form.control}
            name="isLease"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Lease? <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <div className="mt-3 flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow"
                        id="isLease"
                      />
                      <label
                        htmlFor="isLease"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Available for lease?
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription className="ml-6 mt-1">
                    Select if this vehicle is available for lease.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Security Deposit */}
          <FormField
            control={form.control}
            name="securityDeposit"
            render={() => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Security Deposit <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <SecurityDepositField />
                  </FormControl>
                  <FormDescription className="ml-8">
                    Specify if a security deposit is required and provide the
                    amount if applicable.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Payment Info */}
          <div className="mb-2 flex w-full max-sm:flex-col max-sm:space-y-1">
            <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
              Payment Info <span className="mr-5 max-sm:hidden">:</span>
            </FormLabel>
            <div className="w-full rounded-lg border-b p-2 shadow">
              <FormField
                control={form.control}
                name="isCryptoAccepted"
                render={({ field }) => (
                  <FormItem className="mb-2 flex w-full max-sm:flex-col">
                    <div className="w-full flex-col items-start">
                      <FormControl>
                        <div className="mt-3 flex items-center space-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow"
                            id="isCryptoAccepted"
                          />
                          <label
                            htmlFor="isCryptoAccepted"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Crypto
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription className="ml-7 mt-1">
                        Select if your company accepts payments via
                        cryptocurrency.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/* credit/debit details */}
              <FormField
                control={form.control}
                name="isCreditOrDebitCardsSupported"
                render={({ field }) => (
                  <FormItem className="mb-2 flex w-full max-sm:flex-col">
                    <div className="w-full flex-col items-start">
                      <FormControl>
                        <div className="mt-3 flex items-center space-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow"
                            id="isCreditDebitCard"
                          />
                          <label
                            htmlFor="isCreditDebitCard"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Credit / Debit card
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription className="ml-7 mt-1">
                        Select if your company accepts payments via credit or
                        debit card.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />

              {/*Tabby */}
              <FormField
                control={form.control}
                name="isTabbySupported"
                render={({ field }) => (
                  <FormItem className="mb-2 flex w-full max-sm:flex-col">
                    <div className="w-full flex-col items-start">
                      <FormControl>
                        <div className="mt-3 flex items-center space-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow"
                            id="isTabby"
                          />
                          <label
                            htmlFor="isTabby"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Tabby
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription className="ml-7 mt-1">
                        Select if your company accepts payments via Tabby.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Spot Delivery */}
          <FormField
            control={form.control}
            name="isSpotDeliverySupported"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Spot delivery? <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <div className="mt-3 flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 bg-white data-[state=checked]:border-none data-[state=checked]:bg-yellow"
                        id="isSpotDeliverySupported"
                      />
                      <label
                        htmlFor="isSpotDeliverySupported"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Offer spot delivery service?
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription className="ml-7 mt-1">
                    Select this option if your company offers on-the-spot
                    delivery services.
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* Vehicle Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              const [isFocused, setIsFocused] = useState(false); // To manage focus state
              const [charCount, setCharCount] = useState(
                field.value?.length || 0,
              ); // To track character count

              const handleFocus = () => setIsFocused(true);
              const handleBlur = () => setIsFocused(false);
              const handleInputChange = (
                e: React.ChangeEvent<HTMLTextAreaElement>,
              ) => {
                setCharCount(e.target.value.length);
                field.onChange(e);
              };

              return (
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                    Vehicle Description{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div
                    className="w-full flex-col items-start"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <FormControl>
                      <Textarea
                        placeholder="Vehicle Description"
                        {...field}
                        className={`textarea rounded-2xl border-none outline-none ring-0 transition-all duration-300 focus:ring-0 ${
                          isFocused ? "h-96" : "h-20"
                        }`} // Dynamic height
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="flex-between ml-2 w-full">
                      <span className="w-full max-w-[90%]">
                        Provide vehicle description.5000 characters max. This
                        will be showed in the Vehicle Details Page.
                      </span>{" "}
                      <span className="ml-auto"> {`${charCount}/5000`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="flex-center button hover:bg-darkYellow col-span-2 mx-auto mt-3 w-full bg-yellow !text-lg !font-semibold md:w-10/12 lg:w-8/12"
        >
          {type === "Add" ? "Add Vehicle" : "Update Vehicle"}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
