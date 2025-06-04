'use client';

import { Box, Heading, Text, Badge, VStack, HStack, Input, Button, useToast } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const mockWebsites = [
  {
    id: '1',
    name: 'Business Starter',
    domain: 'mybusiness.com',
    domainStatus: 'Active',
  },
  {
    id: '2',
    name: 'Portfolio Pro',
    domain: '',
    domainStatus: 'Not connected',
  },
  {
    id: '3',
    name: 'E-Commerce Basic',
    domain: 'shopdemo.com',
    domainStatus: 'Pending',
  },
];

export default function DomainManagementPage() {
  const params = useParams();
  const toast = useToast();
  const website = mockWebsites.find((w) => w.id === params.websiteId);
  const [domain, setDomain] = useState(website?.domain || '');
  const [status, setStatus] = useState(website?.domainStatus || 'Not connected');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectDomain = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setStatus('Active');
      toast({ title: 'Domain connected!', status: 'success' });
      setIsConnecting(false);
    }, 1500);
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
    <Box maxW="lg" mx="auto" py={10}>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg">Domain Management</Heading>
          <Text color="gray.500" mt={2}>{website.name}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Current Domain:</Text>
          <HStack spacing={4} mt={2}>
            <Text>{domain || <span style={{ color: '#aaa' }}>Not connected</span>}</Text>
            <Badge colorScheme={status === 'Active' ? 'green' : status === 'Pending' ? 'orange' : 'gray'}>{status}</Badge>
          </HStack>
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>Connect or Change Domain</Text>
          <HStack spacing={2}>
            <Input
              placeholder="Enter your domain (e.g. mysite.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              isDisabled={isConnecting}
            />
            <Button colorScheme="blue" onClick={handleConnectDomain} isLoading={isConnecting}>
              {status === 'Active' ? 'Update Domain' : 'Connect Domain'}
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
} 