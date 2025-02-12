import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/general/Spinner";
import { VehicleSeriesSchema } from "@/lib/validator";
import { VehicleSeriesType } from "@/types/types";
// import { addVehicleSeries, updateVehicleSeries } from "@/api/vehicle-series";

type VehicleSeriesFormProps = {
  type: "Add" | "Update";
  brandId: string;
  formData?: VehicleSeriesType | null;
  onSuccess: (data: z.infer<typeof VehicleSeriesSchema>) => void;
};

export default function VehicleSeriesForm({
  type,
  formData,
  // brandId,
  onSuccess,
}: VehicleSeriesFormProps) {
  const [isEditing, setIsEditing] = useState(type === "Add"); // Initially editable for "Add" type
  const initialValues = formData || {
    vehicleSeries: "",
    vehicleSeriesMetaTitle: "",
    vehicleSeriesMetaDescription: "",
    vehicleSeriesPageHeading: "",
    vehicleSeriesPageSubheading: "",
  };

  const form = useForm<z.infer<typeof VehicleSeriesSchema>>({
    resolver: zodResolver(VehicleSeriesSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof VehicleSeriesSchema>) {
    try {
      // if (type === "Add") {
      //   await addVehicleSeries(values, brandId); // Call API to add vehicle series
      // } else if (type === "Update") {
      //   await updateVehicleSeries(values, formData?.vehicleSeriesId as string); // Call API to update vehicle series
      // }

      toast({
        title: `${type} Vehicle Series successful`,
        description: `The vehicle series has been ${type === "Add" ? "added" : "updated"} successfully.`,
        className: "bg-green-500 text-white",
      });

      onSuccess(values); // Trigger the onSuccess callback
      setIsEditing(false); // Exit edit mode after successful submission
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Vehicle Series failed`,
        description: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="flex max-w-[600px] flex-col gap-5 rounded-xl bg-white p-4 shadow-lg">
        {/* Vehicle Series */}
        <FormField
          control={form.control}
          name="vehicleSeries"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Series</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter vehicle series name"
                  {...field}
                  readOnly={!isEditing}
                  className={`input-field ${!isEditing && "bg-gray-100"}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Meta Title */}
        <FormField
          control={form.control}
          name="vehicleSeriesMetaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter meta title"
                  {...field}
                  readOnly={!isEditing}
                  className={`input-field ${!isEditing && "bg-gray-100"}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Meta Description */}
        <FormField
          control={form.control}
          name="vehicleSeriesMetaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter meta description"
                  {...field}
                  readOnly={!isEditing}
                  className={`input-field ${!isEditing && "bg-gray-100"}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Page Heading */}
        <FormField
          control={form.control}
          name="vehicleSeriesPageHeading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Heading</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter page heading"
                  {...field}
                  readOnly={!isEditing}
                  className={`input-field ${!isEditing && "bg-gray-100"}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Page Subheading */}
        <FormField
          control={form.control}
          name="vehicleSeriesPageSubheading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Subheading</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter page subheading"
                  {...field}
                  readOnly={!isEditing}
                  className={`input-field ${!isEditing && "bg-gray-100"}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons Section */}
        <div className="flex-center mt-4 w-full">
          {type === "Update" ? (
            !isEditing ? (
              // Show "Edit" button when not in edit mode
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              >
                Edit
              </Button>
            ) : (
              // Show "Cancel" and "Update" buttons when in edit mode
              <div className="flex w-full gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)} // Cancel edit mode
                  className="w-1/2 border-gray-500 text-red-500"
                >
                  Cancel
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)} // Submit handler for update
                  disabled={form.formState.isSubmitting}
                  className="w-1/2 bg-blue-500 text-white"
                >
                  {form.formState.isSubmitting ? "Updating..." : "Update"}
                  {form.formState.isSubmitting && <Spinner />}
                </Button>
              </div>
            )
          ) : (
            // Show "Submit" button for Add type
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="w-full bg-blue-500 text-white"
            >
              {form.formState.isSubmitting ? "Processing..." : "Submit"}
              {form.formState.isSubmitting && <Spinner />}
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
}
