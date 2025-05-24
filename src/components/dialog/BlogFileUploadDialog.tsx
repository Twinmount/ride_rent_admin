import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadSingleFile } from "@/api/file-upload";
import { toast } from "@/components/ui/use-toast";
import { Copy, Upload } from "lucide-react";
import { GcsFilePaths } from "@/constants/enum";

export const BlogFileUploadDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Maximum size in MB
  const maxSizeMB = 2;

  // Handle file change and automatic upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeMB > maxSizeMB) {
        toast({
          variant: "destructive",
          title: `Image size exceeds ${maxSizeMB} MB`,
        });
        setSelectedFile(null); // Reset selected file
        handleClearInput();
        return;
      }

      setSelectedFile(file); // Set the file for upload

      // Trigger the upload after file selection
      setIsUploading(true);
      try {
        const uploadResponse = await uploadSingleFile(
          GcsFilePaths.IMAGE,
          file,
          (progressEvent) => {
            if (progressEvent.total) {
              const progress =
                (progressEvent.loaded / progressEvent.total) * 100;
              setProgress(progress);
            }
          },
          // isBlog is set to true
          true,
        );
        const filePath = uploadResponse.result.path;

        const appCountry = localStorage.getItem("appCountry") || "uae";

        const imageStreamUrl =
          appCountry === "in"
            ? import.meta.env.VITE_API_URL_INDIA
            : import.meta.env.VITE_API_URL_UAE + "/file/stream?path=" + filePath;

        // set the image URL
        setImageUrl(imageStreamUrl);

        toast({
          title: "File uploaded successfully!",
          description: "Copy the URL to the clipboard",
        });
        setSelectedFile(null);
        setProgress(0);
        handleClearInput();
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          variant: "destructive",
          title: "File upload failed",
          description: "Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Handle copying the image URL to clipboard
  const handleCopyToClipboard = () => {
    if (imageUrl) {
      navigator.clipboard.writeText(imageUrl);
      toast({
        title: "URL copied to clipboard!",
        className: "bg-yellow text-white",
      });

      // Reset after copying
      setSelectedFile(null);
      setProgress(0); // Reset progress as well
      setImageUrl(null);

      setIsOpen(false);

      // Clear the file input field memory
      handleClearInput();
    }
  };

  // Clear the selected file, reset the image URL, and reset the input field memory
  const handleClearSelection = () => {
    setSelectedFile(null);
    setImageUrl(null);
    setProgress(0); // Reset progress as well

    // Clear the file input field memory
    handleClearInput();
  };

  const handleClearInput = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Reset the file input field
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-center my-2 ml-auto w-fit gap-x-2 bg-yellow px-3 py-3 text-lg text-white transition hover:bg-yellow">
          <Upload size={20} className="text-white" />
          <span className="text-sm text-white">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload Image</DialogTitle>
        </DialogHeader>
        <DialogDescription className="italic text-gray-700">
          Select an image file to upload and get its URL.{" "}
          <span className="font-semibold text-gray-800">
            Maximum size: {maxSizeMB} MB
          </span>
        </DialogDescription>

        <div className="space-y-4">
          {/* File Input for Image Selection */}
          <div>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full rounded-md border border-gray-300 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2"
            />
          </div>

          {/* If uploading, show progress and the "Clear Selection" button */}
          <div className="flex items-center justify-between">
            {isUploading ? (
              <span className="text-gray-600">Uploading...</span>
            ) : (
              selectedFile && (
                <div className="space-x-4">
                  {/* Clear selection button */}
                  <Button
                    onClick={handleClearSelection}
                    disabled={isUploading}
                    type="button"
                    className="w-full bg-gray-400 text-white hover:bg-gray-500"
                  >
                    Clear Selection
                  </Button>
                </div>
              )
            )}
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="mt-4 w-full">
              <div className="h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-yellow"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Display image URL if available */}
          {imageUrl && (
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">Image URL:</p>
              <input
                type="text"
                value={imageUrl}
                readOnly
                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none"
              />
              <Button
                onClick={handleCopyToClipboard}
                className="mt-2 flex w-full items-center justify-center bg-yellow font-semibold text-white hover:bg-yellow"
              >
                <Copy className="mr-2" /> Copy URL
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
            type="button"
            className="w-full bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
