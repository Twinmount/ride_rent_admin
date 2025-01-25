import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clear } from "@/utils/storage";

export default function LogoutModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clear();
    navigate("/login");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        tabIndex={-1}
        className={`flex h-11 min-h-11 w-full max-w-full cursor-pointer items-center justify-start gap-2 truncate text-ellipsis whitespace-nowrap rounded-lg pl-3 pr-1 text-left font-bold text-red-500 no-underline transition-colors hover:bg-red-500 hover:text-white`}
      >
        <LogOut size={17} />
        Logout
      </DialogTrigger>
      <DialogContent className="mx-auto max-w-[400px] !rounded-3xl max-sm:w-[95%]">
        <DialogTitle className="text-center text-xl font-semibold">
          Logout
        </DialogTitle>
        <DialogDescription aria-label="Are you sure you want to logout?" />
        <DialogHeader>
          <div className="text-center">
            <p className="text-lg">Are you sure you want to logout?</p>
            <div className="mt-6 flex w-full justify-center gap-3">
              <Button
                onClick={handleLogout}
                className="w-full rounded-xl bg-red-500 !font-semibold !text-white hover:bg-red-600"
              >
                Logout
              </Button>
              <Button
                onClick={handleClose}
                className="w-full rounded-xl bg-gray-400 !text-white hover:bg-gray-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
