import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload, Eye, Download, Trash2, MoreVertical } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import { uploadSingleFile } from "@/api/file-upload";
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

import { downloadFileFromStream } from "@/helpers/form";
import PreviewImageComponent from "../PreviewImageComponent";
import { Progress } from "@/components/ui/progress";
import ImagePreviewModal from "@/components/modal/ImagePreviewModal";
import { Button } from "@/components/ui/button";

type SingleFileUploadProps = {
  name: string;
  label: string;
  description: React.ReactNode;
  existingFile?: string | null;
  isDisabled?: boolean;
  maxSizeMB?: number;
  isDownloadable?: boolean;
  setIsFileUploading?: (isUploading: boolean) => void;
  bucketFilePath: GcsFilePaths;
  downloadFileName?: string;
  setDeletedImages: (deletedPaths: (prev: string[]) => string[]) => void;
};

const SingleFileUpload = ({
  name,
  label,
  description,
  existingFile = null,
  isDisabled = false,
  maxSizeMB = 5,
  isDownloadable = false,
  setIsFileUploading,
  bucketFilePath,
  downloadFileName,
  setDeletedImages,
}: SingleFileUploadProps) => {
  const { control, setValue, clearErrors } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(existingFile);
  const [progress, setProgress] = useState<number>(0);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  // Sync loading state with parent if necessary
  useEffect(() => {
    if (setIsFileUploading) {
      setIsFileUploading(isUploading);
    }
  }, [isUploading, setIsFileUploading]);

  // Fetch image URL if `existingFile` is present (on Update)
  useEffect(() => {
    if (existingFile) {
      setImagePath(existingFile);
      setValue(name, existingFile);
    }
  }, [existingFile, setValue, name]);

  // Handle file upload and setting values
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        toast({
          variant: "destructive",
          title: `Image size exceeds ${maxSizeMB} MB`,
        });
        return;
      }

      setIsUploading(true);
      try {
        const uploadResponse = await uploadSingleFile(
          bucketFilePath,
          file,
          (progressEvent) => {
            if (progressEvent.total) {
              const progress =
                (progressEvent.loaded / progressEvent.total) * 100;
              setProgress(progress);
            }
          },
        );
        const uploadedFilePath = uploadResponse.result.path;

        setValue(name, uploadedFilePath);
        setImagePath(uploadedFilePath); // Set the new image path

        clearErrors(name);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "File upload failed",
          description: "Please try again.",
        });
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    }
  };

  // Handle image deletion
  const handleDeleteImage = () => {
    if (imagePath) {
      // Add the image path to the deletedImages array using the setDeletedImages
      setDeletedImages((prev) => [...prev, imagePath]);
    }

    //  clear the input field memory
    const fileInput = document.getElementById(
      `file-upload-${name}`,
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Clear the file input field
    }

    setImagePath(null); // Remove image path for PreviewImageComponent
    setValue(name, null); // Remove the value from form
    setIsDeleteConfirmationOpen(false);
  };

  // Handle image preview in modal
  const handlePreviewImage = () => {
    if (imagePath) {
      setPreviewImage(imagePath);
    }
  };

  // Handle image download using the helper function
  const handleDownloadImage = async () => {
    if (imagePath) {
      try {
        const fileName = downloadFileName || label;
        await downloadFileFromStream(imagePath, fileName);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Download failed",
          description: "Unable to download the image. Please try again.",
        });
      }
    }
  };
  return (
    <>
      <FormItem className="mb-2 flex w-full max-sm:flex-col">
        <FormLabel className="ml-2 mt-4 flex w-64 justify-between text-base max-sm:w-fit lg:text-lg">
          {label} <span className="mr-5 max-sm:hidden">:</span>
        </FormLabel>
        <div className="w-full flex-col items-start">
          <FormControl>
            <Controller
              name={name}
              control={control}
              render={() => (
                <>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id={`file-upload-${name}`}
                    disabled={isDisabled || isUploading}
                  />
                  <div className="mt-2 flex items-center gap-4">
                    {imagePath ? (
                      <div className="group/box relative w-24">
                        {/* Use PreviewImageComponent to handle image fetching */}
                        <PreviewImageComponent imagePath={imagePath} />
                        <div className="absolute bottom-0 left-0 right-0 top-0 space-x-2">
                          {!isDisabled && (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                className="border-none outline-none ring-0"
                              >
                                <button className="absolute right-1 top-1 h-fit rounded-full border bg-white p-1 shadow-md outline-none ring-0">
                                  <MoreVertical className="h-5 w-5 text-gray-600" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-28">
                                {/* Delete */}
                                <DropdownMenuItem
                                  onClick={() =>
                                    setIsDeleteConfirmationOpen(true)
                                  } // Open the modal instead of directly calling delete
                                  disabled={isDisabled || isUploading}
                                >
                                  <Trash2 className="mr-2 h-5 w-5 text-red-600" />
                                  Delete
                                </DropdownMenuItem>

                                {/* Preview */}
                                <DropdownMenuItem
                                  onClick={handlePreviewImage}
                                  disabled={isUploading}
                                >
                                  <Eye className="mr-2 h-5 w-5 text-blue-600" />
                                  Preview
                                </DropdownMenuItem>

                                {/* Download */}
                                {isDownloadable && (
                                  <DropdownMenuItem
                                    onClick={handleDownloadImage}
                                    disabled={isUploading}
                                  >
                                    <Download className="mr-2 h-5 w-5 text-green-600" />
                                    Download
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor={`file-upload-${name}`}
                        className="relative flex w-24 cursor-pointer justify-center"
                      >
                        <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border bg-gray-50">
                          <Upload size={24} className="text-yellow" />
                          <span className="text-sm text-yellow">Upload</span>
                        </div>

                        {/* progress bar */}
                        {isUploading && (
                          <div className="absolute bottom-1 mx-auto mt-2 w-[99%]">
                            {/* progress bar */}

                            <div className="mt-2 w-full">
                              <Progress value={progress} className="w-[95%]" />
                            </div>
                          </div>
                        )}
                      </label>
                    )}
                  </div>
                </>
              )}
            />
          </FormControl>
          <FormDescription className="mt-1">{description}</FormDescription>
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

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationOpen && (
        <Dialog
          open={isDeleteConfirmationOpen}
          onOpenChange={setIsDeleteConfirmationOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this image?</p>
            <DialogFooter>
              <Button onClick={() => setIsDeleteConfirmationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteImage} variant="destructive">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SingleFileUpload;
