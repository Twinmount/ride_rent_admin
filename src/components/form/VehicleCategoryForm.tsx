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
        className="mx-auto flex w-full max-w-[700px] flex-col gap-5 rounded-3xl bg-white p-2 py-8 !pb-8 shadow-md md:p-4"
      >
        <div className="r flex flex-col gap-5">
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
          className="flex-center button col-span-2 mt-3 w-full bg-yellow !text-lg !font-semibold hover:bg-yellow/90"
        >
          {form.formState.isSubmitting ? "Processing..." : `${type} Category`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
