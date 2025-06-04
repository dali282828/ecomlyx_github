import {
  Box,
  Button,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  SimpleGrid,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  FaCheck, 
  FaStar, 
  FaShoppingCart, 
  FaUsers, 
  FaChartLine,
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { FiExternalLink, FiInfo } from 'react-icons/fi';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  features: string[];
  businessType: string;
}

interface TemplateSelectorProps {
  businessType: string;
  onSelect: (templateId: string) => void;
}

const templates: Record<string, Template[]> = {
  hotel: [
    {
      id: 'hotel-1',
      name: 'Luxury Hotel',
      description: 'Elegant hotel template with advanced booking system and room management.',
      thumbnail: '/templates/hotel-1.jpg',
      features: [
        'Advanced Booking System',
        'Room Management',
        'Guest Reviews',
        'Payment Processing',
        'Room Service Requests',
        'Availability Calendar'
      ],
      businessType: 'hotel'
    },
    {
      id: 'hotel-2',
      name: 'Boutique Hotel',
      description: 'Modern boutique hotel template with unique design and essential features.',
      thumbnail: '/templates/hotel-2.jpg',
      features: [
        'Simple Booking System',
        'Room Gallery',
        'Contact Forms',
        'Social Media Integration',
        'Photo Gallery',
        'Location Map'
      ],
      businessType: 'hotel'
    }
  ],
  restaurant: [
    {
      id: 'restaurant-1',
      name: 'Fine Dining',
      description: 'Sophisticated restaurant template with online reservations and menu management.',
      thumbnail: '/templates/restaurant-1.jpg',
      features: [
        'Online Reservations',
        'Menu Management',
        'Table Booking',
        'Special Offers',
        'Customer Reviews',
        'Photo Gallery'
      ],
      businessType: 'restaurant'
    },
    {
      id: 'restaurant-2',
      name: 'Casual Dining',
      description: 'Modern casual dining template with online ordering and delivery options.',
      thumbnail: '/templates/restaurant-2.jpg',
      features: [
        'Online Ordering',
        'Delivery Integration',
        'Menu Management',
        'Table Reservations',
        'Customer Reviews',
        'Social Media Feed'
      ],
      businessType: 'restaurant'
    }
  ],
  ecommerce: [
    {
      id: 'ecommerce-1',
      name: 'Premium Store',
      description: 'High-end e-commerce template with advanced product management and marketing tools.',
      thumbnail: '/templates/ecommerce-1.jpg',
      features: [
        'Advanced Product Catalog',
        'Shopping Cart & Checkout',
        'Payment Gateway Integration',
        'Inventory Management',
        'Order Tracking System',
        'Customer Reviews',
        'Wishlist & Favorites',
        'Discount & Coupon System',
        'Abandoned Cart Recovery',
        'Email Marketing Integration'
      ],
      businessType: 'ecommerce'
    },
    {
      id: 'ecommerce-2',
      name: 'Fashion Boutique',
      description: 'Modern fashion store template with size guides and virtual try-on features.',
      thumbnail: '/templates/ecommerce-2.jpg',
      features: [
        'Size Guide System',
        'Virtual Try-On',
        'Product Variants',
        'Lookbook Gallery',
        'Seasonal Collections',
        'Social Media Shop',
        'Loyalty Program',
        'Return Management',
        'Stock Alerts',
        'Fashion Blog'
      ],
      businessType: 'ecommerce'
    }
  ],
  realEstate: [
    {
      id: 'realestate-1',
      name: 'Property Portal',
      description: 'Complete real estate platform with property listings and agent management.',
      thumbnail: '/templates/realestate-1.jpg',
      features: [
        'Property Listings',
        'Advanced Search Filters',
        'Virtual Tours',
        'Agent Profiles',
        'Lead Management',
        'Mortgage Calculator',
        'Property Valuation',
        'Booking Viewings',
        'Document Management',
        'Market Analysis'
      ],
      businessType: 'realEstate'
    },
    {
      id: 'realestate-2',
      name: 'Luxury Properties',
      description: 'High-end real estate template for luxury property listings.',
      thumbnail: '/templates/realestate-2.jpg',
      features: [
        'Luxury Property Showcase',
        '360° Virtual Tours',
        'Exclusive Listings',
        'Agent Network',
        'Investment Calculator',
        'Property Alerts',
        'Luxury Blog',
        'Client Portal',
        'International Listings',
        'Market Reports'
      ],
      businessType: 'realEstate'
    }
  ],
  education: [
    {
      id: 'education-1',
      name: 'Learning Platform',
      description: 'Comprehensive educational platform with course management and student tracking.',
      thumbnail: '/templates/education-1.jpg',
      features: [
        'Course Management',
        'Student Portal',
        'Assignment System',
        'Video Lessons',
        'Quiz & Assessment',
        'Progress Tracking',
        'Certificate Generation',
        'Discussion Forums',
        'Payment Integration',
        'Calendar & Scheduling'
      ],
      businessType: 'education'
    },
    {
      id: 'education-2',
      name: 'School Website',
      description: 'Complete school website with parent portal and event management.',
      thumbnail: '/templates/education-2.jpg',
      features: [
        'Parent Portal',
        'Event Calendar',
        'News & Announcements',
        'Student Directory',
        'Attendance Tracking',
        'Grade Management',
        'School Blog',
        'Photo Gallery',
        'Online Admissions',
        'Transportation Tracking'
      ],
      businessType: 'education'
    }
  ],
  healthcare: [
    {
      id: 'healthcare-1',
      name: 'Medical Practice',
      description: 'Professional medical practice website with appointment booking and patient portal.',
      thumbnail: '/templates/healthcare-1.jpg',
      features: [
        'Appointment Booking',
        'Patient Portal',
        'Medical Records',
        'Online Consultations',
        'Prescription Management',
        'Insurance Verification',
        'Doctor Profiles',
        'Service Directory',
        'Health Blog',
        'Emergency Contact'
      ],
      businessType: 'healthcare'
    },
    {
      id: 'healthcare-2',
      name: 'Dental Clinic',
      description: 'Specialized dental clinic website with treatment planning and patient education.',
      thumbnail: '/templates/healthcare-2.jpg',
      features: [
        'Treatment Planning',
        'Appointment Scheduling',
        'Patient Education',
        'Smile Gallery',
        'Insurance Processing',
        'Emergency Services',
        'Dental Blog',
        'Before/After Gallery',
        'Payment Plans',
        'Patient Forms'
      ],
      businessType: 'healthcare'
    }
  ],
  fitness: [
    {
      id: 'fitness-1',
      name: 'Gym & Fitness',
      description: 'Complete fitness center website with class booking and member management.',
      thumbnail: '/templates/fitness-1.jpg',
      features: [
        'Class Booking',
        'Member Portal',
        'Trainer Profiles',
        'Workout Plans',
        'Progress Tracking',
        'Nutrition Plans',
        'Class Schedule',
        'Membership Management',
        'Fitness Blog',
        'Mobile App Integration'
      ],
      businessType: 'fitness'
    },
    {
      id: 'fitness-2',
      name: 'Yoga Studio',
      description: 'Peaceful yoga studio website with class management and online courses.',
      thumbnail: '/templates/fitness-2.jpg',
      features: [
        'Class Schedule',
        'Online Bookings',
        'Teacher Profiles',
        'Workshop Calendar',
        'Retreat Planning',
        'Video Classes',
        'Meditation Timer',
        'Pose Library',
        'Yoga Blog',
        'Membership Plans'
      ],
      businessType: 'fitness'
    }
  ],
  salon: [
    {
      id: 'salon-1',
      name: 'Beauty Salon',
      description: 'Complete beauty salon website with appointment booking and service showcase.',
      thumbnail: '/templates/salon-1.jpg',
      features: [
        'Appointment Booking',
        'Service Menu',
        'Stylist Profiles',
        'Gift Cards',
        'Loyalty Program',
        'Price List',
        'Gallery Showcase',
        'Client Reviews',
        'Special Offers',
        'Online Store'
      ],
      businessType: 'salon'
    },
    {
      id: 'salon-2',
      name: 'Spa & Wellness',
      description: 'Luxury spa website with treatment booking and wellness programs.',
      thumbnail: '/templates/salon-2.jpg',
      features: [
        'Treatment Booking',
        'Package Deals',
        'Therapist Profiles',
        'Wellness Programs',
        'Gift Vouchers',
        'Retreat Planning',
        'Spa Menu',
        'Client Portal',
        'Wellness Blog',
        'Membership Club'
      ],
      businessType: 'salon'
    }
  ],
  automotive: [
    {
      id: 'automotive-1',
      name: 'Car Dealership',
      description: 'Professional car dealership website with inventory management and financing tools.',
      thumbnail: '/templates/automotive-1.jpg',
      features: [
        'Vehicle Inventory',
        'Financing Calculator',
        'Service Booking',
        'Test Drive Requests',
        'Trade-in Valuation',
        'Vehicle Comparison',
        'Service History',
        'Parts Catalog',
        'Dealer Locator',
        'News & Reviews'
      ],
      businessType: 'automotive'
    },
    {
      id: 'automotive-2',
      name: 'Auto Service',
      description: 'Complete auto service website with appointment booking and service tracking.',
      thumbnail: '/templates/automotive-2.jpg',
      features: [
        'Service Booking',
        'Service History',
        'Parts Ordering',
        'Price Estimator',
        'Vehicle Diagnostics',
        'Maintenance Reminders',
        'Technician Profiles',
        'Service Packages',
        'Customer Portal',
        'Emergency Service'
      ],
      businessType: 'automotive'
    }
  ],
  legal: [
    {
      id: 'legal-1',
      name: 'Law Firm',
      description: 'Professional law firm website with case management and client portal.',
      thumbnail: '/templates/legal-1.jpg',
      features: [
        'Case Management',
        'Client Portal',
        'Attorney Profiles',
        'Document Library',
        'Consultation Booking',
        'Legal Blog',
        'Practice Areas',
        'Client Reviews',
        'FAQ System',
        'News & Updates'
      ],
      businessType: 'legal'
    },
    {
      id: 'legal-2',
      name: 'Notary Services',
      description: 'Specialized notary services website with appointment booking and document verification.',
      thumbnail: '/templates/legal-2.jpg',
      features: [
        'Appointment Booking',
        'Document Verification',
        'Service Directory',
        'Online Notary',
        'Document Templates',
        'Fee Calculator',
        'Location Finder',
        'Client Portal',
        'Legal Resources',
        'Mobile Services'
      ],
      businessType: 'legal'
    }
  ]
};

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
};

export default function TemplateSelector({ businessType, onSelect }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [filter, setFilter] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');

  const bgGradient = useColorModeValue(
    'linear(to-r, brand.500, accent.500)',
    'linear(to-r, brand.200, accent.200)'
  );

  const filteredTemplates = templates[businessType].filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || template.features.some(f => f.toLowerCase().includes(filter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    onOpen();
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.id);
      onClose();
    }
  };

  return (
    <Box py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" fontWeight="bold" bgGradient={bgGradient} bgClip="text">
              Choose Your Template
            </Heading>
            <Text color="gray.600">Select a template that best fits your business needs</Text>
          </VStack>
          <HStack spacing={4}>
            <Button
              leftIcon={<FaFilter />}
              variant="outline"
              onClick={() => setFilter(filter === 'all' ? 'mobile' : 'all')}
            >
              {filter === 'all' ? 'All Templates' : 'Mobile First'}
            </Button>
            <Button
              leftIcon={<FaSearch />}
              variant="outline"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </HStack>
        </Flex>

        {/* Search and Filter */}
        <Box
          as="input"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          p={4}
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          _focus={{
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          }}
        />

        {/* Templates Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={8}
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filteredTemplates.map((template) => (
              <MotionCard
                key={template.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
                bg="white"
                overflow="hidden"
                cursor="pointer"
                onClick={() => handleTemplateClick(template)}
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                transition="all 0.2s"
              >
                <Box position="relative">
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    w="full"
                    h="200px"
                    objectFit="cover"
                  />
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    colorScheme="brand"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {template.businessType}
                  </Badge>
                </Box>

                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Heading size="md">{template.name}</Heading>
                    <Text color="gray.600" noOfLines={2}>
                      {template.description}
                    </Text>
                    <SimpleGrid columns={2} spacing={2} w="full">
                      {template.features.slice(0, 4).map((feature, index) => (
                        <Tag
                          key={index}
                          size="sm"
                          colorScheme="purple"
                          variant="subtle"
                          borderRadius="full"
                        >
                          <TagLeftIcon as={FaCheck} />
                          <TagLabel>{feature}</TagLabel>
                        </Tag>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </CardBody>

                <CardFooter borderTop="1px solid" borderColor="gray.100">
                  <HStack spacing={4} w="full" justify="space-between">
                    <HStack spacing={2}>
                      <Icon as={FaMobileAlt} color="gray.400" />
                      <Icon as={FaTabletAlt} color="gray.400" />
                      <Icon as={FaDesktop} color="gray.400" />
                    </HStack>
                    <Button
                      rightIcon={<FiExternalLink />}
                      colorScheme="brand"
                      size="sm"
                    >
                      Preview
                    </Button>
                  </HStack>
                </CardFooter>
              </MotionCard>
            ))}
          </AnimatePresence>
        </SimpleGrid>
      </VStack>

      {/* Template Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={4}>
              <Heading size="md">{selectedTemplate?.name}</Heading>
              <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
                {selectedTemplate?.businessType}
              </Badge>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTemplate && (
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
                <Box>
                  <Image
                    src={selectedTemplate.thumbnail}
                    alt={selectedTemplate.name}
                    borderRadius="lg"
                    w="full"
                  />
                  <Text mt={4} color="gray.600">
                    {selectedTemplate.description}
                  </Text>
                </Box>
                <VStack align="start" spacing={6}>
                  <Box>
                    <Heading size="sm" mb={4}>Key Features</Heading>
                    <SimpleGrid columns={1} spacing={3}>
                      {selectedTemplate.features.map((feature, index) => (
                        <HStack key={index} spacing={3}>
                          <Icon as={FaCheck} color="green.500" />
                          <Text>{feature}</Text>
                        </HStack>
                      ))}
                    </SimpleGrid>
                  </Box>
                  <Box>
                    <Heading size="sm" mb={4}>Template Details</Heading>
                    <SimpleGrid columns={2} spacing={4}>
                      <HStack>
                        <Icon as={FaMobileAlt} color="gray.400" />
                        <Text>Responsive Design</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaUsers} color="gray.400" />
                        <Text>User Management</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaChartLine} color="gray.400" />
                        <Text>Analytics Ready</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaShoppingCart} color="gray.400" />
                        <Text>E-commerce Ready</Text>
                      </HStack>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </Grid>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleConfirm}
                leftIcon={<FaCheck />}
              >
                Select Template
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 