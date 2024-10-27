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
import { RecommendedLinkFormType } from "@/types/types";
import { RecommendedLinkFormDefaultValues } from "@/constants";
import { RecommendedLinkFormSchema } from "@/lib/validator";
import Spinner from "../general/Spinner";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminContext } from "@/context/AdminContext";
import DeleteModal from "../modal/DeleteModal";
import {
  addRecommendedLink,
  deleteRecommendedLink,
  updateRecommendedLink,
} from "@/api/recommended-links";

type RecommendedLinkFormProps = {
  type: "Add" | "Update";
  formData?: RecommendedLinkFormType | null;
};

export default function RecommendedLinkForm({
  type,
  formData,
}: RecommendedLinkFormProps) {
  const initialValues =
    formData && type === "Update" ? formData : RecommendedLinkFormDefaultValues;

  const navigate = useNavigate();
  const { linkId } = useParams<{ linkId: string }>();

  const { state } = useAdminContext();

  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof RecommendedLinkFormSchema>>({
    resolver: zodResolver(RecommendedLinkFormSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof RecommendedLinkFormSchema>) {
    try {
      let data;
      if (type === "Add") {
        data = await addRecommendedLink(values, state.stateId as string);
      } else if (type === "Update") {
        data = await updateRecommendedLink(values, linkId as string);
      }

      if (data) {
        toast({
          title: `${type} Link successfully`,
          className: "bg-yellow text-white bottom-20",
        });
        navigate("/marketing/recommended-links");
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
        queryKey: ["recommended-links", linkId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["recommended-links", state],
        exact: true,
      });
    }
  }

  const { mutateAsync: deleteLinkMutation, isPending } = useMutation({
    mutationFn: () => deleteRecommendedLink(linkId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recommended-links", state],
        exact: true,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[700px] mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8  shadow-md"
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
                  Link should be a proper url.
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
          {form.formState.isSubmitting
            ? "Processing..."
            : `${type} Recommended Link`}
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
            navigateTo="/marketing/recommended-links"
          ></DeleteModal>
        )}

        <p className="p-0 m-0 -mt-3 text-xs text-center text-red-500">
          Make sure appropriate state is selected before adding a link.
          Currently adding link under {state.stateName}
        </p>
      </form>
    </Form>
  );
}
