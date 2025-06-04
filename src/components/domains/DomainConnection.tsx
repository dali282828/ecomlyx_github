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
} from '@chakra-ui/react';

interface DomainConnectionProps {
  websiteId: string;
  onComplete: () => void;
}

export default function DomainConnection({ websiteId, onComplete }: DomainConnectionProps) {
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const toast = useToast();

  const checkDomain = async () => {
    if (!domain) {
      toast({
        title: 'Please enter a domain',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch('/api/domains/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      
      if (data.available) {
        toast({
          title: 'Domain available!',
          status: 'success',
          duration: 3000,
        });
        connectDomain();
      } else {
        toast({
          title: 'Domain not available',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error checking domain',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const connectDomain = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/domains/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, websiteId }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Domain connected successfully!',
          status: 'success',
          duration: 3000,
        });
        onComplete();
      } else {
        toast({
          title: 'Error connecting domain',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error connecting domain',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="xl" fontWeight="bold">Connect Your Domain</Text>
      
      <FormControl>
        <FormLabel>Domain Name</FormLabel>
        <Input
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        onClick={checkDomain}
        isLoading={isChecking || isConnecting}
        loadingText={isChecking ? "Checking..." : "Connecting..."}
      >
        {isChecking ? "Checking Domain" : "Connect Domain"}
      </Button>

      {(isChecking || isConnecting) && (
        <Progress size="xs" isIndeterminate />
      )}
    </VStack>
  );
} 