import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PromotionFormType } from "@/types/types";
import { PromotionFormDefaultValue } from "@/constants";
import { PromotionFormSchema } from "@/lib/validator";
import Spinner from "../general/Spinner";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminContext } from "@/context/AdminContext";

import DeleteModal from "../modal/DeleteModal";
import {
  addPromotion,
  deletePromotion,
  updatePromotion,
} from "@/api/promotions";
import { useState } from "react";
import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import PromotionFileUpload from "./file-uploads/PromotionsFileUpload";
import CategoryDropdown from "./dropdowns/CategoryDropdown";
import { IconRenderer } from "../IconRenderer/IconRenderer";
import { IconName } from "../IconRenderer/icons";
import { renderToStaticMarkup } from "react-dom/server";
import { uploadSingleFile } from "@/api/file-upload";

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

type PromotionFormProps = {
  type: "Add" | "Update";
  formData?: PromotionFormType | null;
};

export default function PromotionForm({ type, formData }: PromotionFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const { state } = useAdminContext();

  const initialValues =
    formData && type === "Update" ? formData : PromotionFormDefaultValue;

  const navigate = useNavigate();
  const { promotionId } = useParams<{ promotionId: string }>();
  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PromotionFormSchema>>({
    resolver: zodResolver(PromotionFormSchema),
    defaultValues: initialValues,
  });

  // Watch the type to determine valid image aspect ratio hints
  const watchedType = form.watch("type");

  const getImageDescription = () => {
    if (watchedType === "listing-page") {
      return "Upload an image or GIF with a maximum file size of 5MB. Vertical (portrait) aspect ratio (3:4) is preferred. Recommended size: 600px x 800px.";
    }
    // Default for homepage, quick-links (city/series/brand), listing-page-filter, etc.
    return "Upload an image or GIF with a maximum file size of 5MB. Landscape aspect ratio (4:3) is preferred. Recommended size: 800px x 600px.";
  };

  const promotionImage = useWatch({
    control: form.control,
    name: "promotionImage",
  });

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

  // Effect to handle mutual exclusivity is better handled by handlers, but for initial load or external changes:
  // If we have an iconName, we assume image should be empty. But we shouldn't force it here to avoid loops.

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PromotionFormSchema>) {
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
      // Prepare payload: if icon is selected, serialize it to promotionImage
      const payload = { ...values };
      if (
        values.type === "listing-page-filter" &&
        values.iconConfig?.iconName
      ) {
        // Generate SVG string
        const svgString = renderToStaticMarkup(
          <IconRenderer
            name={values.iconConfig.iconName as IconName}
            color={values.iconConfig.strokeColor}
            strokeWidth={values.iconConfig.strokeWidth}
            width={60}
            height={60}
          />,
        );

        // Create Blob and File
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const file = new File([blob], "icon-config.svg", {
          type: "image/svg+xml",
        });

        // Upload to GCS
        // Use a dummy progress callback
        const uploadResponse = await uploadSingleFile(
          GcsFilePaths.IMAGE,
          file,
          () => {},
        );

        if (uploadResponse?.result?.path) {
          payload.promotionImage = uploadResponse.result.path;
        } else {
          throw new Error("Failed to upload generated icon.");
        }
      }

      if (type === "Add") {
        data = await addPromotion(payload as any, state.stateId as string);
      } else if (type === "Update") {
        data = await updatePromotion(payload as any, promotionId as string);
      }

      if (data) {
        await deleteMultipleFiles(deletedImages); // Call
      }

      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["promotions", state],
          exact: true,
        });
        toast({
          title: `${type} Promotion successfully`,
          className: "bg-yellow text-white",
        });
        navigate("/marketing/promotions");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} promotion failed`,
        description: "Something went wrong",
      });
    }
  }

  const { mutateAsync: deletePromotionMutation, isPending } = useMutation({
    mutationFn: () => deletePromotion(promotionId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promotions", state],
        exact: true,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[700px] flex-col gap-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8"
      >
        <div className="flex flex-col gap-5">
          {/* Vehicle Category Dropdown */}
          <FormField
            control={form.control}
            name="vehicleCategoryId"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base font-semibold text-gray-800">
                    Vehicle Category
                  </FormLabel>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
                    Optional
                  </span>
                </div>

                <div className="flex w-full flex-col gap-1">
                  <FormControl>
                    <CategoryDropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                      setIsCarsCategory={() => {}}
                      setHideCommercialLicenses={() => {}}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Associate this promotion with a specific vehicle category
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Promotion Type Select */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="text-base font-semibold text-gray-800">
                  Promotion Type <span className="text-red-500">*</span>
                </FormLabel>

                <div className="flex w-full flex-col gap-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 border-gray-200 bg-gray-50 transition-all duration-200 focus:bg-white">
                        <SelectValue placeholder="Select where to display this promotion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="homepage">
                        Home Page Content
                      </SelectItem>
                      <SelectItem value="listing-page">
                        Listing Page Vehicle Card
                      </SelectItem>
                      <SelectItem value="city-listing-page">
                        City Listing Page
                      </SelectItem>
                      <SelectItem value="series-listing-page">
                        Series Listing Page
                      </SelectItem>
                      <SelectItem value="brand-listing-page">
                        Brand Listing Page
                      </SelectItem>
                      <SelectItem value="listing-page-filter">
                        Listing Page Top Filter
                      </SelectItem>
                      <SelectItem value="city-quick-links">
                        City Page Quick Links
                      </SelectItem>
                      <SelectItem value="series-quick-links">
                        Series Page Quick Links
                      </SelectItem>
                      <SelectItem value="brand-quick-links">
                        Brand Page Quick Links
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-gray-500">
                    Determines where and how the promotion will be displayed
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Detailed Link Field */}
          <FormField
            control={form.control}
            name="promotionLink"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="text-base font-semibold text-gray-800">
                  Detailed Link
                </FormLabel>
                <div className="flex w-full flex-col gap-1">
                  <FormControl>
                    <Input
                      placeholder="https://example.com/promotion"
                      {...field}
                      className="h-11 border-gray-200 bg-gray-50 transition-all duration-200 focus:bg-white"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    The destination URL when a user clicks the promotion
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Promotion Image */}
          <div
            className={`transition-opacity duration-300 ${iconName ? "pointer-events-none opacity-40" : "opacity-100"}`}
          >
            <FormField
              control={form.control}
              name="promotionImage"
              render={({ field }) => (
                <div className="relative">
                  <PromotionFileUpload
                    name={field.name}
                    label="Promotion Image"
                    description={getImageDescription()}
                    existingFile={formData?.promotionImage}
                    maxSizeMB={5}
                    setIsFileUploading={setIsFileUploading}
                    bucketFilePath={GcsFilePaths.IMAGE}
                    setDeletedImages={setDeletedImages}
                  />
                  {/* Overlay to deselect/clear image logic if needed, but file upload usually has clear. 
                      Here we make it mutually exclusive: if icon selected, this is disabled.
                  */}
                </div>
              )}
            />
          </div>

          {/* Icon Configuration - Only for listing-page-filter */}
          {watchedType === "listing-page-filter" && (
            <div
              className={`rounded-lg border border-gray-200 p-4 transition-opacity duration-300 ${promotionImage ? "pointer-events-none opacity-40" : "opacity-100"}`}
            >
              <FormLabel className="mb-4 block text-lg font-semibold">
                Icon Configuration
              </FormLabel>

              <FormField
                control={form.control}
                name="iconConfig"
                render={() => {
                  return (
                    <div className="flex flex-col gap-4">
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
                                value={field.value || ""}
                                onChange={(e) => {
                                  field.onChange(e);
                                  // If icon selected, clear image
                                  if (e.target.value) {
                                    form.setValue("promotionImage", "");
                                  }
                                }}
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
                              Choose an icon for this filter.
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
                              Choose the stroke width.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between gap-4">
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
                                  className="h-10 w-24 cursor-pointer rounded border p-1"
                                />
                              </FormControl>
                              <FormDescription>
                                Select background color.
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
                                  className="h-10 w-24 cursor-pointer rounded border p-1"
                                />
                              </FormControl>
                              <FormDescription>
                                Choose the stroke color.
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
                            className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-sm p-2 shadow-md"
                            style={{
                              backgroundColor: bgColor || "#fff",
                            }}
                          >
                            {iconName ? (
                              <IconRenderer
                                name={iconName as IconName}
                                color={strokeColor}
                                strokeWidth={strokeWidth}
                              />
                            ) : (
                              <span className="text-sm text-gray-400">
                                No icon
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Icon Preview
                          </div>

                          {/* Deselect Icon Button */}
                          {iconName && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 text-red-500 hover:text-red-600"
                              onClick={() => {
                                form.setValue("iconConfig.iconName", "");
                                // Optionally reset other config
                              }}
                            >
                              Start Over / Upload Image
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          )}

          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base font-semibold text-gray-800">
                    Display Title
                  </FormLabel>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
                    Optional
                  </span>
                </div>

                <div className="flex w-full flex-col gap-1">
                  <FormControl>
                    <Input
                      placeholder="e.g., 'Summer Special'"
                      {...field}
                      className="h-11 border-gray-200 bg-gray-50 transition-all duration-200 focus:bg-white"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    The main headline text for the promotion
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Subtitle Field (Conditional) */}
          {form.watch("type") !== "listing-page-filter" && (
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2 duration-300 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base font-semibold text-gray-800">
                      Subtitle
                    </FormLabel>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
                      Optional
                    </span>
                  </div>

                  <div className="flex w-full flex-col gap-1">
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Limited time offer ending soon'"
                        {...field}
                        className="h-11 border-gray-200 bg-gray-50 transition-all duration-200 focus:bg-white"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Supporting text displayed below the title
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          )}
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="flex-center button col-span-2 mt-3 w-full bg-yellow !text-lg !font-semibold hover:bg-yellow/90"
        >
          {form.formState.isSubmitting ? "Processing..." : `${type} Promotion`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>

        {/* delete link */}
        {type === "Update" && (
          <DeleteModal
            onDelete={deletePromotionMutation}
            label="Delete"
            title="Delete promotion?"
            description="Are you sure you want to delete this promotion? "
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isPending || form.formState.isSubmitting}
            navigateTo="/marketing/promotions"
          ></DeleteModal>
        )}

        <p className="m-0 -mt-3 p-0 text-center text-xs text-red-500">
          Make sure appropriate state is selected before adding a promotion.
          Currently adding promotion under {state.stateName}
        </p>
      </form>
    </Form>
  );
}
