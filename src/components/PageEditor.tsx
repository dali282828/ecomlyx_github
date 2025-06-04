'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Box,
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
} from '@chakra-ui/react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaQuoteLeft,
  FaCode,
  FaUndo,
  FaRedo,
} from 'react-icons/fa';

interface PageEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function PageEditor({ content, onChange }: PageEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-500 hover:text-brand-600',
        },
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Start writing your content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toolbarBg = useColorModeValue('gray.50', 'gray.700');

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <Box>
      <HStack
        spacing={1}
        p={2}
        bg={toolbarBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderBottomRadius="none"
        borderTopRadius="md"
      >
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            variant="ghost"
            leftIcon={<FaAlignLeft />}
          >
            Format
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isDisabled={!editor.can().toggleHeading({ level: 1 })}
            >
              Heading 1
            </MenuItem>
            <MenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isDisabled={!editor.can().toggleHeading({ level: 2 })}
            >
              Heading 2
            </MenuItem>
            <MenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isDisabled={!editor.can().toggleHeading({ level: 3 })}
            >
              Heading 3
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isDisabled={!editor.can().toggleBulletList()}
            >
              Bullet List
            </MenuItem>
            <MenuItem
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isDisabled={!editor.can().toggleOrderedList()}
            >
              Numbered List
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isDisabled={!editor.can().toggleBlockquote()}
            >
              Quote
            </MenuItem>
            <MenuItem
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isDisabled={!editor.can().toggleCodeBlock()}
            >
              Code Block
            </MenuItem>
          </MenuList>
        </Menu>

        <Divider orientation="vertical" h="24px" />

        <Tooltip label="Bold">
          <IconButton
            aria-label="Bold"
            icon={<FaBold />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          />
        </Tooltip>

        <Tooltip label="Italic">
          <IconButton
            aria-label="Italic"
            icon={<FaItalic />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          />
        </Tooltip>

        <Tooltip label="Underline">
          <IconButton
            aria-label="Underline"
            icon={<FaUnderline />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
          />
        </Tooltip>

        <Divider orientation="vertical" h="24px" />

        <Tooltip label="Align Left">
          <IconButton
            aria-label="Align Left"
            icon={<FaAlignLeft />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
          />
        </Tooltip>

        <Tooltip label="Align Center">
          <IconButton
            aria-label="Align Center"
            icon={<FaAlignCenter />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
          />
        </Tooltip>

        <Tooltip label="Align Right">
          <IconButton
            aria-label="Align Right"
            icon={<FaAlignRight />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
          />
        </Tooltip>

        <Divider orientation="vertical" h="24px" />

        <Tooltip label="Add Link">
          <IconButton
            aria-label="Add Link"
            icon={<FaLink />}
            size="sm"
            variant="ghost"
            onClick={addLink}
            isActive={editor.isActive('link')}
          />
        </Tooltip>

        <Tooltip label="Add Image">
          <IconButton
            aria-label="Add Image"
            icon={<FaImage />}
            size="sm"
            variant="ghost"
            onClick={addImage}
          />
        </Tooltip>

        <Divider orientation="vertical" h="24px" />

        <Tooltip label="Undo">
          <IconButton
            aria-label="Undo"
            icon={<FaUndo />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            isDisabled={!editor.can().undo()}
          />
        </Tooltip>

        <Tooltip label="Redo">
          <IconButton
            aria-label="Redo"
            icon={<FaRedo />}
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            isDisabled={!editor.can().redo()}
          />
        </Tooltip>
      </HStack>

      <Box
        borderWidth="1px"
        borderColor={borderColor}
        borderTopRadius="none"
        borderBottomRadius="md"
        p={4}
        bg={bgColor}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
} 