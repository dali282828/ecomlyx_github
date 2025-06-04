'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Text,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Badge,
  Image,
  Grid,
  GridItem,
  Icon,
  Tooltip,
  Flex,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaWordpress, FaPalette, FaPlug, FaCog, FaCheck, FaGlobe, FaLock, FaBolt, FaSearch, FaUsers, FaFlagCheckered } from 'react-icons/fa';
import { IconType } from 'react-icons';
import PlanSelector from './PlanSelector';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const steps = [
  { title: 'Basic Info', description: 'Website details', icon: FaGlobe },
  { title: 'Theme', description: 'Choose your design', icon: FaPalette },
  { title: 'Plugins', description: 'Add functionality', icon: FaPlug },
  { title: 'Plan', description: 'Choose your plan', icon: FaFlagCheckered },
  { title: 'Configuration', description: 'Final settings', icon: FaCog },
];

interface Theme {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  features: string[];
}

interface WordPressWizardProps {
  websiteId: string;
  businessType: string;
  onComplete?: () => void;
}

export function WordPressWizard({
  websiteId,
  businessType,
  onComplete,
}: WordPressWizardProps) {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [formData, setFormData] = useState({
    siteName: '',
    adminEmail: '',
    theme: '',
    plugins: [] as string[],
    plan: '',
    settings: {
      permalinks: '/%postname%/',
      timezone: 'UTC',
      language: 'en_US',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');

  const themes: Record<string, Theme[]> = {
    hotel: [
      { 
        id: 'astra',
        name: 'Astra',
        description: 'Modern and flexible theme perfect for hotels',
        image: 'https://ps.w.org/astra-sites/assets/screenshot-1.jpg',
        features: ['Responsive Design', 'Booking Integration', 'Gallery Support']
      },
      {
        id: 'hotel-booking',
        name: 'Hotel Booking',
        description: 'Specialized theme for hotel and resort websites',
        image: 'https://themesinfo.com/wp-content/uploads/2023/07/Hotel-Booking-Theme.png',
        features: ['Room Showcase', 'Availability Calendar', 'Price Tables']
      },
    ],
    restaurant: [
      {
        id: 'restaurant-and-cafe',
        name: 'Restaurant & Cafe',
        description: 'Elegant design for restaurants',
        image: 'https://ps.w.org/restaurant-and-cafe/assets/screenshot-1.jpg',
        features: ['Menu Display', 'Reservation System', 'Food Gallery']
      },
      {
        id: 'food-business',
        name: 'Food Business',
        description: 'Modern restaurant theme with advanced features',
        image: 'https://themesinfo.com/wp-content/uploads/2023/07/Food-Business-Theme.png',
        features: ['Online Ordering', 'Special Events', 'Chef Profiles']
      },
    ],
    fitness: [
      {
        id: 'fitness-hub',
        name: 'Fitness Hub',
        description: 'Dynamic and energetic theme for fitness centers',
        image: 'https://ps.w.org/fitness-hub/assets/screenshot-1.jpg',
        features: ['Class Schedule', 'Trainer Profiles', 'Membership Plans']
      },
      {
        id: 'gym-master',
        name: 'Gym Master',
        description: 'Professional fitness theme with modern design',
        image: 'https://themesinfo.com/wp-content/uploads/2023/07/Gym-Master-Theme.png',
        features: ['Workout Tracking', 'Nutrition Plans', 'Progress Photos']
      },
    ],
    default: [
      {
        id: 'twentytwentyfour',
        name: 'Twenty Twenty-Four',
        description: 'Latest WordPress theme with modern features',
        image: 'https://i0.wp.com/themes.svn.wordpress.org/twentytwentyfour/1.0/screenshot.png',
        features: ['Block Editor', 'Responsive Layout', 'Custom Colors']
      },
      {
        id: 'astra',
        name: 'Astra',
        description: 'Versatile and fast-loading theme',
        image: 'https://ps.w.org/astra-sites/assets/screenshot-1.jpg',
        features: ['Performance Optimized', 'Customizable', 'SEO Friendly']
      },
    ],
  };

  const plugins: Record<string, Plugin[]> = {
    common: [
      {
        id: 'wordpress-seo',
        name: 'Yoast SEO',
        description: 'Complete SEO solution for your WordPress site',
        icon: FaSearch,
        features: ['SEO Analysis', 'XML Sitemaps', 'Meta Tags']
      },
      {
        id: 'wordfence',
        name: 'Wordfence Security',
        description: 'Advanced security suite for WordPress',
        icon: FaLock,
        features: ['Firewall', 'Malware Scanner', 'Login Security']
      },
      {
        id: 'w3-total-cache',
        name: 'W3 Total Cache',
        description: 'Performance optimization plugin',
        icon: FaBolt,
        features: ['Page Caching', 'Browser Cache', 'Minification']
      },
    ],
    hotel: [
      {
        id: 'hotel-booking',
        name: 'Hotel Booking',
        description: 'Complete hotel reservation system',
        icon: FaUsers,
        features: ['Room Management', 'Online Booking', 'Payment Gateway']
      },
    ],
    restaurant: [
      { id: 'restaurant-reservations', name: 'Restaurant Reservations', description: 'Table bookings' },
      { id: 'food-menu-pro', name: 'Food Menu Pro', description: 'Menu management' },
    ],
    fitness: [
      { id: 'gym-management', name: 'Gym Management', description: 'Member management' },
      { id: 'class-booking', name: 'Class Booking', description: 'Class scheduling' },
    ],
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/websites/${websiteId}/wordpress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteName: formData.siteName,
          adminEmail: formData.adminEmail,
          theme: formData.theme,
          plugins: formData.plugins,
          settings: formData.settings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create WordPress site');
      }

      toast({
        title: 'Success',
        description: 'WordPress installation has started',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onComplete?.();
    } catch (error) {
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

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            direction="column"
            gap={6}
          >
            <Card bg={cardBg} borderColor={borderColor} shadow="md">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontSize="lg">Site Name</FormLabel>
                    <Input
                      size="lg"
                      value={formData.siteName}
                      onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                      placeholder="Enter your site name"
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="lg">Admin Email</FormLabel>
                    <Input
                      size="lg"
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      placeholder="Enter admin email"
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </MotionFlex>
        );

      case 1:
        return (
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            direction="column"
            gap={6}
          >
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
              {(themes[businessType as keyof typeof themes] || themes.default).map((theme) => (
                <GridItem key={theme.id}>
                  <Card
                    bg={formData.theme === theme.id ? selectedBg : cardBg}
                    borderColor={borderColor}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                    onClick={() => setFormData({ ...formData, theme: theme.id })}
                    overflow="hidden"
                  >
                    <Image
                      src={theme.image}
                      alt={theme.name}
                      height="200px"
                      objectFit="cover"
                    />
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Flex justify="space-between" width="100%" align="center">
                          <Heading size="md">{theme.name}</Heading>
                          {formData.theme === theme.id && (
                            <Icon as={FaCheck} color="green.500" boxSize={5} />
                          )}
                        </Flex>
                        <Text color="gray.500">{theme.description}</Text>
                        <Divider />
                        <VStack align="start" spacing={2} width="100%">
                          {theme.features.map((feature, index) => (
                            <HStack key={index}>
                              <Icon as={FaCheck} color="green.500" />
                              <Text>{feature}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </MotionFlex>
        );

      case 2:
        const availablePlugins = [
          ...plugins.common,
          ...(plugins[businessType as keyof typeof plugins] || []),
        ];

        return (
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            direction="column"
            gap={6}
          >
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
              {availablePlugins.map((plugin) => (
                <GridItem key={plugin.id}>
                  <Card
                    bg={formData.plugins.includes(plugin.id) ? selectedBg : cardBg}
                    borderColor={borderColor}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                    onClick={() => {
                      const newPlugins = formData.plugins.includes(plugin.id)
                        ? formData.plugins.filter((p) => p !== plugin.id)
                        : [...formData.plugins, plugin.id];
                      setFormData({ ...formData, plugins: newPlugins });
                    }}
                  >
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Flex justify="space-between" width="100%" align="center">
                          <HStack>
                            <Icon as={plugin.icon} boxSize={6} color="blue.500" />
                            <Heading size="md">{plugin.name}</Heading>
                          </HStack>
                          {formData.plugins.includes(plugin.id) && (
                            <Icon as={FaCheck} color="green.500" boxSize={5} />
                          )}
                        </Flex>
                        <Text color="gray.500">{plugin.description}</Text>
                        <Divider />
                        <VStack align="start" spacing={2} width="100%">
                          {plugin.features.map((feature, index) => (
                            <HStack key={index}>
                              <Icon as={FaCheck} color="green.500" />
                              <Text>{feature}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </MotionFlex>
        );

      case 3:
        return (
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            direction="column"
            gap={6}
          >
            <PlanSelector
              businessType={businessType}
              onSelect={(planId) => setFormData({ ...formData, plan: planId })}
            />
            {formData.plan && (
              <Text mt={2} color="green.500" fontWeight="bold">
                Selected plan: {formData.plan}
              </Text>
            )}
          </MotionFlex>
        );

      case 4:
        return (
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            direction="column"
            gap={6}
          >
            <Card bg={cardBg} borderColor={borderColor} shadow="md">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="lg">Permalink Structure</FormLabel>
                    <Select
                      size="lg"
                      value={formData.settings.permalinks}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: { ...formData.settings, permalinks: e.target.value },
                        })
                      }
                    >
                      <option value="/%postname%/">Post name</option>
                      <option value="/%year%/%monthnum%/%postname%/">Date and name</option>
                      <option value="/%category%/%postname%/">Category and name</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="lg">Timezone</FormLabel>
                    <Select
                      size="lg"
                      value={formData.settings.timezone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: { ...formData.settings, timezone: e.target.value },
                        })
                      }
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="lg">Language</FormLabel>
                    <Select
                      size="lg"
                      value={formData.settings.language}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: { ...formData.settings, language: e.target.value },
                        })
                      }
                    >
                      <option value="en_US">English (United States)</option>
                      <option value="en_GB">English (United Kingdom)</option>
                      <option value="es_ES">Spanish (Spain)</option>
                      <option value="fr_FR">French (France)</option>
                      <option value="de_DE">German</option>
                    </Select>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </MotionFlex>
        );

      default:
        return null;
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card bg={cardBg} borderColor={borderColor} shadow="lg">
        <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
          <HStack spacing={4}>
            <Icon as={FaWordpress} boxSize={6} color="blue.500" />
            <Heading size="lg">WordPress Setup Wizard</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={8}>
            <Stepper index={activeStep} width="100%" colorScheme="blue">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<Icon as={step.icon} />}
                      incomplete={<Icon as={step.icon} />}
                      active={<Icon as={step.icon} />}
                    />
                  </StepIndicator>
                  <Box flexShrink={0}>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>

            <Box width="100%" py={4}>
              {renderStep()}
            </Box>

            <HStack width="100%" justify="space-between" pt={4}>
              <Button
                leftIcon={<Icon as={FaWordpress} />}
                onClick={handleBack}
                isDisabled={activeStep === 0}
                variant="ghost"
                size="lg"
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  rightIcon={<Icon as={FaCheck} />}
                  colorScheme="blue"
                  onClick={handleComplete}
                  isLoading={isLoading}
                  loadingText="Creating..."
                  isDisabled={!formData.siteName || !formData.adminEmail}
                  size="lg"
                >
                  Create WordPress Site
                </Button>
              ) : (
                <Button
                  rightIcon={<Icon as={steps[activeStep + 1].icon} />}
                  onClick={handleNext}
                  colorScheme="blue"
                  isDisabled={
                    (activeStep === 0 && (!formData.siteName || !formData.adminEmail)) ||
                    (activeStep === 1 && !formData.theme)
                  }
                  size="lg"
                >
                  Next: {steps[activeStep + 1].title}
                </Button>
              )}
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </MotionBox>
  );
} 