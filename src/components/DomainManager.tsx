import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Badge,
  HStack,
  Icon,
  Progress,
} from '@chakra-ui/react';
import { FaGlobe, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { Domain, Website } from '@prisma/client';

interface DomainManagerProps {
  website: Website & { domain: Domain | null };
  onDomainUpdate: (domain: Domain) => void;
}

export function DomainManager({ website, onDomainUpdate }: DomainManagerProps) {
  const [domainName, setDomainName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    // Poll for domain status updates
    if (website.domain?.status === 'PENDING') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/domains?websiteId=${website.id}`);
          const data = await response.json();
          if (data.status !== 'PENDING') {
            onDomainUpdate(data);
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking domain status:', error);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [website.domain?.status, website.id, onDomainUpdate]);

  const checkDomainAvailability = async () => {
    if (!domainName) return;

    setIsChecking(true);
    setIsAvailable(null);

    try {
      const response = await fetch(`/api/domains?name=${domainName}`);
      const data = await response.json();

      if (response.ok) {
        setIsAvailable(data.available);
        if (!data.available) {
          toast({
            title: 'Domain Unavailable',
            description: 'This domain name is already taken.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        throw new Error(data.error || 'Failed to check domain availability');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check domain availability',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleRegisterDomain = async () => {
    if (!domainName || !isAvailable) return;

    setIsRegistering(true);

    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteId: website.id,
          domainName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onDomainUpdate(data);
        toast({
          title: 'Success',
          description: 'Domain registration initiated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error(data.error || 'Failed to register domain');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to register domain',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'PENDING':
        return 'yellow';
      case 'EXPIRED':
        return 'red';
      case 'FAILED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return FaCheck;
      case 'PENDING':
        return FaSpinner;
      case 'EXPIRED':
      case 'FAILED':
        return FaTimes;
      default:
        return FaGlobe;
    }
  };

  return (
    <Box>
      {website.domain ? (
        <VStack align="stretch" spacing={4}>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <HStack justify="space-between">
              <HStack>
                <Icon as={FaGlobe} color="blue.500" />
                <Text fontWeight="medium">{website.domain.name}</Text>
              </HStack>
              <Badge colorScheme={getStatusColor(website.domain.status)}>
                <HStack spacing={1}>
                  <Icon as={getStatusIcon(website.domain.status)} />
                  <Text>{website.domain.status}</Text>
                </HStack>
              </Badge>
            </HStack>

            {website.domain.status === 'PENDING' && (
              <Box mt={4}>
                <Text mb={2}>Setting up your domain...</Text>
                <Progress size="sm" isIndeterminate colorScheme="blue" />
              </Box>
            )}

            {website.domain.sslEnabled && (
              <Badge colorScheme="green" mt={2}>
                SSL Enabled
              </Badge>
            )}
          </Box>
        </VStack>
      ) : (
        <Button
          leftIcon={<FaGlobe />}
          colorScheme="blue"
          onClick={onOpen}
          isDisabled={isRegistering}
        >
          Add Domain
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register Domain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Domain Name</FormLabel>
                <Input
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="example.com"
                  isDisabled={isChecking || isRegistering}
                />
              </FormControl>

              {isAvailable !== null && (
                <Text
                  color={isAvailable ? 'green.500' : 'red.500'}
                  fontWeight="medium"
                >
                  {isAvailable
                    ? 'Domain is available!'
                    : 'Domain is not available'}
                </Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            {!isAvailable && (
              <Button
                colorScheme="blue"
                mr={3}
                onClick={checkDomainAvailability}
                isLoading={isChecking}
              >
                Check Availability
              </Button>
            )}
            <Button
              colorScheme="blue"
              onClick={handleRegisterDomain}
              isLoading={isRegistering}
              isDisabled={!isAvailable || isChecking}
            >
              Register Domain
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 