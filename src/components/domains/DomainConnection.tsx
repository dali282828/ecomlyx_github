'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Progress,
  HStack,
  useColorModeValue,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FaGlobe, FaLink } from 'react-icons/fa';

interface DomainConnectionProps {
  websiteId: string;
  onComplete: () => void;
}

export default function DomainConnection({ websiteId, onComplete }: DomainConnectionProps) {
  const [mode, setMode] = useState<'subdomain' | 'custom' | null>('subdomain');
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [availability, setAvailability] = useState<'available' | 'taken' | null>(null);
  const toast = useToast();

  // Mock availability check for subdomain
  const checkSubdomain = async () => {
    setIsChecking(true);
    setAvailability(null);
    setTimeout(() => {
      if (subdomain.toLowerCase() === 'taken') {
        setAvailability('taken');
        toast({ title: 'Subdomain not available', status: 'error', duration: 3000 });
      } else {
        setAvailability('available');
        toast({ title: 'Subdomain available!', status: 'success', duration: 2000 });
      }
      setIsChecking(false);
    }, 900);
  };

  const connectSubdomain = () => {
    setIsConnecting(true);
    setTimeout(() => {
      toast({ title: 'Subdomain connected!', status: 'success', duration: 2000 });
      setIsConnecting(false);
      onComplete();
    }, 1000);
  };

  const connectCustomDomain = () => {
    setIsConnecting(true);
    setTimeout(() => {
      toast({ title: 'Custom domain saved!', status: 'success', duration: 2000 });
      setIsConnecting(false);
      onComplete();
    }, 1000);
  };

  return (
    <VStack spacing={8} align="stretch">
      <Text fontSize="xl" fontWeight="bold">Connect Your Domain</Text>
      <HStack spacing={6} justify="center">
        <Box
          as="button"
          onClick={() => setMode('subdomain')}
          borderWidth={mode === 'subdomain' ? '2px' : '1px'}
          borderColor={mode === 'subdomain' ? 'blue.500' : useColorModeValue('gray.200', 'gray.600')}
          bg={mode === 'subdomain' ? useColorModeValue('blue.50', 'blue.900') : useColorModeValue('white', 'gray.800')}
          borderRadius="xl"
          p={6}
          minW="220px"
          boxShadow={mode === 'subdomain' ? 'lg' : 'md'}
          transition="all 0.2s"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon as={FaLink} boxSize={8} color={mode === 'subdomain' ? 'blue.500' : 'gray.400'} mb={2} />
          <Text fontWeight="bold">Free Subdomain</Text>
          <Text color="gray.500" fontSize="sm" textAlign="center">Get a free subdomain like <b>yourname.ecomlyx.com</b></Text>
        </Box>
        <Box
          as="button"
          onClick={() => setMode('custom')}
          borderWidth={mode === 'custom' ? '2px' : '1px'}
          borderColor={mode === 'custom' ? 'blue.500' : useColorModeValue('gray.200', 'gray.600')}
          bg={mode === 'custom' ? useColorModeValue('blue.50', 'blue.900') : useColorModeValue('white', 'gray.800')}
          borderRadius="xl"
          p={6}
          minW="220px"
          boxShadow={mode === 'custom' ? 'lg' : 'md'}
          transition="all 0.2s"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon as={FaGlobe} boxSize={8} color={mode === 'custom' ? 'blue.500' : 'gray.400'} mb={2} />
          <Text fontWeight="bold">Custom Domain</Text>
          <Text color="gray.500" fontSize="sm" textAlign="center">Use your own domain (e.g., <b>yourbrand.com</b>)</Text>
        </Box>
      </HStack>
      {mode === 'subdomain' && (
        <Box bg={useColorModeValue('gray.50', 'gray.700')} p={6} borderRadius="lg" boxShadow="md">
          <FormControl mb={2}>
            <FormLabel>Choose your free subdomain</FormLabel>
            <HStack>
              <Input
                placeholder="yourname"
                value={subdomain}
                onChange={e => { setSubdomain(e.target.value); setAvailability(null); }}
                focusBorderColor="blue.400"
                aria-label="Subdomain"
                isDisabled={isChecking || isConnecting}
              />
              <Text color="gray.500">.ecomlyx.com</Text>
            </HStack>
            <Text color="gray.500" fontSize="sm" mt={1}>This will be your free website address.</Text>
          </FormControl>
          <Button
            colorScheme="blue"
            onClick={checkSubdomain}
            isLoading={isChecking}
            isDisabled={!subdomain || isChecking || isConnecting}
            mb={2}
          >
            Check Availability
          </Button>
          {availability === 'available' && (
            <Text color="green.500" fontWeight="bold" mb={2}>Available! <b>https://{subdomain}.ecomlyx.com</b></Text>
          )}
          {availability === 'taken' && (
            <Text color="red.500" fontWeight="bold" mb={2}>Sorry, that subdomain is taken.</Text>
          )}
          <Button
            colorScheme="blue"
            onClick={connectSubdomain}
            isLoading={isConnecting}
            isDisabled={availability !== 'available'}
            w="full"
          >
            Use this subdomain
          </Button>
        </Box>
      )}
      {mode === 'custom' && (
        <Box bg={useColorModeValue('gray.50', 'gray.700')} p={6} borderRadius="lg" boxShadow="md">
          <FormControl mb={2}>
            <FormLabel>Enter your custom domain</FormLabel>
            <Input
              placeholder="yourbrand.com"
              value={customDomain}
              onChange={e => setCustomDomain(e.target.value)}
              focusBorderColor="blue.400"
              aria-label="Custom Domain"
              isDisabled={isChecking || isConnecting}
            />
            <Text color="gray.500" fontSize="sm" mt={1}>You can purchase this domain after setup, or connect an existing one.</Text>
          </FormControl>
          <Button
            colorScheme="blue"
            onClick={connectCustomDomain}
            isLoading={isConnecting}
            isDisabled={!customDomain || isConnecting}
            w="full"
          >
            Continue
          </Button>
          <Box mt={4} p={3} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
            <Text fontSize="sm" color="blue.700">After setup, you'll get instructions to purchase this domain or add DNS records to connect it.</Text>
          </Box>
        </Box>
      )}
      {(isChecking || isConnecting) && (
        <Progress size="xs" isIndeterminate />
      )}
    </VStack>
  );
} 