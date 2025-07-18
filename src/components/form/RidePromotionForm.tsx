import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SingleFileUpload from "./file-uploads/SingleFileUpload";
import { toast } from "../ui/use-toast";
import { addRidePromotions, updateRidePromotions } from "@/api/ride-promotions";
import { RidePromotionFormSchema } from "@/lib/validator";
import { RidePromotionFormType } from "@/types/formTypes";
import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import { FormContainer, FormItemWrapper, FormSubmitButton } from "./form-ui";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { RidePromotionFormDefaultValues } from "@/constants";

type RidePromotionFormProps = {
  id: string;
  promotionFor: "state" | "parentState" | "country";
  formData: RidePromotionFormType | null; // entire section data
};

export default function RidePromotionForm({
  id,
  promotionFor,
  formData,
}: RidePromotionFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const type: "Add" | "Update" = !!formData ? "Update" : "Add";

  const form = useForm<RidePromotionFormType>({
    resolver: zodResolver(RidePromotionFormSchema),
    defaultValues: formData ?? RidePromotionFormDefaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  const onSubmit = async (values: RidePromotionFormType) => {
    if (isFileUploading) {
      toast({
        title: "File upload in progress",
        description: "Please wait until all files finish uploading.",
        className: "bg-orange",
      });
      return;
    }

    try {
      const payload = {
        ...values,
        promotionForId: id,
        promotionFor,
      };

      // const response = await saveRidePromotions(payload);
      let response;
      if (type === "Update") {
        response = await updateRidePromotions(payload);
      } else {
        response = await addRidePromotions(payload);
      }

      if (response) {
        await deleteMultipleFiles(deletedImages);
        queryClient.invalidateQueries({ queryKey: ["ride-promotions"] });
      }

      toast({
        title: type === "Add" ? "Promotion Saved" : "Promotion Updated",
        description:
          "Changes will be reflected in public home page of corresponding location",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      console.error("Save failed:", error);
      toast({
        variant: "destructive",
        title: "Promotion save Failed",
        description: "There was an error saving the promotions.",
      });
    }
  };

  return (
    <Form {...form}>
      <FormContainer onSubmit={form.handleSubmit(onSubmit)}>
        {/* Section Title */}
        <FormField
          control={form.control}
          name="sectionTitle"
          render={({ field }) => (
            <FormItemWrapper
              label="Section Title"
              description="This title will appear above the promotion cards."
            >
              <Input
                className="input-field"
                placeholder="Best offers in Bengaluru"
                {...field}
              />
            </FormItemWrapper>
          )}
        />

        {/* Section Subtitle */}
        <FormField
          control={form.control}
          name="sectionSubtitle"
          render={({ field }) => (
            <FormItemWrapper
              label="Section Subtitle"
              description="This subtitle appears below the section title."
            >
              <Input
                className="input-field"
                placeholder="Discover exclusive deals available in your location."
                {...field}
              />
            </FormItemWrapper>
          )}
        />

        {/* Promotion Cards */}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="mb-4 rounded-xl border-2 border-gray-200 p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold lg:text-xl">
                {" "}
                Promotion Card {index + 1}
              </h3>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                Delete
              </Button>
            </div>

            {/* Card Image */}
            <FormField
              control={form.control}
              name={`cards.${index}.image`}
              render={({ field }) => (
                <SingleFileUpload
                  name={field.name}
                  label="Vehicle Image"
                  description="Recommended size: 800x600"
                  setIsFileUploading={setIsFileUploading}
                  bucketFilePath={GcsFilePaths.IMAGE}
                  existingFile={field.value}
                  setDeletedImages={setDeletedImages}
                />
              )}
            />

            {/* Card Title */}
            <FormField
              control={form.control}
              name={`cards.${index}.cardTitle`}
              render={({ field }) => (
                <FormItemWrapper
                  label="Card Title"
                  description="The main heading of this promotion card."
                >
                  <Input
                    className="input-field bg-white"
                    placeholder="Offer Upto 25%"
                    {...field}
                  />
                </FormItemWrapper>
              )}
            />

            {/* Card Subtitle */}
            <FormField
              control={form.control}
              name={`cards.${index}.cardSubtitle`}
              render={({ field }) => (
                <FormItemWrapper
                  label="Card Subtitle"
                  description="Short description for this promotion card."
                >
                  <Input
                    className="input-field"
                    placeholder="Short description for this promotion"
                    {...field}
                  />
                </FormItemWrapper>
              )}
            />

            {/* Card Link */}
            <FormField
              control={form.control}
              name={`cards.${index}.link`}
              render={({ field }) => (
                <FormItemWrapper
                  label="Link"
                  description="URL to navigate to when this card is clicked."
                >
                  <Input
                    className="input-field"
                    placeholder="https://example.com"
                    {...field}
                  />
                </FormItemWrapper>
              )}
            />
          </div>
        ))}

        {/* Add Card Button */}
        {fields.length < 4 && (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                image: "",
                cardTitle: "",
                cardSubtitle: "",
                link: "",
              })
            }
          >
            <Plus className="mr-2 text-yellow" /> Add Promotion Card
          </Button>
        )}

        {/* Submit Button */}
        <div className="flex-center mt-6 flex-col gap-4">
          <FormSubmitButton
            text={
              form.formState.isSubmitting
                ? "Submitting..."
                : type === "Add"
                  ? "Save"
                  : "Update"
            }
            isLoading={form.formState.isSubmitting}
          />
          <Button
            type="button"
            variant="outline"
            className="flex-center button col-span-2 mx-auto w-full bg-slate-900 !text-lg !font-semibold text-gray-100 hover:bg-slate-800 hover:text-white md:w-10/12 lg:w-8/12"
            onClick={() => {
              form.reset();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Cancel & Reset
          </Button>
        </div>
      </FormContainer>
    </Form>
  );
}
