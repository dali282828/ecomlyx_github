import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
  Tooltip,
  Icon,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
  Circle,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  FaStore,
  FaBlog,
  FaLandmark,
  FaInfoCircle,
  FaCheck,
  FaRocket,
  FaLock,
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaCog,
} from 'react-icons/fa';

const MotionBox = motion(Box);

const modes = [
  {
    id: 'ecommerce',
    title: 'E-commerce Store',
    description: 'Build a full-featured online store with product management, cart, and secure checkout.',
    icon: FaStore,
    features: [
      'Product catalog & inventory',
      'Shopping cart & checkout',
      'Payment processing',
      'Order management',
      'Customer accounts',
      'Analytics dashboard',
    ],
    badge: 'Popular',
    color: 'blue',
  },
  {
    id: 'blog',
    title: 'Blog Platform',
    description: 'Create a modern blog with content management, categories, and social sharing.',
    icon: FaBlog,
    features: [
      'Rich text editor',
      'Categories & tags',
      'Comments system',
      'SEO optimization',
      'Social sharing',
      'Newsletter integration',
    ],
    badge: 'New',
    color: 'green',
  },
  {
    id: 'business',
    title: 'Business Website',
    description: 'Professional website for your business with services, portfolio, and contact forms.',
    icon: FaLandmark,
    features: [
      'Service showcase',
      'Portfolio gallery',
      'Contact forms',
      'Team profiles',
      'Testimonials',
      'Appointment booking',
    ],
    color: 'purple',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: 'spring',
      stiffness: 100,
    },
  }),
  hover: {
    y: -8,
    transition: {
      duration: 0.2,
      type: 'spring',
      stiffness: 400,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const featureIconMap = {
  'Product catalog & inventory': FaShoppingCart,
  'Shopping cart & checkout': FaChartLine,
  'Payment processing': FaLock,
  'Order management': FaCog,
  'Customer accounts': FaUsers,
  'Analytics dashboard': FaChartLine,
  'Rich text editor': FaBlog,
  'Categories & tags': FaStore,
  'Comments system': FaUsers,
  'SEO optimization': FaRocket,
  'Social sharing': FaUsers,
  'Newsletter integration': FaChartLine,
  'Service showcase': FaStore,
  'Portfolio gallery': FaLandmark,
  'Contact forms': FaUsers,
  'Team profiles': FaUsers,
  'Testimonials': FaUsers,
  'Appointment booking': FaCog,
};

interface ChooseModeProps {
  onSelect: (mode: string) => void;
  selectedMode?: string;
}

export default function ChooseMode({ onSelect, selectedMode }: ChooseModeProps) {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [detailedMode, setDetailedMode] = useState<typeof modes[0] | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const selectedBorder = useColorModeValue('blue.200', 'blue.700');

  const handleModeClick = (mode: typeof modes[0]) => {
    setDetailedMode(mode);
    onOpen();
  };

  const handleConfirm = () => {
    if (detailedMode) {
      onSelect(detailedMode.id);
      onClose();
    }
  };

  return (
    <VStack spacing={8} w="full" maxW="6xl" mx="auto" px={4}>
      <VStack spacing={4} textAlign="center">
        <Heading
          as="h2"
          size="xl"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
          fontWeight="extrabold"
        >
          Choose Your Website Type
        </Heading>
        <Text color="gray.600" fontSize="lg" maxW="2xl">
          Select the type of website that best fits your needs. Each option comes with
          specialized features and tools to help you succeed.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
        <AnimatePresence>
          {modes.map((mode, index) => (
            <MotionBox
              key={mode.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              cursor="pointer"
              onClick={() => handleModeClick(mode)}
              onHoverStart={() => setHoveredMode(mode.id)}
              onHoverEnd={() => setHoveredMode(null)}
            >
              <Box
                p={6}
                bg={selectedMode === mode.id ? selectedBg : bgColor}
                borderWidth="2px"
                borderColor={selectedMode === mode.id ? selectedBorder : borderColor}
                borderRadius="xl"
                boxShadow="lg"
                position="relative"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  bg: selectedMode === mode.id ? selectedBg : hoverBg,
                  borderColor: selectedMode === mode.id ? selectedBorder : 'blue.300',
                }}
              >
                {mode.badge && (
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    colorScheme={mode.color}
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    {mode.badge}
                  </Badge>
                )}

                {selectedMode === mode.id && (
                  <Circle
                    size="24px"
                    bg="blue.500"
                    color="white"
                    position="absolute"
                    top={4}
                    left={4}
                    zIndex={1}
                  >
                    <FaCheck size="12px" />
                  </Circle>
                )}

                <VStack spacing={4} align="start">
                  <Circle
                    size="16"
                    bg={`${mode.color}.100`}
                    color={`${mode.color}.500`}
                    mb={2}
                  >
                    <Icon as={mode.icon} boxSize="8" />
                  </Circle>

                  <Heading size="md" color={`${mode.color}.600`}>
                    {mode.title}
                  </Heading>

                  <Text color="gray.600" fontSize="sm" noOfLines={3}>
                    {mode.description}
                  </Text>

                  <HStack spacing={2} wrap="wrap">
                    {mode.features.slice(0, 3).map((feature) => (
                      <Badge
                        key={feature}
                        colorScheme={mode.color}
                        variant="subtle"
                        px={2}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                    {mode.features.length > 3 && (
                      <Badge
                        colorScheme="gray"
                        variant="subtle"
                        px={2}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                      >
                        +{mode.features.length - 3} more
                      </Badge>
                    )}
                  </HStack>

                  <Tooltip
                    label="Click to view details"
                    placement="top"
                    hasArrow
                    isOpen={hoveredMode === mode.id}
                  >
                    <Button
                      size="sm"
                      colorScheme={mode.color}
                      variant="outline"
                      rightIcon={<FaInfoCircle />}
                      w="full"
                      mt={2}
                    >
                      View Details
                    </Button>
                  </Tooltip>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </AnimatePresence>
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="xl"
          boxShadow="2xl"
        >
          <ModalHeader
            borderBottomWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            pb={4}
          >
            <HStack spacing={4}>
              <Circle
                size="12"
                bg={`${detailedMode?.color}.100`}
                color={`${detailedMode?.color}.500`}
              >
                <Icon as={detailedMode?.icon} boxSize="6" />
              </Circle>
              <VStack align="start" spacing={0}>
                <Heading size="md">{detailedMode?.title}</Heading>
                <Text fontSize="sm" color="gray.500">
                  {detailedMode?.description}
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {detailedMode?.features.map((feature) => (
                <Flex
                  key={feature}
                  align="center"
                  p={3}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  transition="all 0.2s"
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.600'),
                    transform: 'translateY(-2px)',
                  }}
                >
                  <Circle
                    size="8"
                    bg={`${detailedMode.color}.100`}
                    color={`${detailedMode.color}.500`}
                    mr={3}
                  >
                    <Icon
                      as={featureIconMap[feature as keyof typeof featureIconMap]}
                      boxSize="4"
                    />
                  </Circle>
                  <Text fontSize="sm" fontWeight="medium">
                    {feature}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </ModalBody>
          <Flex
            p={6}
            borderTopWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            justify="flex-end"
            gap={4}
          >
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme={detailedMode?.color}
              onClick={handleConfirm}
              rightIcon={<FaCheck />}
            >
              Select {detailedMode?.title}
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </VStack>
  );
} 