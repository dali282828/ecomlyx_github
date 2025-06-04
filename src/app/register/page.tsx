'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <VStack spacing="8">
        <VStack spacing="3" textAlign="center">
          <Heading size="lg">Create your account</Heading>
          <Text color="gray.500">
            Join our platform and start your journey today
          </Text>
        </VStack>

        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={bgColor}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          borderWidth="1px"
          borderColor={borderColor}
          width="full"
        >
          <RegisterForm />
        </Box>
      </VStack>
    </Container>
  );
} 