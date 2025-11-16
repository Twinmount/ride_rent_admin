import { Pencil, Trash2, GripVertical, Check } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FAQItemType } from "@/types/formTypes";

type SortableFAQItemProps = {
  faq: FAQItemType;
  index: number;
  editingIndex: number | null;
  onEdit: (index: number | null) => void;
  onDelete: (index: number) => void;
  onChange: (index: number, field: keyof FAQItemType, value: string) => void;
  error?: string;
};

export const SortableFAQItem = ({
  faq,
  index,
  editingIndex,
  onEdit,
  onDelete,
  onChange,
  error,
}: SortableFAQItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = editingIndex === index;
  const isEmpty = !faq.question && !faq.answer;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col gap-3 rounded-lg border bg-white p-5 shadow-sm transition-all duration-200 ${error ? "border-red-400 bg-red-50/30" : "border-gray-200 hover:border-gray-300"} ${isDragging ? "shadow-xl" : "hover:shadow-md"} ${isEditing ? "ring-2 ring-slate-400 ring-offset-2" : ""} `}
    >
      {/* FAQ Number Badge */}
      <div className="absolute -left-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-xs font-bold text-white shadow-md">
        {index + 1}
      </div>

      {isEditing ? (
        <>
          {/* Editing Mode */}
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Question
              </label>
              <input
                className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 bg-white focus:border-slate-500 focus:ring-slate-200"
                } `}
                value={faq.question}
                onChange={(e) => onChange(index, "question", e.target.value)}
                placeholder="e.g., What are the rental requirements?"
                autoFocus={isEmpty}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Answer
              </label>
              <textarea
                className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 bg-white focus:border-slate-500 focus:ring-slate-200"
                } `}
                value={faq.answer}
                onChange={(e) => onChange(index, "answer", e.target.value)}
                placeholder="Provide a detailed answer here..."
                rows={4}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 rounded-md bg-red-100 p-3 text-sm text-red-700">
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Action Buttons - Editing */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <button
              onClick={() => onDelete(index)}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              onClick={() => onEdit(null)}
              className="flex items-center gap-1.5 rounded-md bg-slate-700 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              type="button"
            >
              <Check className="h-4 w-4" />
              Done
            </button>
          </div>
        </>
      ) : (
        <>
          {/* View Mode */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="text-base font-semibold leading-snug text-gray-900">
                {faq.question || (
                  <span className="italic text-gray-400">
                    No question added
                  </span>
                )}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {faq.answer || (
                  <span className="italic text-gray-400">No answer added</span>
                )}
              </p>
            </div>

            {/* Action Icons - View Mode */}
            <div className="flex items-start gap-2">
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing"
                type="button"
                title="Drag to reorder"
              >
                <GripVertical className="h-5 w-5" />
              </button>
              <button
                onClick={() => onEdit(index)}
                className="rounded p-1.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-700"
                type="button"
                title="Edit FAQ"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-50"
                type="button"
                title="Delete FAQ"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
