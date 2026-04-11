import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserRound, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from "@/components/ui/use-toast";
import { ManagerSchema } from "@/lib/validator";
import SingleFileUpload from "@/components/form/file-uploads/SingleFileUpload";
import Spinner from "@/components/general/Spinner";
import type { Manager } from "@/types/manager-types";
import { GcsFilePaths } from "@/constants/enum";
import { useCreateManager, useUpdateManager } from "@/hooks/useManagers";
import CompanyLanguagesDropdown from "@/components/form/dropdowns/CompanyLanguagesDropdown";
import { WorkingHoursPicker, DEFAULT_WORKING_HOURS } from "@/components/form/manager/WorkingHoursPicker";

type FormValues = z.infer<typeof ManagerSchema>;

type AddManagerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  /** When provided, the dialog operates in Edit mode. */
  managerToEdit?: Manager | null;
};

/**
 * AddManagerDialog
 *
 * A reusable modal dialog for both creating and editing agent Managers.
 * - Add mode: opens with an empty form.
 * - Edit mode: pre-fills form with `managerToEdit` data.
 */
export default function AddManagerDialog({
  open,
  onOpenChange,
  agentId,
  managerToEdit = null,
}: AddManagerDialogProps) {
  const isEditing = !!managerToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(ManagerSchema),
    defaultValues: {
      profilePicture: "",
      name: "",
      gender: undefined,
      phoneNumber: "",
      languages: [],
      workingHours: DEFAULT_WORKING_HOURS,
    },
  });

  const createMutation = useCreateManager(agentId);
  const updateMutation = useUpdateManager(agentId);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Sync form with managerToEdit when dialog opens in Edit mode.
  useEffect(() => {
    if (managerToEdit) {
      form.reset({
        profilePicture: managerToEdit.profilePicture ?? "",
        name: managerToEdit.name,
        gender: managerToEdit.gender,
        phoneNumber: managerToEdit.phoneNumber,
        languages: managerToEdit.languages ?? [],
        workingHours: managerToEdit.workingHours?.length ? managerToEdit.workingHours : DEFAULT_WORKING_HOURS,
      });
    } else {
      form.reset({
        profilePicture: "",
        name: "",
        gender: undefined,
        phoneNumber: "",
        languages: [],
        workingHours: DEFAULT_WORKING_HOURS,
      });
    }
  }, [managerToEdit, open]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        email: `${values.phoneNumber.replace(/[^0-9]/g, "")}@noemail.com`,
      };
      
      if (isEditing) {
        await updateMutation.mutateAsync({
          managerId: managerToEdit.id,
          formData: payload,
        });
        toast({ title: "Manager updated successfully", className: "bg-yellow text-white" });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Manager added successfully", className: "bg-yellow text-white" });
      }
      handleClose();
    } catch {
      toast({
        variant: "destructive",
        title: isEditing ? "Failed to update manager" : "Failed to add manager",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="w-[95%] sm:max-w-lg rounded-2xl p-0 overflow-hidden border-0 shadow-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow/10">
                <UserRound className="h-5 w-5 text-yellow" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {isEditing ? "Edit Manager" : "Add Manager"}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-0.5">
                  {isEditing
                    ? "Update the manager's details below."
                    : "Fill in the details to add a new manager."}
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 border-none outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        {/* ── Form Body ── */}
        <div className="overflow-y-auto max-h-[70vh] px-6 py-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Profile Picture */}
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <SingleFileUpload
                    name={field.name}
                    label="Profile Picture"
                    description="Optional – upload a profile photo for this manager."
                    existingFile={field.value}
                    maxSizeMB={3}
                    setIsFileUploading={() => {}}
                    bucketFilePath={GcsFilePaths.LOGOS}
                    isDownloadable={false}
                    downloadFileName="manager-profile"
                    setDeletedImages={() => {}}
                  />
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., John Doe"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-3 mt-1"
                      >
                        {(["male", "female", "other"] as const).map((option) => (
                          <label
                            key={option}
                            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                              field.value === option
                                ? "border-yellow bg-yellow/10 text-yellow"
                                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <RadioGroupItem value={option} className="sr-only" />
                            {option}
                          </label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="ae"
                        value={field.value}
                        onChange={field.onChange}
                        className="flex items-center"
                        inputClassName="input-field !w-full !text-base"
                        countrySelectorStyleProps={{
                          className: "bg-white !border-none outline-none !rounded-xl mr-1",
                          style: { border: "none" },
                          buttonClassName:
                            "!border-none outline-none !h-[52px] !w-[50px] !rounded-xl !bg-gray-100",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Languages */}
              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Languages Spoken
                    </FormLabel>
                    <FormControl>
                      <CompanyLanguagesDropdown
                        isIndia={false}
                        value={field.value ?? []}
                        onChangeHandler={(langs) => field.onChange(langs)}
                        placeholder="Languages"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Working Hours */}
              <FormField
                control={form.control}
                name="workingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 block mb-2">
                      Working Hours & Holidays
                    </FormLabel>
                    <FormControl>
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <WorkingHoursPicker
                          value={field.value}
                          onChange={(hours) => field.onChange(hours)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ── Actions ── */}
              <div className="flex gap-3 pt-2 border-t border-gray-100 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 rounded-xl"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-yellow hover:bg-darkYellow text-white font-semibold flex-center gap-2"
                >
                  {isSaving && <Spinner />}
                  {isEditing ? "Save Changes" : "Add Manager"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
