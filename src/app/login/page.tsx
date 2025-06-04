'use client';

import { Box, Container, Heading, Text, Link, VStack, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const formBg = useColorModeValue('white', 'gray.800');
  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Welcome Back
          </Heading>
          <Text color="gray.600">
            Login to your account to manage your websites
          </Text>
        </Box>

        <Box w="full" bg={formBg} p={8} borderRadius="lg" boxShadow="sm">
          <LoginForm />
        </Box>
      </VStack>
    </Container>
  );
} 