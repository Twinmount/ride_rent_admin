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
import StatesDropdown from "./StatesDropdown";
import VehicleTypesDropdown from "./dropdowns/VehicleTypesDropdown";
import CategoryDropdown from "./dropdowns/CategoryDropdown";

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
        navigate("/manage-meta-data/listing");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} meta data failed`,
        description: "Something went wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[700px] mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8  shadow-md"
      >
        <div className="flex flex-col gap-5 ">
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  State <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <StatesDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value);
                      }}
                      value={initialValues.stateId}
                      placeholder="state"
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
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base max-sm:w-fit w-72 lg:text-lg">
                  Vehicle Category <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <CategoryDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value);
                        form.setValue("typeId", "");
                      }}
                      value={initialValues.categoryId}
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
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Vehicle Type <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <VehicleTypesDropdown
                      vehicleCategoryId={form.watch("categoryId")}
                      value={field.value}
                      onChangeHandler={field.onChange}
                      isDisabled={!form.watch("categoryId")}
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
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Meta Title <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Textarea
                      placeholder="Best Affordable vehicle in  Dubai"
                      {...field}
                      className="textarea h-28 rounded-xl "
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
                field.value?.length || 0
              ); // To track character count

              const handleFocus = () => setIsFocused(true);
              const handleBlur = () => setIsFocused(false);
              const handleInputChange = (
                e: React.ChangeEvent<HTMLTextAreaElement>
              ) => {
                setCharCount(e.target.value.length);
                field.onChange(e);
              };

              return (
                <FormItem className="flex w-full mb-2 max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 text-base h-fit w-52 min-w-52 lg:text-lg">
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
                        placeholder="Meta Description"
                        {...field}
                        className={`textarea rounded-xl transition-all duration-300 ${
                          isFocused ? "h-96" : "h-28"
                        }`} // Dynamic height
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="w-full mt-1 ml-2 flex-between">
                      <span className="w-full max-w-[90%]">
                        Provide meta description.5000 characters max.
                      </span>{" "}
                      <span className="ml-auto"> {`${charCount}/5000`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2 " />
                  </div>
                </FormItem>
              );
            }}
          />
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-yellow/90"
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
