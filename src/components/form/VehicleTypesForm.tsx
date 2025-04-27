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
import { VehicleTypeFormType } from "@/types/types";
import { VehicleTypeFormSchema } from "@/lib/validator";
import { VehicleTypeFormDefaultValues } from "@/constants";
import Spinner from "../general/Spinner";
import { addVehicleType, updateVehicleType } from "@/api/vehicle-types";
import { toast } from "../ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";

type VehicleTypeFormProps = {
  type: "Add" | "Update";
  category?: string | undefined;
  formData?: VehicleTypeFormType | null;
};

export default function VehicleTypeForm({
  type,
  category,
  formData,
}: VehicleTypeFormProps) {
  const initialValues =
    formData && type === "Update" ? formData : VehicleTypeFormDefaultValues;

  const { vehicleCategoryId, vehicleTypeId } = useParams<{
    vehicleCategoryId: string;
    vehicleTypeId: string;
  }>();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof VehicleTypeFormSchema>>({
    resolver: zodResolver(VehicleTypeFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof VehicleTypeFormSchema>) {
    try {
      let data;
      if (type === "Add") {
        data = await addVehicleType(values, vehicleCategoryId as string);
      } else if (type === "Update") {
        data = await updateVehicleType(values, vehicleTypeId as string);
      }

      if (data) {
        toast({
          title: `${type} Vehicle type successfully`,
          className: "bg-yellow text-white",
        });
        if (type === "Add") {
          navigate(`/vehicle/manage-types/${vehicleCategoryId}`);
        } else {
          navigate(`/vehicle/manage-types/`);
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Vehicle type failed`,
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
            name="name"
            render={({ field }) => (
              <FormItem className="mb-2 w-full">
                <FormLabel className="ml-2">Vehicle Type Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 'Airport Pickup'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Add your new <span className="font-semibold">{category}</span>{" "}
                  type name.
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
                <FormLabel className="ml-2">Vehicle Type Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 'airport_pickup'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  This value will be used for API interaction. Eg: for "Airport
                  Pickup", value will be "airport-pickup"
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
          {form.formState.isSubmitting
            ? "Submitting..."
            : `${type} ${category} type `}{" "}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
        <p className="m-0 -mt-3 p-0 text-center text-xs text-red-500">
          Make sure appropriate vehicle category is selected before adding a
          type. Currently adding type under {category} vehicle category
        </p>
      </form>
    </Form>
  );
}
