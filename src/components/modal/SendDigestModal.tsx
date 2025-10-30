import { useState } from "react";
import { SendDigestPayload } from "@/types/api-types/API-types";  // Import if needed

interface DigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendEmail: (payload: SendDigestPayload) => Promise<void>;
  onDownloadPdf: (payload: SendDigestPayload) => Promise<void>;
  supplierId: string;
  supplierName?: string;
}

export default function DigestModal({ 
  isOpen, 
  onClose, 
  onSendEmail, 
  onDownloadPdf, 
  supplierId, 
  supplierName 
}: DigestModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'last_week' | 'last_2weeks' | 'last_month' | 'custom'>('last_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const buildPayload = (): SendDigestPayload => {
    const payload: SendDigestPayload = { supplierId };
    if (selectedPeriod === 'custom') {
      if (!customStartDate || !customEndDate) {
        throw new Error('Please select both start and end dates for custom period.');
      }
      payload.startDate = customStartDate;
      payload.endDate = customEndDate;
    } else {
      payload.timePeriod = selectedPeriod;
    }
    return payload;
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPeriod === 'custom' && (!customStartDate || !customEndDate)) {
      alert('Please select both start and end dates for custom period.');
      return;
    }

    setIsEmailLoading(true);
    try {
      const payload = buildPayload();
      await onSendEmail(payload);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Failed to send Mail: ${errorMessage}`);
      onClose();  // Close after error (toast already handled in parent)
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleDownloadPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPeriod === 'custom' && (!customStartDate || !customEndDate)) {
      alert('Please select both start and end dates for custom period.');
      return;
    }

    setIsPdfLoading(true);
    try {
      const payload = buildPayload();
      await onDownloadPdf(payload);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Failed to download PDF: ${errorMessage}`);
      onClose();  // Close after error (toast already handled in parent)
    } finally {
      setIsPdfLoading(false);
    }
  };

  if (!isOpen) return null;

  const isCustom = selectedPeriod === 'custom';
  const isValidCustom = !isCustom || (customStartDate && customEndDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center shadow-lg justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select the time period for {supplierName || 'supplier'} Digest
        </h3>
        <form className="space-y-4">
          {/* Period Selection (unchanged) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Predefined Period</label>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="period"
                  value="last_week"
                  checked={selectedPeriod === 'last_week'}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="mr-2"
                />
                Last Week
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="period"
                  value="last_2weeks"
                  checked={selectedPeriod === 'last_2weeks'}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="mr-2"
                />
                Last 2 Weeks
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="period"
                  value="last_month"
                  checked={selectedPeriod === 'last_month'}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="mr-2"
                />
                Last Month
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="period"
                  value="custom"
                  checked={selectedPeriod === 'custom'}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="mr-2"
                />
                Custom Date Range
              </label>
            </div>
          </div>

          {isCustom && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          )}

          {/* New: PDF and Email Buttons (show after selection) */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isPdfLoading || !isValidCustom}
              className="flex-1 px-4 py-2 text-sm font-medium shadow-lg text-white bg-[#ffa733] rounded-md hover:bg-[#bb7a25] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPdfLoading ? 'Generating PDF...' : 'Download PDF'}
            </button>
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isEmailLoading || !isValidCustom}
              className="flex-1 px-4 py-2 text-sm font-medium shadow-lg text-white bg-[#ffa733] rounded-md hover:bg-[#c98327] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEmailLoading ? 'Sending Email...' : 'Send Email'}
            </button>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isEmailLoading || isPdfLoading}
              className="px-4 py-2 text-sm font-medium shadow-lg text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}