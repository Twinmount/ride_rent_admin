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
      <DialogTrigger className="group relative flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-yellow hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow">
        <div className="flex h-12 w-fit flex-shrink-0 items-center justify-center rounded-lg text-yellow group-hover:text-white">
          <CloudDownload className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-800 group-hover:text-white">
            {triggerLabel}
          </span>
        </div>
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
