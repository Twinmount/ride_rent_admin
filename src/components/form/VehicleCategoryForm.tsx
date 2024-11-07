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
import { CategoryFormType } from "@/types/types";
import { CategoryFormSchema } from "@/lib/validator";
import { CategoryFormDefaultValues } from "@/constants";
import Spinner from "../general/Spinner";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { addCategory, updateCategory } from "@/api/vehicle-categories";

type CategoryFormProps = {
  type: "Add" | "Update";
  formData?: CategoryFormType | null;
};

export default function CategoryForm({ type, formData }: CategoryFormProps) {
  const initialValues =
    formData && type === "Update" ? formData : CategoryFormDefaultValues;

  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  // 1. Define your form.
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof CategoryFormSchema>) {
    try {
      let data;
      if (type === "Add") {
        data = await addCategory(values);
      } else if (type === "Update") {
        data = await updateCategory(values, categoryId as string);
      }

      if (data) {
        toast({
          title: `${type} Category successfully`,
          className: "bg-yellow text-white",
        });
        navigate("/manage-categories");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Category failed`,
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
        <div className="flex flex-col gap-5 r">
          {/* category label */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-2 w-full">
                <FormLabel className="ml-2">Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 'Sports Car'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Add your Category Name. This will be displayed in the UI
                </FormDescription>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="mb-2 w-full">
                <FormLabel className="ml-2">Category Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 'sports-car'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  This value will be used for API interaction. Eg: for "Sports
                  Car", value will be "sports-car"
                </FormDescription>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-yellow/90"
        >
          {form.formState.isSubmitting ? "Processing..." : `${type} Category`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
