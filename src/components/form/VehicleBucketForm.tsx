import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { VehicleBucketSchema } from "@/lib/validator";
import { FormItemWrapper } from "./form-ui/FormItemWrapper";
import StatesDropdown from "./dropdowns/StatesDropdown";
import { Textarea } from "../ui/textarea";
import {
  TEXT_LIMITS,
  VEHICLE_BUCKET_DISPLAY_GROUP_FILTER_DROPDOWN_OPTIONS,
  VEHICLE_BUCKET_MAX_VEHICLE_CODE_LIMIT,
  VEHICLE_BUCKET_MODES_ENUM,
  VehicleBucketFormDefaultValues,
} from "@/constants";
import {
  useNavigate,
  useParams,
  useSearchParams,
  SetURLSearchParams,
} from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { addVehicleBucket, updateVehicleBucket } from "@/api/vehicle-bucket";
import { FormContainer, FormSubmitButton } from "./form-ui";
import VehicleMultiSelectDropdown from "./dropdowns/VehicleMultiSelectDropdown";
import { VehicleBucketType } from "@/types/api-types/API-types";
import { sanitizeStringToSlug } from "@/lib/utils";
import { generateVehicleBucketPublicSiteLink } from "@/utils/helper";
import { ExternalLink } from "lucide-react";
import VehicleCategoryDropdown from "./dropdowns/VehicleCategoryDropdown";
import VehicleTypesDropdown from "./dropdowns/VehicleTypesDropdown";
import LocationPicker from "./LocationPicker";
import VehicleBucketModeDropdown from "./dropdowns/VehicleBucketModeDropdown";
import { useFormValidationToast } from "@/hooks/useFormValidationToast";
import { SingleSelectDropdown } from "./dropdowns/SingleSelectDropdown";
import RichTextEditorComponent from "./RichTextEditorComponent";
import BrandsDropdown from "./dropdowns/BrandsDropdown";
import SeriesDropdown from "./dropdowns/SeriesDropdown";

type VehicleBucketFormProps = {
  type: "Add" | "Update";
  formData?: VehicleBucketType | null;
  setSearchParams?: SetURLSearchParams;
};

export default function VehicleBucketForm({
  type,
  formData,
  setSearchParams,
}: VehicleBucketFormProps) {
  const [categoryId, setCategoryId] = useState<string | null>(
    formData?.vehicleCategoryId || null,
  );
  const [brandId, setBrandId] = useState<string | null>(
    formData?.vehicleBrandId || null,
  );
  const initialValues = formData || VehicleBucketFormDefaultValues;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const stateValue = searchParams.get("state");
  const { vehicleBucketId } = useParams<{
    vehicleBucketId: string;
  }>();

  const form = useForm<z.infer<typeof VehicleBucketSchema>>({
    resolver: zodResolver(VehicleBucketSchema),
    defaultValues: initialValues,
  });

  // custom hook to validate complex form fields
  useFormValidationToast(form);

  async function onSubmit(values: z.infer<typeof VehicleBucketSchema>) {
    try {
      let data;
      if (type === "Add") {
        data = await addVehicleBucket(values);
      } else if (type === "Update") {
        // Correct order: id, values
        data = await updateVehicleBucket(vehicleBucketId as string, values);
      }

      if (data) {
        toast({
          title: `${type} Vehicle Bucket successful`,
          description: `The vehicle bucket has been ${type === "Add" ? "added" : "updated"} successfully.`,
          className: "bg-green-500 text-white",
        });

        // invalidating cached data in the series listing page and in form fetch
        queryClient.invalidateQueries({
          queryKey: ["vehicle-bucket"],
        });

        // If setSearchParams is provided (Add mode), set the vehicleBucketId to enable FAQ tab
        if (type === "Add" && setSearchParams && data.result?.id) {
          setSearchParams(
            new URLSearchParams({ vehicleBucketId: data.result.id }),
          );
        } else {
          navigate("/manage-vehicle-bucket");
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Vehicle bucket failed`,
        description: "Something went wrong. Please try again.",
      });
    } finally {
      // invalidating cached data in the series listing page and in form fetch
      queryClient.invalidateQueries({
        queryKey: ["vehicle-bucket", vehicleBucketId],
      });
    }
  }

  const selectedBucketMode = form.watch("vehicleBucketMode");

  const stateId = form.watch("stateId");

  const { VEHICLE_CODE, VEHICLE_TYPE, LOCATION_COORDINATES, VEHICLE_SERIES } =
    VEHICLE_BUCKET_MODES_ENUM;

  const isLocationMode = selectedBucketMode === LOCATION_COORDINATES;
  const isVehicleTypeMode = selectedBucketMode === VEHICLE_TYPE;
  const isVehicleCodeMode = selectedBucketMode === VEHICLE_CODE;
  const isVehicleSeriesMode = selectedBucketMode === VEHICLE_SERIES;

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="vehicleBucketMode"
          render={({ field }) => (
            <FormItemWrapper
              label="Bucket Mode"
              description={
                <span>
                  Choose how vehicles will be selected for this bucket.
                  {type === "Update" && (
                    <span className="text-orange-500 mt-1 block text-xs">
                      ⚠️ Changing mode will clear related fields. Save your work
                      first.
                    </span>
                  )}
                </span>
              }
            >
              <VehicleBucketModeDropdown
                onChangeHandler={(value) => {
                  field.onChange(value);

                  // Clear conditional fields when mode changes
                  if (value === VEHICLE_CODE) {
                    form.setValue("vehicleCategoryId", "");
                    form.setValue("vehicleTypeId", "");
                    form.setValue("location", undefined);
                    form.setValue("vehicleBrandId", "");
                    form.setValue("vehicleSeriesId", "");
                  } else if (value === VEHICLE_TYPE) {
                    form.setValue("vehicleCodes", []);
                    form.setValue("location", undefined);
                    form.setValue("vehicleBrandId", "");
                    form.setValue("vehicleSeriesId", "");
                  } else if (value === LOCATION_COORDINATES) {
                    form.setValue("vehicleCodes", []);
                    form.setValue("vehicleCategoryId", "");
                    form.setValue("vehicleTypeId", "");
                    form.setValue("vehicleBrandId", "");
                    form.setValue("vehicleSeriesId", "");
                  } else if (value === VEHICLE_SERIES) {
                    form.setValue("vehicleCodes", []);
                    form.setValue("vehicleCategoryId", "");
                    form.setValue("vehicleTypeId", "");
                    form.setValue("vehicleBrandId", "");
                    form.setValue("location", undefined);
                  }
                }}
                value={field.value}
                placeholder="Select bucket mode"
                disabled={type === "Update"}
              />
            </FormItemWrapper>
          )}
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
                  field.onChange(value.stateId);
                }}
                value={field.value}
                placeholder="location"
                isDisabled={type === "Update"}
              />
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Bucket Name */}
        <FormField
          control={form.control}
          name="vehicleBucketName"
          render={({ field }) => (
            <FormItemWrapper
              label="Vehicle Bucket Name"
              description={
                <span>
                  The display name for the vehicle bucket (e.g. 'Luxury Cars
                  Dubai'). Used only for UI label in Admin.
                  {type === "Add" && (
                    <span className="mt-1 block text-xs text-orange">
                      This will auto-generate the URL value below. Cannot be
                      changed after creation.
                    </span>
                  )}
                </span>
              }
            >
              <Input
                placeholder="e.g., 'Luxury Cars Dubai'"
                {...field}
                className={`input-field ${type === "Add" ? "border-orange-300" : ""}`}
                readOnly={type === "Update"}
                onChange={(e) => {
                  field.onChange(e);

                  // Auto-generate slug from vehicleBucketName
                  const sanitizedSlug = sanitizeStringToSlug(e.target.value);
                  form.setValue("vehicleBucketValue", sanitizedSlug);
                }}
              />
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Bucket Value (Slug) - Non-editable */}
        <FormField
          control={form.control}
          name="vehicleBucketValue"
          render={({ field }) => {
            const vehicleBucketPublicLink =
              type === "Update" && stateValue
                ? generateVehicleBucketPublicSiteLink(stateValue, field.value)
                : "/offer/" + field.value;
            return (
              <FormItemWrapper
                label="Vehicle Bucket URL Slug (Auto Generated)"
                description={
                  <span>
                    Unique identifier for the URL (e.g.
                    '/ae/dubai/offer/luxury-cars-dubai').
                    <br />
                    Auto-generated from the bucket name.
                    {type === "Update" && field.value && stateValue ? (
                      <a
                        href={vehicleBucketPublicLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center justify-start text-xs text-blue-500"
                      >
                        <ExternalLink size={12} className="mr-1" />
                        {vehicleBucketPublicLink}
                      </a>
                    ) : (
                      <span className="mt-1 block text-xs text-orange">
                        page url eg : {vehicleBucketPublicLink}
                      </span>
                    )}
                    {type === "Add" && (
                      <span className="mt-1 block text-xs text-orange">
                        Cannot be changed after creation.
                      </span>
                    )}
                  </span>
                }
              >
                <Input
                  placeholder="e.g., 'luxury-cars-dubai'"
                  {...field}
                  className={`input-field cursor-not-allowed bg-gray-100 ${type === "Add" ? "border-orange-300" : ""}`}
                  readOnly
                />
              </FormItemWrapper>
            );
          }}
        />

        {/* Vehicle Selection */}
        {isVehicleCodeMode && (
          <FormField
            control={form.control}
            name="vehicleCodes"
            render={({ field }) => (
              <FormItemWrapper
                label="Select Vehicles"
                description={
                  <span>
                    Search and select up to{" "}
                    {VEHICLE_BUCKET_MAX_VEHICLE_CODE_LIMIT} vehicles to include
                    in this bucket.
                    <br />
                    Selected vehicles will be displayed in the order they are
                    added.
                  </span>
                }
              >
                <VehicleMultiSelectDropdown
                  selectedVehicleCodes={field.value || []}
                  selectedStateId={stateId}
                  onChange={field.onChange}
                  maxSelections={VEHICLE_BUCKET_MAX_VEHICLE_CODE_LIMIT}
                />
              </FormItemWrapper>
            )}
          />
        )}

        {/* Vehicle Category */}
        {(isVehicleTypeMode || isLocationMode || isVehicleSeriesMode) && (
          <FormField
            control={form.control}
            name="vehicleCategoryId"
            render={({ field }) => {
              return (
                <FormItemWrapper
                  label="Vehicle Category"
                  description="Category of the vehicle"
                >
                  <VehicleCategoryDropdown
                    onChangeHandler={(value) => {
                      field.onChange(value);
                      if (field.value !== value) {
                        field.onChange(value);
                        form.setValue("vehicleTypeId", "", {
                          shouldValidate: false,
                          shouldDirty: true,
                        });
                        form.setValue("vehicleBrandId", "", {
                          shouldValidate: false,
                          shouldDirty: true,
                        });
                        form.setValue("vehicleSeriesId", "", {
                          shouldValidate: false,
                          shouldDirty: true,
                        });
                      }
                    }}
                    value={field.value}
                    placeholder="Select category"
                    setCategoryId={setCategoryId}
                    isDisabled={type === "Update"}
                  />
                </FormItemWrapper>
              );
            }}
          />
        )}

        {/* Vehicle Type */}
        {(isVehicleTypeMode || isLocationMode) && (
          <FormField
            control={form.control}
            name="vehicleTypeId"
            render={({ field }) => {
              return (
                <FormItemWrapper
                  label="Vehicle Type"
                  description={
                    isVehicleTypeMode
                      ? "All vehicles of this type will be automatically included"
                      : "Vehicles of this type near the coordinates will be shown"
                  }
                >
                  <VehicleTypesDropdown
                    vehicleCategoryId={categoryId || undefined}
                    value={field.value}
                    onChangeHandler={(value) => {
                      field.onChange(value);
                    }}
                    isDisabled={!categoryId}
                  />
                </FormItemWrapper>
              );
            }}
          />
        )}

        {/* Vehicle Brand and Series : Vehicle Series Mode */}
        {isVehicleSeriesMode && (
          <>
            {/* Vehicle Brand */}
            <FormField
              control={form.control}
              name="vehicleBrandId"
              render={({ field }) => (
                <FormItemWrapper
                  label="Brand Name"
                  description="Select the vehicle brand under the chosen category"
                >
                  <BrandsDropdown
                    vehicleCategoryId={categoryId || undefined}
                    value={field.value}
                    onChangeHandler={(value) => {
                      field.onChange(value);
                      setBrandId(value);
                      // Reset series when brand changes
                      form.setValue("vehicleSeriesId", "");
                    }}
                    isDisabled={!categoryId || type === "Update"}
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
                  description="All vehicles of this series will be included in this bucket"
                >
                  <SeriesDropdown
                    value={field.value}
                    onChangeHandler={field.onChange}
                    stateId={stateId}
                    brandId={brandId || ""}
                    isDisabled={!brandId}
                  />
                </FormItemWrapper>
              )}
            />
          </>
        )}

        {/* Location Mode and Vehicle Series Mode */}
        {(isLocationMode || isVehicleSeriesMode) && (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItemWrapper
                label="Vehicle Location (GPS Coordinates)"
                description="Select coordinates on the map. Vehicles nearest to this location will be displayed."
              >
                <LocationPicker
                  onChangeHandler={field.onChange}
                  initialLocation={field.value}
                  buttonText="Choose Location on Map"
                  showDetails={true}
                  buttonClassName="w-full cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900"
                />
              </FormItemWrapper>
            )}
          />
        )}

        {/* Section Type */}
        <FormField
          control={form.control}
          name="displayGroup"
          render={({ field }) => (
            <FormItemWrapper
              label="Footer Display Group"
              description="Select where this bucket will be displayed in the public site footer"
            >
              <SingleSelectDropdown
                options={VEHICLE_BUCKET_DISPLAY_GROUP_FILTER_DROPDOWN_OPTIONS}
                onChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                placeholder="Select footer display group"
              />
            </FormItemWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="linkText"
          render={({ field }) => (
            <FormItemWrapper
              label="Link Text"
              description={
                <span>
                  Text that will be displayed for the link.
                  <br />
                  100 characters max.
                </span>
              }
            >
              <Input
                placeholder="e.g., 'View All Luxury Cars'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Vehicle Bucket Description */}
        <FormField
          control={form.control}
          name="vehicleBucketDescription"
          render={({ field }) => {
            const limit = TEXT_LIMITS.DETAILED_DESCRIPTION;

            return (
              <FormItemWrapper
                label="Vehicle Bucket Description"
                description={
                  <span className="flex">
                    <span>
                      Enter the vehicle bucket description for this bucket. It
                      will be displayed as the info box description in the
                      Next.js vehicle bucket page.
                    </span>
                    <span className="mt-1 text-sm text-gray-500">
                      {field.value?.length || 0}/{limit}
                    </span>
                  </span>
                }
              >
                <RichTextEditorComponent
                  content={field.value || ""}
                  onUpdate={(updatedContent) => field.onChange(updatedContent)}
                />
              </FormItemWrapper>
            );
          }}
        />

        {/* Series Page Heading */}
        <FormField
          control={form.control}
          name="pageHeading"
          render={({ field }) => (
            <FormItemWrapper
              label="Page Heading"
              description={
                <span>
                  This will be displayed as the <strong>heading</strong> of the
                  page.
                  <br />
                  100 characters max.
                </span>
              }
            >
              <Input
                placeholder="e.g., 'BWM under 100 AED'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Series Page Subheading */}
        <FormField
          control={form.control}
          name="pageSubheading"
          render={({ field }) => (
            <FormItemWrapper
              label="Page Subheading"
              description={
                <span>
                  This will be displayed as the <strong>sub-heading</strong> of
                  the page.
                  <br />
                  200 characters max.
                </span>
              }
            >
              <Input
                placeholder="e.g., 'Luxury Cars under 100 AED'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Meta Title */}
        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItemWrapper
              label="Meta Title"
              description={
                <span>
                  Enter the meta title for this bucket.
                  <br /> 80 characters max.
                </span>
              }
            >
              <Input
                placeholder="e.g., 'Luxury Car Rental Dubai'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Meta Description */}
        <FormField
          control={form.control}
          name="metaDescription"
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
                label="Meta Description"
                description={
                  <span className="flex flex-col">
                    <span>Provide a meta description for this Bucket.</span>
                    <span className="mt-1 text-sm text-gray-500">
                      {charCount}/{limit} characters used
                    </span>
                  </span>
                }
              >
                <Textarea
                  placeholder="Meta Description"
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
          text={type === "Add" ? "Add Bucket" : "Update Bucket"}
          isLoading={form.formState.isSubmitting}
        />
      </FormContainer>
    </Form>
  );
}
