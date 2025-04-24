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

import { Button } from "@/components/ui/button";
import { ListingMetaFormType } from "@/types/types";
import { ListingMetaFormDefaultValue } from "@/constants";
import { ListingMetaFormSchema } from "@/lib/validator";
import Spinner from "../general/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { addListingMetaData, updateListingMetaData } from "@/api/meta-data";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import StatesDropdown from "./dropdowns/StatesDropdown";
import VehicleTypesDropdown from "./dropdowns/VehicleTypesDropdown";
import MetaCategoryDropdownField from "./dropdowns/MetaCategoryDropdownField";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/input";

type ListingMetaFormProps = {
  type: "Add" | "Update";
  formData?: ListingMetaFormType | null;
};

export default function ListingMetaForm({
  type,
  formData,
}: ListingMetaFormProps) {
  const initialValues =
    formData && type === "Update" ? formData : ListingMetaFormDefaultValue;

  const navigate = useNavigate();
  const { metaDataId } = useParams<{ metaDataId: string }>();

  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof ListingMetaFormSchema>>({
    resolver: zodResolver(ListingMetaFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ListingMetaFormSchema>) {
    try {
      let data;
      if (type === "Add") {
        data = await addListingMetaData(values);
      } else if (type === "Update") {
        data = await updateListingMetaData(values, metaDataId as string);
      }

      if (data) {
        toast({
          title: `${type} Meta Data successfully`,
          className: "bg-yellow text-white",
        });
        navigate("/meta-data/listing");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} meta data failed`,
        description: "Something went wrong",
      });
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["listing-meta-data", metaDataId],
      });
      queryClient.invalidateQueries({
        queryKey: ["listing-meta-data"],
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[700px] flex-col gap-5 rounded-3xl bg-white p-2 py-8 !pb-8 shadow-md md:p-4"
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  State <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <StatesDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value);
                      }}
                      value={initialValues.stateId}
                      placeholder="state"
                      isDisabled={type === "Update"}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Choose your state
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base max-sm:w-fit lg:text-lg">
                  Vehicle Category <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="w-full flex-col items-start">
                  <FormControl>
                    <MetaCategoryDropdownField
                      onChangeHandler={(value) => {
                        field.onChange(value);
                        form.setValue("typeId", "");
                      }}
                      value={initialValues.categoryId}
                      isDisabled={type === "Update"}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    select vehicle category
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* type of the vehicle */}
          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Vehicle Type <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="w-full flex-col items-start">
                  <FormControl>
                    <VehicleTypesDropdown
                      vehicleCategoryId={form.watch("categoryId")}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      isDisabled={
                        !form.watch("categoryId") || type === "Update"
                      }
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    select vehicle type
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/*meta title*/}
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  Meta Title <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Textarea
                      placeholder="Best Affordable vehicle in  Dubai"
                      {...field}
                      className="textarea h-28 rounded-xl"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Provide the meta title for the selected state home page
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* meta description */}
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => {
              const [isFocused, setIsFocused] = useState(false); // To manage focus state
              const [charCount, setCharCount] = useState(
                field.value?.length || 0,
              ); // To track character count

              const handleFocus = () => setIsFocused(true);
              const handleBlur = () => setIsFocused(false);
              const handleInputChange = (
                e: React.ChangeEvent<HTMLTextAreaElement>,
              ) => {
                setCharCount(e.target.value.length);
                field.onChange(e);
              };

              return (
                <FormItem className="mb-2 flex w-full max-sm:flex-col">
                  <FormLabel className="ml-2 mt-4 flex h-fit w-52 min-w-52 justify-between text-base lg:text-lg">
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
                        placeholder="Meta Description"
                        {...field}
                        className={`textarea rounded-xl transition-all duration-300 ${
                          isFocused ? "h-96" : "h-28"
                        }`} // Dynamic height
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="flex-between ml-2 mt-1 w-full">
                      <span className="w-full max-w-[90%]">
                        Provide meta description.5000 characters max.
                      </span>{" "}
                      <span className="ml-auto"> {`${charCount}/5000`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2" />
                  </div>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="h1"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  H1 <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="Best Affordable vehicle in  Dubai"
                      {...field}
                      className="rounded-xl"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Provide the meta title for the selected state home page
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="h2"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base lg:text-lg">
                  H2 <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="Best Affordable vehicle in  Dubai"
                      {...field}
                      className="rounded-xl"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Provide the meta title for the selected state home page
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
          {form.formState.isSubmitting
            ? "Processing..."
            : `${type} Listing Meta`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
