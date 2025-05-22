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

type DeleteModalProps = {
  onDelete: () => void;
  label?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  navigateTo?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
};

export default function DeleteModal({
  onDelete,
  label = "Delete",
  title = "Confirm Delete",
  description = "Are you sure you want to delete this item?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  navigateTo = "/",
  children,
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
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent className="mx-auto w-fit !rounded-3xl max-sm:w-[95%]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div>
            {children}
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
