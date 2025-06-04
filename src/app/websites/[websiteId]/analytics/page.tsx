'use client';

import { Box, Heading, Text, VStack, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Progress } from '@chakra-ui/react';
import { useParams } from 'next/navigation';

const mockWebsites = [
  {
    id: '1',
    name: 'Business Starter',
  },
  {
    id: '2',
    name: 'Portfolio Pro',
  },
  {
    id: '3',
    name: 'E-Commerce Basic',
  },
];

const mockAnalytics = {
  visitors: 1240,
  pageViews: 3200,
  bounceRate: 42,
  avgSession: '2m 15s',
  trafficSources: [
    { source: 'Google', percent: 60 },
    { source: 'Direct', percent: 25 },
    { source: 'Social', percent: 10 },
    { source: 'Referral', percent: 5 },
  ],
};

export default function WebsiteAnalyticsPage() {
  const params = useParams();
  const website = mockWebsites.find((w) => w.id === params.websiteId);

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
        <Box>
          <Heading size="lg">Analytics</Heading>
          <Text color="gray.500" mt={2}>{website.name}</Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat>
            <StatLabel>Visitors</StatLabel>
            <StatNumber>{mockAnalytics.visitors}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" /> 12% this week
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Page Views</StatLabel>
            <StatNumber>{mockAnalytics.pageViews}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" /> 8% this week
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Bounce Rate</StatLabel>
            <StatNumber>{mockAnalytics.bounceRate}%</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" /> 2% this week
            </StatHelpText>
          </Stat>
        </SimpleGrid>
        <Box>
          <Heading size="sm" mb={4}>Traffic Sources</Heading>
          <VStack align="stretch" spacing={3}>
            {mockAnalytics.trafficSources.map((src) => (
              <Box key={src.source}>
                <Text fontWeight="bold">{src.source}</Text>
                <Progress value={src.percent} colorScheme="blue" />
                <Text fontSize="sm" color="gray.500">{src.percent}%</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
} 