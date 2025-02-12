import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Download, Eye, Trash2, MoreVertical } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { downloadFileFromStream, validateFileSize } from "@/helpers/form";
import ImagePreviewModal from "../../modal/ImagePreviewModal";
import { uploadMultipleFiles } from "@/api/file-upload";
import { GcsFilePaths } from "@/constants/enum";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import PreviewImageComponent from "../PreviewImageComponent";
import ImagePlaceholder from "../../ImagePlaceholder";

type MultipleFileUploadProps = {
  name: string;
  label: string;
  existingFiles?: string[];
  description: React.ReactNode;
  maxSizeMB?: number;
  isFileUploading?: boolean;
  setIsFileUploading?: (isUploading: boolean) => void;
  bucketFilePath: GcsFilePaths;
  downloadFileName?: string;
  setDeletedFiles: (deletedPaths: (prev: string[]) => string[]) => void;
};

const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  name,
  label,
  existingFiles = [],
  description,
  maxSizeMB = 15,
  isFileUploading,
  setIsFileUploading,
  bucketFilePath,
  downloadFileName,
  setDeletedFiles,
}) => {
  const { control, setValue, clearErrors } = useFormContext();
  const [files, setFiles] = useState<string[]>(existingFiles);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  // Get max file count based on name
  const getMaxCount = () => {
    if (name === "vehiclePhotos") return 8;
    if (name === "commercialLicenses") return 2;
    return 0;
  };

  const maxCount = getMaxCount();

  // Sync files state with form value
  useEffect(() => {
    setValue(name, files);
  }, [files, setValue, name]);

  // Handle file selection and upload
  const handleFilesChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    const remainingLimit = maxCount - files.length - uploadingCount;
    if (selectedFiles.length > remainingLimit) {
      toast({
        variant: "destructive",
        title: "File limit exceeded",
        description: `You can only upload a maximum of ${maxCount} files.`,
      });
      selectedFiles.splice(remainingLimit);
    }

    // Validate file sizes
    for (const file of selectedFiles) {
      if (!validateFileSize(file, maxSizeMB)) {
        toast({
          variant: "destructive",
          title: "Invalid file size",
          description: `File ${file.name} exceeds the size limit of ${maxSizeMB}MB`,
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (setIsFileUploading) setIsFileUploading(true);

    // Increment uploading count by the number of files being uploaded
    setUploadingCount((prev) => prev + validFiles.length);

    try {
      // Upload all files at once
      const uploadResponse = await uploadMultipleFiles(
        bucketFilePath,
        validFiles,
      );

      const uploadedPaths = uploadResponse.result.paths;

      // Update the form state with new paths
      setFiles((prevFiles) => [...prevFiles, ...uploadedPaths]);
      clearErrors(name);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "File upload failed",
        description: "Please try again.",
      });
      console.error("Error uploading multiple files:", error);
    } finally {
      setUploadingCount((prev) => prev - validFiles.length); // Decrement count after all files are uploaded
      if (setIsFileUploading) setIsFileUploading(false);
      event.target.value = ""; // Reset the input
    }
  };

  const handleDeleteFile = () => {
    if (fileToDelete) {
      setFiles((prevFiles) =>
        prevFiles.filter((path) => path !== fileToDelete),
      );
      setDeletedFiles((prev) => [...prev, fileToDelete]);
      setFileToDelete(null); // Clear the file to delete
    }
    setIsDeleteConfirmationOpen(false); // Close the confirmation modal
  };

  const handlePreviewImage = (filePath: string) => {
    setPreviewImage(filePath);
  };

  // Handle image download using the helper function
  const handleDownloadImage = async (filePath: string, index: number) => {
    try {
      const fileName = downloadFileName || label;
      await downloadFileFromStream(filePath, index + 1 + " - " + fileName);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Unable to download the image. Please try again.",
      });
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <FormItem className="mb-2 flex w-full max-sm:flex-col">
        <FormLabel className="ml-2 mt-4 flex w-72 justify-between text-base font-semibold lg:text-lg">
          {label} <span className="mr-5 max-sm:hidden">:</span>
        </FormLabel>
        <div className="w-full flex-col items-start">
          <FormControl>
            <Controller
              name={name}
              control={control}
              render={() => (
                <>
                  {/* Uploaded files preview */}

                  <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                    {files.length > 0 &&
                      files.map((filePath, index) => (
                        <div
                          key={index}
                          className="relative h-16 w-16 overflow-hidden rounded-lg"
                        >
                          <PreviewImageComponent imagePath={filePath} />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="absolute right-1 top-1 h-fit rounded-full border bg-white p-1 shadow-md outline-none ring-0">
                                <MoreVertical className="h-5 w-5 text-gray-600" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-28">
                              <DropdownMenuItem
                                onClick={() => handlePreviewImage(filePath)}
                              >
                                <Eye className="mr-2 h-5 w-5 text-blue-600" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDownloadImage(filePath, index)
                                }
                              >
                                <Download className="mr-2 h-5 w-5 text-green-600" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setFileToDelete(filePath); // Set the file to be deleted
                                  setIsDeleteConfirmationOpen(true); // Open the confirmation modal
                                }}
                              >
                                <Trash2 className="mr-2 h-5 w-5 text-red-600" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    {/* Placeholders for additional uploads */}
                    {Array.from({ length: maxCount - files.length }).map(
                      (_, index) => (
                        <ImagePlaceholder
                          key={index}
                          index={index}
                          name={name}
                          isUploading={isFileUploading}
                          uploadingCount={uploadingCount}
                          onFileChange={handleFilesChange}
                        />
                      ),
                    )}
                  </div>
                </>
              )}
            />
          </FormControl>
          <FormDescription className="ml-2 mt-1">{description}</FormDescription>
          <FormMessage />
        </div>
      </FormItem>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          imagePath={previewImage}
          setSelectedImage={setPreviewImage} // Close modal function
        />
      )}

      {/* delete confirmation modal */}
      {isDeleteConfirmationOpen && (
        <Dialog
          open={isDeleteConfirmationOpen}
          onOpenChange={setIsDeleteConfirmationOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this file?</p>
            <DialogFooter>
              <Button onClick={() => setIsDeleteConfirmationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteFile} variant="destructive">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MultipleFileUpload;
