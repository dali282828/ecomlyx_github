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
  Checkbox,
  Alert,
  AlertIcon,
  Link,
} from '@chakra-ui/react';

interface WordPressSetupProps {
  websiteId: string;
  businessName: string;
  businessType: string;
  adminEmail: string;
  onComplete: () => void;
}

const demoTemplates = [
  { id: '1', name: 'Business Starter', type: 'business', image: '/templates/business-starter.png' },
  { id: '2', name: 'Portfolio Pro', type: 'portfolio', image: '/templates/portfolio-pro.png' },
  { id: '3', name: 'E-Commerce Basic', type: 'ecommerce', image: '/templates/ecommerce-basic.png' },
];

export default function WordPressSetup({ websiteId, businessName, businessType, adminEmail, onComplete }: WordPressSetupProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [installPlugins, setInstallPlugins] = useState(true);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const toast = useToast();

  const installWordPress = async () => {
    setIsInstalling(true);
    try {
      const response = await fetch('/api/wordpress/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          businessName,
          businessType,
          adminEmail,
          installPlugins,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubdomain(data.subdomain);
        toast({
          title: 'WordPress installed successfully!',
          status: 'success',
          duration: 3000,
        });
        onComplete();
      } else {
        toast({
          title: 'Error installing WordPress',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('WordPress install error:', error);
      toast({
        title: 'Error installing WordPress',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="xl" fontWeight="bold">Install WordPress</Text>
      
      <FormControl>
        <FormLabel>Install Plugins</FormLabel>
        <Checkbox
          isChecked={installPlugins}
          onChange={(e) => setInstallPlugins(e.target.checked)}
        >
          Install Plugins
        </Checkbox>
      </FormControl>

      <Button
        colorScheme="blue"
        onClick={installWordPress}
        isLoading={isInstalling}
        isDisabled={isInstalling}
      >
        {isInstalling ? "Installing..." : "Install WordPress"}
      </Button>
      {subdomain && (
        <Alert status="success" mt={4} borderRadius="md">
          <AlertIcon />
          Your WordPress site is live at:{' '}
          <Link href={`https://${subdomain}`} color="blue.500" isExternal ml={1}>
            {subdomain}
          </Link>
        </Alert>
      )}
    </VStack>
  );
} 