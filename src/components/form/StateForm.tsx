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
import { StateFormType } from "@/types/types";
import { StateFormSchema } from "@/lib/validator";
import { StateFormDefaultValues } from "@/constants";
import Spinner from "../general/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { addState, updateState } from "@/api/states";
import { useEffect, useState } from "react";
import { GcsFilePaths } from "@/constants/enum";
import { deleteMultipleFiles } from "@/helpers/form";
import SingleFileUpload from "./file-uploads/SingleFileUpload";
import { useStateListQuery } from "@/hooks/query/useStateListQuery";
import Select from "react-select";

type StateFormProps = {
  type: "Add" | "Update";
  formData?: StateFormType | null;
};

export default function StateForm({ type, formData }: StateFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const initialValues =
    formData && type === "Update" ? formData : StateFormDefaultValues;

  const navigate = useNavigate();
  const { stateId } = useParams<{ stateId: string }>();

  const stateListQuery = useStateListQuery({ enabled: true });
  const { data: stateList } = !!stateListQuery && stateListQuery;
  const stateOptions = stateList?.result
    ?.filter((c: any) => c.stateId !== initialValues.stateId)
    .map((state) => ({
      value: state.stateId,
      label: state.stateName,
    }));

  const [selectedStates, setSelectedStates] = useState<string[]>(
    initialValues?.relatedStates ?? [],
  );

  useEffect(() => {
    if (type === "Update") {
      setSelectedStates(formData?.relatedStates ?? []);
    }
  }, [formData]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof StateFormSchema>>({
    resolver: zodResolver(StateFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof StateFormSchema>) {
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
        data = await addState(values, selectedStates);
      } else if (type === "Update") {
        data = await updateState(values, stateId as string, selectedStates);
      }

      if (data) {
        // actually delete the images from the db, if any
        await deleteMultipleFiles(deletedImages);
      }

      if (data) {
        toast({
          title: `${type} State successfully`,
          className: "bg-yellow text-white",
        });

        navigate("/locations/manage-states");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Location failed`,
        description: "Something went wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[700px] flex-col gap-5 rounded-3xl bg-white p-2 py-8 !pb-8 shadow-md md:p-4"
      >
        <div className="r flex flex-col gap-5">
          {/* type title */}
          <FormField
            control={form.control}
            name="stateName"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-56 justify-between text-base max-sm:w-fit lg:text-lg">
                  State Name
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: 'Abu Dhabi'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Add your State Name
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="stateValue"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-56 justify-between text-base max-sm:w-fit lg:text-lg">
                  State Value<span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: 'abu-dhabi'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    This value will be used for API interaction. Eg: for "Abu
                    Dhabi", value will be "abu-dhabi"
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stateImage"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="State Image"
                description="Upload an image with a maximum file size of 1mb."
                isDownloadable
                existingFile={formData?.stateImage || null}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                setDeletedImages={setDeletedImages}
              />
            )}
          />

          <FormField
            control={form.control}
            name="relatedStates"
            render={() => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-56 justify-between text-base max-sm:w-fit lg:text-lg">
                  Related States <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Select
                      isMulti
                      options={stateOptions || []}
                      value={stateOptions?.filter((opt) =>
                        selectedStates.includes(opt.value),
                      )}
                      onChange={(selected: any) =>
                        setSelectedStates(selected.map((opt: any) => opt.value))
                      }
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Select related states in any order.
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
          {isFileUploading
            ? "Uploading..."
            : form.formState.isSubmitting
              ? "Processing..."
              : `${type} State`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
