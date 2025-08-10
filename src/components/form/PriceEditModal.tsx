import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PriceEditModalProps {
  open: boolean;
  onClose: () => void;
  year: string;
  prices: { hourly: number; daily: number; week: number; monthly: number };
  onSave: (prices: { hourly: number; daily: number; week: number; monthly: number }) => void;
}

export default function PriceEditModal({ open, onClose, year, prices, onSave }: PriceEditModalProps) {
  const [hourly, setHourly] = useState(prices.hourly);
  const [daily, setDaily] = useState(prices.daily);
  const [week, setWeek] = useState(prices.week);
  const [monthly, setMonthly] = useState(prices.monthly);

  const handleSave = () => {
    onSave({ hourly, daily, week, monthly });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full rounded-xl p-6 bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-2 text-gray-800">Edit Prices for {year}</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-5 mt-2"
          onSubmit={e => { e.preventDefault(); handleSave(); }}
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 mb-1">Hourly Price</label>
            <input
              type="number"
              value={hourly}
              onChange={e => setHourly(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-full"
              min={0}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 mb-1">Daily Price</label>
            <input
              type="number"
              value={daily}
              onChange={e => setDaily(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-full"
              min={0}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 mb-1">Weekly Price</label>
            <input
              type="number"
              value={week}
              onChange={e => setWeek(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-full"
              min={0}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 mb-1">Monthly Price</label>
            <input
              type="number"
              value={monthly}
              onChange={e => setMonthly(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-full"
              min={0}
            />
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-yellow text-white font-semibold hover:bg-yellow-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
