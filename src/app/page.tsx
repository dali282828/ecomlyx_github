'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  Icon,
  Image,
  useColorModeValue,
  Flex,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { 
  FaHotel, 
  FaUtensils, 
  FaShoppingCart, 
  FaBuilding,
  FaHome,
  FaGraduationCap,
  FaHeartbeat,
  FaDumbbell,
  FaCut,
  FaCar,
  FaBalanceScale,
  FaRocket,
  FaShieldAlt,
  FaChartLine,
  FaMobileAlt,
  FaArrowRight,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Testimonials from '@/components/home/Testimonials';
import HowItWorks from '@/components/home/HowItWorks';
import TrustBadges from '@/components/TrustBadges';
import HelpButton from '@/components/HelpButton';
import SectionDivider from '@/components/SectionDivider';

const businessTypes = [
  {
    title: 'Hotel',
    icon: FaHotel,
    description: 'Complete hotel management system with booking, room management, and guest services.',
    features: ['Booking System', 'Room Management', 'Guest Reviews', 'Payment Processing']
  },
  {
    title: 'Restaurant',
    icon: FaUtensils,
    description: 'Restaurant website with online reservations, menu management, and ordering system.',
    features: ['Online Reservations', 'Menu Management', 'Table Booking', 'Online Ordering']
  },
  {
    title: 'E-commerce',
    icon: FaShoppingCart,
    description: 'Full-featured online store with product management and secure checkout.',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Tracking']
  },
  {
    title: 'Real Estate',
    icon: FaHome,
    description: 'Professional real estate platform with property listings and agent management.',
    features: ['Property Listings', 'Virtual Tours', 'Agent Profiles', 'Lead Management']
  },
  {
    title: 'Education',
    icon: FaGraduationCap,
    description: 'Complete educational platform with course management and student tracking.',
    features: ['Course Management', 'Student Portal', 'Assignment System', 'Progress Tracking']
  },
  {
    title: 'Healthcare',
    icon: FaHeartbeat,
    description: 'Medical practice website with appointment booking and patient portal.',
    features: ['Appointment Booking', 'Patient Portal', 'Medical Records', 'Online Consultations']
  },
  {
    title: 'Fitness',
    icon: FaDumbbell,
    description: 'Fitness center website with class booking and member management.',
    features: ['Class Booking', 'Member Portal', 'Workout Plans', 'Progress Tracking']
  },
  {
    title: 'Salon & Spa',
    icon: FaCut,
    description: 'Beauty salon and spa website with appointment booking and service showcase.',
    features: ['Appointment Booking', 'Service Menu', 'Stylist Profiles', 'Gift Cards']
  },
  {
    title: 'Automotive',
    icon: FaCar,
    description: 'Car dealership and auto service website with inventory management.',
    features: ['Vehicle Inventory', 'Service Booking', 'Parts Catalog', 'Test Drive Requests']
  },
  {
    title: 'Legal',
    icon: FaBalanceScale,
    description: 'Law firm website with case management and client portal.',
    features: ['Case Management', 'Client Portal', 'Attorney Profiles', 'Document Library']
  },
  {
    title: 'Business',
    icon: FaBuilding,
    description: 'Professional business website with modern design and essential features.',
    features: ['Contact Forms', 'Service Showcase', 'Blog System', 'SEO Tools']
  }
];

const features = [
  {
    title: 'Lightning Fast',
    icon: FaRocket,
    description: 'Built with performance in mind, ensuring your website loads quickly and efficiently.',
  },
  {
    title: 'Secure & Reliable',
    icon: FaShieldAlt,
    description: 'Enterprise-grade security to protect your business and customer data.',
  },
  {
    title: 'Mobile First',
    icon: FaMobileAlt,
    description: 'Perfectly optimized for all devices, from mobile phones to desktop computers.',
  },
  {
    title: 'Analytics Ready',
    icon: FaChartLine,
    description: 'Built-in analytics to track your website performance and visitor behavior.',
  },
];

export default function Home() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.600)'
  );
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  const handleGetStarted = () => {
    router.push('/create');
  };

  const handleSelectTemplate = (type: any) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const onScroll = () => {
      setShowStickyCTA(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box>
      <Header />
      {/* Animated Hero Section */}
      <Box
        as={motion.div}
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: '100% 50%' }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        bgGradient={bgGradient}
        color="white"
        pt={32}
        pb={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="center" textAlign="center" position="relative" zIndex={1}>
            <Badge
              px={3}
              py={1}
              bg="whiteAlpha.200"
              borderRadius="full"
              fontSize="sm"
              mb={4}
            >
              New Features Available
            </Badge>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Heading
                as="h1"
                size="2xl"
                bgGradient="linear(to-r, white, blue.100)"
                bgClip="text"
                fontWeight="extrabold"
                mb={2}
              >
                Create Your Business Website in Minutes
              </Heading>
            </motion.div>
            <Text fontSize="xl" maxW="container.md" opacity={0.9}>
              Choose your business type and get a fully functional website with all the features you need.
              No coding required.
            </Text>
            <HStack spacing={4} justify="center">
              <Button
                as={motion.button}
                size="lg"
                colorScheme="brand"
                px={8}
                rightIcon={<FaArrowRight />}
                fontWeight="bold"
                fontSize="xl"
                onClick={handleGetStarted}
                _hover={{
                  transform: 'translateY(-2px) scale(1.05)',
                  boxShadow: '2xl',
                }}
                transition="all 0.2s"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
              >
                Get Started
              </Button>
            </HStack>
            {/* Sticky CTA for desktop */}
            {showStickyCTA && (
              <Box
                position="fixed"
                bottom={8}
                left="50%"
                transform="translateX(-50%)"
                zIndex={1200}
                display={{ base: 'none', md: 'block' }}
              >
                <Button
                  as={motion.button}
                  size="lg"
                  colorScheme="brand"
                  px={8}
                  rightIcon={<FaArrowRight />}
                  fontWeight="bold"
                  fontSize="xl"
                  onClick={handleGetStarted}
                  boxShadow="2xl"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>
      {/* Trust Badges Section */}
      <SectionDivider color="#f7fafc" />
      <TrustBadges />
      <SectionDivider color="#f7fafc" flip />
      {/* AI vs Classic Mode Section */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        py={16}
        bg={useColorModeValue('gray.100', 'gray.800')}
      >
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Heading as="h2" size="lg" textAlign="center">
              Choose How You Want to Build Your Website
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Box
                p={8}
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="xl"
                boxShadow="lg"
                borderWidth={2}
                borderColor="blue.400"
                position="relative"
                _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)', transition: 'all 0.2s' }}
              >
                <Badge colorScheme="blue" position="absolute" top={4} right={4} px={3} py={1} borderRadius="full">
                  Recommended
                </Badge>
                <VStack spacing={4} align="center">
                  <Icon as={FaRocket} w={12} h={12} color="blue.500" />
                  <Heading as="h3" size="md">AI Mode</Heading>
                  <Text color="gray.600" textAlign="center">
                    Let our AI generate your site's content and structure. Just answer a few questions and get a ready-to-go website in seconds!
                  </Text>
                  <Button colorScheme="blue" size="lg" onClick={() => router.push('/create?mode=ai')}>
                    Start with AI
                  </Button>
                </VStack>
              </Box>
              <Box
                p={8}
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="xl"
                boxShadow="lg"
                borderWidth={2}
                borderColor="gray.300"
                _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)', transition: 'all 0.2s' }}
              >
                <VStack spacing={4} align="center">
                  <Icon as={FaBuilding} w={12} h={12} color="gray.500" />
                  <Heading as="h3" size="md">Classic Mode</Heading>
                  <Text color="gray.600" textAlign="center">
                    Prefer to do it yourself? Build your site manually with full control over every detail. Perfect for those who want a hands-on approach.
                  </Text>
                  <Button colorScheme="gray" size="lg" onClick={() => router.push('/create?mode=classic')}>
                    Start Manually
                  </Button>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      <SectionDivider color="#f7fafc" />
      {/* Stats Section */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        py={20}
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Stat>
              <StatLabel fontSize="lg">Active Users</StatLabel>
              <StatNumber>10,000+</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel fontSize="lg">Websites Created</StatLabel>
              <StatNumber>5,000+</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                15.05%
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel fontSize="lg">Customer Satisfaction</StatLabel>
              <StatNumber>98%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5.01%
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        </Container>
      </Box>
      <SectionDivider color="#fff" flip />
      {/* Features Section */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        py={20}
      >
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Why Choose Ecomlyx?
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="container.md">
                We provide everything you need to create a professional website for your business
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature) => (
                <Box
                  key={feature.title}
                  p={6}
                  bg={useColorModeValue('white', 'gray.800')}
                  borderRadius="lg"
                  boxShadow="md"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                    transition: 'all 0.2s',
                  }}
                >
                  <VStack spacing={4} align="start">
                    <Icon as={feature.icon} w={10} h={10} color="blue.500" />
                    <Heading as="h3" size="md">
                      {feature.title}
                    </Heading>
                    <Text color="gray.600">{feature.description}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      <SectionDivider color="#f7fafc" />
      {/* Business Types Section */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        py={20}
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Choose Your Business Type
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="container.md">
                Select from our pre-built templates designed for your specific industry
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {businessTypes.map((type, idx) => (
                <motion.div
                  key={type.title}
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <Box
                    bg={useColorModeValue('white', 'gray.800')}
                    borderRadius="xl"
                    boxShadow="lg"
                    p={8}
                    cursor="pointer"
                    borderWidth={selectedType?.title === type.title ? '2px' : '1px'}
                    borderColor={selectedType?.title === type.title ? 'brand.500' : 'gray.200'}
                    onClick={() => handleSelectTemplate(type)}
                    transition="all 0.2s"
                    minH="280px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <HStack spacing={4} mb={4}>
                      <Icon as={type.icon} boxSize={8} color="brand.500" />
                      <Heading size="md">{type.title}</Heading>
                    </HStack>
                    <Text color="gray.600" mb={4}>
                      {type.description}
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {type.features.map((feature: string) => (
                        <Badge key={feature} colorScheme="blue" variant="subtle">
                          {feature}
                        </Badge>
                      ))}
                    </HStack>
                    <Button
                      mt={6}
                      colorScheme="brand"
                      size="sm"
                      w="full"
                      onClick={() => handleSelectTemplate(type)}
                      variant="outline"
                    >
                      Preview
                    </Button>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      <SectionDivider color="#fff" flip />
      {/* How It Works Section */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <HowItWorks />
      </Box>
      <SectionDivider color="#f7fafc" />
      {/* Testimonials Section */}
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Testimonials />
      </Box>
      <SectionDivider color="#fff" flip />
      {/* CTA Section */}
      <Box
        as={motion.div}
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, type: 'spring' }}
        py={20}
      >
        <Container maxW="container.xl">
          <Box
            bgGradient={bgGradient}
            borderRadius="xl"
            p={12}
            textAlign="center"
            color="white"
          >
            <VStack spacing={6}>
              <Heading as="h2" size="xl">
                Ready to Get Started?
              </Heading>
              <Text fontSize="lg" maxW="container.md">
                Join thousands of businesses that trust Ecomlyx for their online presence
              </Text>
              <Button
                size="lg"
                colorScheme="whiteAlpha"
                px={8}
                onClick={handleGetStarted}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                Create Your Website Now
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>

      {/* Business Type Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedType && (
          <Box
            as={motion.div}
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="blackAlpha.700"
            zIndex={2000}
            display="flex"
            alignItems="center"
            justifyContent="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="2xl"
              p={10}
              maxW="lg"
              w="full"
              boxShadow="2xl"
              position="relative"
            >
              <Button
                position="absolute"
                top={4}
                right={4}
                size="sm"
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
              >
                Close
              </Button>
              <HStack spacing={4} mb={4}>
                <Icon as={selectedType.icon} boxSize={10} color="brand.500" />
                <Heading size="lg">{selectedType.title}</Heading>
              </HStack>
              <Text color="gray.600" mb={6}>{selectedType.description}</Text>
              <VStack align="start" spacing={2} mb={6}>
                {selectedType.features.map((feature: string) => (
                  <HStack key={feature}>
                    <Badge colorScheme="blue">{feature}</Badge>
                  </HStack>
                ))}
              </VStack>
              <Button
                colorScheme="brand"
                size="lg"
                w="full"
                rightIcon={<FaArrowRight />}
                onClick={() => {
                  setIsModalOpen(false);
                  router.push(`/create?type=${selectedType.title.toLowerCase()}`);
                }}
              >
                Use this Template
              </Button>
            </Box>
          </Box>
        )}
      </AnimatePresence>

      {/* Floating Help Button */}
      <HelpButton />
    </Box>
  );
} 