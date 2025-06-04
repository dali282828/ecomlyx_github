import React from 'react';
import { Box, Heading, Text, VStack, HStack, Badge, Button, useColorModeValue, Icon, Progress, Tooltip } from '@chakra-ui/react';
import { PLANS } from '../plans';
import { FaCrown, FaArrowUp, FaDatabase, FaExchangeAlt } from 'react-icons/fa';

interface Usage {
  storage: number; // GB
  storageLimit: number; // GB
  bandwidth: number; // GB
  bandwidthLimit: number; // GB
}

interface PlanSummaryProps {
  planId: string;
  usage?: Usage;
  nextBillingDate?: string;
  onUpgrade?: () => void;
}

export default function PlanSummary({ planId, usage, nextBillingDate, onUpgrade }: PlanSummaryProps) {
  const plan = PLANS[planId.toLowerCase()] || PLANS['starter'];
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('lg', 'dark-lg');
  return (
    <Box
      bg={cardBg}
      boxShadow={cardShadow}
      borderRadius="2xl"
      p={8}
      mb={8}
      w="full"
      maxW="lg"
      mx="auto"
      position="relative"
      borderWidth={2}
      borderColor={planId.toLowerCase() === 'business' ? 'purple.400' : planId.toLowerCase() === 'pro' ? 'blue.400' : 'gray.200'}
    >
      <HStack spacing={3} mb={2}>
        <Icon as={FaCrown} color={planId.toLowerCase() === 'business' ? 'purple.400' : planId.toLowerCase() === 'pro' ? 'blue.400' : 'gray.400'} boxSize={6} />
        <Heading size="md">{plan.name} Plan</Heading>
        <Badge colorScheme={planId.toLowerCase() === 'business' ? 'purple' : planId.toLowerCase() === 'pro' ? 'blue' : 'gray'}>{planId.charAt(0).toUpperCase() + planId.slice(1)}</Badge>
      </HStack>
      <Text fontWeight="bold" fontSize="2xl" mb={2}>
        ${plan.price} <Text as="span" fontSize="md" color="gray.500">/mo</Text>
      </Text>
      {nextBillingDate && (
        <Text fontSize="sm" color="gray.500" mb={2}>Next billing: {nextBillingDate}</Text>
      )}
      <VStack align="start" spacing={1} mb={4}>
        {plan.features.map((f) => (
          <Text key={f} fontSize="sm" color="gray.600">• {f}</Text>
        ))}
      </VStack>
      {usage && (
        <VStack align="start" spacing={2} mb={4} w="full">
          <HStack w="full" justify="space-between">
            <HStack><Icon as={FaDatabase} color="blue.400" /><Text fontSize="sm">Storage</Text></HStack>
            <Text fontSize="sm">{usage.storage} / {usage.storageLimit} GB</Text>
          </HStack>
          <Progress value={Math.min((usage.storage / usage.storageLimit) * 100, 100)} colorScheme="blue" size="sm" w="full" borderRadius="md" />
          <HStack w="full" justify="space-between">
            <HStack><Icon as={FaExchangeAlt} color="purple.400" /><Text fontSize="sm">Bandwidth</Text></HStack>
            <Text fontSize="sm">{usage.bandwidth} / {usage.bandwidthLimit} GB</Text>
          </HStack>
          <Progress value={Math.min((usage.bandwidth / usage.bandwidthLimit) * 100, 100)} colorScheme="purple" size="sm" w="full" borderRadius="md" />
        </VStack>
      )}
      {onUpgrade && (
        <Button leftIcon={<FaArrowUp />} colorScheme="blue" variant="outline" onClick={onUpgrade} w="full">
          Upgrade Plan
        </Button>
      )}
    </Box>
  );
} 