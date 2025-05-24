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
import { CountryFormType } from "@/types/types";
import { CountryFormSchema } from "@/lib/validator";
import { CountryFormDefaultValues } from "@/constants";
import Spinner from "../general/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { addCountry, updateCountry } from "@/api/states";

type CountryFormProps = {
  type: "Add" | "Update";
  formData?: CountryFormType | null;
};

export default function CountryForm({ type, formData }: CountryFormProps) {
  const initialValues =
    formData && type === "Update" ? formData : CountryFormDefaultValues;

  const navigate = useNavigate();
  const { countryId } = useParams<{ countryId: string }>();

  // 1. Define your form.
  const form = useForm<z.infer<typeof CountryFormSchema>>({
    resolver: zodResolver(CountryFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof CountryFormSchema>) {
    try {
      let data;
      if (type === "Add") {
        data = await addCountry(values);
      } else if (type === "Update") {
        data = await updateCountry(values, countryId as string);
      }

      if (data) {
        toast({
          title: `${type} Country successfully`,
          className: "bg-yellow text-white",
        });

        navigate("/locations/manage-countries");
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
            name="countryName"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-56 justify-between text-base max-sm:w-fit lg:text-lg">
                  Country Name
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="w-full flex-col items-start">
                  <FormControl>
                    <Input
                      placeholder="eg: 'UAE'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Add your Country Name
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="countryValue"
            render={({ field }) => (
              <FormItem className="mb-2 flex w-full max-sm:flex-col">
                <FormLabel className="ml-2 mt-4 flex w-56 justify-between text-base max-sm:w-fit lg:text-lg">
                  Country Value
                  <span className="mr-5 max-sm:hidden">:</span>
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
                    This value will be used for API interaction. Eg: for
                    "India", value will be "india"
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
          disabled={form.formState.isSubmitting || type === "Update"}
          className="flex-center button col-span-2 mt-3 w-full bg-yellow !text-lg !font-semibold hover:bg-yellow/90"
        >
          {form.formState.isSubmitting ? "Processing..." : `Save Country`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
