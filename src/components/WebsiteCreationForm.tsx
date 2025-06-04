'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

type BusinessType = 'RESTAURANT' | 'HOTEL' | 'RETAIL' | 'SERVICE' | 'OTHER';

interface WebsiteCreationFormProps {
  onSuccess?: () => void;
}

export function WebsiteCreationForm({ onSuccess }: WebsiteCreationFormProps) {
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('OTHER');
  const [creationMode, setCreationMode] = useState<'ai' | 'classic'>('ai');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [showWordPressFields, setShowWordPressFields] = useState(false);
  const [wordPressDetails, setWordPressDetails] = useState({
    domain: '',
    adminEmail: '',
    adminUsername: '',
    adminPassword: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const handleBusinessTypeChange = (value: BusinessType) => {
    setBusinessType(value);
    setShowWordPressFields(['HOTEL', 'RESTAURANT', 'RETAIL'].includes(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    onOpen();

    try {
      // Create website
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          businessType,
          creationMode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create website');
      }

      const website = await response.json();

      // Configure WordPress if needed
      if (showWordPressFields) {
        setCurrentStep('Configuring WordPress...');
        setProgress(50);

        const wpResponse = await fetch(`/api/websites/${website.id}/wordpress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(wordPressDetails),
        });

        if (!wpResponse.ok) {
          throw new Error('Failed to configure WordPress');
        }

        const wpConfig = await wpResponse.json();
        console.log('WordPress configuration:', wpConfig);
      }

      // Simulate progress for AI mode
      if (creationMode === 'ai') {
        const steps = [
          'Analyzing business requirements...',
          'Generating content structure...',
          'Creating initial pages...',
          'Setting up SEO...',
          'Finalizing website...',
        ];

        for (let i = 0; i < steps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setProgress(((i + 1) / steps.length) * 100);
          setCurrentStep(steps[i]);
        }
      } else {
        setProgress(100);
        setCurrentStep('Website created successfully!');
      }

      toast({
        title: 'Website created successfully',
        description: 'Your website is ready to be customized',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onSuccess?.();
      router.push(`/dashboard/websites/${website.id}`);
    } catch (error) {
      toast({
        title: 'Error creating website',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Box as="form" onSubmit={handleSubmit} w="full" maxW="md">
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Website Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your website name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Business Type</FormLabel>
            <Select
              value={businessType}
              onChange={(e) => handleBusinessTypeChange(e.target.value as BusinessType)}
            >
              <option value="RESTAURANT">Restaurant</option>
              <option value="HOTEL">Hotel</option>
              <option value="RETAIL">Retail</option>
              <option value="SERVICE">Service</option>
              <option value="OTHER">Other</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Creation Mode</FormLabel>
            <RadioGroup value={creationMode} onChange={(value) => setCreationMode(value as 'ai' | 'classic')}>
              <Stack direction="row">
                <Radio value="ai">AI-Assisted</Radio>
                <Radio value="classic">Classic</Radio>
              </Stack>
            </RadioGroup>
            <Text fontSize="sm" color="gray.500" mt={1}>
              {creationMode === 'ai'
                ? 'AI will help generate content and structure'
                : 'Start with a blank template'}
            </Text>
          </FormControl>

          <Collapse in={showWordPressFields}>
            <VStack spacing={4} align="stretch" bg="gray.50" p={4} borderRadius="md">
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>WordPress Integration</AlertTitle>
                  <AlertDescription>
                    Your website will be created with WordPress, including all necessary plugins and themes for your business type.
                  </AlertDescription>
                </Box>
              </Alert>

              <FormControl isRequired>
                <FormLabel>Domain Name</FormLabel>
                <Input
                  value={wordPressDetails.domain}
                  onChange={(e) => setWordPressDetails(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="example.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Admin Email</FormLabel>
                <Input
                  type="email"
                  value={wordPressDetails.adminEmail}
                  onChange={(e) => setWordPressDetails(prev => ({ ...prev, adminEmail: e.target.value }))}
                  placeholder="admin@example.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Admin Username</FormLabel>
                <Input
                  value={wordPressDetails.adminUsername}
                  onChange={(e) => setWordPressDetails(prev => ({ ...prev, adminUsername: e.target.value }))}
                  placeholder="admin"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Admin Password</FormLabel>
                <Input
                  type="password"
                  value={wordPressDetails.adminPassword}
                  onChange={(e) => setWordPressDetails(prev => ({ ...prev, adminPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </FormControl>
            </VStack>
          </Collapse>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Creating..."
          >
            Create Website
          </Button>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Creating Your Website</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Progress value={progress} size="sm" colorScheme="blue" mb={4} />
            <Text textAlign="center" mb={2}>
              {currentStep}
            </Text>
            <Text textAlign="center" fontSize="sm" color="gray.500">
              {creationMode === 'ai'
                ? 'AI is working its magic...'
                : 'Setting up your website...'}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 