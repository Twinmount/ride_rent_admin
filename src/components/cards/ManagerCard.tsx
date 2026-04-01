import { Phone, Pencil, Trash2, UserRound } from "lucide-react";
import PreviewImageComponent from "@/components/form/PreviewImageComponent";
import type { Manager } from "@/types/manager-types";

type ManagerCardProps = {
  manager: Manager;
  onEdit?: (manager: Manager) => void;
  onDelete?: (manager: Manager) => void;
  isDeleting?: boolean;
};

/** Displays a single manager's details in a clean card layout. */
export default function ManagerCard({ manager, onEdit, onDelete, isDeleting }: ManagerCardProps) {
  return (
    <div className="group relative flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Avatar */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-yellow/30">
        {manager.profilePicture ? (
          <PreviewImageComponent imagePath={manager.profilePicture} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-yellow/10">
            <UserRound className="h-7 w-7 text-yellow" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 truncate">{manager.name}</p>
            <p className="text-xs capitalize text-gray-400 mt-0.5">{manager.gender}</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(manager)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border-none bg-gray-50 text-gray-400 outline-none transition-colors hover:bg-yellow/10 hover:text-yellow"
                title="Edit manager"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(manager)}
                disabled={isDeleting}
                className="flex h-8 w-8 items-center justify-center rounded-lg border-none bg-gray-50 text-gray-400 outline-none transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete manager"
              >
                {isDeleting ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <a
            href={`tel:${manager.phoneNumber}`}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-yellow transition-colors"
          >
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{manager.phoneNumber}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
