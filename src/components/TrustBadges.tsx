import { Box, HStack, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { FaLock, FaCloud, FaCcStripe, FaShieldAlt } from 'react-icons/fa';

const badges = [
  { icon: FaLock, label: 'SSL Secured' },
  { icon: FaCloud, label: 'Powered by Google Cloud' },
  { icon: FaCcStripe, label: 'Payments by Stripe' },
  { icon: FaShieldAlt, label: 'GDPR Compliant' },
];

export default function TrustBadges() {
  return (
    <Box py={6} px={2} bg={useColorModeValue('gray.50', 'gray.800')}>
      <HStack spacing={{ base: 4, md: 10 }} justify="center" wrap="wrap">
        {badges.map((badge) => (
          <HStack key={badge.label} spacing={2}>
            <Box as={badge.icon} boxSize={6} color="blue.500" />
            <Text fontSize="sm" color="gray.600">{badge.label}</Text>
          </HStack>
        ))}
      </HStack>
    </Box>
  );
} 