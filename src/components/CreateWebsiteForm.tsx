'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface CreateWebsiteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (website: any) => void;
}

const businessTypes = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'retail', label: 'Retail Store' },
  { value: 'service', label: 'Service Business' },
];

const templates = [
  { id: 'hotel-1', name: 'Modern Hotel', type: 'hotel' },
  { id: 'hotel-2', name: 'Luxury Resort', type: 'hotel' },
  { id: 'restaurant-1', name: 'Fine Dining', type: 'restaurant' },
  { id: 'restaurant-2', name: 'Cafe & Bistro', type: 'restaurant' },
  { id: 'retail-1', name: 'Modern Shop', type: 'retail' },
  { id: 'retail-2', name: 'Boutique Store', type: 'retail' },
  { id: 'service-1', name: 'Professional Services', type: 'service' },
  { id: 'service-2', name: 'Consulting Firm', type: 'service' },
];

export function CreateWebsiteForm({ isOpen, onClose, onSuccess }: CreateWebsiteFormProps) {
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const buttonBg = useColorModeValue('brand.500', 'brand.200');
  const buttonColor = useColorModeValue('white', 'gray.800');
  const buttonHoverBg = useColorModeValue('brand.600', 'brand.300');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          businessType,
          templateId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create website');
      }

      const newWebsite = await response.json();
      onSuccess(newWebsite);
      toast({
        title: 'Success',
        description: 'Website created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      router.push(`/create?websiteId=${newWebsite.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create website',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = templates.filter(
    (template) => template.type === businessType
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Create New Website</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Website Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter website name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Business Type</FormLabel>
                <Select
                  value={businessType}
                  onChange={(e) => {
                    setBusinessType(e.target.value);
                    setTemplateId('');
                  }}
                  placeholder="Select business type"
                >
                  {businessTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Template</FormLabel>
                <Select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  placeholder="Select template"
                  isDisabled={!businessType}
                >
                  {filteredTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
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
              isLoading={isLoading}
              loadingText="Creating..."
            >
              Create Website
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
} 