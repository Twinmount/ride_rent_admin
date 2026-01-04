import { useEffect, useState, useRef } from "react";
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
import { getPrimaryFormDefaultValues } from "@/constants";
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
import { save, StorageKeys } from "@/utils/storage";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError, Location } from "@/types/types";
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
import PriceEditModal from "../PriceEditModal";
import { validatePriceEdit } from "@/utils/validatePriceEdit";
import VehicleDescriptionTextEditor from "../VehicleDescriptionTextEditor";
import { FormContainer } from "../form-ui/FormContainer";
import { FormItemWrapper } from "../form-ui/FormItemWrapper";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";
import { FormCheckbox } from "../form-ui/FormCheckbox";
import { Switch } from "@/components/ui/switch";
import SeriesDropdown from "../dropdowns/SeriesDropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatesDropdownForVehicleForm from "../dropdowns/StatesDropdownForVehicleForm";
import LocationPicker from "../LocationPicker";
import { saveRentalPricesApi } from "../SeriesPriceTable";
import SingleFileUpload from "../file-uploads/SingleFileUpload";

type PrimaryFormProps = {
  type: "Add" | "Update";
  formData?: PrimaryFormType | null;
  onNextTab?: () => void;
  initialCountryCode?: string;
  levelsFilled?: number;
  isIndia?: boolean;
  countryId: string;
  companyLocation: Location | null;
  isAddOrIncomplete?: boolean;
};

type CityType = {
  _id?: string;
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
};

export default function PrimaryDetailsForm({
  type,
  onNextTab,
  formData,
  levelsFilled,
  initialCountryCode,
  isIndia = false,
  countryId,
  companyLocation,
  isAddOrIncomplete,
}: PrimaryFormProps) {
  const [isPhotosUploading, setIsPhotosUploading] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isLicenseUploading, setIsLicenseUploading] = useState(false);
  const [isLocationImporting, setIsLocationImporting] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [isCarsCategory, setIsCarsCategory] = useState(false);
  const [hideCommercialLicenses, setHideCommercialLicenses] = useState(false);
  const [isPriceEditModalOpen, setIsPriceEditModalOpen] = useState(false);
  const [priceEditModalProps, setPriceEditModalProps] = useState<any>(null);
  const [cities, setCities] = useState<CityType[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [temporaryCities, setTemporaryCities] = useState<CityType[]>([]);
  const [originalVehiclePhotos, setOriginalVehiclePhotos] = useState<string[]>(
    [],
  );
  const [showPhotoChangeWarning, setShowPhotoChangeWarning] = useState(true);

  const [countryCode, setCountryCode] = useState<string>(() => {
    const code = initialCountryCode || (isIndia ? "+91" : "+971");
    return code.startsWith("+") ? code : `+${code}`;
  });

  const navigate = useNavigate();

  const thumbnailWarningRef = useRef<HTMLDivElement>(null);

  const { vehicleId, userId } = useParams<{
    vehicleId: string;
    userId: string;
  }>();

  const queryClient = useQueryClient();

  const initialValues = formData
    ? {
        ...formData,
        cityIds: [
          ...formData.cityIds,
          ...(formData.tempCitys ?? []).map((city: CityType) => city.cityId),
        ],
      }
    : getPrimaryFormDefaultValues(isIndia, countryCode);

  // Define your form.
  const form = useForm<z.infer<typeof PrimaryFormSchema>>({
    resolver: zodResolver(PrimaryFormSchema),
    defaultValues: initialValues as PrimaryFormType,
    shouldFocusError: true,
  });

  useEffect(() => {
    if (initialCountryCode) {
      const normalizedCode = initialCountryCode.startsWith("+")
        ? initialCountryCode
        : `+${initialCountryCode}`;
      setCountryCode(normalizedCode);
    }
  }, [initialCountryCode]);

  useEffect(() => {
    if (type === "Update" && formData?.vehiclePhotos) {
      setOriginalVehiclePhotos([...formData.vehiclePhotos]);
    }
  }, [type, formData?.vehiclePhotos]);

  useEffect(() => {
    if (type === "Update" && originalVehiclePhotos.length > 0) {
      const currentPhotos = form.watch("vehiclePhotos") || [];

      // Check if photos changed
      const sortedOriginal = [...originalVehiclePhotos].sort();
      const sortedCurrent = [...currentPhotos].sort();

      const hasChanged =
        sortedOriginal.length !== sortedCurrent.length ||
        !sortedOriginal.every((photo, index) => photo === sortedCurrent[index]);

      setShowPhotoChangeWarning(hasChanged);
    }
  }, [form.watch("vehiclePhotos"), originalVehiclePhotos, type]);

  useEffect(() => {
    if (formData?.tempCitys && Array.isArray(formData.tempCitys)) {
      setCities((prevCities) => {
        const newCities = formData.tempCitys?.filter(
          (newCity: CityType) =>
            !prevCities.some((city) => city.cityId === newCity.cityId),
        );
        return [...prevCities, ...(newCities || [])];
      });

      setTemporaryCities(formData.tempCitys);

      setSelectedCities((prevSelected) => {
        const newCityIds = formData?.tempCitys
          ?.map((city: CityType) => city.cityId)
          .filter((id) => !prevSelected.includes(id));
        return [...prevSelected, ...(newCityIds || [])];
      });
    }
  }, [formData?.tempCitys]);

  const setVehicleLocation = (location: Location | null) => {
    if (location === null)
      return toast({
        variant: "destructive",
        title: `Location importing failed`,
        description: "Something went wrong",
      });
    setIsLocationImporting(true);
    form.setValue("location", location);
    setTimeout(() => {
      form.clearErrors("location");
      setIsLocationImporting(false);
    }, 1000);
  };

  const handleSavePrices = async (prices: {
    hourly: number;
    daily: number;
    week: number;
    monthly: number;
  }) => {
    const vehicleSeriesId = form.getValues("vehicleSeriesId") || "";
    const year = form.getValues("vehicleRegisteredYear");
    await saveRentalPricesApi(vehicleSeriesId, year, prices);
    setIsPriceEditModalOpen(false);
  };

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

    if (
      isPhotosUploading ||
      isLicenseUploading ||
      isVideoUploading ||
      isThumbnailUploading
    ) {
      showFileUploadInProgressToast();
      return;
    }

    // if photo changed, show warning
    if (showPhotoChangeWarning && values.thumbnail) {
      if (thumbnailWarningRef.current) {
        thumbnailWarningRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return;
    }

    // Only for Update, call price edit validation API before submit
    if (type === "Update" && vehicleId) {
      const vehicleSeriesId = form.getValues("vehicleSeriesId") || "";
      const year = form.getValues("vehicleRegisteredYear");
      const priceEditResult = await validatePriceEdit(vehicleSeriesId, year);
      if (!priceEditResult.ok) {
        setIsPriceEditModalOpen(true);
        setPriceEditModalProps({
          open: true,
          onClose: () => setIsPriceEditModalOpen(false),
          year:
            values.vehicleRegisteredYear?.toString() ||
            new Date().getFullYear().toString(),
          prices: { hourly: 0, daily: 0, week: 0, monthly: 0 },
          onSave: (prices: {
            hourly: number;
            daily: number;
            week: number;
            monthly: number;
          }) => handleSavePrices(prices),
        });
        return;
      }
    }

    const cityIds = selectedCities.filter((city) => !city.includes("temp-"));
    const tempCitys = cities.filter(
      (city) =>
        city.cityId.includes("temp-") && selectedCities.includes(city.cityId),
    );

    // Append other form data
    try {
      const data = await handleLevelOneFormSubmission(
        type,
        { ...values, cityIds, tempCitys } as PrimaryFormType,
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

        if (data.result) {
          setCities((prev) => {
            let approvedCities = prev.filter(
              (city) => !city.cityId.includes("temp-") && !city._id,
            );

            return [...approvedCities, ...(data.result.tempCitys || [])];
          });
          setSelectedCities([
            ...data.result.city?.map((city: CityType) => city.cityId),
            ...(data.result.tempCitys?.map((city: CityType) => city.cityId) ??
              []),
          ]);
          setTemporaryCities(data.result.tempCitys || []);
        }

        setCities((prev) =>
          prev.map((city) => {
            if (
              city.cityId.includes("temp-") &&
              !selectedCities.includes(city.cityId)
            ) {
              const { _id, ...rest } = city; // remove _id
              return rest;
            }
            return city;
          }),
        );

        if (type === "Add") {
          save(StorageKeys.VEHICLE_ID, data.result.vehicleId);
          save(StorageKeys.CATEGORY_ID, data.result.vehicleCategory.categoryId);
          save(StorageKeys.VEHICLE_TYPE_ID, data.result.vehicleType.typeId);

          if (onNextTab) onNextTab();
        } else if (type === "Update" && !isAddOrIncomplete) {
          // invalidating cached data in the listing page
          queryClient.invalidateQueries({
            queryKey: [
              "listings",
              "live-listings",
              "primary-details-form",
              "primary-details-form-default",
              vehicleId,
            ],
          });
          // navigate after 300ms
          setTimeout(() => {
            navigate("/listings/live");
          }, 300);
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
        queryKey: [
          "listings",
          "live-listings",
          "primary-details-form",
          "primary-details-form-default",
          vehicleId,
        ],
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

  const videoDownloadFileName =
    formData?.vehicleTitleH1 || formData?.vehicleTitle || "vehicle-video";
  const photoDownloadFileName =
    formData?.vehicleTitleH1 || formData?.vehicleTitle || "vehicle-photo";

  return (
    <>
      <Form {...form}>
        <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="disablePriceMatching"
            render={({ field }) => (
              <FormItem className="mt-4 flex items-center justify-end">
                <FormLabel className="mb-0 mr-2 mt-2">
                  Disable Price Matching :{" "}
                </FormLabel>
                <FormControl>
                  <Switch
                    id="disablePriceMatching"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
                  onChangeHandler={(value) => {
                    field.onChange(value);
                    form.setValue("vehicleSeriesId", "");
                    form.setValue("vehicleMetaTitle", "");
                    form.setValue("vehicleMetaDescription", "");
                  }}
                  isDisabled={!form.watch("vehicleCategoryId")}
                />
              </FormItemWrapper>
            )}
          />

          {/* Year of Manufacture */}
          <FormField
            control={form.control}
            name="vehicleRegisteredYear"
            render={({ field }) => (
              <FormItemWrapper
                label="Year of Manufacture"
                description="Enter the year in which the vehicle was manufactured."
              >
                <YearPicker
                  onChangeHandler={field.onChange}
                  value={initialValues.vehicleRegisteredYear}
                  placeholder="year"
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

          {/* is Modified */}
          <FormField
            control={form.control}
            name="isVehicleModified"
            render={({ field }) => (
              <FormItemWrapper
                label="Modified?"
                description="Select this if the vehicle is modified for show/display purposes and can't be used on the road."
              >
                <FormCheckbox
                  id="isVehicleModified"
                  label="Is this vehicle modified?"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormItemWrapper>
            )}
          />

          {/* URL label */}
          <FormField
            control={form.control}
            name="vehicleTitle"
            render={({ field }) => {
              const [charCount, setCharCount] = useState(
                field.value?.length || 0,
              );
              const [isDialogOpen, setIsDialogOpen] = useState(false);
              const [pendingValue, setPendingValue] = useState("");
              const [originalValue] = useState(field.value);
              const inputRef = useRef<HTMLInputElement>(null);

              const focusInputAtEnd = () => {
                setTimeout(() => {
                  if (inputRef.current) {
                    inputRef.current.focus();
                    const length = inputRef.current.value.length;
                    inputRef.current.setSelectionRange(length, length);
                  }
                }, 0);
              };

              const handleInputChange = (
                e: React.ChangeEvent<HTMLInputElement>,
              ) => {
                const newValue = e.target.value;
                setCharCount(newValue.length);

                if (
                  originalValue &&
                  originalValue !== newValue &&
                  field.value === originalValue
                ) {
                  setPendingValue(newValue);
                  setIsDialogOpen(true);
                } else {
                  field.onChange(e);
                }
              };

              const handleConfirm = () => {
                field.onChange({ target: { value: pendingValue } });
                setIsDialogOpen(false);
                focusInputAtEnd();
              };

              return (
                <>
                  <FormItemWrapper
                    label="URL Label"
                    description={
                      <>
                        <span className="w-full max-w-[90%]">
                          Provide url label. This will be used for creating
                          <strong>url of the vehicle details page</strong>
                        </span>{" "}
                        <span className="ml-auto"> {`${charCount}/50`}</span>
                      </>
                    }
                  >
                    <Input
                      ref={inputRef}
                      placeholder="e.g., 'URL Label'"
                      value={field.value}
                      onChange={handleInputChange}
                      className="input-field"
                      maxLength={50}
                    />
                  </FormItemWrapper>

                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                      if (!open) {
                        field.onChange({ target: { value: originalValue } });
                        focusInputAtEnd();
                      }
                      setIsDialogOpen(open);
                    }}
                  >
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="mb-4">
                          Confirm URL Label Change
                        </DialogTitle>
                        <DialogDescription>
                          Changing this URL label will change existing link. Do
                          you want to proceed with changes ?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDialogOpen(false);
                            field.onChange({
                              target: { value: originalValue },
                            });
                            focusInputAtEnd();
                          }}
                          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                        >
                          NO
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirm}
                          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                        >
                          YES
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              );
            }}
          />

          {/* Vehicle Title */}
          <FormField
            control={form.control}
            name="vehicleTitleH1"
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
                  label="Vehicle Title H1"
                  description={
                    <>
                      <span className="w-full max-w-[90%]">
                        Provide vehicle title. This will be used for showing the
                        vehicle{" "}
                        <strong>title of the vehicle details page</strong>, and
                        also for the <strong>SEO meta data</strong> purposes.
                        100 characters max.
                      </span>{" "}
                      <span className="ml-auto"> {`${charCount}/100`}</span>
                    </>
                  }
                >
                  <Input
                    placeholder="e.g., 'Vehicle Title H1'"
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
                description={
                  isIndia
                    ? "Choose your state and location"
                    : "Choose your state/location"
                }
              >
                <StatesDropdownForVehicleForm
                  onChangeHandler={(value) => {
                    field.onChange(value);
                    // when state changes, vehicle series and metadata fields
                    form.setValue("cityIds", []);
                    form.setValue("tempCitys", []); //
                    form.setValue("vehicleSeriesId", "");
                    form.setValue("vehicleMetaTitle", "");
                    form.setValue("vehicleMetaDescription", "");
                  }}
                  value={initialValues.stateId}
                  placeholder="location"
                  isIndia={isIndia}
                  countryId={countryId}
                  setCities={setCities}
                  setSelectedCities={setSelectedCities}
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
                    {isIndia
                      ? "Available Places / Areas"
                      : "City / Serving Areas"}{" "}
                    <br />
                    <span className="text-xs text-gray-500">
                      (multiple selection allowed)
                    </span>
                  </span>
                }
                description={
                  isIndia
                    ? "Select / Create serviceable. You can select up to 10 serviceable areas."
                    : "Select all the cities of operation/serving areas."
                }
              >
                <CitiesDropdown
                  stateId={form.watch("stateId")}
                  value={field.value}
                  onChangeHandler={field.onChange}
                  placeholder="cities"
                  setSelectedCities={setSelectedCities}
                  selectedCities={selectedCities}
                  cities={cities}
                  setCities={setCities}
                  setTemporaryCities={setTemporaryCities}
                  temporaryCities={temporaryCities}
                  isTempCreatable={!!isIndia}
                />
              </FormItemWrapper>
            )}
          />

          {/* Vehicle Series */}
          <FormField
            control={form.control}
            name="vehicleSeriesId"
            render={({ field }) => (
              <FormItemWrapper
                label="Vehicle Series"
                description="Select your vehicle's series under the above vehicle brand and vehicle location."
              >
                <SeriesDropdown
                  value={field.value}
                  onChangeHandler={field.onChange}
                  isDisabled={
                    !form.watch("stateId") || !form.watch("vehicleBrandId")
                  }
                  stateId={form.watch("stateId")}
                  brandId={form.watch("vehicleBrandId")}
                />
              </FormItemWrapper>
            )}
          />

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
                    <strong>{isIndia ? "KL02AB1234" : "ABC12345"}</strong>).
                    <br />
                    The number should be a combination of letters and numbers,
                    without spaces or special characters, up to 15 characters.
                  </span>
                }
              >
                <Input
                  placeholder={isIndia ? "e.g., KL02AB1234" : "e.g., ABC12345"}
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

          {/* Lease */}
          <FormField
            control={form.control}
            name="isFancyNumber"
            render={({ field }) => (
              <FormItemWrapper
                label="Fancy Number?"
                description="Select if your vehicle has a fancy/special number plate. Highlight will be shown in your public vehicle details page."
              >
                <FormCheckbox
                  id="isFancyNumber"
                  label="Fancy Number Highlight"
                  checked={field.value}
                  onChange={field.onChange}
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
                downloadFileName={photoDownloadFileName}
                setDeletedFiles={setDeletedFiles}
                isVideoAccepted={false}
                isImageAccepted={true}
              />
            )}
          />

          {/* Vehicle Thumbnail field */}
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => {
              {
                const FILE_SIZE_LIMIT = 0.1; //100kb
                return (
                  <SingleFileUpload
                    name={field.name}
                    label="Vehicle Thumbnail"
                    existingFile={formData?.thumbnail || null}
                    maxSizeMB={FILE_SIZE_LIMIT}
                    setIsFileUploading={setIsThumbnailUploading}
                    bucketFilePath={GcsFilePaths.VEHICLE_THUMBNAILS}
                    setDeletedImages={setDeletedFiles}
                    acceptedFormats={["webp"]}
                    description={
                      <div>
                        <div>
                          Upload an optimized thumbnail (WebP format, max{" "}
                          {FILE_SIZE_LIMIT * 1024}KB) for listing cards. If not
                          provided, the first vehicle photo will be used.
                        </div>
                        {showPhotoChangeWarning &&
                          form.getValues("thumbnail") && (
                            <div
                              ref={thumbnailWarningRef}
                              className="mt-2 flex items-center justify-between gap-3 rounded-md border border-blue-300 bg-blue-50 p-3"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-blue-600">ℹ️</span>
                                <p className="text-sm text-blue-700">
                                  Vehicle photos have been modified. You may
                                  want to review if the thumbnail still
                                  represents the vehicle accurately.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowPhotoChangeWarning(false);
                                }}
                                className="flex-shrink-0 rounded-md border border-blue-300 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                      </div>
                    }
                  />
                );
              }
            }}
          />

          {/* Vehicle Videos */}
          <FormField
            control={form.control}
            name="vehicleVideos"
            render={() => (
              <MultipleFileUpload
                name="vehicleVideos"
                label="Vehicle Video"
                existingFiles={initialValues.vehicleVideos || []}
                description="Add Vehicle Videos (if any). Up to 1 video can be added."
                maxVideoSizeMB={100}
                setIsFileUploading={setIsVideoUploading}
                bucketFilePath={GcsFilePaths.VIDEO_VEHICLES}
                isFileUploading={isVideoUploading}
                downloadFileName={videoDownloadFileName}
                setDeletedFiles={setDeletedFiles}
                isVideoAccepted={true}
                isImageAccepted={false}
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
                      ? `Registration Card ${isIndia ? "" : "/ Certificate"}`
                      : `Registration Card  ${isIndia ? "" : "/ Mulkia"}`
                  }
                  existingFiles={initialValues.commercialLicenses || []}
                  description={
                    <>
                      Upload{" "}
                      <span className="font-bold text-yellow">front</span> &{" "}
                      <span className="font-bold text-yellow">back</span> images
                      of the Registration Card{" "}
                      {!isIndia
                        ? isCustomCommercialLicenseLabel
                          ? "/ Certificate"
                          : "/ Mulkia"
                        : ""}
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
                    {`Registration Card ${isIndia ? "" : "/ Mulkia"} Expiry Date`}{" "}
                    <br />
                    <span className="text-sm text-gray-500">(DD/MM/YYYY)</span>
                  </span>
                }
                description={`Enter the expiry date for the Registration Card ${
                  isIndia ? "" : "/ Mulkia"
                } in the format DD/MM/YYYY.`}
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
                  >
                    {isIndia && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="India_SPEC" id="India_SPEC" />
                        <Label htmlFor="India">India</Label>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="UAE_SPEC" id="UAE_SPEC" />
                      <Label htmlFor="UAE">GCC</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="USA_SPEC" id="USA_SPEC" />
                      <Label htmlFor="USA_SPEC">USA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="OTHERS" id="others" />
                      <Label htmlFor="others">Other</Label>
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
                    <span className="font-semibold text-green-400">
                      WhatsApp
                    </span>{" "}
                    mobile number. This number will receive direct booking
                    details.
                  </span>
                }
              >
                <PhoneInput
                  defaultCountry={isIndia ? "in" : "ae"}
                  value={field.value}
                  onChange={(value, country) => {
                    field.onChange(value);
                    const newCountryCode = `+${country.country.dialCode}`;
                    setCountryCode(newCountryCode);
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

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItemWrapper
                label="Vehicle Location"
                description={
                  <span>
                    Enter the GSP location where the vehicle is situated.
                  </span>
                }
              >
                <>
                  <LocationPicker
                    onChangeHandler={field.onChange}
                    initialLocation={field.value}
                    buttonText="Choose Location"
                    showDetails={true}
                    buttonClassName="w-full cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900"
                  />
                  <div>
                    <div className="flex justify-end">
                      {isLocationImporting ? (
                        <span className="mt-2">Loading...</span>
                      ) : (
                        <span
                          className={`mt-2 select-none underline ${
                            companyLocation
                              ? "cursor-pointer text-blue-700"
                              : "cursor-not-allowed text-gray-400"
                          }`}
                          onClick={() => {
                            if (!companyLocation) return;
                            toast({
                              title: `Imported location successfully`,
                              className: "bg-yellow text-white",
                            });
                            setVehicleLocation(companyLocation);
                          }}
                        >
                          Import office location of agent as vehicle location.
                        </span>
                      )}
                    </div>
                  </div>
                </>
              </FormItemWrapper>
            )}
          />

          {/* Display Address - NEW FIELD */}
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
                        Provide the address to display for this vehicle. By
                        default, this is set to your company's display address.
                        You can customize it for this specific vehicle. 150
                        characters max.
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
                      <RentalDetailsFormField isIndia={isIndia} />
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
                        Provide a meta description for this vehicle. This will
                        be used as the Meta Description in the
                        vehicle-details-page in Nextjs.
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
                {!isIndia && (
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
                )}

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
                {!isIndia && (
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
                )}

                {/* Cash */}

                <FormField
                  control={form.control}
                  name="isCashSupported"
                  render={({ field }) => (
                    <div className="mb-2">
                      <FormCheckbox
                        id="isCash"
                        label="Cash"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      <FormDescription className="ml-7 mt-1">
                        Select if your accepts payments via Cash.
                      </FormDescription>
                      <FormMessage className="ml-2" />
                    </div>
                  )}
                />

                {/* UPI */}
                {isIndia && (
                  <FormField
                    control={form.control}
                    name="isUPISupported"
                    render={({ field }) => (
                      <div className="mb-2">
                        <FormCheckbox
                          id="isUPI"
                          label="UPI"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <FormDescription className="ml-7 mt-1">
                          Select if your accepts payments via UPI.
                        </FormDescription>
                        <FormMessage className="ml-2" />
                      </div>
                    )}
                  />
                )}
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
      {/* Price Edit Modal for price validation failure */}
      {isPriceEditModalOpen && <PriceEditModal {...priceEditModalProps} />}
    </>
  );
}
