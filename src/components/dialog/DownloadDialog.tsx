import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloudDownload } from "lucide-react";

interface DownloadDialogProps {
  triggerLabel: string;
  dialogTitle: string;
  children: ReactNode;
}

const DownloadDialog = ({
  triggerLabel,
  dialogTitle,
  children,
}: DownloadDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger className="flex h-11 min-h-11 w-full max-w-full cursor-pointer items-center justify-start gap-2 truncate rounded-lg pl-2 pr-1 text-left text-black hover:bg-slate-800 hover:text-white">
        <CloudDownload />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="mx-auto h-fit max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDialog;
