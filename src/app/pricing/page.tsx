'use client';
import React, { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, SimpleGrid, Button, Badge, HStack, Icon,
  Table, Thead, Tr, Th, Tbody, Td, useColorModeValue, Tabs, TabList, TabPanels, Tab,
  TabPanel, Switch, FormControl, FormLabel, Tooltip, IconButton, Collapse, useDisclosure,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Image,
  Flex, Grid, GridItem, useBreakpointValue, ScaleFade, Fade, useToast
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaStar, FaCheck, FaTimes, FaQuestionCircle, FaCalculator,
  FaChartLine, FaRocket, FaShieldAlt, FaHeadset, FaGlobe,
  FaUtensils, FaShoppingCart, FaPalette, FaHotel, FaDumbbell,
  FaTooth, FaGraduationCap, FaBriefcase, FaComments
} from 'react-icons/fa';
import { PLANS } from '../../plans';
import { BUSINESS_TYPE_PRESETS } from '../../ai-presets';

const MotionBox = motion(Box);

// Business type icons mapping
const BUSINESS_ICONS = {
  restaurant: FaUtensils,
  ecommerce: FaShoppingCart,
  portfolio: FaPalette,
  hotel: FaHotel,
  fitness: FaDumbbell,
  dental: FaTooth,
  education: FaGraduationCap,
  consulting: FaBriefcase,
};

// Extended business types with descriptions
const BUSINESS_TYPES = {
  restaurant: {
    name: 'Restaurant',
    description: 'Perfect for restaurants, cafes, and food businesses',
    icon: FaUtensils,
    features: ['Online ordering', 'Table reservations', 'Menu management', 'Customer reviews'],
  },
  ecommerce: {
    name: 'E-commerce',
    description: 'Ideal for online stores and retail businesses',
    icon: FaShoppingCart,
    features: ['Product catalog', 'Secure checkout', 'Inventory management', 'Order tracking'],
  },
  portfolio: {
    name: 'Portfolio',
    description: 'Great for creatives and professionals',
    icon: FaPalette,
    features: ['Gallery showcase', 'Project portfolio', 'Client testimonials', 'Contact forms'],
  },
  hotel: {
    name: 'Hotel',
    description: 'Perfect for hotels and accommodations',
    icon: FaHotel,
    features: ['Room booking', 'Availability calendar', 'Guest reviews', 'Amenities showcase'],
  },
  fitness: {
    name: 'Fitness',
    description: 'Ideal for gyms and fitness centers',
    icon: FaDumbbell,
    features: ['Class scheduling', 'Member portal', 'Trainer profiles', 'Progress tracking'],
  },
};

const businessTypes = Object.keys(BUSINESS_TYPES);
const plansToShow = [PLANS.starter, PLANS.pro, PLANS.business];
const recommendedPlanId = 'pro';

const featureRows = [
  { 
    label: 'WordPress Sites',
    key: 'sites',
    tooltip: 'Number of WordPress websites you can create'
  },
  {
    label: 'Storage',
    key: 'storageLimitMB',
    format: (v: number) => `${v / 1024} GB`,
    tooltip: 'Total storage space for your websites'
  },
  {
    label: 'Traffic',
    key: 'trafficLimitGB',
    format: (v: number) => `${v} GB`,
    tooltip: 'Monthly bandwidth allocation'
  },
  {
    label: 'Users',
    key: 'users',
    tooltip: 'Number of team members who can access the dashboard'
  },
  {
    label: 'Support',
    key: 'features',
    format: (arr: string[]) => arr.find(f => f.toLowerCase().includes('support')) || '-',
    tooltip: 'Level of customer support provided'
  },
];

const faqs = [
  {
    question: 'Can I upgrade or downgrade my plan later?',
    answer: 'Yes, you can change your plan at any time. When upgrading, you\'ll be prorated for the remainder of your billing cycle. When downgrading, the new rate will apply at the start of your next billing cycle.'
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer: 'We\'ll notify you before you reach your limits. You can either upgrade your plan or purchase additional resources as needed.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 14-day money-back guarantee for all plans. No questions asked.'
  },
  {
    question: 'Can I get a custom plan for my business?',
    answer: 'Absolutely! Contact our sales team for custom enterprise solutions tailored to your specific needs.'
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardSelected = useColorModeValue('blue.50', 'blue.900');
  const cardShadow = useColorModeValue('lg', 'dark-lg');
  const gradient = useColorModeValue(
    'linear(to-br, blue.50, white 60%, purple.50)',
    'linear(to-br, blue.900, gray.800 60%, purple.900)'
  );

  const handlePlanSelect = (planId: string, businessType: string) => {
    toast({
      title: 'Plan Selected',
      description: `You've selected the ${planId} plan for ${businessType}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    // Navigate to registration with plan pre-selected
    window.location.href = `/register?plan=${planId}&type=${businessType}`;
  };

  const calculatePrice = (price: number) => {
    if (isAnnual) {
      return (price * 10).toFixed(2); // 2 months free for annual
    }
    return price.toFixed(2);
  };

  return (
    <Box minH="100vh" bgGradient={gradient} py={12}>
      <Container maxW="container.xl">
        {/* Header Section */}
        <VStack spacing={8} align="center" mb={12}>
          <Heading
            size="2xl"
            fontWeight="extrabold"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            Choose Your Perfect Plan
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl" textAlign="center">
            Select the plan that best fits your business needs. All plans include secure WordPress hosting,
            premium support, and instant setup.
          </Text>

          {/* Billing Toggle */}
          <HStack spacing={4} mt={4}>
            <Text>Monthly</Text>
            <Switch
              colorScheme="blue"
              isChecked={isAnnual}
              onChange={() => setIsAnnual(!isAnnual)}
            />
            <HStack>
              <Text>Annual</Text>
              <Badge colorScheme="green">Save 20%</Badge>
            </HStack>
          </HStack>
        </VStack>

        {/* Business Type Tabs */}
        <Tabs variant="soft-rounded" colorScheme="blue" align="center" isFitted>
          <TabList mb={8} overflowX="auto" py={2}>
            {businessTypes.map((type) => (
              <Tab
                key={type}
                fontWeight="bold"
                fontSize="lg"
                textTransform="capitalize"
                _selected={{ color: 'white', bg: 'blue.500' }}
              >
                <HStack spacing={2}>
                  <Icon as={BUSINESS_TYPES[type].icon} />
                  <Text>{BUSINESS_TYPES[type].name}</Text>
                </HStack>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {businessTypes.map((type) => (
              <TabPanel key={type} px={0}>
                {/* Business Type Description */}
                <VStack spacing={4} mb={8} align="center">
                  <Heading size="md" color="blue.500">
                    {BUSINESS_TYPES[type].name} Solutions
                  </Heading>
                  <Text color="gray.600" textAlign="center" maxW="2xl">
                    {BUSINESS_TYPES[type].description}
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full" maxW="2xl">
                    {BUSINESS_TYPES[type].features.map((feature) => (
                      <HStack key={feature} spacing={2}>
                        <Icon as={FaCheck} color="green.500" />
                        <Text>{feature}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </VStack>

                {/* Plan Cards */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full" mb={12}>
                  {plansToShow.map((plan) => (
                    <MotionBox
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Box
                        bg={plan.id === recommendedPlanId ? cardSelected : cardBg}
                        borderWidth={2}
                        borderColor={plan.id === recommendedPlanId ? 'blue.400' : 'gray.200'}
                        borderRadius="2xl"
                        p={8}
                        boxShadow={cardShadow}
                        position="relative"
                        textAlign="left"
                        transition="all 0.3s"
                        _hover={{
                          transform: 'translateY(-4px)',
                          boxShadow: 'xl',
                        }}
                      >
                        {/* Plan Badges */}
                        {plan.id === recommendedPlanId && (
                          <Badge
                            colorScheme="blue"
                            position="absolute"
                            top={4}
                            right={4}
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            <HStack spacing={1}>
                              <Icon as={FaStar} />
                              <Text>Most Popular</Text>
                            </HStack>
                          </Badge>
                        )}
                        {plan.id === 'business' && (
                          <Badge
                            colorScheme="purple"
                            position="absolute"
                            top={4}
                            left={4}
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            <HStack spacing={1}>
                              <Icon as={FaRocket} />
                              <Text>Best Value</Text>
                            </HStack>
                          </Badge>
                        )}

                        {/* Plan Content */}
                        <VStack spacing={4} align="start">
                          <Heading size="md">{plan.name}</Heading>
                          <HStack spacing={1}>
                            <Text fontWeight="bold" fontSize="3xl">
                              ${calculatePrice(plan.price)}
                            </Text>
                            <Text color="gray.500">/mo</Text>
                            {isAnnual && (
                              <Badge colorScheme="green" ml={2}>
                                Save 20%
                              </Badge>
                            )}
                          </HStack>

                          {/* Plan Features */}
                          <VStack align="start" spacing={2} w="full">
                            {plan.features.map((feature) => (
                              <HStack key={feature} spacing={2}>
                                <Icon as={FaCheck} color="green.500" />
                                <Text fontSize="sm">{feature}</Text>
                              </HStack>
                            ))}
                          </VStack>

                          {/* Business-specific features */}
                          <Box
                            mt={4}
                            p={3}
                            bg="blue.50"
                            borderRadius="md"
                            w="full"
                          >
                            <Text fontSize="sm" color="blue.600" fontWeight="medium">
                              Includes for {BUSINESS_TYPES[type].name}:
                            </Text>
                            <SimpleGrid columns={1} spacing={1} mt={2}>
                              {BUSINESS_TYPES[type].features.map((feature) => (
                                <HStack key={feature} spacing={2}>
                                  <Icon as={FaCheck} color="blue.500" boxSize={3} />
                                  <Text fontSize="xs">{feature}</Text>
                                </HStack>
                              ))}
                            </SimpleGrid>
                          </Box>

                          {/* Action Button */}
                          <Button
                            colorScheme="blue"
                            w="full"
                            size="lg"
                            onClick={() => handlePlanSelect(plan.id, type)}
                            leftIcon={<Icon as={FaRocket} />}
                            mt={4}
                          >
                            {plan.id === recommendedPlanId ? 'Get Started' : `Choose ${plan.name}`}
                          </Button>
                        </VStack>
                      </Box>
                    </MotionBox>
                  ))}
                </SimpleGrid>

                {/* Feature Comparison Table */}
                <Box
                  w="full"
                  mt={8}
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow={cardShadow}
                  overflow="hidden"
                >
                  <Box p={6}>
                    <Heading size="md" mb={4}>
                      Compare Plans
                    </Heading>
                    <Table variant="simple" size="md">
                      <Thead>
                        <Tr>
                          <Th>Feature</Th>
                          {plansToShow.map((plan) => (
                            <Th key={plan.id} textAlign="center">
                              {plan.name}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {featureRows.map((row) => (
                          <Tr key={row.key}>
                            <Td>
                              <HStack spacing={2}>
                                <Text>{row.label}</Text>
                                <Tooltip label={row.tooltip}>
                                  <Icon as={FaQuestionCircle} color="gray.400" />
                                </Tooltip>
                              </HStack>
                            </Td>
                            {plansToShow.map((plan) => (
                              <Td key={plan.id} textAlign="center">
                                {row.format
                                  ? row.format(plan[row.key])
                                  : plan[row.key] || '-'}
                              </Td>
                            ))}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* FAQ Section */}
        <Box mt={16} mb={8}>
          <Heading size="lg" textAlign="center" mb={8}>
            Frequently Asked Questions
          </Heading>
          <Accordion allowMultiple>
            {faqs.map((faq, index) => (
              <AccordionItem key={index}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="medium">
                      {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text color="gray.600">{faq.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>

        {/* Trust Badges */}
        <SimpleGrid
          columns={{ base: 2, md: 4 }}
          spacing={8}
          mt={16}
          mb={8}
          textAlign="center"
        >
          <VStack>
            <Icon as={FaShieldAlt} boxSize={8} color="blue.500" />
            <Text fontWeight="medium">Secure Hosting</Text>
          </VStack>
          <VStack>
            <Icon as={FaHeadset} boxSize={8} color="blue.500" />
            <Text fontWeight="medium">24/7 Support</Text>
          </VStack>
          <VStack>
            <Icon as={FaChartLine} boxSize={8} color="blue.500" />
            <Text fontWeight="medium">99.9% Uptime</Text>
          </VStack>
          <VStack>
            <Icon as={FaGlobe} boxSize={8} color="blue.500" />
            <Text fontWeight="medium">Global CDN</Text>
          </VStack>
        </SimpleGrid>

        {/* Live Chat Support */}
        <Box
          position="fixed"
          bottom={4}
          right={4}
          zIndex={1000}
        >
          <IconButton
            aria-label="Chat with us"
            icon={<FaComments />}
            colorScheme="blue"
            size="lg"
            isRound
            onClick={() => window.location.href = '/support'}
            boxShadow="lg"
          />
        </Box>
      </Container>
    </Box>
  );
} 