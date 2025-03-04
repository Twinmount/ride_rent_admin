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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PrimaryFormDefaultValues } from "@/constants";
import { PrimaryFormSchema } from "@/lib/validator";
import { PrimaryFormType } from "@/types/formTypes";
import YearPicker from "../YearPicker";
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
import VehicleDescriptionTextEditor from "../VehicleDescriptionTextEditor";
import { FormContainer } from "../form-ui/FormContainer";
import { FormItemWrapper } from "../form-ui/FormItemWrapper";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormCheckbox } from "../form-ui/FormCheckbox";

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
    initialCountryCode || "971",
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
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* Vehicle Category */}
        <FormField
          control={form.control}
          name="vehicleCategoryId"
          render={({ field }) => (
            <FormItemWrapper
              label="Vehicle Category"
              description={
                isCategoryDisabled
                  ? "Cannot change category of published vehicle"
                  : "Select vehicle category"
              }
            >
              <CategoryDropdown
                onChangeHandler={(value) => {
                  field.onChange(value);
                  form.setValue("vehicleTypeId", "");
                  form.setValue("vehicleBrandId", "");

                  // Reset `commercialLicenses` if the category is bicycles or buggies
                  if (
                    [
                      "b21e0a75-37bc-430b-be3a-c8c0939ef3ec", // buggies
                      "0ad5ac71-5f8f-43c3-952f-a325e362ad87", // bicycles
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
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Type */}
        <FormField
          control={form.control}
          name="vehicleTypeId"
          render={({ field }) => (
            <FormItemWrapper
              label="Vehicle Type"
              description="Select vehicle type"
            >
              <VehicleTypesDropdown
                vehicleCategoryId={form.watch("vehicleCategoryId")}
                value={field.value}
                onChangeHandler={field.onChange}
                isDisabled={!form.watch("vehicleCategoryId")}
              />
            </FormItemWrapper>
          )}
        />

        {/* Additional Services Dropdown for Cars */}
        {isCarsCategory && (
          <FormField
            control={form.control}
            name="additionalVehicleTypes"
            render={({ field }) => (
              <FormItemWrapper
                label={
                  <div>
                    Services Offered <br />
                    <span>&#40;optional&#41;</span>
                  </div>
                }
                description="(optional) Select additional services for this vehicle if available"
              >
                <AdditionalTypesDropdown
                  value={field.value || []}
                  onChangeHandler={field.onChange}
                  vehicleTypeId={form.watch("vehicleTypeId")}
                  isDisabled={!form.watch("vehicleTypeId")}
                />
              </FormItemWrapper>
            )}
          />
        )}

        {/* Brand Name */}
        <FormField
          control={form.control}
          name="vehicleBrandId"
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

        {/* Model Name */}
        <FormField
          control={form.control}
          name="vehicleModel"
          render={({ field }) => (
            <FormItemWrapper
              label="Model Name"
              description={
                <>
                  Enter the model name, e.g.,{" "}
                  <strong>"Mercedes-Benz C-Class 2024 Latest Model."</strong>
                </>
              }
            >
              <Input
                placeholder="e.g., 'Model'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Title */}
        <FormField
          control={form.control}
          name="vehicleTitle"
          render={({ field }) => {
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            );
            const handleInputChange = (
              e: React.ChangeEvent<HTMLInputElement>,
            ) => {
              setCharCount(e.target.value.length);
              field.onChange(e);
            };

            return (
              <FormItemWrapper
                label="Vehicle Title"
                description={
                  <>
                    <span className="w-full max-w-[90%]">
                      Provide vehicle title. This will be used for showing the
                      vehicle <strong>title of the vehicle details page</strong>
                      , and also for the <strong>SEO meta data</strong>{" "}
                      purposes. 100 characters max.
                    </span>{" "}
                    <span className="ml-auto"> {`${charCount}/100`}</span>
                  </>
                }
              >
                <Input
                  placeholder="e.g., 'Vehicle Title'"
                  value={field.value}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </FormItemWrapper>
            );
          }}
        />

        {/* Location (State) */}
        <FormField
          control={form.control}
          name="stateId"
          render={({ field }) => (
            <FormItemWrapper
              label="Location"
              description="Choose your state/location"
            >
              <StatesDropdown
                onChangeHandler={(value) => {
                  field.onChange(value);
                  // when state changes, reset cities and all the seven fields thats under "vehicleSeries" and metadata fields
                  form.setValue("cityIds", []);
                  form.setValue("vehicleSeriesLabel", "");
                  form.setValue("vehicleSeries", "");
                  form.setValue("vehicleSeriesPageHeading", "");
                  form.setValue("vehicleSeriesPageSubheading", "");
                  form.setValue("vehicleSeriesInfoTitle", "");
                  form.setValue("vehicleSeriesInfoDescription", "");
                  form.setValue("vehicleSeriesMetaTitle", "");
                  form.setValue("vehicleSeriesMetaDescription", "");
                  form.setValue("vehicleMetaTitle", "");
                  form.setValue("vehicleMetaDescription", "");
                }}
                value={initialValues.stateId}
                placeholder="location"
              />
            </FormItemWrapper>
          )}
        />

        {/* City / Serving Areas */}
        <FormField
          control={form.control}
          name="cityIds"
          render={({ field }) => (
            <FormItemWrapper
              label={
                <span>
                  City / Serving Areas <br />
                  <span className="text-xs text-gray-500">
                    (multiple selection allowed)
                  </span>
                </span>
              }
              description="Select all the cities of operation/serving areas."
            >
              <CitiesDropdown
                stateId={form.watch("stateId")}
                value={field.value}
                onChangeHandler={field.onChange}
                placeholder="cities"
              />
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Series related 7  fields */}
        <div className="my-5 border-b border-t border-b-gray-300 border-t-gray-300 py-9">
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
                <VehicleSeriesSearch
                  value={field.value}
                  vehicleBrandId={form.watch("vehicleBrandId")}
                  stateId={form.watch("stateId")}
                  onChangeHandler={({
                    seriesLabel,
                    heading,
                    subHeading,
                    infoTitle,
                    infoDescription,
                    metaTitle,
                    metaDescription,
                  }) => {
                    field.onChange(seriesLabel);

                    const sanitizedSeries = seriesLabel
                      .replace(/[^a-zA-Z0-9-\s]/g, "") // Remove invalid characters
                      .replace(/\s+/g, " ") // Normalize spaces
                      .trim(); // Trim leading/trailing spaces
                    // Reset or set meta fields to empty strings if not provided
                    form.setValue(
                      "vehicleSeries",
                      sanitizeStringToSlug(sanitizedSeries) ?? "",
                    );

                    form.setValue("vehicleSeriesPageHeading", heading ?? "");
                    form.setValue(
                      "vehicleSeriesPageSubheading",
                      subHeading ?? "",
                    );
                    form.setValue("vehicleSeriesInfoTitle", infoTitle ?? "");
                    form.setValue(
                      "vehicleSeriesInfoDescription",
                      infoDescription ?? "",
                    );
                    form.setValue("vehicleSeriesMetaTitle", metaTitle ?? "");
                    form.setValue(
                      "vehicleSeriesMetaDescription",
                      metaDescription ?? "",
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
                    This will be displayed as the <strong>heading</strong> of
                    the series listing page.
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
                    This will be displayed as the <strong>sub-heading</strong>{" "}
                    of the series listing page.
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
                        Enter the series info description for this series. It
                        will be displayed as the info box description in the
                        Next.js series listing page.
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
        </div>

        {/* Registration Number */}
        <FormField
          control={form.control}
          name="vehicleRegistrationNumber"
          render={({ field }) => (
            <FormItemWrapper
              label="Registration Number"
              description={
                <span>
                  Enter your vehicle registration number (e.g.,{" "}
                  <strong>ABC12345</strong>).
                  <br />
                  The number should be a combination of letters and numbers,
                  without spaces or special characters, up to 15 characters.
                </span>
              }
            >
              <Input
                placeholder="e.g., ABC12345"
                {...field}
                className="input-field"
                type="text"
                onKeyDown={(e) => {
                  // Allow only alphanumeric characters and control keys
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
            </FormItemWrapper>
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
                    Upload <span className="font-bold text-yellow">front</span>{" "}
                    & <span className="font-bold text-yellow">back</span> images
                    of the Registration Card /{" "}
                    {isCustomCommercialLicenseLabel ? "Certificate" : "Mulkia"}
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

        {/* Registration Card / Mulkia Expiry Date */}
        <FormField
          control={form.control}
          name="commercialLicenseExpireDate"
          render={({ field }) => (
            <FormItemWrapper
              label={
                <span>
                  Registration Card / Mulkia Expiry Date <br />
                  <span className="text-sm text-gray-500">(DD/MM/YYYY)</span>
                </span>
              }
              description="Enter the expiry date for the Registration Card/Mulkia in the format DD/MM/YYYY."
            >
              <DatePicker
                selected={field.value}
                onChange={(date: Date | null) => field.onChange(date)}
                dateFormat="dd/MM/yyyy"
                wrapperClassName="datePicker text-base -ml-4"
                placeholderText="DD/MM/YYYY"
              />
            </FormItemWrapper>
          )}
        />

        {/* Registered Year */}
        <FormField
          control={form.control}
          name="vehicleRegisteredYear"
          render={({ field }) => (
            <FormItemWrapper
              label="Registered Year"
              description="Enter the year in which the vehicle was registered."
            >
              <YearPicker
                onChangeHandler={field.onChange}
                value={initialValues.vehicleRegisteredYear}
                placeholder="year"
              />
            </FormItemWrapper>
          )}
        />

        {/* Specification */}
        <FormField
          control={form.control}
          name="specification"
          render={({ field }) => (
            <FormItemWrapper
              label="Specification"
              description="Select the regional specification of the vehicle"
            >
              <div className="mt-2">
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
              </div>
            </FormItemWrapper>
          )}
        />

        {/* Phone / Whatsapp Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItemWrapper
              label="Whatsapp/Mobile"
              description={
                <span>
                  Enter the{" "}
                  <span className="font-semibold text-green-400">WhatsApp</span>{" "}
                  mobile number. This number will receive direct booking
                  details.
                </span>
              }
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
                    "bg-white !border-none outline-none !rounded-xl mr-1",
                  style: {
                    border: "none",
                  },
                  buttonClassName:
                    "!border-none outline-none !h-[52px] !w-[50px] !rounded-xl !bg-gray-100",
                }}
              />
            </FormItemWrapper>
          )}
        />

        {/* Rental Details */}
        <FormField
          control={form.control}
          name="rentalDetails"
          render={() => {
            return (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base font-semibold lg:text-lg">
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

        {/* Vehicle  Meta Title */}
        <FormField
          control={form.control}
          name="vehicleMetaTitle"
          render={({ field }) => (
            <FormItemWrapper
              label="Vehicle Meta Title"
              description={
                <span>
                  Enter the meta title for this vehicle. This will be used as
                  the Meta Title in the vehicle-details-page in Nextjs.
                  <br /> Only alphanumeric characters are allowed.
                </span>
              }
            >
              <Input
                placeholder="Vehicle Meta Title"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Meta Description */}
        <FormField
          control={form.control}
          name="vehicleMetaDescription"
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
                label="Vehicle Meta Description"
                description={
                  <span className="flex flex-col">
                    <span>
                      Provide a meta description for this vehicle. This will be
                      used as the Meta Description in the vehicle-details-page
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

        {/* Lease */}
        <FormField
          control={form.control}
          name="isLease"
          render={({ field }) => (
            <FormItemWrapper
              label="Lease?"
              description="Select if this vehicle is available for lease."
            >
              <FormCheckbox
                id="isLease"
                label="Available for lease?"
                checked={field.value}
                onChange={field.onChange}
              />
            </FormItemWrapper>
          )}
        />

        {/* Security Deposit */}
        <FormField
          control={form.control}
          name="securityDeposit"
          render={() => (
            <FormItemWrapper
              label="Security Deposit"
              description="Specify if a security deposit is required and provide the amount if applicable."
            >
              <SecurityDepositField />
            </FormItemWrapper>
          )}
        />

        {/* Payment Info */}
        <div className="mb-2 flex w-full max-sm:flex-col max-sm:space-y-1">
          <FormItemWrapper
            label="Payment Info"
            description="Select the payment methods your company supports."
          >
            <div className="w-full rounded-lg border-b p-2 shadow">
              {/* Crypto */}
              <FormField
                control={form.control}
                name="isCryptoAccepted"
                render={({ field }) => (
                  <div className="mb-2">
                    <FormCheckbox
                      id="isCryptoAccepted"
                      label="Crypto"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                    <FormDescription className="ml-7 mt-1">
                      Select if your company accepts payments via
                      cryptocurrency.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                )}
              />

              {/* Credit/Debit Cards */}
              <FormField
                control={form.control}
                name="isCreditOrDebitCardsSupported"
                render={({ field }) => (
                  <div className="mb-2">
                    <FormCheckbox
                      id="isCreditDebitCard"
                      label="Credit / Debit Card"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                    <FormDescription className="ml-7 mt-1">
                      Select if your company accepts payments via credit or
                      debit cards.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                )}
              />

              {/* Tabby */}
              <FormField
                control={form.control}
                name="isTabbySupported"
                render={({ field }) => (
                  <div className="mb-2">
                    <FormCheckbox
                      id="isTabby"
                      label="Tabby"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                    <FormDescription className="ml-7 mt-1">
                      Select if your company accepts payments via Tabby.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                )}
              />
            </div>
          </FormItemWrapper>
        </div>

        {/* Spot Delivery */}
        <FormField
          control={form.control}
          name="isSpotDeliverySupported"
          render={({ field }) => (
            <FormItemWrapper
              label="Spot Delivery?"
              description="Select this option if your company offers on-the-spot delivery services."
            >
              <FormCheckbox
                id="isSpotDeliverySupported"
                label="Offer spot delivery service?"
                checked={field.value}
                onChange={field.onChange}
              />
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <VehicleDescriptionTextEditor
              content={field.value}
              onUpdate={(updatedContent) => field.onChange(updatedContent)}
            />
          )}
        />

        {/* Submit */}
        <FormSubmitButton
          text={type === "Add" ? "Add Vehicle" : "Update Vehicle"}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
