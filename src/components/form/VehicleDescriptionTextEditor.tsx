import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditorComponent from "./RichTextEditorComponent";

interface VehicleDescriptionTextEditorProps {
  content?: string;
  onUpdate: (content: string) => void;
}

export default function VehicleDescriptionTextEditor({
  content = "",
  onUpdate,
}: VehicleDescriptionTextEditorProps) {
  return (
    <FormItem className="flex flex-col w-full mb-2 max-sm:flex-col">
      <FormLabel className="w-full mt-4 ml-2 text-lg font-semibold text-left ">
        Vehicle Description
      </FormLabel>
      <FormDescription className="w-full ml-2">
        Provide vehicle description. 5000 characters max.
      </FormDescription>
      <FormControl>
        {/* Render the RichTextEditor component */}
        <RichTextEditorComponent content={content} onUpdate={onUpdate} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
