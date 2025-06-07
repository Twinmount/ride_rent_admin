import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GcsFilePaths } from "@/constants/enum";
import SingleFileUpload from "./file-uploads/SingleFileUpload";
import { toast } from "../ui/use-toast";
import { Switch } from "../ui/switch";
import {
  addHomePageBanner,
  deleteHomePageBanner,
  updateHomePageBanner,
} from "@/api/states";

const BannerSectionSchema = z.object({
  _id: z.string().optional(),
  sectionName: z.string().min(1, "Section name is required"),
  desktopImage: z.string().min(1, "Desktop image is required"),
  mobileImage: z.string().min(1, "Mobile image is required"),
  link: z.string().optional(),
  isEnabled: z.boolean().default(true),
});

export interface BannerType {
  _id?: string;
  sectionName: string;
  desktopImage: string;
  mobileImage: string;
  link?: string;
  isEnabled: boolean;
  bannerForId: string;
  bannerFor: "state" | "country" | "parentState";
}

const HomepageBannerSchema = z.object({
  sections: z.array(BannerSectionSchema),
});

type FormValues = z.infer<typeof HomepageBannerSchema>;

export default function HomepageBannerForm({
  id = "",
  bannerFor = "state",
  data = [],
}: {
  id: string;
  bannerFor: "state" | "country" | "parentState";
  data: BannerType[];
}) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(HomepageBannerSchema),
    defaultValues: {
      sections: data.length
        ? data.map((item) => ({
            _id: item._id || "",
            sectionName: item.sectionName,
            desktopImage: item.desktopImage || "",
            mobileImage: item.mobileImage || "",
            link: item.link || "",
            isEnabled: item.isEnabled,
          }))
        : [
            {
              _id: "",
              sectionName: "",
              desktopImage: "",
              mobileImage: "",
              link: "",
              isEnabled: true,
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  // Dummy Save Handler
  const handleSectionSave = async (sectionIndex: number) => {
    if (isFileUploading) {
      toast({
        title: "File Upload in Progress",
        description: "Please wait until the file upload completes.",
        duration: 3000,
        className: "bg-orange",
      });
      return;
    }

    const isValid = await form.trigger(`sections.${sectionIndex}`);
    if (!isValid) {
      // Optionally show a toast or handle UI feedback
      toast({
        title: "Validation Failed",
        description: `Please correct errors in section ${sectionIndex + 1}`,
        className: "bg-red-500 text-white",
      });
      return;
    }

    try {
      const section = form.getValues().sections[sectionIndex];

      const formData: BannerType = {
        _id: section._id,
        sectionName: section.sectionName,
        desktopImage: section.desktopImage,
        mobileImage: section.mobileImage,
        link: section.link,
        isEnabled: section.isEnabled,
        bannerForId: id,
        bannerFor,
      };

      const response = formData?._id
        ? await updateHomePageBanner(formData, formData._id)
        : ((await addHomePageBanner(formData)) as any);

      if (response && response?.result?._id && !formData._id) {
        form.setValue(`sections.${sectionIndex}._id`, response?.result?._id);
      }

      if (response) {
        // commented this line on puprose
        // await deleteMultipleFiles(deletedImages);
      }

      toast({
        title: "Homepage Banners Saved",
        className: "bg-yellow text-white",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Something went wrong.",
      });
    }
  };

  // Dummy Delete Handler with Confirmation
  const handleSectionRemove = async (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this section?",
    );
    if (confirmDelete) {
      remove(index);
      if (fields[index]._id) {
        await deleteHomePageBanner(fields[index]._id);
      }
      //   queryClient.invalidateQueries({ queryKey: ["banner-state", id] });
      toast({
        title: `Section ${index + 1} removed`,
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-xl bg-white p-6 shadow-md"
      >
        <h2 className="text-center text-xl font-bold">
          Homepage Banner Sections
        </h2>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Section {index + 1}</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="bg-yellow px-6 py-3 text-base font-semibold text-white hover:bg-yellow/90"
                  onClick={() => handleSectionSave(index)}
                >
                  Save Section
                </Button>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSectionRemove(index)}
                  >
                    Remove Section
                  </Button>
                )}
              </div>
            </div>

            {/* Enabled Toggle */}
            <FormField
              control={form.control}
              name={`sections.${index}.isEnabled`}
              render={({ field }) => (
                <FormItem className="mt-4 flex items-center justify-between">
                  <FormLabel className="mb-0">Enabled</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="ml-3"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Section Name */}
            <FormField
              control={form.control}
              name={`sections.${index}.sectionName`}
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: Hero Banner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Desktop Image */}
            <FormField
              control={form.control}
              name={`sections.${index}.desktopImage`}
              render={({ field }) => (
                <SingleFileUpload
                  name={`sections.${index}.desktopImage`}
                  label="Desktop Image"
                  description="Recommended aspect ratio: 1600x450 (desktop)"
                  isDownloadable
                  setIsFileUploading={setIsFileUploading}
                  bucketFilePath={GcsFilePaths.BANNERS}
                  setDeletedImages={setDeletedImages}
                  existingFile={field.value}
                />
              )}
            />

            {/* Mobile Image */}
            <FormField
              control={form.control}
              name={`sections.${index}.mobileImage`}
              render={({ field }) => (
                <SingleFileUpload
                  name={`sections.${index}.mobileImage`}
                  label="Mobile Image"
                  description="Recommended aspect ratio: 1600x800 (mobile)"
                  isDownloadable
                  setIsFileUploading={setIsFileUploading}
                  bucketFilePath={GcsFilePaths.BANNERS}
                  setDeletedImages={setDeletedImages}
                  existingFile={field.value}
                />
              )}
            />

            <FormField
              control={form.control}
              name={`sections.${index}.link`}
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        {/* Add Section Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              sectionName: "",
              desktopImage: "",
              mobileImage: "",
              link: "",
              isEnabled: true,
            })
          }
        >
          + Add Another Section
        </Button>
      </form>
    </Form>
  );
}
