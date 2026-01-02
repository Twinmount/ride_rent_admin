import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import JoditRichTextEditor from "./text-editor/JoditTextEditor";

interface RichTextContentEditorProps {
  content?: string;
  onUpdate: (content: string) => void;
}

export default function RichTextContentEditor({
  content = "", // initial content is empty if not provided
  onUpdate,
}: RichTextContentEditorProps) {
  return (
    <FormItem className="mb-2 flex w-full flex-col max-sm:flex-col">
      <FormLabel className="ml-2 mt-4 w-full text-left text-lg !font-bold lg:text-xl">
        Rich Text Content
      </FormLabel>
      <FormDescription className="ml-2 w-full">
        Make sure appropriate page structure is maintained here as it will be
        directly reflected in the Frontend UI. <br />
        &#8226; use{" "}
        <span className="rounded-md bg-slate-300 px-1 font-semibold">
          ctrl+shift+v
        </span>{" "}
        or{" "}
        <span className="rounded-md bg-slate-300 px-1 font-semibold">
          cmd+shift+v
        </span>{" "}
        to paste a copied text <br />
      </FormDescription>
      <FormControl className="">
        <JoditRichTextEditor content={content} onChange={onUpdate} />
      </FormControl>

      <FormMessage />
    </FormItem>
  );
}
