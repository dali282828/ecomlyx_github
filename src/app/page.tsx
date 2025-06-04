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
} from 'react-icons/fa';

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
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.600)'
  );

  const handleGetStarted = () => {
    router.push('/create');
  };

  const handleSelectTemplate = (type: string) => {
    router.push(`/create?type=${type.toLowerCase()}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        color="white"
        py={20}
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
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, white, blue.100)"
              bgClip="text"
              fontWeight="extrabold"
            >
              Create Your Business Website in Minutes
            </Heading>
            <Text fontSize="xl" maxW="container.md" opacity={0.9}>
              Choose your business type and get a fully functional website with all the features you need.
              No coding required.
            </Text>
            <HStack spacing={4}>
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
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                px={8}
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-2px)',
                }}
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* AI vs Classic Mode Section */}
      <Box py={16} bg={useColorModeValue('gray.100', 'gray.800')}>
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

      {/* Stats Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
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

      {/* Features Section */}
      <Box py={20}>
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

      {/* Business Types Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
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
              {businessTypes.map((type) => (
                <Box
                  key={type.title}
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
                    <Icon as={type.icon} w={10} h={10} color="blue.500" />
                    <Heading as="h3" size="md">
                      {type.title}
                    </Heading>
                    <Text color="gray.600">{type.description}</Text>
                    <VStack align="start" spacing={2} w="full">
                      {type.features.map((feature) => (
                        <HStack key={feature} spacing={2}>
                          <Box w={2} h={2} bg="blue.500" borderRadius="full" />
                          <Text fontSize="sm">{feature}</Text>
                        </HStack>
                      ))}
                    </VStack>
                    <Button
                      colorScheme="blue"
                      width="full"
                      onClick={() => handleSelectTemplate(type.title)}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'md',
                      }}
                    >
                      Select Template
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20}>
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
    </Box>
  );
} 