import { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import styles from "./JoditTextEditor.module.css";

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
        url: "https://your-backend-api/api/v1/file-upload",
        insertImageAsBase64URI: false,
        prepareData: (formData: FormData) => {
          // Append any additional parameters if needed
          formData.append("userId", "12345");
          return formData;
        },
        process: (response: any) => {
          // Assuming the response contains a 'url' field with the image URL
          return {
            files: [response.url],
            path: "",
            baseurl: "",
            error: response.status !== 200 ? 1 : 0,
            msg: response.message || "",
          };
        },
        defaultHandlerSuccess: (data: any) => {
          if (data.files && data.files.length) {
            editor.current.s.insertImage(data.files[0]);
          }
        },
        defaultHandlerError: (error: any) => {
          console.error("Image upload failedss:", error);
        },
      },
    }),
    [placeholder],
  );

  const handleBlur = (newContent: string) => {
    onChange(newContent);
  };

  return (
    <div className={styles.editorContent} style={{ marginBottom: "1rem" }}>
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
