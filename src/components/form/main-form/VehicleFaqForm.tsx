import React, { useState } from "react";
import { Pencil, Trash2, GripVertical, RotateCcw, Plus } from "lucide-react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type FAQItem = {
  question: string;
  answer: string;
};

type VehicleFAQ = {
  vehicleId: string;
  isCustomized: boolean;
  faqList: FAQItem[];
  createdAt: Date | null;
  updatedAt: Date | null;
};

const SortableItem = ({
  faq,
  index,
  editingIndex,
  onEdit,
  onDelete,
  onChange,
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow"
    >
      {editingIndex === index ? (
        <>
          <input
            className="rounded border p-2"
            value={faq.question}
            onChange={(e) => onChange(index, "question", e.target.value)}
            placeholder="Enter question"
          />
          <textarea
            className="rounded border p-2"
            value={faq.answer}
            onChange={(e) => onChange(index, "answer", e.target.value)}
            placeholder="Enter answer"
          />
          <div className="flex justify-end">
            <button
              onClick={() => onEdit(null)}
              className="mr-3 text-sm text-blue-600 hover:underline"
            >
              <Trash2
                className="h-4 w-4 cursor-pointer text-red-600"
                onClick={() => onDelete(index)}
              />
            </button>
            <button
              onClick={() => onEdit(null)}
              className="text-sm text-blue-600 hover:underline"
            >
              Done
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
          <div className="ml-4 flex items-start gap-3">
            <button {...attributes} {...listeners}>
              <GripVertical className="h-4 w-4 cursor-grab text-gray-400" />
            </button>
            <Pencil
              className="h-4 w-4 cursor-pointer text-blue-600"
              onClick={() => onEdit(index)}
            />
            <Trash2
              className="h-4 w-4 cursor-pointer text-red-600"
              onClick={() => onDelete(index)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-800">Reset FAQ?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to reset to default FAQs? This will discard your
          current changes.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const VehicleFaqForm = ({
  data,
  updateFaqMutation,
  resetFaqMutation,
}: {
  data: VehicleFAQ;
  updateFaqMutation: any;
  resetFaqMutation: any;
}) => {
  const [faqs, setFaqs] = useState<FAQItem[]>(data.faqList);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleChange = (index: number, field: keyof FAQItem, value: string) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)),
    );
  };

  const handleDelete = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleSave = () => {
    const cleanedFaqs = faqs.filter(
      (faq) => faq.question.trim() !== "" && faq.answer.trim() !== "",
    );

    const mutationdata = { vehicleId: data.vehicleId, faqList: cleanedFaqs };
    updateFaqMutation.mutate(mutationdata);
  };

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
    setEditingIndex(faqs.length);
  };

  const handleResetToDefault = () => {
    resetFaqMutation.mutate(data.vehicleId);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFaqs((items) => arrayMove(items, active.id, over.id));
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Top actions */}
        <div className="flex justify-end">
          <button
            disabled={resetFaqMutation.isLoading}
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </button>
        </div>

        {/* DnD FAQ list */}
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
              <SortableItem
                key={index}
                index={index}
                faq={faq}
                editingIndex={editingIndex}
                onEdit={setEditingIndex}
                onDelete={handleDelete}
                onChange={handleChange}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Buttons */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            onClick={handleAddFaq}
            className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
            Add FAQ
          </button>

          {faqs.length > 0 && (
            <button
              onClick={handleSave}
              disabled={updateFaqMutation.isLoading}
              className="button hover:bg-darkYellow mx-auto mt-3 inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-md bg-yellow px-8 text-sm font-semibold text-primary-foreground ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 md:mt-0 md:w-auto"
            >
              Update FAQ
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleResetToDefault}
      />
    </>
  );
};

export default VehicleFaqForm;
