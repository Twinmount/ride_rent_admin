import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { ENV } from "@/config/env.config";

interface RichTextEditorProps {
  content?: string; // Initial content
  onUpdate: (content: string) => void; // Callback when content changes
  isBlog?: boolean; // Check if its a blog to render h1 and h2 tag as the 'description' in level-one form (semantically) doesn't require those two tags
}

const domain = ENV.PUBLIC_SITE_DOMAIN || "https://ride.rent";

// CustomLink Link to conditionally remove nofollow for internal links
const CustomLink = Link.extend({
  renderHTML({ HTMLAttributes }) {
    const href: string = HTMLAttributes.href ?? "";
    const isInternal = href.startsWith(domain);

    return [
      "a",
      {
        ...HTMLAttributes,
        rel: isInternal
          ? "noopener noreferrer"
          : "noopener noreferrer nofollow",
      },
      0,
    ];
  },
});

export default function RichTextEditorComponent({
  content = "",
  onUpdate,
  isBlog = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CustomLink,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML() ?? "";
      onUpdate(htmlContent);
    },
  });

  if (!editor) return null; // Prevent rendering if editor is not ready

  return (
    <RichTextEditor editor={editor} className="min-h-36 shadow-lg">
      <RichTextEditor.Toolbar sticky stickyOffset={75} className="shadow-lg">
        <RichTextEditor.ColorPicker
          colors={[
            "#25262b",
            "#868e96",
            "#fa5252",
            "#e64980",
            "#be4bdb",
            "#7950f2",
            "#4c6ef5",
            "#228be6",
            "#15aabf",
            "#12b886",
            "#40c057",
            "#82c91e",
            "#fab005",
            "#fd7e14",
          ]}
        />

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Color color="#F03E3E" />
          <RichTextEditor.Color color="#7048E8" />
          <RichTextEditor.Color color="#1098AD" />
          <RichTextEditor.Color color="#37B24D" />
          <RichTextEditor.Color color="#F59F00" />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.UnsetColor />
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
      <RichTextEditor.Content aria-placeholder="Type your content here" />
    </RichTextEditor>
  );
}
