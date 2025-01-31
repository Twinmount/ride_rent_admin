import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

interface RichTextEditorProps {
  content?: string; // Initial content
  onUpdate: (content: string) => void; // Callback when content changes
  isBlog?: boolean; // Check if its a blog to render h1 and h2 tag as the 'description' in level-one form (semantically) doesn't require those two tags
}

export default function RichTextEditorComponent({
  content = "",
  onUpdate,
  isBlog = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML() ?? "";
      onUpdate(htmlContent);
    },
  });

  if (!editor) return null; // Prevent rendering if editor is not ready

  return (
    <RichTextEditor editor={editor} className="shadow-lg">
      <RichTextEditor.Toolbar sticky stickyOffset={75} className="shadow-lg">
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          {/* h1 and h2 only renders if its Blog */}
          {isBlog && <RichTextEditor.H1 />}
          {isBlog && <RichTextEditor.H2 />}
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      {/* Content Editable Area */}
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
