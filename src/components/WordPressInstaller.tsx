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
  Alert,
  AlertIcon,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Heading,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FaCheck, FaSpinner, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface WordPressInstallerProps {
  websiteId: string;
  businessType: string;
  onComplete?: () => void;
}

export function WordPressInstaller({
  websiteId,
  businessType,
  onComplete,
}: WordPressInstallerProps) {
  const [siteName, setSiteName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const steps = [
    'Preparing WordPress installation',
    'Creating database',
    'Installing WordPress core',
    'Configuring settings',
    'Installing business-specific plugins',
    'Setting up theme',
  ];

  const handleInstall = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentStep(0);

      const response = await fetch(`/api/websites/${websiteId}/wordpress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteName,
          adminEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Installation failed');
      }

      // Simulate progress through steps
      for (let i = 1; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setCurrentStep(i);
      }

      toast({
        title: 'Success',
        description: 'WordPress has been installed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onComplete?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Installation failed');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Installation failed',
        status: 'error',
        duration: 5000,
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
      <Card>
        <CardHeader>
          <Heading size="md">Install WordPress</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6}>
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <FormControl>
              <FormLabel>Site Name</FormLabel>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Enter your site name"
                isDisabled={isLoading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Admin Email</FormLabel>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Enter admin email"
                isDisabled={isLoading}
              />
            </FormControl>

            {isLoading && (
              <Box w="100%">
                <Progress
                  value={(currentStep / (steps.length - 1)) * 100}
                  size="sm"
                  colorScheme="brand"
                  mb={4}
                />
                <Text color="gray.600" mb={4}>
                  {steps[currentStep]}...
                </Text>
                <List spacing={3}>
                  {steps.map((step, index) => (
                    <ListItem
                      key={index}
                      color={
                        index < currentStep
                          ? 'green.500'
                          : index === currentStep
                          ? 'blue.500'
                          : 'gray.500'
                      }
                    >
                      <ListIcon
                        as={
                          index < currentStep
                            ? FaCheck
                            : index === currentStep
                            ? FaSpinner
                            : FaTimes
                        }
                        color={
                          index < currentStep
                            ? 'green.500'
                            : index === currentStep
                            ? 'blue.500'
                            : 'gray.500'
                        }
                      />
                      {step}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Button
              colorScheme="brand"
              onClick={handleInstall}
              isLoading={isLoading}
              loadingText="Installing..."
              width="full"
              isDisabled={!siteName || !adminEmail}
            >
              Install WordPress
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </MotionBox>
  );
} 