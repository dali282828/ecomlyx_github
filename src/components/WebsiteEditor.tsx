'use client';

import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  useColorModeValue,
  IconButton,
  Tooltip,
  Divider,
  Input,
  useToast,
} from '@chakra-ui/react';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { PageEditor } from './PageEditor';

interface Page {
  id: string;
  title: string;
  content: string;
  slug: string;
}

interface Website {
  id: string;
  title: string;
  pages: Page[];
}

interface WebsiteEditorProps {
  website: Website;
  onSave: (website: Website) => Promise<void>;
}

export function WebsiteEditor({ website, onSave }: WebsiteEditorProps) {
  const [activePage, setActivePage] = useState<Page | null>(website.pages[0] || null);
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const handlePageSelect = (page: Page) => {
    setActivePage(page);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleContentChange = (content: string) => {
    if (activePage) {
      setActivePage({
        ...activePage,
        content,
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedWebsite = {
        ...website,
        pages: website.pages.map(page =>
          page.id === activePage?.id ? activePage : page
        ),
      };
      await onSave(updatedWebsite);
      toast({
        title: 'Changes saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error saving changes',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPage = () => {
    if (!newPageTitle.trim()) return;

    const newPage: Page = {
      id: Date.now().toString(),
      title: newPageTitle,
      content: '',
      slug: newPageTitle.toLowerCase().replace(/\s+/g, '-'),
    };

    website.pages.push(newPage);
    setActivePage(newPage);
    setNewPageTitle('');
  };

  const handleDeletePage = (pageId: string) => {
    const updatedPages = website.pages.filter(page => page.id !== pageId);
    if (updatedPages.length === 0) {
      toast({
        title: 'Cannot delete last page',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    website.pages = updatedPages;
    if (activePage?.id === pageId) {
      setActivePage(updatedPages[0]);
    }
  };

  return (
    <Box h="full" display="flex">
      {/* Sidebar */}
      <VStack
        w="250px"
        h="full"
        borderRight="1px"
        borderColor={borderColor}
        p={4}
        spacing={4}
        align="stretch"
      >
        <Text fontSize="lg" fontWeight="bold">
          Pages
        </Text>
        <HStack>
          <Input
            placeholder="New page title"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            size="sm"
          />
          <IconButton
            aria-label="Add page"
            icon={<FaPlus />}
            size="sm"
            onClick={handleAddPage}
          />
        </HStack>
        <Divider />
        <VStack spacing={2} align="stretch" overflowY="auto">
          {website.pages.map((page) => (
            <HStack
              key={page.id}
              p={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: hoverBg }}
              bg={activePage?.id === page.id ? hoverBg : 'transparent'}
              onClick={() => handlePageSelect(page)}
            >
              <Text flex={1}>{page.title}</Text>
              <IconButton
                aria-label="Delete page"
                icon={<FaTrash />}
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePage(page.id);
                }}
              />
            </HStack>
          ))}
        </VStack>
      </VStack>

      {/* Main content */}
      <Box flex={1} p={4} overflowY="auto">
        {activePage ? (
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="2xl" fontWeight="bold">
                {activePage.title}
              </Text>
              <HStack>
                <Button
                  leftIcon={isEditing ? <FaEye /> : <FaEdit />}
                  onClick={handleToggleEdit}
                  size="sm"
                >
                  {isEditing ? 'Preview' : 'Edit'}
                </Button>
                {isEditing && (
                  <Button
                    colorScheme="brand"
                    onClick={handleSave}
                    isLoading={isSaving}
                    size="sm"
                  >
                    Save
                  </Button>
                )}
              </HStack>
            </HStack>
            <Divider />
            {isEditing ? (
              <PageEditor
                content={activePage.content}
                onChange={handleContentChange}
              />
            ) : (
              <Box
                p={4}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                bg={bgColor}
                dangerouslySetInnerHTML={{ __html: activePage.content }}
              />
            )}
          </VStack>
        ) : (
          <Text>No pages available. Create a new page to get started.</Text>
        )}
      </Box>
    </Box>
  );
} 