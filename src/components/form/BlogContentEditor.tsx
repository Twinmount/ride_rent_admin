import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditorComponent from "./RichTextEditorComponent";

interface BlogContentEditorProps {
  content?: string; // initial content if any
  onUpdate: (content: string) => void; // callback to update the HTML string
}

export default function BlogContentEditor({
  content = "", // initial content is empty if not provided
  onUpdate,
}: BlogContentEditorProps) {
  return (
    <FormItem className="flex flex-col w-full mb-2 max-sm:flex-col">
      <FormLabel className="w-full mt-4 ml-2 text-lg !font-bold text-left lg:text-xl">
        Body Of The Blog
      </FormLabel>
      <FormDescription className="w-full ml-2">
        Make sure appropriate page structure is maintained here as it will be
        directly reflected in the Frontend UI. <br />
        &#8226; use{" "}
        <span className="px-1 font-semibold rounded-md bg-slate-300">
          ctrl+shift+v
        </span>{" "}
        or{" "}
        <span className="px-1 font-semibold rounded-md bg-slate-300">
          cmd+shift+v
        </span>{" "}
        to paste a copied text <br />
      </FormDescription>
      <FormControl>
        {/* Render the RichTextEditor component */}
        <RichTextEditorComponent
          content={content}
          onUpdate={onUpdate}
          isBlog={true}
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  );
}
