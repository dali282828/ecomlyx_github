'use client';

import {
  Box, Heading, Text, VStack, Input, Textarea, Button, useToast, FormControl, FormLabel, HStack, Divider, Switch, Avatar, SimpleGrid, Select
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const mockWebsites = [
  {
    id: '1',
    name: 'Business Starter',
    description: 'A modern business website template.',
    seoTitle: 'Business Starter - Modern Website',
    seoDescription: 'Grow your business with a modern website.',
    favicon: '/favicon.ico',
    logo: '/logo.png',
    color: '#2563eb',
    font: 'Inter',
    facebook: 'https://facebook.com/business',
    twitter: 'https://twitter.com/business',
    instagram: '',
    linkedin: '',
    googleAnalytics: 'UA-12345678-1',
    facebookPixel: '',
    chatWidget: '',
    ssl: true,
    forceHttps: true,
    passwordProtected: false,
    published: true,
  },
  {
    id: '2',
    name: 'Portfolio Pro',
    description: 'A clean portfolio template for creatives.',
    seoTitle: 'Portfolio Pro - Showcase Your Work',
    seoDescription: 'Showcase your creative work with Portfolio Pro.',
  },
  {
    id: '3',
    name: 'E-Commerce Basic',
    description: 'A starter template for online stores.',
    seoTitle: 'E-Commerce Basic - Start Selling Online',
    seoDescription: 'Launch your online store with E-Commerce Basic.',
  },
];

export default function WebsiteSettingsPage() {
  const params = useParams();
  const toast = useToast();
  const website = mockWebsites.find((w) => w.id === params.websiteId);
  // General
  const [name, setName] = useState(website?.name || '');
  const [description, setDescription] = useState(website?.description || '');
  // SEO
  const [seoTitle, setSeoTitle] = useState(website?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(website?.seoDescription || '');
  // Branding
  const [favicon, setFavicon] = useState(website?.favicon || '');
  const [logo, setLogo] = useState(website?.logo || '');
  const [color, setColor] = useState(website?.color || '#2563eb');
  const [font, setFont] = useState(website?.font || 'Inter');
  // Social
  const [facebook, setFacebook] = useState(website?.facebook || '');
  const [twitter, setTwitter] = useState(website?.twitter || '');
  const [instagram, setInstagram] = useState(website?.instagram || '');
  const [linkedin, setLinkedin] = useState(website?.linkedin || '');
  // Integrations
  const [googleAnalytics, setGoogleAnalytics] = useState(website?.googleAnalytics || '');
  const [facebookPixel, setFacebookPixel] = useState(website?.facebookPixel || '');
  const [chatWidget, setChatWidget] = useState(website?.chatWidget || '');
  // Security
  const [ssl, setSsl] = useState(website?.ssl || false);
  const [forceHttps, setForceHttps] = useState(website?.forceHttps || false);
  const [passwordProtected, setPasswordProtected] = useState(website?.passwordProtected || false);
  // Publishing
  const [published, setPublished] = useState(website?.published || false);
  // Loading
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (section: string) => {
    setIsSaving(true);
    setTimeout(() => {
      toast({ title: `${section} saved!`, status: 'success' });
      setIsSaving(false);
    }, 1000);
  };

  if (!website) {
    return (
      <Box p={10} textAlign="center">
        <Heading size="md">Website Not Found</Heading>
        <Text mt={4}>The website you are looking for does not exist.</Text>
      </Box>
    );
  }

  return (
    <Box maxW="3xl" mx="auto" py={10}>
      <VStack align="stretch" spacing={8}>
        {/* General Info */}
        <Box>
          <Heading size="md" mb={2}>General Info</Heading>
          <FormControl mb={2}>
            <FormLabel>Website Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </FormControl>
          <Button colorScheme="blue" onClick={() => handleSave('General Info')} isLoading={isSaving} alignSelf="flex-end">Save</Button>
        </Box>
        <Divider />
        {/* SEO */}
        <Box>
          <Heading size="md" mb={2}>SEO Settings</Heading>
          <FormControl mb={2}>
            <FormLabel>SEO Title</FormLabel>
            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>SEO Description</FormLabel>
            <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} />
          </FormControl>
          <Button colorScheme="blue" onClick={() => handleSave('SEO Settings')} isLoading={isSaving} alignSelf="flex-end">Save</Button>
        </Box>
        <Divider />
        {/* Branding */}
        <Box>
          <Heading size="md" mb={2}>Branding</Heading>
          <FormControl mb={2}>
            <FormLabel>Favicon</FormLabel>
            <Input value={favicon} onChange={(e) => setFavicon(e.target.value)} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Logo</FormLabel>
            <Input value={logo} onChange={(e) => setLogo(e.target.value)} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Primary Color</FormLabel>
            <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} w="60px" p={0} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Font</FormLabel>
            <Select value={font} onChange={(e) => setFont(e.target.value)}>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Lato">Lato</option>
            </Select>
          </FormControl>
          <Button colorScheme="blue" onClick={() => handleSave('Branding')} isLoading={isSaving} alignSelf="flex-end">Save</Button>
        </Box>
        <Divider />
        {/* Social Links */}
        <Box>
          <Heading size="md" mb={2}>Social Links</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl mb={2}>
              <FormLabel>Facebook</FormLabel>
              <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Twitter</FormLabel>
              <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>Instagram</FormLabel>
              <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            </FormControl>
            <FormControl mb={2}>
              <FormLabel>LinkedIn</FormLabel>
              <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            </FormControl>
          </SimpleGrid>
          <Button colorScheme="blue" onClick={() => handleSave('Social Links')} isLoading={isSaving} alignSelf="flex-end">Save</Button>
        </Box>
        <Divider />
        {/* Integrations */}
        <Box>
          <Heading size="md" mb={2}>Integrations</Heading>
          <FormControl mb={2}>
            <FormLabel>Google Analytics</FormLabel>
            <Input value={googleAnalytics} onChange={(e) => setGoogleAnalytics(e.target.value)} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Facebook Pixel</FormLabel>
            <Input value={facebookPixel} onChange={(e) => setFacebookPixel(e.target.value)} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Chat Widget</FormLabel>
            <Input value={chatWidget} onChange={(e) => setChatWidget(e.target.value)} />
          </FormControl>
          <Button colorScheme="blue" onClick={() => handleSave('Integrations')} isLoading={isSaving} alignSelf="flex-end">Save</Button>
        </Box>
        <Divider />
        {/* Security */}
        <Box>
          <Heading size="md" mb={2}>Security</Heading>
          <HStack mb={2}>
            <FormLabel htmlFor="ssl" mb={0}>SSL Enabled</FormLabel>
            <Switch id="ssl" isChecked={ssl} onChange={() => setSsl(!ssl)} />
          </HStack>
          <HStack mb={2}>
            <FormLabel htmlFor="forceHttps" mb={0}>Force HTTPS</FormLabel>
            <Switch id="forceHttps" isChecked={forceHttps} onChange={() => setForceHttps(!forceHttps)} />
          </HStack>
          <HStack mb={2}>
            <FormLabel htmlFor="passwordProtected" mb={0}>Password Protected</FormLabel>
            <Switch id="passwordProtected" isChecked={passwordProtected} onChange={() => setPasswordProtected(!passwordProtected)} />
          </HStack>
          <Button colorScheme="blue" onClick={() => handleSave('Security')} isLoading={isSaving} alignSelf="flex-end">Save</Button>
        </Box>
        <Divider />
        {/* Publishing */}
        <Box>
          <Heading size="md" mb={2}>Publishing</Heading>
          <HStack mb={2}>
            <FormLabel htmlFor="published" mb={0}>Published</FormLabel>
            <Switch id="published" isChecked={published} onChange={() => setPublished(!published)} />
          </HStack>
          <Button colorScheme="blue" onClick={() => handleSave('Publishing')} isLoading={isSaving} alignSelf="flex-end">Save</Button>
        </Box>
        <Divider />
        {/* Danger Zone */}
        <Box>
          <Heading size="md" mb={2} color="red.500">Danger Zone</Heading>
          <Button colorScheme="red" variant="outline" onClick={() => toast({ title: 'Site deleted (mock)', status: 'error' })}>
            Delete Website
          </Button>
        </Box>
      </VStack>
    </Box>
  );
} 