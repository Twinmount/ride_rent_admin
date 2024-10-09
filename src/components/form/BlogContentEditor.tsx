import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface BlogContentEditorProps {
  content?: string // initial content if any
  onUpdate: (content: string) => void // callback to update the HTML string
}

export default function BlogContentEditor({
  content = '', // initial content is empty if not provided
  onUpdate,
}: BlogContentEditorProps) {
  // Initialize the editor with necessary extensions and content
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML() ?? ''
      onUpdate(htmlContent)
    },
  })

  return (
    <FormItem className="flex flex-col w-full mb-2 max-sm:flex-col">
      <FormLabel className="w-full mt-4 ml-2 text-lg !font-bold text-left lg:text-xl">
        Body Of The Blog
      </FormLabel>
      <FormDescription className="w-full ml-2">
        Make sure appropriate page structure is maintained here as it will be
        directly reflected in the Frontend UI. And also, note that, <br />
        &#8226; use{' '}
        <span className="px-1 font-semibold rounded-md bg-slate-300">
          ctrl+shift+v
        </span>{' '}
        or{' '}
        <span className="px-1 font-semibold rounded-md bg-slate-300">
          cmd+shift+v
        </span>{' '}
        to paste a copied text <br />
      </FormDescription>
      <FormControl>
        <RichTextEditor editor={editor} className="shadow-lg">
          {/* Toolbar with editor controls */}

          <RichTextEditor.Toolbar
            sticky
            stickyOffset={75}
            className="shadow-lg"
          >
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
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

          {/* Content editable area */}
          <RichTextEditor.Content />
        </RichTextEditor>
      </FormControl>

      <FormMessage />
    </FormItem>
  )
}
