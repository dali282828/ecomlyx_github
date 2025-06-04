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
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';

const MotionBox = motion(Box);

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const buttonBg = useColorModeValue('brand.500', 'brand.200');
  const buttonColor = useColorModeValue('black', 'white');
  const buttonHoverBg = useColorModeValue('brand.600', 'brand.300');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Sign in the user after successful registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Failed to sign in after registration');
      }

      toast({
        title: 'Success',
        description: 'Registration successful! Welcome to the platform.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred during registration',
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
            <FormLabel>Full Name</FormLabel>
            <InputGroup>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                size="lg"
                pl={10}
              />
              <Icon
                as={FaUser}
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="gray.500"
              />
            </InputGroup>
          </FormControl>

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
                minLength={8}
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

          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                size="lg"
                pl={10}
                minLength={8}
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
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  variant="ghost"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            size="lg"
            width="full"
            isLoading={isLoading}
            loadingText="Creating account..."
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
            Create Account
          </Button>

          <Text color="gray.500" fontSize="sm">
            Already have an account?{' '}
            <Button
              variant="link"
              colorScheme="brand"
              onClick={() => router.push('/login')}
            >
              Sign in here
            </Button>
          </Text>
        </VStack>
      </form>
    </MotionBox>
  );
} 