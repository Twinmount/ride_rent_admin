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
      if (type === "Add") {
        data = await addPromotion(values, state.stateId as string);
      } else if (type === "Update") {
        data = await updatePromotion(values, promotionId as string);
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
                        City Page Quick Link
                      </SelectItem>
                      <SelectItem value="series-listing-page">
                        Series Page Quick Link
                      </SelectItem>
                      <SelectItem value="brand-listing-page">
                        Brand Page Quick Link
                      </SelectItem>
                      <SelectItem value="listing-page-filter">
                        Listing Page Top Filter
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
          <FormField
            control={form.control}
            name="promotionImage"
            render={({ field }) => (
              <PromotionFileUpload
                name={field.name}
                label="Promotion Image"
                description="Upload an image or GIF with a maximum file size of 5MB. Vertical (portrait) aspect ratio is preferred"
                existingFile={formData?.promotionImage}
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                setDeletedImages={setDeletedImages}
              />
            )}
          />

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
