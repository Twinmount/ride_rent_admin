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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, HelpCircle, X, ExternalLink } from "lucide-react";

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

// Comprehensive promotion info data
const PROMOTION_INFO = [
  {
    type: "homepage",
    label: "Home Page Content",
    description: "Displays on the homepage content section. Ideal for featured promotions, seasonal offers, and major announcements.",
    imageSize: "1200px × 675px",
    aspectRatio: "16:9 (Landscape)",
    exampleUrl: "/ae/dubai",
    exampleLabel: "Homepage"
  },
  {
    type: "listing-page",
    label: "Listing Page Vehicle Card",
    description: "Appears as a promotional card within the vehicle listing grid on all listing pages. Injected between vehicle cards for maximum visibility.",
    imageSize: "600px × 800px",
    aspectRatio: "3:4 (Portrait)",
    exampleUrl: "/ae/dubai/listing/cars",
    exampleLabel: "Cars Listing"
  },
  {
    type: "city-listing-page",
    label: "City Listing Page",
    description: "Shows on city-specific listing pages (e.g., Dubai Cars, Abu Dhabi SUVs). Displayed as a promotional card within the vehicle grid.",
    imageSize: "600px × 800px",
    aspectRatio: "3:4 (Portrait)",
    exampleUrl: "/ae/dubai/listing/cars/city/dubai",
    exampleLabel: "Dubai City Listing"
  },
  {
    type: "series-listing-page",
    label: "Series Listing Page",
    description: "Displays on vehicle series pages (e.g., BMW 3 Series, Mercedes C-Class). Appears as a promotional card in the results.",
    imageSize: "600px × 800px",
    aspectRatio: "3:4 (Portrait)",
    exampleUrl: "/ae/dubai/listing/cars/series/bmw-3-series",
    exampleLabel: "Series Page"
  },
  {
    type: "brand-listing-page",
    label: "Brand Listing Page",
    description: "Appears on brand listing pages (e.g., Mercedes-Benz, BMW, Audi). Shows as a promotional card mixed with vehicle results.",
    imageSize: "600px × 800px",
    aspectRatio: "3:4 (Portrait)",
    exampleUrl: "/ae/dubai/listing/cars/brand/mercedes-benz",
    exampleLabel: "Brand Page"
  },
  {
    type: "listing-page-filter",
    label: "Listing Page Top Filter",
    description: "Displays as a clickable filter chip at the top of listing pages. Uses an icon (not image). Helps users discover special categories or offers.",
    imageSize: "Icon Only (16px × 16px)",
    aspectRatio: "N/A - Uses Icon",
    exampleUrl: "/ae/dubai/listing/cars",
    exampleLabel: "Filter Chips at Top"
  },
  {
    type: "city-quick-links",
    label: "City Quick Links",
    description: "Shows in the quick links section on city pages. Displays as cards with images and titles. Provides shortcuts to popular categories.",
    imageSize: "800px × 600px",
    aspectRatio: "4:3 (Landscape)",
    exampleUrl: "/ae/dubai/listing/cars/city/dubai",
    exampleLabel: "Quick Links Section"
  },
  {
    type: "series-quick-links",
    label: "Series Quick Links",
    description: "Appears in the quick links section on vehicle series pages. Card-based navigation for related content.",
    imageSize: "800px × 600px",
    aspectRatio: "4:3 (Landscape)",
    exampleUrl: "/ae/dubai/listing/cars/series/bmw-3-series",
    exampleLabel: "Quick Links Section"
  },
  {
    type: "brand-quick-links",
    label: "Brand Quick Links",
    description: "Displays in the quick links section on brand pages. Card layout for easy navigation to related pages.",
    imageSize: "800px × 600px",
    aspectRatio: "4:3 (Landscape)",
    exampleUrl: "/ae/dubai/listing/cars/brand/mercedes-benz",
    exampleLabel: "Quick Links Section"
  }
];
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
  const [showInfoModal, setShowInfoModal] = useState(false);

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
    const sizeGuides: Record<string, string> = {
      "homepage": "Upload an image or GIF (max 5MB). Landscape 16:9 aspect ratio. Recommended: 1200px × 675px for best display.",
      "listing-page": "Upload an image or GIF (max 5MB). Portrait 3:4 aspect ratio. Recommended: 600px × 800px to match vehicle cards.",
      "city-listing-page": "Upload an image or GIF (max 5MB). Portrait 3:4 aspect ratio. Recommended: 600px × 800px to match vehicle cards.",
      "series-listing-page": "Upload an image or GIF (max 5MB). Portrait 3:4 aspect ratio. Recommended: 600px × 800px to match vehicle cards.",
      "brand-listing-page": "Upload an image or GIF (max 5MB). Portrait 3:4 aspect ratio. Recommended: 600px × 800px to match vehicle cards.",
      "city-quick-links": "Upload an image or GIF (max 5MB). Square or 4:3 landscape. Recommended: 800px × 600px for quick link cards.",
      "series-quick-links": "Upload an image or GIF (max 5MB). Square or 4:3 landscape. Recommended: 800px × 600px for quick link cards.",
      "brand-quick-links": "Upload an image or GIF (max 5MB). Square or 4:3 landscape. Recommended: 800px × 600px for quick link cards.",
    };
    return sizeGuides[watchedType] || "Upload an image or GIF with a maximum file size of 5MB.";
  };

  const getPromotionTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      "homepage": "Displays on the homepage content section. Ideal for featured promotions and major announcements. Shows as a large banner or card.",
      "listing-page": "Appears as a card within the vehicle listing grid on all listing pages. Injected between vehicle cards for maximum visibility.",
      "city-listing-page": "Shows on city-specific listing pages (e.g., Dubai Cars). Displayed as a promotional card within the vehicle grid.",
      "series-listing-page": "Displays on vehicle series pages (e.g., BMW 3 Series). Appears as a promotional card in the results.",
      "brand-listing-page": "Appears on brand listing pages (e.g., Mercedes-Benz). Shows as a promotional card mixed with vehicle results.",
      "listing-page-filter": "Displays as a clickable filter option at the top of listing pages. Uses an icon or image badge. Helps users discover special categories or offers.",
      "city-quick-links": "Shows in the quick links section on city pages. Displays as an icon with title. Provides shortcuts to popular categories or locations.",
      "series-quick-links": "Appears in the quick links section on vehicle series pages. Icon-based navigation links for related content.",
      "brand-quick-links": "Displays in the quick links section on brand pages. Icon with title layout for easy navigation to related pages."
    };
    return descriptions[type] || "Determines where and how the promotion will be displayed";
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
    <TooltipProvider>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex w-full max-w-[700px] flex-col gap-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8"
        >
        {/* Form Header with Help Button */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{type} Promotion</h2>
            <p className="text-sm text-gray-500">Configure your promotion settings</p>
          </div>
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            <HelpCircle size={18} />
            <span className="hidden sm:inline">Promotion Guide</span>
          </button>
        </div>

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
                <div className="flex items-center gap-2">
                  <FormLabel className="text-base font-semibold text-gray-800">
                    Promotion Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        title="Promotion Type Information"
                        aria-label="Show promotion type information"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-gray-900 p-4 text-sm text-white">
                      <p className="font-semibold mb-2">Promotion Type Guide</p>
                      <ul className="space-y-1.5 text-xs leading-relaxed">
                        <li><strong>Home Page:</strong> Main homepage banner</li>
                        <li><strong>Listing Page Card:</strong> Shows in vehicle grid</li>
                        <li><strong>City/Series/Brand Listing:</strong> Page-specific cards</li>
                        <li><strong>Top Filter:</strong> Clickable filter badge with icon</li>
                        <li><strong>Quick Links:</strong> Icon shortcuts on specific pages</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>

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
                  <FormDescription className="text-xs text-gray-600 leading-relaxed">
                    {getPromotionTypeDescription(watchedType || "")}
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

          {/* Promotion Image - Hidden for listing-page-filter type */}
          {watchedType !== "listing-page-filter" && (
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
          )}

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

    {/* Comprehensive Info Modal */}
    {showInfoModal && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={() => setShowInfoModal(false)}
      >
        <div 
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Promotion Guide</h2>
              <p className="text-sm text-gray-500">Complete reference for all promotion types</p>
            </div>
            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Image Size Quick Reference */}
            <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-800">
                📐 Quick Reference: Image Sizes
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="pb-2 font-semibold text-gray-700">Type</th>
                      <th className="pb-2 font-semibold text-gray-700">Size (W × H)</th>
                      <th className="pb-2 font-semibold text-gray-700">Aspect Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    <tr>
                      <td className="py-2 text-gray-600">Homepage</td>
                      <td className="py-2 font-medium text-gray-900">1200 × 675px</td>
                      <td className="py-2 text-gray-600">16:9 Landscape</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Listing Page Cards</td>
                      <td className="py-2 font-medium text-gray-900">600 × 800px</td>
                      <td className="py-2 text-gray-600">3:4 Portrait</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Quick Links</td>
                      <td className="py-2 font-medium text-gray-900">800 × 600px</td>
                      <td className="py-2 text-gray-600">4:3 Landscape</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Top Filter</td>
                      <td className="py-2 font-medium text-gray-900">Icon Only</td>
                      <td className="py-2 text-gray-600">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Promotion Types Detail */}
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Promotion Types
            </h3>
            <div className="space-y-4">
              {PROMOTION_INFO.map((info) => (
                <div 
                  key={info.type}
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-yellow hover:bg-yellow/5"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900">{info.label}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {info.type}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">{info.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">
                      📏 {info.imageSize}
                    </span>
                    <span className="rounded bg-purple-50 px-2 py-1 text-purple-700">
                      📐 {info.aspectRatio}
                    </span>
                    <a
                      href={`http://localhost:3000${info.exampleUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-green-700 hover:bg-green-100"
                    >
                      <ExternalLink size={12} />
                      {info.exampleLabel}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips Section */}
            <div className="mt-6 rounded-lg border-l-4 border-yellow bg-yellow/10 p-4">
              <h4 className="mb-2 font-semibold text-gray-900">💡 Tips for Best Results</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Use high-quality images that match the recommended dimensions</li>
                <li>• For vehicle cards, use portrait images to match the grid layout</li>
                <li>• Quick link cards look best with landscape images</li>
                <li>• Top filters only use icons - no image upload needed</li>
                <li>• All links will open in a new tab when clicked by users</li>
              </ul>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 border-t bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="w-full rounded-lg bg-yellow px-4 py-2 font-medium text-white hover:bg-yellow/90"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    )}
    </TooltipProvider>
  );
}
