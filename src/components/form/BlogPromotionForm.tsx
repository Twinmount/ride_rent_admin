import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormField } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { BlogPromotionFormType } from "@/types/types";
import { BlogPromotionFormDefaultValue } from "@/constants";
import { BlogPromotionFormSchema } from "@/lib/validator";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteModal from "../modal/DeleteModal";
import { useState } from "react";
import { GcsFilePaths } from "@/constants/enum";
import {
  addBlogPromotion,
  deleteBlogPromotion,
  updateBlogPromotion,
} from "@/api/blogs";
import { deleteMultipleFiles, imageGuidelines } from "@/helpers/form";
import PromotionFileUpload from "./file-uploads/PromotionsFileUpload";
import BlogPromotionPlacementDropdown from "./dropdowns/BlogPromotionPlacementDropdown";
import { FormSubmitButton } from "./form-ui/FormSubmitButton";
import { FormContainer } from "./form-ui/FormContainer";
import { FormItemWrapper } from "./form-ui/FormItemWrapper";

type BlogPromotionFormProps = {
  type: "Add" | "Update";
  formData?: BlogPromotionFormType | null;
};

export default function BlogPromotionForm({
  type,
  formData,
}: BlogPromotionFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const initialValues =
    formData && type === "Update" ? formData : BlogPromotionFormDefaultValue;

  const navigate = useNavigate();
  const { promotionId } = useParams<{ promotionId: string }>();
  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof BlogPromotionFormSchema>>({
    resolver: zodResolver(BlogPromotionFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof BlogPromotionFormSchema>) {
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
        data = await addBlogPromotion(values);
      } else if (type === "Update") {
        data = await updateBlogPromotion(values, promotionId as string);
      }

      if (data) {
        //  delete the images from the db, if any
        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
        toast({
          title: `${type} Promotion successfully`,
          className: "bg-yellow text-white",
        });
        navigate("/ride-blogs/promotions");
        queryClient.invalidateQueries({
          queryKey: ["blog-promotions"],
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
    mutationFn: () => deleteBlogPromotion(promotionId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-promotions"],
        exact: true,
      });
    },
  });

  const selectedPlacement = form.watch("blogPromotionPlacement");
  const currentImageDescription =
    imageGuidelines[selectedPlacement] || "Upload an image. Max size: 5MB.";

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* blog promotion placement */}
        <FormField
          control={form.control}
          name="blogPromotionPlacement"
          render={({ field }) => (
            <FormItemWrapper
              label="Blog Placement"
              description="Choose where the blog will be placed."
            >
              <BlogPromotionPlacementDropdown
                value={field.value}
                onChangeHandler={field.onChange}
              />
            </FormItemWrapper>
          )}
        />

        {/* type title */}
        <FormField
          control={form.control}
          name="promotionImage"
          render={({ field }) => (
            <PromotionFileUpload
              name={field.name}
              label="Promotion Image"
              description={currentImageDescription}
              existingFile={formData?.promotionImage}
              maxSizeMB={5}
              setIsFileUploading={setIsFileUploading}
              bucketFilePath={GcsFilePaths.IMAGE}
              setDeletedImages={setDeletedImages}
              isDisabled={!selectedPlacement}
            />
          )}
        />

        {/* promotion link */}
        <FormField
          control={form.control}
          name="promotionLink"
          render={({ field }) => (
            <FormItemWrapper
              label="Promotion Link"
              description=" Provide the link associated with this blog promotion"
            >
              <Input
                placeholder="eg: 'https://example.com'"
                {...field}
                className="input-field"
              />
            </FormItemWrapper>
          )}
        />

        {/* Submit */}
        <FormSubmitButton
          text={
            form.formState.isSubmitting ? "Processing..." : `${type} Promotion`
          }
          isLoading={form.formState.isSubmitting}
        />

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
            navigateTo="/ride-blogs/promotions"
          ></DeleteModal>
        )}

        <p className="m-0 -mt-3 p-0 text-center text-xs text-red-500">
          Note that blog promotions are global, not state specific.
        </p>
      </FormContainer>
    </Form>
  );
}
