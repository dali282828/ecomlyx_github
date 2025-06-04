import { Box, Heading, Text, SimpleGrid, VStack, HStack, Image, Badge, useColorModeValue } from '@chakra-ui/react';
import { PLUGIN_REGISTRY } from '../plugins/registry';
import { THEME_REGISTRY } from '../themes/registry';
import { BUSINESS_TYPE_PRESETS } from '../ai-presets';

interface PluginThemePreviewProps {
  businessType: string;
}

export default function PluginThemePreview({ businessType }: PluginThemePreviewProps) {
  const preset = BUSINESS_TYPE_PRESETS[businessType];
  const theme = preset ? THEME_REGISTRY[preset.theme] : null;
  const plugins = preset ? preset.plugins.map((id: string) => PLUGIN_REGISTRY[id]) : [];

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  if (!preset) return <Text color="red.500">No preset found for this business type.</Text>;

  return (
    <VStack align="start" spacing={8} w="full">
      <Box w="full">
        <Heading size="md" mb={2}>Theme</Heading>
        {theme ? (
          <HStack spacing={4} align="center" bg={cardBg} boxShadow={cardShadow} borderRadius="lg" p={4}>
            <Image src={theme.preview} alt={theme.name} boxSize="80px" borderRadius="md" objectFit="cover" />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">{theme.name}</Text>
              <Text color="gray.500" fontSize="sm">{theme.description}</Text>
            </VStack>
            <Badge colorScheme="blue" ml={2}>{theme.id}</Badge>
          </HStack>
        ) : (
          <Text color="gray.500">No theme found.</Text>
        )}
      </Box>
      <Box w="full">
        <Heading size="md" mb={2}>Plugins</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {plugins.map((plugin) => (
            <Box key={plugin.id} bg={cardBg} boxShadow={cardShadow} borderRadius="lg" p={4} display="flex" alignItems="center" gap={4}>
              <Image src={plugin.icon} alt={plugin.name} boxSize="40px" borderRadius="md" objectFit="contain" />
              <VStack align="start" spacing={0} flex={1}>
                <Text fontWeight="bold">{plugin.name}</Text>
                <Text color="gray.500" fontSize="sm">{plugin.description}</Text>
              </VStack>
              <Badge colorScheme="purple">{plugin.id}</Badge>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
} 