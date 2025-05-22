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
import { LinkFormType } from "@/types/types";
import { LinkFormDefaultValues } from "@/constants";
import { LinkFormSchema } from "@/lib/validator";
import Spinner from "../general/Spinner";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminContext } from "@/context/AdminContext";
import { addLink, deleteLink, updateLink } from "@/api/links";
import DeleteModal from "../modal/DeleteModal";

type LinkFormProps = {
  type: "Add" | "Update";
  formData?: LinkFormType | null;
};

export default function LinkForm({ type, formData }: LinkFormProps) {
  const initialValues =
    formData && type === "Update" ? formData : LinkFormDefaultValues;

  const navigate = useNavigate();
  const { linkId } = useParams<{ linkId: string }>();

  const { state } = useAdminContext();

  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof LinkFormSchema>>({
    resolver: zodResolver(LinkFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof LinkFormSchema>) {
    try {
      let data;
      if (type === "Add") {
        data = await addLink(values, state.stateId as string);
      } else if (type === "Update") {
        data = await updateLink(values, linkId as string);
      }

      if (data) {
        toast({
          title: `${type} Link successfully`,
          className: "bg-yellow text-white bottom-20",
        });
        navigate("/marketing/quick-links");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: `${type} Link failed`,
        description: "Something went wrong",
      });
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["quick-links"],
      });
    }
  }

  const { mutateAsync: deleteLinkMutation, isPending } = useMutation({
    mutationFn: () => deleteLink(linkId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quick-links"],
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-[700px] flex-col gap-5 rounded-3xl bg-white p-2 py-8 !pb-8 shadow-md md:p-4"
      >
        <div className="flex flex-col gap-5">
          {/* type title */}
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem className="mb-2 w-full">
                <FormLabel className="ml-2">Label</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 'Browse Luxury Vehicles for Rent in Abu Dhabi'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>

                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem className="mb-2 w-full">
                <FormLabel className="ml-2">Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 'https://example.com'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Link should be a proper url
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
          {form.formState.isSubmitting ? "Processing..." : `${type} Link`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>

        {/* delete link */}
        {type === "Update" && (
          <DeleteModal
            onDelete={deleteLinkMutation}
            label="Delete"
            title="Delete Link?"
            description="Are you sure you want to delete this link? "
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isPending || form.formState.isSubmitting}
            navigateTo="/marketing/quick-links"
          ></DeleteModal>
        )}

        <p className="m-0 -mt-3 p-0 text-center text-xs text-red-500">
          Make sure appropriate state is selected before adding a link.
          Currently adding link under {state.stateName}
        </p>
      </form>
    </Form>
  );
}
