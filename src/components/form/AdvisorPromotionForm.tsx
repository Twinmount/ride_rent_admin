import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormField } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { AdvisorPromotionFormType } from "@/types/types";
import { AdvisorPromotionFormDefaultValue } from "@/constants";
import { AdvisorPromotionFormSchema } from "@/lib/validator";
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
import { FormContainer } from "./form-ui/FormContainer";
import { FormItemWrapper } from "./form-ui/FormItemWrapper";
import { FormSubmitButton } from "./form-ui/FormSubmitButton";

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
          title: `${type} Advisor Promotion successfully`,
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
        title: `${type} advisor promotion failed`,
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
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* type title */}
        <FormField
          control={form.control}
          name="promotionImage"
          render={({ field }) => (
            <PromotionFileUpload
              name={field.name}
              label="Promotion Image"
              description={
                "Upload promotion image of vertical ration. Max size: 5MB"
              }
              existingFile={formData?.promotionImage}
              maxSizeMB={5}
              setIsFileUploading={setIsFileUploading}
              bucketFilePath={GcsFilePaths.IMAGE}
              setDeletedImages={setDeletedImages}
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
            form.formState.isSubmitting
              ? "Processing..."
              : `${type} Advisor Promotion`
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
            navigateTo="/advisor/promotions"
          />
        )}

        <p className="m-0 -mt-3 p-0 text-center text-xs text-red-500">
          Note that Advisor blog promotions are global, not state specific.
        </p>
      </FormContainer>
    </Form>
  );
}
