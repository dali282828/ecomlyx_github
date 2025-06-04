'use client';

import { useRouter } from 'next/navigation';
import { Container, Box, Text } from '@chakra-ui/react';
import { WordPressWizard } from '@/components/WordPressWizard';

interface WordPressPageProps {
  params: {
    websiteId: string;
  };
}

export default function WordPressPage({ params }: WordPressPageProps) {
  const router = useRouter();
  const { websiteId } = params;

  const handleComplete = () => {
    // Redirect to website dashboard or WordPress status page
    router.push(`/websites/${websiteId}`);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={8}>
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Install WordPress
        </Text>
        <Text color="gray.600">
          Follow the steps below to set up WordPress for your website.
        </Text>
      </Box>

      <WordPressWizard
        websiteId={websiteId}
        businessType="default"
        onComplete={handleComplete}
      />
    </Container>
  );
} 