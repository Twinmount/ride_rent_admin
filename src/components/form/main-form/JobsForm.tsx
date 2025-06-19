import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { JobFormSchema } from "@/lib/validator";
import { JobFormDefaultValues } from "@/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Spinner from "@/components/general/Spinner";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteModal from "@/components/modal/DeleteModal";
import JobFormDropdown from "../dropdowns/JobFormDropdown";
import { addJob, deleteJobById, updateJob } from "@/api/careers";

export type JobFormSchemaType = z.infer<typeof JobFormSchema>;

type JobFormProps = {
  type: "Add" | "Update";
  formData?: JobFormSchemaType | null;
};

const CAREER_JOB = "CAREER_JOB";

export default function JobsForm({ type, formData }: JobFormProps) {
  const initialValues =
    formData && type === "Update" ? formData : JobFormDefaultValues;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { jobId } = useParams<{ jobId: string }>();

  // 1. Define your form.
  const form = useForm<JobFormSchemaType>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: JobFormSchemaType) {
    try {
      let data;
      if (type === "Add") {
        data = await addJob(values);
      } else if (type === "Update") {
        data = await updateJob(values, jobId as string);
      }

      if (data) {
        toast({
          title: `${type} job successfully`,
          className: "bg-yellow text-white",
        });
        queryClient.invalidateQueries({
          queryKey: [CAREER_JOB],
        });
        navigate("/careers/jobs");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} job failed`,
        description: "Something went wrong",
      });
    }
  }

  // delete mutation
  const { mutateAsync: deleteJobMutation, isPending } = useMutation({
    mutationFn: () => deleteJobById(jobId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CAREER_JOB],
      });
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray<z.infer<typeof JobFormSchema>>({
    control: form.control,
    name: "sections",
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
            name="jobtitle"
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
                    Job Title
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>

                  <div className="w-full flex-col items-start">
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Software Developer'"
                        {...field}
                        className="input-field"
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="flex-between ml-2 w-full">
                      <span className="w-full max-w-[90%]">
                        Add your Job Title. 120 characters max. Less is better.
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
            name="jobdescription"
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
                    Job Description
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
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormDescription className="flex-between ml-2 w-full">
                      <span className="w-full max-w-[90%]">
                        This value will be used to show the "job description" in
                        each job item. Up to 500 characters are allowed.
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
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="mb-2 flex w-full max-sm:flex-col">
              <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base lg:text-lg">
                Location <span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="w-full flex-col items-start">
                <FormControl>
                  <JobFormDropdown
                    value={field.value}
                    onChangeHandler={field.onChange}
                    placeholder="Location"
                    type="location"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Select the job location.
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="mb-2 flex w-full max-sm:flex-col">
              <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base max-sm:w-fit lg:text-lg">
                Date<span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="w-full flex-col items-start">
                <FormControl>
                  <Input
                    type="date"
                    placeholder="e.g., 'Choose date'"
                    value={field.value}
                    onChange={field.onChange}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Select a date to show in job details
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem className="mb-2 flex w-full max-sm:flex-col">
              <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base lg:text-lg">
                Job Level <span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="w-full flex-col items-start">
                <FormControl>
                  <JobFormDropdown
                    value={field.value}
                    onChangeHandler={field.onChange}
                    // placeholder="Location"
                    type="level"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Select the job level.
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem className="mb-2 flex w-full max-sm:flex-col">
              <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base lg:text-lg">
                Experience <span className="mr-5 max-sm:hidden">:</span>
              </FormLabel>
              <div className="w-full flex-col items-start">
                <FormControl>
                  <JobFormDropdown
                    value={field.value}
                    onChangeHandler={field.onChange}
                    // placeholder="Location"
                    type="experience"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Select the job experience.
                </FormDescription>
                <FormMessage className="ml-2" />
              </div>
            </FormItem>
          )}
        />

        {/* Sections */}

        <div>
          <div>
            {sectionFields?.map((section, sectionIndex) => {
              return (
                <div
                  key={section.id}
                  className="mb-3 space-y-4 rounded-lg border p-4"
                >
                  {/* Section Title */}
                  <FormField
                    control={form.control}
                    name={`sections.${sectionIndex}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter section title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Points */}

                  <PointsField
                    sectionIndex={sectionIndex}
                    control={form.control}
                  />

                  {/* Remove section */}
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeSection(sectionIndex)}
                    className="text-sm"
                  >
                    Remove Section
                  </Button>
                </div>
              );
            })}
            <Button
              type="button"
              onClick={() =>
                appendSection({
                  title: "",
                  points: [""],
                })
              }
              className="bg-yellow text-white"
            >
              + Add Section
            </Button>
          </div>
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="flex-center button col-span-2 mt-3 w-full bg-yellow !text-lg !font-semibold hover:bg-yellow/90"
        >
          {form.formState.isSubmitting ? "Processing..." : `${type} Job`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>

        {/* delete modal */}
        {type === "Update" && (
          <DeleteModal
            onDelete={deleteJobMutation}
            label="Delete Job"
            title="Delete Job?"
            description="Are you sure you want to delete this Job? This cannot be undone"
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isPending || form.formState.isSubmitting}
            navigateTo="/careers/jobs"
          />
        )}
      </form>
    </Form>
  );
}

// Separate component for Points
function PointsField({
  sectionIndex,
  control,
}: {
  sectionIndex: number;
  control: any;
}) {
  const {
    fields: pointFields,
    append: appendPoint,
    remove: removePoint,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.points` as const,
  });

  return (
    <div className="space-y-3">
      <FormLabel className="text-sm text-gray-700">Points</FormLabel>
      {pointFields.map((point, pointIndex) => (
        <div key={point.id} className="flex items-start gap-2">
          <FormField
            control={control}
            name={`sections.${sectionIndex}.points.${pointIndex}` as const}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea placeholder="Enter point" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => removePoint(pointIndex)}
            className="mt-1 text-red-500"
          >
            ✕
          </Button>
        </div>
      ))}
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => appendPoint("")}
          className="text-sm"
        >
          + Add Point
        </Button>
      </div>
    </div>
  );
}
