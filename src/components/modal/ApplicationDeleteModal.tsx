import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import Spinner from "../general/Spinner";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";

type DeleteModalProps = {
  onDelete: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  navigateTo?: string;
  isLoading?: boolean;
};

export default function ApplicationDeleteModal({
  onDelete,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this item?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  navigateTo = "/",
}: DeleteModalProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    await onDelete();
    setOpen(false);
    navigate(navigateTo);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex-center button col-span-2 mx-auto w-full cursor-pointer border border-red-500/70 bg-transparent !text-lg !font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white md:w-10/12 lg:w-8/12"
        asChild
      >
        <Button className="!m-0 !h-auto !w-auto !rounded bg-red-600 px-2 py-1 text-white">
          <Trash strokeWidth={2} className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto w-fit !rounded-3xl max-sm:w-[95%]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div>
            <div className="mt-4 flex justify-center gap-3">
              <Button
                onClick={handleConfirmDelete}
                className="bg-red-500 !font-semibold !text-white hover:bg-red-600"
                disabled={isLoading}
              >
                {confirmText} {isLoading && <Spinner />}
              </Button>
              <Button
                onClick={handleClose}
                className="bg-gray-400 !text-white hover:bg-gray-500"
              >
                {cancelText}
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
