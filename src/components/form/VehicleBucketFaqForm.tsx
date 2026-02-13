import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableFAQItem } from "./SortableFAQItem";
import { Plus, Loader2, Undo2 } from "lucide-react";
import { FormSubmitButton } from "./form-ui";
import { FAQItemType } from "@/types/formTypes";
import { toast } from "../ui/use-toast";
import { isFaqEmpty } from "@/helpers/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createContentFaq,
  updateContentFaq,
  deleteContentFaq,
} from "@/api/content-faq/contentFaqApi";
import { ContentFaq, FaqType } from "@/types/api-types/contentFaqApi-types";
import { useNavigate } from "react-router-dom";

export type VehicleBucketFaqData = {
  faqs: ContentFaq[];
  vehicleBucketId: string;
};

type VehicleBucketFaqFormProps = {
  type: "Add" | "Update";
  data: VehicleBucketFaqData;
};

/**
 * Vehicle Bucket FAQ Form component
 */
const VehicleBucketFaqForm = ({ type, data }: VehicleBucketFaqFormProps) => {
  const [faqs, setFaqs] = useState<ContentFaq[]>(data.faqs);
  const [editingIndex, setEditingIndex] = useState<number | null>(
    type === "Add" && data.faqs.length === 0 ? 0 : null,
  );
  const [errors, setErrors] = useState<{ [key: number]: string }>({});
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Filter out any undefined or null values
  useEffect(() => {
    const validFaqs = (data.faqs || []).filter(
      (faq): faq is ContentFaq => faq !== null && faq !== undefined,
    );
    setFaqs(validFaqs);
  }, [data.faqs]);

  // Create FAQ mutation
  const createMutation = useMutation({
    mutationFn: createContentFaq,
    onSuccess: (response) => {
      // Update local state with the returned FAQ (which now has an _id)
      if (savingIndex !== null) {
        setFaqs((prev) =>
          prev.map((faq, i) => (i === savingIndex ? response.data : faq)),
        );
      }
      queryClient.invalidateQueries({
        queryKey: ["vehicle-bucket-faqs", data.vehicleBucketId],
      });
      toast({
        title: "FAQ added successfully",
        className: "bg-yellow text-white",
      });
      setSavingIndex(null);
    },
    onError: (err) => {
      console.error("Error creating FAQ:", err);
      toast({
        variant: "destructive",
        title: "Error adding FAQ",
        description: "An error occurred while adding the FAQ.",
      });
      setSavingIndex(null);
    },
  });

  // Update FAQ mutation
  const updateMutation = useMutation({
    mutationFn: ({ faqId, faqData }: { faqId: string; faqData: any }) =>
      updateContentFaq(faqId, faqData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicle-bucket-faqs", data.vehicleBucketId],
      });
      toast({
        title: "FAQ updated successfully",
        className: "bg-yellow text-white",
      });
      setSavingIndex(null);
    },
    onError: (err) => {
      console.error("Error updating FAQ:", err);
      toast({
        variant: "destructive",
        title: "Error updating FAQ",
        description: "An error occurred while updating the FAQ.",
      });
      setSavingIndex(null);
    },
  });

  // Delete FAQ mutation
  const deleteMutation = useMutation({
    mutationFn: (faqId: string) =>
      deleteContentFaq(faqId, FaqType.VEHICLE_BUCKET),
    onSuccess: (_data, faqId) => {
      // Remove from local state immediately
      setFaqs((prev) => prev.filter((f) => f._id !== faqId));
      queryClient.invalidateQueries({
        queryKey: ["vehicle-bucket-faqs", data.vehicleBucketId],
      });
      toast({
        title: "FAQ deleted successfully",
        className: "bg-yellow text-white",
      });
    },
    onError: (err) => {
      console.error("Error deleting FAQ:", err);
      toast({
        variant: "destructive",
        title: "Error deleting FAQ",
        description: "An error occurred while deleting the FAQ.",
      });
    },
  });

  const handleChange = (
    index: number,
    field: keyof FAQItemType,
    value: string,
  ) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)),
    );

    // Clear error for this FAQ when user starts typing
    if (errors[index]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const handleAddFaq = () => {
    // Check if there's an incomplete FAQ
    const incompleteIndex = faqs.findIndex((faq) =>
      isFaqEmpty({ question: faq.question || "", answer: faq.answer || "" }),
    );

    if (incompleteIndex !== -1) {
      setErrors((prev) => ({
        ...prev,
        [incompleteIndex]: "Please complete this FAQ before adding a new one",
      }));

      toast({
        variant: "destructive",
        title: "Incomplete FAQ",
        description:
          "Please complete all existing FAQs before adding a new one.",
      });

      // Auto-focus the incomplete FAQ
      setEditingIndex(incompleteIndex);
      return;
    }
    // Clear any existing errors
    setErrors({});

    // Add new FAQ and set it to editing mode
    const newFaq: ContentFaq = {
      _id: "",
      faqType: FaqType.VEHICLE_BUCKET,
      question: "",
      answer: "",
      targetId: data.vehicleBucketId,
    };
    setFaqs((prev) => [...prev, newFaq]);
    setEditingIndex(faqs.length);
  };

  const handleDelete = (index: number) => {
    const faq = faqs[index];

    // If this is a new FAQ (no _id), just remove from local state
    if (!faq._id) {
      setFaqs((prev) => prev.filter((_, i) => i !== index));
      if (editingIndex === index) setEditingIndex(null);
      return;
    }

    // Delete from server
    deleteMutation.mutate(faq._id);
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleSaveFaq = (index: number) => {
    const faq = faqs[index];

    // Validation
    if (
      isFaqEmpty({ question: faq.question || "", answer: faq.answer || "" })
    ) {
      setErrors({
        [index]: "Both question and answer are required",
      });

      toast({
        variant: "destructive",
        title: "Incomplete FAQ",
        description: "Please fill in both question and answer.",
      });
      return;
    }

    setSavingIndex(index);

    const faqData = {
      faqType: FaqType.VEHICLE_BUCKET,
      question: faq.question?.trim(),
      answer: faq.answer?.trim(),
      targetId: data.vehicleBucketId,
    };

    if (!faq._id) {
      // Create new FAQ
      createMutation.mutate(faqData);
    } else {
      // Update existing FAQ
      updateMutation.mutate({
        faqId: faq._id,
        faqData: faqData,
      });
    }

    setEditingIndex(null);
    setErrors({});
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFaqs((items) => arrayMove(items, active.id, over.id));
    }
  };

  const handleGoBack = () => {
    navigate("/manage-vehicle-bucket");
  };

  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="min-w-[650px] space-y-4">
      {faqs.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <p className="text-center text-gray-500">
            No FAQs added yet. Click below to add your first FAQ.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={faqs.map((_, index) => index)}
            strategy={verticalListSortingStrategy}
          >
            {faqs.map((faq, index) => {
              // Skip rendering if faq is undefined
              if (!faq) return null;

              return (
                <div key={faq._id || `new-${index}`} className="relative">
                  <SortableFAQItem
                    index={index}
                    faq={{
                      question: faq.question || "",
                      answer: faq.answer || "",
                    }}
                    editingIndex={editingIndex}
                    onEdit={(i) => {
                      if (i === null && editingIndex !== null) {
                        // User clicked "Done" - save the FAQ
                        handleSaveFaq(editingIndex);
                      } else {
                        setEditingIndex(i);
                      }
                    }}
                    onDelete={handleDelete}
                    onChange={handleChange}
                    error={errors[index]}
                  />
                  {savingIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </SortableContext>
        </DndContext>
      )}

      <div className="flex flex-col gap-3 md:items-center md:justify-between">
        <FormSubmitButton
          text={
            <>
              Add New <Plus />
            </>
          }
          isLoading={false}
          variant="default"
          type="button"
          onClick={handleAddFaq}
          disabled={isLoading}
        />

        <FormSubmitButton
          text={
            <span className="flex items-center justify-start gap-2">
              Go Back to List <Undo2 size={16} className="mb-1" />
            </span>
          }
          isLoading={false}
          variant="outline"
          type="button"
          onClick={handleGoBack}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default VehicleBucketFaqForm;
