'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const MotionBox = motion(Box);

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const buttonBg = useColorModeValue('brand.500', 'brand.200');
  const buttonColor = useColorModeValue('black', 'white');
  const buttonHoverBg = useColorModeValue('brand.600', 'brand.300');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: 'Error',
          description: 'Invalid email or password',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                size="lg"
                pl={10}
              />
              <Icon
                as={FaEnvelope}
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="gray.500"
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                size="lg"
                pl={10}
              />
              <Icon
                as={FaLock}
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="gray.500"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            size="lg"
            width="full"
            isLoading={isLoading}
            loadingText="Signing in..."
            bg={buttonBg}
            color={buttonColor}
            _hover={{
              bg: buttonHoverBg,
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
          >
            Sign In
          </Button>

          <Text color="gray.500" fontSize="sm">
            Don't have an account?{' '}
            <Button
              variant="link"
              colorScheme="brand"
              onClick={() => router.push('/register')}
            >
              Register here
            </Button>
          </Text>
        </VStack>
      </form>
    </MotionBox>
  );
} 