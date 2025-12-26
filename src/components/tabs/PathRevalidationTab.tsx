import { Check, RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";
import { validateAndExtractPathForRevalidation } from "@/helpers";
import { ENV } from "@/config/env.config";

interface PathRevalidationTabProps {
  pathInput: string;
  setPathInput: (value: string) => void;
  onRevalidate: (path: string) => void;
  isLoading: boolean;
}

export const PathRevalidationTab: React.FC<PathRevalidationTabProps> = ({
  pathInput,
  setPathInput,
  onRevalidate,
  isLoading,
}) => {
  const [extractedPath, setExtractedPath] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Handle input change
  const handleInputChange = (value: string) => {
    setPathInput(value);
    setValidationError("");
    setShowSuccess(false);
    setExtractedPath("");

    // Auto-extract path if URL is pasted
    if (value.trim()) {
      const result = validateAndExtractPathForRevalidation(value);

      if (result.isValid) {
        setExtractedPath(result.path);
        setShowSuccess(true);
      } else if (result.error) {
        setValidationError(result.error);
      }
    }
  };

  // Handle revalidation
  const handleRevalidate = () => {
    const result = validateAndExtractPathForRevalidation(pathInput);

    if (!result.isValid) {
      setValidationError(result.error || "Invalid URL");
      return;
    }

    // Use extracted path for revalidation
    onRevalidate(result.path);
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
        <div className="text-sm text-blue-800">
          <p className="mb-1 font-semibold">How to use:</p>
          <ol className="list-inside list-decimal space-y-1">
            <li>
              Visit any page on <strong>{ENV.BASE_DOMAIN}</strong>
            </li>
            <li>Copy the full URL from your browser</li>
            <li>Paste it here to revalidate that page's cache</li>
          </ol>
        </div>
      </div>

      {/* URL Input */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Paste Full URL
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={pathInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`${ENV.BASE_DOMAIN}/ae/dubai/cars`}
                className={`w-full rounded-lg border px-4 py-2 pr-10 focus:outline-none focus:ring-2 ${
                  validationError
                    ? "border-red-300 focus:ring-red-500"
                    : showSuccess
                      ? "border-green-300 focus:ring-green-500"
                      : "border-gray-300 focus:border-transparent focus:ring-yellow"
                }`}
                disabled={isLoading}
              />
              {/* Success/Error Icon */}
              {showSuccess && (
                <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
              )}
              {validationError && (
                <AlertCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
              )}
            </div>
            <button
              onClick={handleRevalidate}
              disabled={!showSuccess || isLoading}
              className="flex items-center gap-2 rounded-lg bg-yellow px-6 py-2 font-semibold text-white hover:bg-yellow/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Revalidate
            </button>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Success Message with Extracted Path */}
          {showSuccess && extractedPath && (
            <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-semibold">Valid URL detected</p>
                <p className="mt-1 text-xs text-green-600">
                  Extracted path:{" "}
                  <code className="rounded bg-green-100 px-1 py-0.5">
                    {extractedPath}
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Example:{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5">
            {ENV.BASE_DOMAIN}/ae/dubai/cars
          </code>
          <span className="mx-2">OR</span>
          <code className="rounded bg-gray-100 px-1 py-0.5">
            {ENV.BASE_DOMAIN}/in/banglore/cars
          </code>
        </p>
      </div>
    </div>
  );
};
