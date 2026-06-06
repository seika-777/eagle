"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import { Box, Field, HStack, IconButton, Input, Button, Text } from "@chakra-ui/react";
import {
  LuBold,
  LuItalic,
  LuList,
  LuListOrdered,
  LuHeading2,
  LuHeading3,
  LuLink,
  LuUnlink,
  LuX,
} from "react-icons/lu";

const Ruby = Node.create({
  name: "ruby",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      text: { default: "" },
      reading: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "ruby",
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const rt = el.querySelector("rt");
          const reading = rt?.textContent ?? "";
          const text = el.childNodes[0]?.textContent ?? "";
          return { text, reading };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return ["ruby", mergeAttributes({}), node.attrs.text, ["rt", {}, node.attrs.reading]];
  },
});

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
};

type RubyDialog = { open: boolean; selectedText: string };

export default function RichTextField({ label, value, onChange, required }: Props) {
  const [rubyDialog, setRubyDialog] = useState<RubyDialog>({ open: false, selectedText: "" });
  const [rubyReading, setRubyReading] = useState("");
  const [linkDialog, setLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Ruby,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleRubyClick = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    if (!selectedText) return;
    setRubyDialog({ open: true, selectedText });
    setRubyReading("");
  };

  const applyRuby = () => {
    if (!editor || !rubyDialog.selectedText || !rubyReading) return;
    editor
      .chain()
      .focus()
      .deleteSelection()
      .insertContent({ type: "ruby", attrs: { text: rubyDialog.selectedText, reading: rubyReading } })
      .run();
    setRubyDialog({ open: false, selectedText: "" });
  };

  const handleLinkClick = () => {
    if (!editor) return;
    setLinkUrl(editor.getAttributes("link").href ?? "");
    setLinkDialog(true);
  };

  const applyLink = () => {
    if (!editor) return;
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkDialog(false);
    setLinkUrl("");
  };

  const closeRubyDialog = () => setRubyDialog({ open: false, selectedText: "" });
  const closeLinkDialog = () => { setLinkDialog(false); setLinkUrl(""); };

  return (
    <Field.Root required={required}>
      <Field.Label>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
      <Box width="100%" border="1px solid" borderColor="border" borderRadius="md" overflow="hidden">
        <HStack gap={1} p={2} borderBottom="1px solid" borderColor="border" flexWrap="wrap">
          <IconButton
            aria-label="Bold"
            size="xs"
            variant={editor?.isActive("bold") ? "solid" : "ghost"}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <LuBold />
          </IconButton>
          <IconButton
            aria-label="Italic"
            size="xs"
            variant={editor?.isActive("italic") ? "solid" : "ghost"}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <LuItalic />
          </IconButton>
          <IconButton
            aria-label="Heading 2"
            size="xs"
            variant={editor?.isActive("heading", { level: 2 }) ? "solid" : "ghost"}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <LuHeading2 />
          </IconButton>
          <IconButton
            aria-label="Heading 3"
            size="xs"
            variant={editor?.isActive("heading", { level: 3 }) ? "solid" : "ghost"}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <LuHeading3 />
          </IconButton>
          <IconButton
            aria-label="Bullet list"
            size="xs"
            variant={editor?.isActive("bulletList") ? "solid" : "ghost"}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <LuList />
          </IconButton>
          <IconButton
            aria-label="Ordered list"
            size="xs"
            variant={editor?.isActive("orderedList") ? "solid" : "ghost"}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <LuListOrdered />
          </IconButton>
          <Button
            size="xs"
            variant="ghost"
            fontWeight="normal"
            fontSize="xs"
            px={2}
            onClick={handleRubyClick}
          >
            ルビ
          </Button>
          <IconButton
            aria-label="Link"
            size="xs"
            variant={editor?.isActive("link") ? "solid" : "ghost"}
            onClick={handleLinkClick}
          >
            <LuLink />
          </IconButton>
          {editor?.isActive("link") && (
            <IconButton
              aria-label="Remove link"
              size="xs"
              variant="ghost"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <LuUnlink />
            </IconButton>
          )}
        </HStack>

        {rubyDialog.open && (
          <HStack p={2} borderBottom="1px solid" borderColor="border" bg="bg.subtle" gap={2}>
            <Text fontSize="sm" whiteSpace="nowrap">「{rubyDialog.selectedText}」の読み:</Text>
            <Input
              size="sm"
              autoFocus
              value={rubyReading}
              onChange={(e) => setRubyReading(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyRuby();
                if (e.key === "Escape") closeRubyDialog();
              }}
              placeholder="よみがな"
            />
            <Button size="xs" onClick={applyRuby}>適用</Button>
            <IconButton size="xs" aria-label="close" variant="ghost" onClick={closeRubyDialog}>
              <LuX />
            </IconButton>
          </HStack>
        )}

        {linkDialog && (
          <HStack p={2} borderBottom="1px solid" borderColor="border" bg="bg.subtle" gap={2}>
            <Text fontSize="sm" whiteSpace="nowrap">URL:</Text>
            <Input
              size="sm"
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyLink();
                if (e.key === "Escape") closeLinkDialog();
              }}
              placeholder="https://..."
            />
            <Button size="xs" onClick={applyLink}>適用</Button>
            <IconButton size="xs" aria-label="close" variant="ghost" onClick={closeLinkDialog}>
              <LuX />
            </IconButton>
          </HStack>
        )}

        <Box p={3} minH="200px" className="rich-text-editor-body">
          <style>{`
            .rich-text-editor-body .tiptap { outline: none; min-height: 180px; }
            .rich-text-editor-body .tiptap p { margin-bottom: 0.5em; }
            .rich-text-editor-body .tiptap ul,
            .rich-text-editor-body .tiptap ol { padding-left: 1.5em; margin-bottom: 0.5em; }
            .rich-text-editor-body .tiptap h2 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; }
            .rich-text-editor-body .tiptap h3 { font-size: 1.1em; font-weight: bold; margin-bottom: 0.5em; }
            .rich-text-editor-body .tiptap a { color: #3182ce; text-decoration: underline; cursor: pointer; }
            .rich-text-editor-body .tiptap ruby rt { font-size: 0.5em; }
          `}</style>
          <EditorContent editor={editor} />
        </Box>
      </Box>
    </Field.Root>
  );
}
