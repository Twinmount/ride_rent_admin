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
import "@mantine/tiptap/styles.css";
import { Input } from "@/components/ui/input";
import { AdvisorBlogFormType } from "@/types/types";
import { AdvisorBlogFormSchema } from "@/lib/validator";
import { AdvisorBlogFormDefaultValues } from "@/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { GcsFilePaths } from "@/constants/enum";
import { toast } from "@/components/ui/use-toast";
import SingleFileUpload from "../file-uploads/SingleFileUpload";

import BlogCategoriesDropdown from "../dropdowns/BlogCategoryDropdown";
import { Textarea } from "@/components/ui/textarea";
import BlogContentEditor from "../BlogContentEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMultipleFiles } from "@/helpers/form";
import DeleteModal from "@/components/modal/DeleteModal";
import {
  addAdvisorBlog,
  deleteAdvisorBlogById,
  updateAdvisorBlog,
} from "@/api/advisor";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";

type StateFormProps = {
  type: "Add" | "Update";
  formData?: AdvisorBlogFormType | null;
};

export default function BlogForm({ type, formData }: StateFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const initialValues =
    formData && type === "Update" ? formData : AdvisorBlogFormDefaultValues;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { blogId } = useParams<{ blogId: string }>();

  // 1. Define your form.
  const form = useForm<z.infer<typeof AdvisorBlogFormSchema>>({
    resolver: zodResolver(AdvisorBlogFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AdvisorBlogFormSchema>) {
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
        data = await addAdvisorBlog(values);
      } else if (type === "Update") {
        data = await updateAdvisorBlog(values, blogId as string);
      }

      if (data) {
        // delete the images from the db, if any
        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
        toast({
          title: `${type} Advisor Blog successfully`,
          className: "bg-yellow text-white",
        });
        queryClient.invalidateQueries({
          queryKey: ["advisor-blogs"],
        });
        navigate("/advisor/blogs");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Advisor Blog failed`,
        description: "Something went wrong",
      });
    }
  }

  // delete mutation
  const { mutateAsync: deletePromotionMutation, isPending } = useMutation({
    mutationFn: () => deleteAdvisorBlogById(blogId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["advisor-blogs"],
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-5xl flex-col gap-5 rounded-3xl bg-white p-2 py-8 !pb-8 shadow-md md:p-4"
      >
        <div className="r flex flex-col gap-5">
          {/* type title */}
          <FormField
            control={form.control}
            name="blogTitle"
            render={({ field }) => {
              const [charCount, setCharCount] = useState(
                field.value?.length || 0,
              );

              const handleInputChange = (
                e: React.ChangeEvent<HTMLInputElement>,
              ) => {
                const newValue = e.target.value;

                // Prevent typing if the character count exceeds 50
                if (newValue.length <= 120) {
                  setCharCount(newValue.length);
                  field.onChange(e);
                }
              };

              return (
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base max-sm:w-fit lg:text-lg">
                    Blog Title
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>

                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Exploring Abu Dhabi: A Traveler's Guide'"
                        {...field}
                        className="input-field"
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="flex-between ml-2 w-full">
                      <span className="w-full max-w-[90%]">
                        Add your Blog Title. 120 characters max. Less is better.
                      </span>{" "}
                      <span
                        className={`ml-auto mr-5 ${
                          charCount >= 120 ? "text-red-500" : ""
                        }`}
                      >{`${charCount}/120`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />

          {/* description */}
          <FormField
            control={form.control}
            name="blogDescription"
            render={({ field }) => {
              const [charCount, setCharCount] = useState(
                field.value?.length || 0,
              );

              const handleInputChange = (
                e: React.ChangeEvent<HTMLInputElement>,
              ) => {
                const newValue = e.target.value;

                // Prevent typing if the character count exceeds 120
                if (newValue.length <= 150) {
                  setCharCount(newValue.length);
                  field.onChange(e);
                }
              };

              return (
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base max-sm:w-fit lg:text-lg">
                    Description
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>

                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <Input
                        placeholder="e.g., 'This blog provides an overview of the top attractions in Abu Dhabi.'"
                        {...field}
                        className="input-field"
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="flex-between ml-2 w-full">
                      <span className="w-full max-w-[90%]">
                        This value will be used to show the "description" in
                        each blog card on the frontend. Up to 120 characters are
                        allowed.
                      </span>
                      <span
                        className={`ml-auto mr-5 ${
                          charCount >= 150 ? "text-red-500" : ""
                        }`}
                      >{`${charCount}/150`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="blogImage"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Blog Banner"
                description="Upload an image with a maximum file size of 1mb."
                isDownloadable
                existingFile={formData?.blogImagePath || null}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                setDeletedImages={setDeletedImages}
              />
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="blogCategory"
          render={({ field }) => (
            <FormItem className="mb-2 flex w-full max-sm:flex-col">
              <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base lg:text-lg">
                Blog Category <span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="w-full flex-col items-start">
                <FormControl>
                  <BlogCategoriesDropdown
                    value={field.value}
                    onChangeHandler={field.onChange}
                    placeholder="category"
                    type="advisor"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Select the category in which the blog belongs to.
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </FormItem>
          )}
        />

        {/* blogAuthor */}
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem className="mb-2 flex w-full max-sm:flex-col">
              <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base max-sm:w-fit lg:text-lg">
                Blog Author<span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="w-full flex-col items-start">
                <FormControl>
                  <Input
                    placeholder="e.g., 'John Wick'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  This value will be used to mimic an "author" in blog details
                  page
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => {
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            );

            const handleInputChange = (
              e: React.ChangeEvent<HTMLInputElement>,
            ) => {
              const newValue = e.target.value;

              // Prevent typing if the character count exceeds 120
              if (newValue.length <= 150) {
                setCharCount(newValue.length);
                field.onChange(e);
              }
            };

            return (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base max-sm:w-fit lg:text-lg">
                  Meta Title
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="e.g., 'Top Attractions in Abu Dhabi'"
                      {...field}
                      className="input-field"
                      onChange={handleInputChange} // Handle change to track character count
                    />
                  </FormControl>
                  <FormDescription className="flex-between ml-2 w-full">
                    <span className="w-full max-w-[90%]">
                      Provide the meta title. 150 characters max.
                    </span>
                    <span
                      className={`ml-auto mr-5 ${
                        charCount >= 150 ? "text-red-500" : ""
                      }`}
                    >{`${charCount}/150`}</span>
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => {
            const [isFocused, setIsFocused] = useState(false); // To manage focus state
            const [charCount, setCharCount] = useState(
              field.value?.length || 0,
            );

            const handleFocus = () => setIsFocused(true);
            const handleBlur = () => setIsFocused(false);

            const handleInputChange = (
              e: React.ChangeEvent<HTMLTextAreaElement>,
            ) => {
              const newValue = e.target.value;

              // Prevent typing if the character count exceeds 500
              if (newValue.length <= 500) {
                setCharCount(newValue.length);
                field.onChange(e);
              }
            };

            return (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex h-fit w-64 justify-between text-base lg:text-lg">
                  Meta Description
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div
                  className="w-full flex-col items-start"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Discover the top attractions in Abu Dhabi, from the Sheikh Zayed Mosque to the Corniche.'"
                      {...field}
                      className={`textarea rounded-2xl border-none outline-none ring-0 transition-all duration-300 focus:ring-0 ${
                        isFocused ? "h-96" : "h-20"
                      }`}
                      onChange={handleInputChange} // Handle change to track character count
                    />
                  </FormControl>
                  <FormDescription className="flex-between ml-2 w-full">
                    <span className="w-full max-w-[90%]">
                      Provide meta description.500 characters max.
                    </span>{" "}
                    <span
                      className={`ml-auto mr-5 ${
                        charCount >= 500 ? "text-red-500" : ""
                      }`}
                    >
                      {" "}
                      {`${charCount}/500`}
                    </span>
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            );
          }}
        />

        <hr className="my-3 border" />

        {/* blog content text editor field*/}
        <FormField
          control={form.control}
          name="blogContent"
          render={({ field }) => (
            <BlogContentEditor
              content={field.value}
              onUpdate={(updatedContent) => field.onChange(updatedContent)}
            />
          )}
        />

        {/* Submit */}
        <FormSubmitButton
          text={
            isFileUploading
              ? "Uploading..."
              : form.formState.isSubmitting
                ? "Processing..."
                : `${type} Advisor Blog`
          }
          isLoading={form.formState.isSubmitting}
        />

        {/* delete modal */}
        {type === "Update" && (
          <DeleteModal
            onDelete={deletePromotionMutation}
            label="Delete Blog"
            title="Delete Blog?"
            description="Are you sure you want to delete this Blog? This cannot be undone"
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isPending || form.formState.isSubmitting}
            navigateTo="/ride-blogs"
          />
        )}
      </form>
    </Form>
  );
}
