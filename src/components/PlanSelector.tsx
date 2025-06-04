import React from 'react';
import { Box, VStack, Heading, Text, SimpleGrid, Button, Badge, HStack, Icon, Table, Thead, Tr, Th, Tbody, Td, useColorModeValue } from '@chakra-ui/react';
import { PLANS } from '../plans';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

interface PlanSelectorProps {
  businessType: string;
  onSelect: (planId: string) => void;
}

const MotionBox = motion(Box);

// Map business type to recommended plan and available plans
const BUSINESS_TYPE_PLAN_MAP: Record<string, { plans: string[]; recommended: string }> = {
  restaurant: {
    plans: ['starter', 'pro', 'business'],
    recommended: 'pro',
  },
  ecommerce: {
    plans: ['pro', 'business', 'starter'],
    recommended: 'business',
  },
  portfolio: {
    plans: ['starter', 'pro', 'business'],
    recommended: 'starter',
  },
  // fallback
  default: {
    plans: ['starter', 'pro', 'business'],
    recommended: 'starter',
  },
};

export default function PlanSelector({ businessType, onSelect }: PlanSelectorProps) {
  const planMap = BUSINESS_TYPE_PLAN_MAP[businessType] || BUSINESS_TYPE_PLAN_MAP.default;
  const plansToShow = planMap.plans.map((id) => PLANS[id]);
  const recommendedPlanId = planMap.recommended;
  const [selected, setSelected] = React.useState<string>(recommendedPlanId);

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardSelected = useColorModeValue('blue.50', 'blue.900');
  const cardShadow = useColorModeValue('lg', 'dark-lg');
  const gradient = useColorModeValue('linear(to-br, blue.50, white 60%, purple.50)', 'linear(to-br, blue.900, gray.800 60%, purple.900)');

  // Feature comparison table data
  const featureRows = [
    { label: 'WordPress Sites', key: 'sites' },
    { label: 'Storage', key: 'storageLimitMB', format: (v: number) => `${v / 1024} GB` },
    { label: 'Traffic', key: 'trafficLimitGB', format: (v: number) => `${v} GB` },
    { label: 'Users', key: 'users' },
    { label: 'Support', key: 'features', format: (arr: string[]) => arr.find(f => f.toLowerCase().includes('support')) || '-' },
  ];

  return (
    <VStack spacing={10} w="full">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
        {plansToShow.map((plan) => (
          <MotionBox
            key={plan.id}
            whileHover={{ y: -8, boxShadow: '0 8px 32px rgba(66,153,225,0.18)' }}
            transition={{ type: 'spring', stiffness: 300 }}
            bgGradient={gradient}
            bg={selected === plan.id ? cardSelected : cardBg}
            borderWidth={2}
            borderColor={plan.id === recommendedPlanId ? 'blue.400' : 'gray.200'}
            borderRadius="2xl"
            p={8}
            boxShadow={cardShadow}
            position="relative"
            cursor="pointer"
            onClick={() => { setSelected(plan.id); onSelect(plan.id); }}
            _hover={{ borderColor: 'blue.300' }}
            outline={selected === plan.id ? '2px solid #3182ce' : 'none'}
          >
            {plan.id === recommendedPlanId && (
              <Badge colorScheme="blue" position="absolute" top={4} right={4} zIndex={2}>
                Recommended
              </Badge>
            )}
            {selected === plan.id && (
              <Badge colorScheme="green" position="absolute" top={4} left={4} zIndex={2} px={2} py={1} borderRadius="full">
                <HStack spacing={1}><Icon as={FaCheckCircle} /> Selected</HStack>
              </Badge>
            )}
            <VStack spacing={3} align="start">
              <Heading size="md" mb={1}>{plan.name}</Heading>
              <Text fontWeight="bold" fontSize="2xl">
                ${plan.price} <Text as="span" fontSize="md" color="gray.500">/mo</Text>
              </Text>
              <VStack align="start" spacing={1} mb={2}>
                {plan.features.map((f) => (
                  <Text key={f} fontSize="sm" color="gray.600">• {f}</Text>
                ))}
              </VStack>
            </VStack>
            <Button
              colorScheme="blue"
              w="full"
              mt={4}
              onClick={e => { e.stopPropagation(); setSelected(plan.id); onSelect(plan.id); }}
              variant={selected === plan.id ? 'solid' : 'outline'}
            >
              {selected === plan.id ? 'Selected' : `Choose ${plan.name}`}
            </Button>
          </MotionBox>
        ))}
      </SimpleGrid>
      {/* Feature comparison table */}
      <Box w="full" mt={8}>
        <Heading size="sm" mb={4} color="gray.600">Compare Plans</Heading>
        <Table variant="simple" size="md" bg={cardBg} borderRadius="xl" boxShadow={cardShadow} overflow="hidden">
          <Thead>
            <Tr>
              <Th>Feature</Th>
              {plansToShow.map(plan => (
                <Th key={plan.id} textAlign="center">{plan.name}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {featureRows.map(row => (
              <Tr key={row.key}>
                <Td>{row.label}</Td>
                {plansToShow.map(plan => (
                  <Td key={plan.id} textAlign="center">
                    {row.format
                      ? row.format(plan[row.key])
                      : plan[row.key] || '-'}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
} 