import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Progress,
  Badge,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FaRocket, FaCheck, FaTimes, FaSpinner, FaGlobe } from 'react-icons/fa';
import { Website, Domain } from '@prisma/client';

interface WebsiteLauncherProps {
  website: Website & { domain: Domain | null };
  onLaunchComplete: (website: Website) => void;
}

export function WebsiteLauncher({ website, onLaunchComplete }: WebsiteLauncherProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchStatus, setLaunchStatus] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPolling) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/websites/${website.id}/launch`);
          const data = await response.json();

          if (response.ok) {
            setLaunchStatus(data);
            if (data.status === 'PUBLISHED') {
              setIsPolling(false);
              onLaunchComplete(website);
              toast({
                title: 'Website Launched!',
                description: 'Your website is now live and accessible.',
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
            }
          }
        } catch (error) {
          console.error('Error checking launch status:', error);
        }
      }, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPolling, website.id, onLaunchComplete, toast]);

  const handleLaunch = async () => {
    if (!website.domain) {
      toast({
        title: 'Domain Required',
        description: 'Please add a domain before launching your website.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (website.domain.status !== 'ACTIVE') {
      toast({
        title: 'Domain Not Ready',
        description: 'Please wait for your domain to be activated.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLaunching(true);

    try {
      const response = await fetch(`/api/websites/${website.id}/launch`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setLaunchStatus(data);
        setIsPolling(true);
        toast({
          title: 'Launch Initiated',
          description: 'Your website is being deployed. This may take a few minutes.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error || 'Failed to launch website');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to launch website',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'green';
      case 'DRAFT':
        return 'yellow';
      case 'ARCHIVED':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return FaCheck;
      case 'DRAFT':
        return FaSpinner;
      case 'ARCHIVED':
        return FaTimes;
      default:
        return FaGlobe;
    }
  };

  if (website.status === 'PUBLISHED') {
    return (
      <Alert status="success" borderRadius="md">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Website is Live!</AlertTitle>
          <AlertDescription>
            Your website is published and accessible at{' '}
            <Text as="span" fontWeight="bold">
              https://{website.domain?.name}
            </Text>
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {launchStatus && (
        <Box p={4} borderWidth="1px" borderRadius="lg">
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text fontWeight="medium">Deployment Status</Text>
              <Badge colorScheme={getStatusColor(launchStatus.status)}>
                <HStack spacing={1}>
                  <Icon as={getStatusIcon(launchStatus.status)} />
                  <Text>{launchStatus.status}</Text>
                </HStack>
              </Badge>
            </HStack>

            {isPolling && (
              <>
                <Text fontSize="sm" color="gray.600">
                  Deploying your website...
                </Text>
                <Progress size="sm" isIndeterminate colorScheme="blue" />
              </>
            )}

            {launchStatus.deployment && (
              <Box fontSize="sm" color="gray.600">
                <Text>Version: {launchStatus.deployment.version}</Text>
                <Text>
                  Deployed:{' '}
                  {new Date(launchStatus.deployment.timestamp).toLocaleString()}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )}

      <Button
        leftIcon={<FaRocket />}
        colorScheme="blue"
        size="lg"
        onClick={handleLaunch}
        isLoading={isLaunching || isPolling}
        isDisabled={!website.domain || website.domain.status !== 'ACTIVE'}
      >
        {isLaunching || isPolling ? 'Launching...' : 'Launch Website'}
      </Button>

      {website.domain && website.domain.status === 'ACTIVE' && (
        <Text fontSize="sm" color="gray.600" textAlign="center">
          Your website will be accessible at{' '}
          <Text as="span" fontWeight="bold">
            https://{website.domain.name}
          </Text>
        </Text>
      )}
    </VStack>
  );
} 