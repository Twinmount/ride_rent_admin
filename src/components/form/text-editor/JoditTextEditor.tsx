import { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { Slug } from "@/api/Api-Endpoints";
import { toast } from "@/components/ui/use-toast";
import { load, StorageKeys } from "@/utils/storage";
import style from "./JoditTextEditor.module.css";
import { BlogFileUploadDialog } from "@/components/dialog/BlogFileUploadDialog";

interface JoditRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const JoditRichTextEditor: React.FC<JoditRichTextEditorProps> = ({
  content,
  onChange,
  placeholder,
}) => {
  const editor = useRef<any | null>(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      removeButtons: ["about", "print", "file"],
      disablePlugins: ["speech-recognize"],
      uploader: {
        url: `${import.meta.env.VITE_API_URL}${Slug.POST_SINGLE_FILE}`,
        headers: {
          Authorization: `Bearer ${load<string>(StorageKeys.ACCESS_TOKEN)}`,
        },

        insertImageAsBase64URI: false, // Don't insert image as Base64 URI
        filesVariableName: () => "file",

        prepareData: (formData: FormData) => {
          formData.append("fileCategory", "/images"); // Optional metadata
          return formData;
        },

        process: async (response: any) => {
          if (response.error) {
            console.error("Image upload failed:", response.msg);
            toast({ variant: "destructive", title: "Image upload failed" });
            return {
              files: [],
              error: 1,
              msg: response.msg || "Error uploading image",
            };
          }

          // Extract the image URL from response.files[0].url
          if (response.files && response.files.length) {
            const imageUrl = response.files[0].url;
            editor.current.s.insertImage(imageUrl); // Insert image into the editor
            return {
              files: [imageUrl],
              error: 0,
              msg: "Image uploaded successfully",
            };
          } else {
            console.error("No file found in the response:", response);
            return {
              files: [],
              error: 1,
              msg: "No file found in the response",
            };
          }
        },

        defaultHandlerSuccess: (data: any) => {
          if (data.files && data.files.length) {
            const imageUrl = data.files[0].url;
            editor.current.s.insertImage(imageUrl); // Insert image into the editor
          }
        },

        defaultHandlerError: (error: any) => {
          console.error("Image upload failed:", error);
          toast({ variant: "destructive", title: "Image upload failed" });
        },
      },

      events: {
        afterOpenPopup: () => {
          // Access the popup content
          const popupElem = document.querySelector(".jodit-popup__content");
          if (!popupElem) return;

          // Hide the "Upload" tab
          const uploadTab = popupElem.querySelector(
            '.jodit-tabs__buttons [data-ref="upload"]',
          );
          if (uploadTab && uploadTab instanceof HTMLElement) {
            uploadTab.style.display = "none"; // Hide the "Upload" tab
          }

          // Show the "URL" tab by default (click the URL tab programmatically)
          const urlTab = popupElem.querySelector(
            '.jodit-tabs__buttons [data-ref="link"]',
          );
          if (urlTab && urlTab instanceof HTMLElement) {
            urlTab.style.width = "100%";
            urlTab.click();
          }
        },
      },
    }),
    [placeholder],
  );

  const handleBlur = (newContent: string) => {
    onChange(newContent);
  };

  return (
    <div
      className={style.editorContent}
      style={{ marginBottom: "1rem", height: "auto", overflow: "hidden" }}
    >
      <div className="ml-auto w-fit">
        <BlogFileUploadDialog />
      </div>

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default JoditRichTextEditor;
