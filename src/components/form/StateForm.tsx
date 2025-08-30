import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { IconRenderer } from "../IconRenderer/IconRenderer";

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
import { StateFormType } from "@/types/types";
import { StateFormSchema } from "@/lib/validator";
import { StateFormDefaultValues } from "@/constants";
import Spinner from "../general/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { addState, updateState } from "@/api/states";
import { useEffect, useState } from "react";
import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import SingleFileUpload from "./file-uploads/SingleFileUpload";
import { useStateListQuery } from "@/hooks/query/useStateListQuery";
import Select from "react-select";
import { useAdminContext } from "@/context/AdminContext";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { FormItemWrapper } from "./form-ui/FormItemWrapper";
import LocationPicker from "./LocationPicker";
import { IconName } from "../IconRenderer/icons";

type StateFormProps = {
  type: "Add" | "Update";
  formData?: StateFormType | null;
  parentStateId?: string | null;
};

export default function StateForm({
  type,
  formData,
  parentStateId,
}: StateFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const iconList = [
    "pub",
    "residentialArea",
    "residentialBuildings",
    "waterfall",
    "wildlife",
    "windmill",
    "zoo",
    "airport",
    "amusementPark",
    "aquarium",
    "artGallery",
    "bar",
    "beachUmberlla",
    "beach",
  ];

  const strokeWidthList = ["0.5", "0.75", "1", "1.25", "1.5", "1.75", "2"];

  const { country } = useAdminContext();
  const countryName = country.countryValue;
  const isIndia = countryName === "India";

  const initialValues =
    formData && type === "Update"
      ? formData
      : {
        ...StateFormDefaultValues,
        ...(parentStateId ? { parentStateId } : {}),
        ...(!parentStateId && isIndia ? { isParentState: true } : {}),
      };

  const navigate = useNavigate();
  const { stateId } = useParams<{ stateId: string }>();

  const { query: stateListQuery } = useStateListQuery({
    enabled: true,
    parentStateId,
  });

  const { data: stateList } = !!stateListQuery && stateListQuery;
  const stateOptions = stateList?.result
    ?.filter((c: any) => c.stateId !== initialValues.stateId)
    .map((state) => ({
      value: state.stateId,
      label: state.stateName,
    }));

  const [selectedStates, setSelectedStates] = useState<string[]>(
    initialValues?.relatedStates ?? [],
  );

  useEffect(() => {
    if (type === "Update") {
      setSelectedStates(formData?.relatedStates ?? []);
    }
  }, [formData]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof StateFormSchema>>({
    resolver: zodResolver(StateFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof StateFormSchema>) {
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
        data = await addState(values, selectedStates, country.countryId);
      } else if (type === "Update") {
        data = await updateState(values, stateId as string, selectedStates);
      }

      if (data) {
        // actually delete the images from the db, if any
        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
        toast({
          title: `${type} State successfully`,
          className: "bg-yellow text-white",
        });

        try {
          await queryClient.invalidateQueries({
            queryKey: [
              "states",
              country.countryId,
              isIndia && parentStateId ? parentStateId : null,
            ],
            exact: true,
          });

          if (parentStateId) {
            await queryClient.invalidateQueries({
              queryKey: ["parent-states", country.countryId],
            });
          }
        } catch (error) {
          console.error("Query invalidation failed:", error);
        }

        navigate("/locations/manage-states");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Location failed`,
        description: "Something went wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[700px] flex-col gap-5 rounded-3xl bg-white p-2 py-8 !pb-8 shadow-md md:p-4"
      >
        <div className="r flex flex-col gap-5">
          {/* type title */}
          <FormField
            control={form.control}
            name="stateName"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-56 justify-between text-base max-sm:w-fit lg:text-lg">
                  {!!parentStateId ? "Location" : "State"} Name
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: 'Abu Dhabi'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Add your {!!parentStateId ? "Location" : "State"} Name
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="stateValue"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-56 justify-between text-base max-sm:w-fit lg:text-lg">
                  {!!parentStateId ? "Location" : "State"} Value
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: 'abu-dhabi'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    This value will be used for API interaction. Eg: for "Abu
                    Dhabi", value will be "abu-dhabi"
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* State Image */}
          <FormField
            control={form.control}
            name="stateImage"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label={`${!!parentStateId ? "Location" : "State"} Image`}
                description="Upload an image with a maximum file size of 1mb."
                isDownloadable
                existingFile={formData?.stateImage || null}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                setDeletedImages={setDeletedImages}
              />
            )}
          />

          {/* State Icon */}
          <FormField
            control={form.control}
            name="stateIcon"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label={`${!!parentStateId ? "Location" : "State"} Icon`}
                description="Upload an icon image (preferably SVG or small PNG) with a maximum file size of 1mb."
                isDownloadable
                existingFile={formData?.stateIcon || null}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                setDeletedImages={setDeletedImages}
              />
            )}
          />

          {/* Is Favorite Checkbox */}
          <FormField
            control={form.control}
            name="isFavorite"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-56 justify-between text-base max-sm:w-fit lg:text-lg">
                  Mark as Favorite
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isFavorite"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="isFavorite"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Show this {!!parentStateId ? "location" : "state"} as a
                        favorite
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription className="ml-2">
                    Favorite items will be highlighted in the app
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItemWrapper
                label="GPS Location"
                description={
                  <span>Enter the approximate GSP location of this place</span>
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

          {!(!parentStateId && isIndia) && (
            <FormField
              control={form.control}
              name="relatedStates"
              render={() => (
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex w-56 justify-between text-base max-sm:w-fit lg:text-lg">
                    Related {!!parentStateId ? "Locations" : "States"}{" "}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <Select
                        isMulti
                        options={stateOptions || []}
                        value={selectedStates
                          .map((stateId) =>
                            stateOptions?.find((opt) => opt.value === stateId),
                          )
                          .filter(Boolean)}
                        onChange={(selected: any) =>
                          setSelectedStates(
                            selected.map((opt: any) => opt.value),
                          )
                        }
                        menuPlacement="auto"
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </FormControl>
                    <FormDescription className="ml-2">
                      Select related {!!parentStateId ? "locations" : "states"}{" "}
                      in any order.
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="iconConfig"
            render={() => {
              const iconName = useWatch({
                control: form.control,
                name: "iconConfig.iconName",
              });
              const bgColor = useWatch({
                control: form.control,
                name: "iconConfig.bgColor",
              });
              const strokeColor = useWatch({
                control: form.control,
                name: "iconConfig.strokeColor",
              });
              const strokeWidth = useWatch({
                control: form.control,
                name: "iconConfig.strokeWidth",
              });

              return (
                <FormItem className="mb-6 flex flex-col gap-4 rounded-lg border border-gray-300 p-4 shadow-sm">
                  <FormLabel className="text-lg font-semibold">
                    Icon Configuration
                  </FormLabel>

                  {/* Icon Name */}
                  <FormField
                    control={form.control}
                    name="iconConfig.iconName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Icon Name</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="rounded-md border px-3 py-2 shadow-sm"
                          >
                            <option value="">Select icon</option>
                            {iconList.map((icon) => (
                              <option key={icon} value={icon}>
                                {icon}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormDescription>
                          Choose an icon for this state.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="iconConfig.strokeWidth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Stroke Width</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="rounded-md border px-3 py-2 shadow-sm"
                          >
                            <option value="">Select</option>
                            {strokeWidthList.map((icon) => (
                              <option key={icon} value={icon}>
                                {icon}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormDescription>
                          Choose an icon for this state.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    {/* Background Color */}
                    <FormField
                      control={form.control}
                      name="iconConfig.bgColor"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Background Color</FormLabel>
                          <FormControl>
                            <input
                              type="color"
                              {...field}
                              className="h-10 w-24 cursor-pointer rounded border"
                            />
                          </FormControl>
                          <FormDescription>
                            Select background color for the icon.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Stroke Color */}
                    <FormField
                      control={form.control}
                      name="iconConfig.strokeColor"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Stroke Color</FormLabel>
                          <FormControl>
                            <input
                              type="color"
                              {...field}
                              className="h-10 w-24 cursor-pointer rounded border"
                            />
                          </FormControl>
                          <FormDescription>
                            Choose the stroke color around the icon.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Preview */}
                  {(iconName || bgColor || strokeColor || strokeWidth) && (
                    <div className="mt-4 flex flex-col items-center justify-center">
                      <div
                        className="inline-flex items-center justify-center rounded-sm p-2 shadow-md"
                        style={{
                          backgroundColor: bgColor || "#fff",
                          width: "60px",
                          height: "60px",
                        }}
                      >
                        {iconName ? (
                          <IconRenderer
                            name={iconName as IconName}
                            color={strokeColor}
                            strokeWidth={strokeWidth}
                          />
                        ) : (
                          <span className="text-sm text-gray-400">No icon</span>
                        )}
                      </div>
                      <div>Icon Preview</div>
                    </div>
                  )}
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
          className="flex-center button col-span-2 mt-3 w-full bg-yellow !text-lg !font-semibold hover:bg-yellow/90"
        >
          {isFileUploading
            ? "Uploading..."
            : form.formState.isSubmitting
              ? "Processing..."
              : `${type} ${!!parentStateId ? "Location" : "State"}`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
