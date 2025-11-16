import { useState } from "react";
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
import { Plus } from "lucide-react";
import { FormSubmitButton } from "./form-ui";
import { FAQItemType } from "@/types/formTypes";
import { toast } from "../ui/use-toast";
import { isFaqEmpty } from "@/helpers/form";

export type RideBlogFaqData = {
  faqs: FAQItemType[];
  blogId: string;
};

type RideBlogFaqFormProps = {
  type: "Add" | "Update";
  data: RideBlogFaqData;
  mutateFunction: any;
};

const RideBlogFaqForm = ({
  type,
  data,
  mutateFunction,
}: RideBlogFaqFormProps) => {
  const [faqs, setFaqs] = useState<FAQItemType[]>(data.faqs);
  const [editingIndex, setEditingIndex] = useState<number | null>(0);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

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
    const incompleteIndex = faqs.findIndex((faq) => isFaqEmpty(faq));

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
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
    setEditingIndex(faqs.length);
  };

  const handleDelete = (index: number) => {
    // Prevent deleting the last FAQ
    if (faqs.length === 1) {
      toast({
        variant: "destructive",
        title: "Cannot Delete",
        description:
          "At least one FAQ must remain. Clear the fields if needed.",
      });
      return;
    }

    setFaqs((prev) => prev.filter((_, i) => i !== index));

    // Clear error for deleted FAQ
    if (errors[index]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }

    if (editingIndex === index) setEditingIndex(null);
  };

  const handleSave = () => {
    // Validation 1: Check if there are any FAQs
    if (faqs.length === 0) {
      toast({
        variant: "destructive",
        title: "No FAQs",
        description: "Please add at least one FAQ before saving.",
      });
      return;
    }

    // Validation 2: Check for any empty FAQs
    const hasEmptyFaq = faqs.some((faq) => isFaqEmpty(faq));

    if (hasEmptyFaq) {
      // Find first incomplete FAQ index
      const firstIncompleteIndex = faqs.findIndex((faq) => isFaqEmpty(faq));

      setErrors({
        [firstIncompleteIndex]: "Both question and answer are required",
      });

      toast({
        variant: "destructive",
        title: "Incomplete FAQs",
        description:
          "Please complete all FAQs. Both question and answer are required.",
      });

      // Auto-focus the first incomplete FAQ
      setEditingIndex(firstIncompleteIndex);
      return;
    }

    // Clean and prepare data
    const cleanedFaqs = faqs.map(({ question, answer }) => ({
      question: question.trim(),
      answer: answer.trim(),
    }));

    const mutationData = {
      blogId: data.blogId,
      faqs: cleanedFaqs,
    };

    // Clear errors on successful validation
    setErrors({});

    mutateFunction.mutate(mutationData);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFaqs((items) => arrayMove(items, active.id, over.id));
    }
  };

  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="min-w-[650px] space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={faqs.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          {faqs.map((faq, index) => (
            <SortableFAQItem
              key={index}
              index={index}
              faq={faq}
              editingIndex={editingIndex}
              onEdit={setEditingIndex}
              onDelete={handleDelete}
              onChange={handleChange}
              error={errors[index]}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex flex-col gap-3 md:items-center md:justify-between">
        <FormSubmitButton
          text={
            <>
              Add New <Plus />
            </>
          }
          isLoading={false}
          variant="outline"
          type="button"
          onClick={handleAddFaq}
        />

        <FormSubmitButton
          text={type === "Add" ? "Add Blog FAQ" : "Update Blog FAQ"}
          isLoading={mutateFunction.isLoading}
          onClick={handleSave}
          disabled={
            mutateFunction.isLoading ||
            faqs.length === 0 ||
            faqs.every(isFaqEmpty)
          }
        />
      </div>
    </div>
  );
};

export default RideBlogFaqForm;
