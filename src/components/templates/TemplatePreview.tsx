'use client';

import { Box, Image, Text, VStack, Badge, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface TemplatePreviewProps {
  template: {
    id: string;
    name: string;
    thumbnail: string;
    features: string[];
    plugins: string[];
  };
  isSelected: boolean;
  onSelect: () => void;
}

export default function TemplatePreview({ template, isSelected, onSelect }: TemplatePreviewProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        cursor="pointer"
        onClick={onSelect}
        borderColor={isSelected ? 'blue.500' : 'gray.200'}
        boxShadow={isSelected ? 'lg' : 'md'}
      >
        <Image
          src={template.thumbnail}
          alt={template.name}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        <VStack p={4} align="start" spacing={3}>
          <Text fontWeight="bold" fontSize="lg">{template.name}</Text>
          <HStack wrap="wrap" spacing={2}>
            {template.features.map((feature, index) => (
              <Badge key={index} colorScheme="blue">{feature}</Badge>
            ))}
          </HStack>
        </VStack>
      </Box>
    </motion.div>
  );
} 