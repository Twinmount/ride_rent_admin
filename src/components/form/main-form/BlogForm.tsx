import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import '@mantine/tiptap/styles.css'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogFormType } from '@/types/types'
import { BlogFormSchema } from '@/lib/validator'
import { BlogFormDefaultValues } from '@/constants'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { GcsFilePaths } from '@/constants/enum'
import Spinner from '@/components/general/Spinner'
import { toast } from '@/components/ui/use-toast'
import SingleFileUpload from '../SingleFileUpload'
import { addBlog, deleteBlogById, updateBlog } from '@/api/blogs'
import BlogCategoriesDropdown from '../BlogCategoryDropdown'
import { Textarea } from '@/components/ui/textarea'
import BlogContentEditor from '../BlogContentEditor'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMultipleFiles } from '@/helpers/form'
import DeleteModal from '@/components/modal/DeleteModal'

type StateFormProps = {
  type: 'Add' | 'Update'
  formData?: BlogFormType | null
}

export default function BlogForm({ type, formData }: StateFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [deletedImages, setDeletedImages] = useState<string[]>([])

  const initialValues =
    formData && type === 'Update' ? formData : BlogFormDefaultValues

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { blogId } = useParams<{ blogId: string }>()

  // 1. Define your form.
  const form = useForm<z.infer<typeof BlogFormSchema>>({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: initialValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof BlogFormSchema>) {
    if (isFileUploading) {
      toast({
        title: 'File Upload in Progress',
        description:
          'Please wait until the file upload completes before submitting the form.',
        duration: 3000,
        className: 'bg-orange',
      })
      return
    }

    try {
      let data
      if (type === 'Add') {
        data = await addBlog(values)
      } else if (type === 'Update') {
        data = await updateBlog(values, blogId as string)
      }

      if (data) {
        // actually delete the images from the db, if any
        await deleteMultipleFiles(deletedImages)
      }

      if (data) {
        toast({
          title: `${type} Blog successfully`,
          className: 'bg-yellow text-white',
        })
        queryClient.invalidateQueries({
          queryKey: ['blog-by-id', blogId],
          exact: true,
        })
        queryClient.invalidateQueries({
          queryKey: ['blogs'],
          exact: true,
        })
        navigate('/happenings/blogs')
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: `${type} Blog failed`,
        description: 'Something went wrong',
      })
    }
  }

  // delete mutation
  const { mutateAsync: deletePromotionMutation, isPending } = useMutation({
    mutationFn: () => deleteBlogById(blogId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
        exact: true,
      })
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-5xl mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8  shadow-md"
      >
        <div className="flex flex-col gap-5 r ">
          {/* type title */}
          <FormField
            control={form.control}
            name="blogTitle"
            render={({ field }) => {
              const [charCount, setCharCount] = useState(
                field.value?.length || 0
              )

              const handleInputChange = (
                e: React.ChangeEvent<HTMLInputElement>
              ) => {
                const newValue = e.target.value

                // Prevent typing if the character count exceeds 50
                if (newValue.length <= 60) {
                  setCharCount(newValue.length)
                  field.onChange(e)
                }
              }

              return (
                <FormItem className="flex w-full mb-2 max-sm:flex-col">
                  <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                    Blog Title
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>

                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Exploring Abu Dhabi: A Traveler's Guide'"
                        {...field}
                        className="input-field"
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="w-full ml-2 flex-between">
                      <span className="w-full max-w-[90%]">
                        Add your Blog Title. 60 characters max. Less is better.
                      </span>{' '}
                      <span
                        className={`ml-auto mr-5 ${
                          charCount >= 50 ? 'text-red-500' : ''
                        }`}
                      >{`${charCount}/50`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )
            }}
          />

          {/* description */}
          <FormField
            control={form.control}
            name="blogDescription"
            render={({ field }) => {
              const [charCount, setCharCount] = useState(
                field.value?.length || 0
              )

              const handleInputChange = (
                e: React.ChangeEvent<HTMLInputElement>
              ) => {
                const newValue = e.target.value

                // Prevent typing if the character count exceeds 120
                if (newValue.length <= 120) {
                  setCharCount(newValue.length)
                  field.onChange(e)
                }
              }

              return (
                <FormItem className="flex w-full mb-2 max-sm:flex-col">
                  <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                    Description
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>

                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="e.g., 'This blog provides an overview of the top attractions in Abu Dhabi.'"
                        {...field}
                        className="input-field"
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="w-full ml-2 flex-between">
                      <span className="w-full max-w-[90%]">
                        This value will be used to show the "description" in
                        each blog card on the frontend. Up to 120 characters are
                        allowed.
                      </span>
                      <span
                        className={`ml-auto mr-5 ${
                          charCount >= 120 ? 'text-red-500' : ''
                        }`}
                      >{`${charCount}/120`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              )
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
            <FormItem className="flex w-full mb-2 max-sm:flex-col ">
              <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base lg:text-lg">
                Blog Category <span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="flex-col items-start w-full">
                <FormControl>
                  <BlogCategoriesDropdown
                    value={field.value}
                    onChangeHandler={field.onChange}
                    placeholder="category"
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
            <FormItem className="flex w-full mb-2 max-sm:flex-col ">
              <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                Blog Author<span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="flex-col items-start w-full">
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

        {/* meta title */}
        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem className="flex w-full mb-2 max-sm:flex-col ">
              <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                Meta title<span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="flex-col items-start w-full">
                <FormControl>
                  <Input
                    placeholder="e.g., 'Best Attractions in Abu Dhabi'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  This value will be used to show the "description" in each blog
                  cards in the frontend.
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => {
            const [isFocused, setIsFocused] = useState(false) // To manage focus state
            const [charCount, setCharCount] = useState(field.value?.length || 0)

            const handleFocus = () => setIsFocused(true)
            const handleBlur = () => setIsFocused(false)

            const handleInputChange = (
              e: React.ChangeEvent<HTMLTextAreaElement>
            ) => {
              const newValue = e.target.value

              // Prevent typing if the character count exceeds 500
              if (newValue.length <= 500) {
                setCharCount(newValue.length)
                field.onChange(e)
              }
            }

            return (
              <FormItem className="flex w-full mb-2 max-sm:flex-col">
                <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base h-fit lg:text-lg">
                  Meta Description
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div
                  className="flex-col items-start w-full"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Discover the top attractions in Abu Dhabi, from the Sheikh Zayed Mosque to the Corniche.'"
                      {...field}
                      className={`textarea rounded-2xl transition-all duration-300 outline-none border-none focus:ring-0 ring-0 ${
                        isFocused ? 'h-96' : 'h-20'
                      }`}
                      onChange={handleInputChange} // Handle change to track character count
                    />
                  </FormControl>
                  <FormDescription className="w-full ml-2 flex-between">
                    <span className="w-full max-w-[90%]">
                      Provide meta description.500 characters max.
                    </span>{' '}
                    <span
                      className={`ml-auto mr-5 ${
                        charCount >= 500 ? 'text-red-500' : ''
                      }`}
                    >
                      {' '}
                      {`${charCount}/500`}
                    </span>
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )
          }}
        />

        <hr className="my-3 border" />

        {/* blog content text editor */}
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

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-yellow/90"
        >
          {isFileUploading
            ? 'Uploading...'
            : form.formState.isSubmitting
            ? 'Processing...'
            : `${type} Blog`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>

        {/* delete modal */}
        {type === 'Update' && (
          <DeleteModal
            onDelete={deletePromotionMutation}
            label="Delete Blog"
            title="Delete Blog?"
            description="Are you sure you want to delete this Blog? This cannot be undone"
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isPending || form.formState.isSubmitting}
            navigateTo="/happenings/blogs"
          ></DeleteModal>
        )}
      </form>
    </Form>
  )
}
