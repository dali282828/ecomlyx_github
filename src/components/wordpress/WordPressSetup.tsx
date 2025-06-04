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
  InputGroup,
  InputRightElement,
  IconButton,
  Collapse,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, InfoOutlineIcon } from '@chakra-ui/icons';

interface WebsiteAdminSetupProps {
  websiteId: string;
  businessName: string;
  businessType: string;
  adminEmail: string;
  onComplete: () => void;
}

function getPasswordStrength(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function WebsiteAdminSetup({ websiteId, businessName, businessType, adminEmail, onComplete }: WebsiteAdminSetupProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [installPlugins, setInstallPlugins] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const passwordStrength = getPasswordStrength(adminPassword);

  const handleSetup = async () => {
    setIsInstalling(true);
    setTimeout(() => {
      setSubdomain('your-site.ecomlyx.com');
      toast({ title: 'Website setup complete!', status: 'success', duration: 3000 });
      setIsInstalling(false);
      onComplete();
    }, 1200);
  };

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="xl" fontWeight="bold">Website Admin Setup</Text>
      <Box bg={useColorModeValue('gray.50', 'gray.700')} p={6} borderRadius="lg" boxShadow="md">
        <FormControl mb={4} isRequired>
          <FormLabel display="flex" alignItems="center" gap={2}>
            Admin Email <InfoOutlineIcon color="blue.400" title="This will be used to log in and receive notifications." />
          </FormLabel>
          <Input value={adminEmail} isReadOnly focusBorderColor="blue.400" />
        </FormControl>
        <FormControl mb={4} isRequired>
          <FormLabel display="flex" alignItems="center" gap={2}>
            Admin Password <InfoOutlineIcon color="blue.400" title="Choose a strong password for your admin account." />
          </FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter a strong password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              focusBorderColor="blue.400"
              minLength={8}
              required
              aria-label="Admin Password"
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                size="sm"
                variant="ghost"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              />
            </InputRightElement>
          </InputGroup>
          <Progress mt={2} value={passwordStrength * 25} size="xs" colorScheme={passwordStrength >= 3 ? 'green' : 'yellow'} borderRadius="md" />
          <Text color={passwordStrength >= 3 ? 'green.500' : 'orange.500'} fontSize="sm" mt={1}>
            {adminPassword.length === 0 ? 'Enter a password.' : passwordStrength === 4 ? 'Strong password!' : 'Use at least 8 characters, uppercase, number, and symbol.'}
          </Text>
        </FormControl>
        <Button
          variant="link"
          colorScheme="blue"
          mb={2}
          onClick={() => setShowAdvanced(v => !v)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </Button>
        <Collapse in={showAdvanced} animateOpacity>
          <FormControl mb={4}>
            <Checkbox
              isChecked={installPlugins}
              onChange={e => setInstallPlugins(e.target.checked)}
            >
              Install recommended plugins (SEO, security, forms)
            </Checkbox>
          </FormControl>
        </Collapse>
        <Button
          colorScheme="blue"
          onClick={handleSetup}
          isLoading={isInstalling}
          isDisabled={isInstalling || adminPassword.length < 8 || passwordStrength < 3}
          size="lg"
          w="full"
          mt={2}
        >
          {isInstalling ? 'Setting up...' : 'Finish Setup'}
        </Button>
      </Box>
      {subdomain && (
        <Alert status="success" mt={4} borderRadius="md">
          <AlertIcon />
          Your website is live at:{' '}
          <Link href={`https://${subdomain}`} color="blue.500" isExternal ml={1}>
            {subdomain}
          </Link>
        </Alert>
      )}
    </VStack>
  );
} 