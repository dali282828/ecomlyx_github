import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaRocket,
  FaPalette,
  FaCog,
  FaCheckCircle,
} from 'react-icons/fa';

const MotionBox = motion(Box);

const steps = [
  {
    title: 'Choose Your Template',
    description: 'Select from our AI-powered templates designed for your specific industry. Each template comes with pre-built features and layouts.',
    icon: FaRocket,
  },
  {
    title: 'Customize Your Design',
    description: 'Personalize your website with our intuitive drag-and-drop editor. Change colors, fonts, and layouts to match your brand.',
    icon: FaPalette,
  },
  {
    title: 'Add Your Content',
    description: 'Upload your images, write your content, and configure your settings. Our AI assistant helps you optimize everything.',
    icon: FaCog,
  },
  {
    title: 'Launch Your Website',
    description: 'Review your site, connect your domain, and go live! Our team ensures everything runs smoothly.',
    icon: FaCheckCircle,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HowItWorks() {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      py={20}
      id="how-it-works"
    >
      <Container maxW={'7xl'}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="bold"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
            >
              How It Works
            </Heading>
            <Text
              color={useColorModeValue('gray.600', 'gray.400')}
              fontSize="lg"
              maxW="2xl"
            >
              Create your professional website in four simple steps. No coding required.
            </Text>
          </VStack>

          <MotionBox
            as={SimpleGrid}
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing={10}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((step, index) => (
              <MotionBox
                key={step.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <VStack
                  spacing={4}
                  p={8}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="xl"
                  boxShadow="lg"
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    right: { base: 'auto', lg: index < steps.length - 1 ? '-50%' : 'auto' },
                    left: { base: '50%', lg: 'auto' },
                    bottom: { base: index < steps.length - 1 ? '-50%' : 'auto', lg: 'auto' },
                    transform: {
                      base: index < steps.length - 1 ? 'translateX(-50%)' : 'none',
                      lg: 'translateY(-50%)',
                    },
                    width: { base: '2px', lg: '50%' },
                    height: { base: '50%', lg: '2px' },
                    bg: 'brand.500',
                    opacity: 0.2,
                    display: { base: index < steps.length - 1 ? 'block' : 'none', lg: index < steps.length - 1 ? 'block' : 'none' },
                  }}
                >
                  <Box
                    p={4}
                    bg={useColorModeValue('white', 'gray.600')}
                    borderRadius="full"
                    boxShadow="md"
                  >
                    <Icon
                      as={step.icon}
                      w={8}
                      h={8}
                      color="brand.500"
                    />
                  </Box>
                  <VStack spacing={2} align="start">
                    <Heading as="h3" size="md">
                      {step.title}
                    </Heading>
                    <Text
                      color={useColorModeValue('gray.600', 'gray.400')}
                      fontSize="sm"
                    >
                      {step.description}
                    </Text>
                  </VStack>
                </VStack>
              </MotionBox>
            ))}
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
} 