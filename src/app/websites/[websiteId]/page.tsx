'use client';

import { Box, Heading, Text, Badge, HStack, Button, VStack } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const mockWebsites = [
  {
    id: '1',
    name: 'Business Starter',
    status: 'Published',
    createdAt: '2024-06-01',
    domain: 'mybusiness.com',
    description: 'A modern business website template.',
  },
  {
    id: '2',
    name: 'Portfolio Pro',
    status: 'Draft',
    createdAt: '2024-06-02',
    domain: '',
    description: 'A clean portfolio template for creatives.',
  },
  {
    id: '3',
    name: 'E-Commerce Basic',
    status: 'Pending',
    createdAt: '2024-06-03',
    domain: 'shopdemo.com',
    description: 'A starter template for online stores.',
  },
];

export default function WebsiteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const website = mockWebsites.find((w) => w.id === params.websiteId);

  if (!website) {
    return (
      <Box p={10} textAlign="center">
        <Heading size="md">Website Not Found</Heading>
        <Text mt={4}>The website you are looking for does not exist.</Text>
        <Button mt={6} colorScheme="blue" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </Box>
    );
  }

  return (
    <Box maxW="2xl" mx="auto" py={10}>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg">{website.name}</Heading>
          <HStack mt={2} spacing={4}>
            <Badge colorScheme={website.status === 'Published' ? 'green' : website.status === 'Draft' ? 'gray' : 'orange'}>
              {website.status}
            </Badge>
            <Text color="gray.500">Created: {website.createdAt}</Text>
          </HStack>
        </Box>
        <Box>
          <Text fontWeight="bold">Domain:</Text>
          <Text>{website.domain || <span style={{ color: '#aaa' }}>Not connected</span>}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Description:</Text>
          <Text>{website.description}</Text>
        </Box>
        <HStack spacing={4} mt={4}>
          <Link href={`/websites/${website.id}/edit`} passHref legacyBehavior>
            <Button colorScheme="blue">Edit Website</Button>
          </Link>
          <Link href={`/websites/${website.id}/domain`} passHref legacyBehavior>
            <Button>Manage Domain</Button>
          </Link>
          <Link href={`/websites/${website.id}/analytics`} passHref legacyBehavior>
            <Button>View Analytics</Button>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
} 