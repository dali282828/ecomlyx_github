'use client';

import {
  Box, Flex, VStack, HStack, Text, Button, useToast, IconButton, Divider, Heading, Input, Textarea, Select, Switch, FormControl, FormLabel, Image, Grid, GridItem, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Tooltip, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AddIcon, DeleteIcon, EditIcon, SettingsIcon, AttachmentIcon, ViewIcon } from '@chakra-ui/icons';

const mockPages = [
  { id: '1', title: 'Home', slug: 'home', content: 'Welcome to our website!' },
  { id: '2', title: 'About', slug: 'about', content: 'Learn more about us.' },
  { id: '3', title: 'Contact', slug: 'contact', content: 'Get in touch with us.' },
];

const mockWordPress = {
  posts: [
    { id: '1', title: 'First Post', date: '2023-01-01', status: 'Published' },
    { id: '2', title: 'Second Post', date: '2023-01-02', status: 'Draft' },
  ],
  media: [
    { id: '1', name: 'image1.jpg', type: 'image', size: '1.2MB', url: '/images/image1.jpg' },
    { id: '2', name: 'document.pdf', type: 'document', size: '2.5MB', url: '/documents/document.pdf' },
  ],
  plugins: [
    { id: '1', name: 'Yoast SEO', status: 'Active' },
    { id: '2', name: 'WooCommerce', status: 'Inactive' },
  ],
  themes: [
    { id: '1', name: 'Default Theme', status: 'Active' },
    { id: '2', name: 'Custom Theme', status: 'Inactive' },
  ],
};

export default function WebsiteEditorPage() {
  const params = useParams();
  const toast = useToast();
  const [pages, setPages] = useState(mockPages);
  const [selectedPage, setSelectedPage] = useState(mockPages[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(selectedPage.title);
  const [editContent, setEditContent] = useState(selectedPage.content);
  const [uploadedMedia, setUploadedMedia] = useState(mockWordPress.media);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddPage = () => {
    const newPage = { id: String(pages.length + 1), title: 'New Page', slug: 'new-page', content: 'Add your content here.' };
    setPages([...pages, newPage]);
    toast({ title: 'Page added!', status: 'success' });
  };

  const handleDeletePage = (id: string) => {
    setPages(pages.filter((page) => page.id !== id));
    if (selectedPage.id === id) {
      setSelectedPage(pages[0]);
    }
    toast({ title: 'Page deleted!', status: 'error' });
  };

  const handleEditPage = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setPages(pages.map((page) => (page.id === selectedPage.id ? { ...page, title: editTitle, content: editContent } : page)));
    setIsEditing(false);
    toast({ title: 'Page updated!', status: 'success' });
  };

  const handleCancelEdit = () => {
    setEditTitle(selectedPage.title);
    setEditContent(selectedPage.content);
    setIsEditing(false);
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newMedia = Array.from(files).map((file) => ({
        id: String(uploadedMedia.length + 1),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        url: URL.createObjectURL(file),
      }));
      setUploadedMedia([...uploadedMedia, ...newMedia]);
      toast({ title: 'Media uploaded!', status: 'success' });
    }
  };

  return (
    <Flex h="100vh">
      <Box w="250px" bg={bgColor} p={4} borderRight="1px" borderColor={borderColor}>
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Website Editor</Heading>
          <Button leftIcon={<AddIcon />} onClick={handleAddPage} colorScheme="blue" size="sm">
            Add Page
          </Button>
          <Divider />
          <Text fontWeight="bold">Pages</Text>
          {pages.map((page) => (
            <HStack key={page.id} justify="space-between">
              <Text cursor="pointer" onClick={() => setSelectedPage(page)}>
                {page.title}
              </Text>
              <IconButton aria-label="Edit page" icon={<EditIcon />} size="sm" onClick={handleEditPage} />
              <IconButton aria-label="Delete page" icon={<DeleteIcon />} size="sm" onClick={() => handleDeletePage(page.id)} />
            </HStack>
          ))}
        </VStack>
      </Box>
      <Box flex="1" p={4} bg={bgColor}>
        <Tabs>
          <TabList>
            <Tab>Pages</Tab>
            <Tab>WordPress</Tab>
            <Tab>Media</Tab>
            <Tab>Plugins</Tab>
            <Tab>Themes</Tab>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">{selectedPage.title}</Heading>
                {isEditing ? (
                  <VStack align="stretch" spacing={4}>
                    <FormControl>
                      <FormLabel>Title</FormLabel>
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Content</FormLabel>
                      <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={10} />
                    </FormControl>
                    <HStack>
                      <Button colorScheme="blue" onClick={handleSaveEdit}>Save</Button>
                      <Button onClick={handleCancelEdit}>Cancel</Button>
                    </HStack>
                  </VStack>
                ) : (
                  <VStack align="stretch" spacing={4}>
                    <Text>{selectedPage.content}</Text>
                    <Button leftIcon={<ViewIcon />} onClick={onOpen}>Preview</Button>
                  </VStack>
                )}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">WordPress Posts</Heading>
                {mockWordPress.posts.map((post) => (
                  <HStack key={post.id} justify="space-between">
                    <Text>{post.title}</Text>
                    <Text>{post.date}</Text>
                    <Badge colorScheme={post.status === 'Published' ? 'green' : 'yellow'}>{post.status}</Badge>
                  </HStack>
                ))}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Media Library</Heading>
                <Input type="file" accept="image/*,application/pdf" onChange={handleMediaUpload} />
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  {uploadedMedia.map((item) => (
                    <GridItem key={item.id}>
                      {item.type === 'image' ? (
                        <Image src={item.url} alt={item.name} boxSize="100px" objectFit="cover" />
                      ) : (
                        <Text>{item.name}</Text>
                      )}
                      <Text>{item.size}</Text>
                    </GridItem>
                  ))}
                </Grid>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Plugins</Heading>
                {mockWordPress.plugins.map((plugin) => (
                  <HStack key={plugin.id} justify="space-between">
                    <Text>{plugin.name}</Text>
                    <Badge colorScheme={plugin.status === 'Active' ? 'green' : 'red'}>{plugin.status}</Badge>
                  </HStack>
                ))}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Themes</Heading>
                {mockWordPress.themes.map((theme) => (
                  <HStack key={theme.id} justify="space-between">
                    <Text>{theme.name}</Text>
                    <Badge colorScheme={theme.status === 'Active' ? 'green' : 'red'}>{theme.status}</Badge>
                  </HStack>
                ))}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">WordPress Settings</Heading>
                <FormControl>
                  <FormLabel>Site Title</FormLabel>
                  <Input defaultValue="My WordPress Site" />
                </FormControl>
                <FormControl>
                  <FormLabel>Tagline</FormLabel>
                  <Input defaultValue="Just another WordPress site" />
                </FormControl>
                <FormControl>
                  <FormLabel>Timezone</FormLabel>
                  <Select defaultValue="UTC">
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Date Format</FormLabel>
                  <Select defaultValue="F j, Y">
                    <option value="F j, Y">F j, Y</option>
                    <option value="Y-m-d">Y-m-d</option>
                    <option value="m/d/Y">m/d/Y</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Time Format</FormLabel>
                  <Select defaultValue="g:i a">
                    <option value="g:i a">g:i a</option>
                    <option value="H:i">H:i</option>
                  </Select>
                </FormControl>
                <Button colorScheme="blue" onClick={() => toast({ title: 'Settings saved!', status: 'success' })}>Save Settings</Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedPage.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedPage.content}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
} 