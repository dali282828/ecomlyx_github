import { Box, Text, VStack, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export default function ModeSelectCard({ icon, title, description, selected, onClick, tooltip }) {
  return (
    <Tooltip label={tooltip} hasArrow placement="top">
      <Box
        as={motion.div}
        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        whileTap={{ scale: 0.98 }}
        borderWidth={selected ? '2px' : '1px'}
        borderColor={selected ? 'blue.500' : useColorModeValue('gray.200', 'gray.600')}
        bg={selected ? useColorModeValue('blue.50', 'blue.900') : useColorModeValue('white', 'gray.800')}
        borderRadius="xl"
        p={8}
        cursor="pointer"
        minW="260px"
        minH="180px"
        transition="all 0.2s"
        onClick={onClick}
        textAlign="center"
        boxShadow={selected ? 'lg' : 'md'}
      >
        <VStack spacing={4} align="center">
          <Box fontSize="3xl" color={selected ? 'blue.500' : 'gray.500'}>{icon}</Box>
          <Text fontWeight="bold" fontSize="lg">{title}</Text>
          <Text color="gray.500" fontSize="sm">{description}</Text>
        </VStack>
      </Box>
    </Tooltip>
  );
} 