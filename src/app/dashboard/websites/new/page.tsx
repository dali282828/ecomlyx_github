'use client';

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { WebsiteCreationForm } from '@/components/WebsiteCreationForm';

export default function NewWebsitePage() {
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg">Create New Website</Heading>
          <Text color="gray.600" mt={2}>
            Get started by creating your new website. Choose between AI-assisted or classic mode.
          </Text>
        </Box>

        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <WebsiteCreationForm />
        </Box>
      </VStack>
    </Container>
  );
} 