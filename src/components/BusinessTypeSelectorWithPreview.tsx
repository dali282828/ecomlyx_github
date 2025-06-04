import { useState } from 'react';
import { Box, SimpleGrid, VStack, Heading, Text, useColorModeValue, Card, CardBody } from '@chakra-ui/react';
import { BUSINESS_TYPE_REGISTRY } from '../business-types/registry';
import PluginThemePreview from './PluginThemePreview';

const businessTypes = Object.values(BUSINESS_TYPE_REGISTRY);

export default function BusinessTypeSelectorWithPreview() {
  const [selected, setSelected] = useState(businessTypes[0]?.id || '');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');
  const cardSelected = useColorModeValue('blue.50', 'blue.900');

  return (
    <VStack align="start" spacing={10} w="full">
      <Box w="full">
        <Heading size="lg" mb={4}>Choose a Business Type</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} mb={6}>
          {businessTypes.map((type) => (
            <Box
              as="button"
              key={type.id}
              onClick={() => setSelected(type.id)}
              bg={selected === type.id ? cardSelected : cardBg}
              boxShadow={cardShadow}
              borderRadius="xl"
              borderWidth={selected === type.id ? '2px' : '1px'}
              borderColor={selected === type.id ? 'blue.400' : 'gray.200'}
              p={6}
              textAlign="left"
              transition="all 0.2s"
              _hover={{ boxShadow: 'lg', borderColor: 'blue.300' }}
              cursor="pointer"
            >
              <Heading size="md" mb={2}>{type.label}</Heading>
              <Text color="gray.500" fontSize="sm">{type.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      <PluginThemePreview businessType={selected} />
    </VStack>
  );
} 