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
import { AdvisorPromotionFormType } from "@/types/types";
import { AdvisorPromotionFormDefaultValue } from "@/constants";
import { AdvisorPromotionFormSchema } from "@/lib/validator";
import Spinner from "../general/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteModal from "../modal/DeleteModal";
import { useState } from "react";
import { GcsFilePaths } from "@/constants/enum";

import { deleteMultipleFiles } from "@/helpers/form";
import PromotionFileUpload from "./file-uploads/PromotionsFileUpload";
import {
  addAdvisorBlogPromotion,
  deleteAdvisorBlogById,
  updateAdvisorBlogPromotion,
} from "@/api/advisor";

type AdvisorPromotionFormProps = {
  type: "Add" | "Update";
  formData?: AdvisorPromotionFormType | null;
};

export default function AdvisorPromotionForm({
  type,
  formData,
}: AdvisorPromotionFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const initialValues =
    formData && type === "Update" ? formData : AdvisorPromotionFormDefaultValue;

  const navigate = useNavigate();
  const { promotionId } = useParams<{ promotionId: string }>();
  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof AdvisorPromotionFormSchema>>({
    resolver: zodResolver(AdvisorPromotionFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AdvisorPromotionFormSchema>) {
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
        data = await addAdvisorBlogPromotion(values);
      } else if (type === "Update") {
        data = await updateAdvisorBlogPromotion(values, promotionId as string);
      }

      if (data) {
        // actually delete the images from the db, if any
        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
        toast({
          title: `${type} Promotion successfully`,
          className: "bg-yellow text-white",
        });
        navigate("/advisor/promotions");
        queryClient.invalidateQueries({
          queryKey: ["advisor-promotions"],
        });
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
    mutationFn: () => deleteAdvisorBlogById(promotionId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-promotions"],
        exact: true,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[700px] flex-col gap-5 rounded-3xl bg-white p-2 py-8 !pb-8 shadow-md md:p-4"
      >
        <div className="flex flex-col gap-5">
          {/* type title */}
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

          {/* type value */}
          <FormField
            control={form.control}
            name="promotionLink"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base max-sm:w-fit lg:text-lg">
                  Promotion Link <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: 'https://example.com'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Provide the link associated with this blog promotion
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />
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

        {/* delete modal */}
        {type === "Update" && (
          <DeleteModal
            onDelete={deletePromotionMutation}
            label="Delete"
            title="Delete promotion?"
            description="Are you sure you want to delete this promotion? "
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isPending || form.formState.isSubmitting}
            navigateTo="/advisor/promotions"
          ></DeleteModal>
        )}

        <p className="m-0 -mt-3 p-0 text-center text-xs text-red-500">
          Note that advisor promotions are global, not state specific.
        </p>
      </form>
    </Form>
  );
}
