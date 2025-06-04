'use client';

import { useState, useEffect } from 'react';
import {
  Box, Container, VStack, Heading, Text, Button, useToast,
  Progress, SimpleGrid, Input, useColorModeValue, HStack, Badge,
  Icon, Tooltip, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel,
  Select, Textarea, Card, CardBody, Image, AspectRatio, Divider,
  Alert, AlertIcon, AlertTitle, AlertDescription, useSteps,
  Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle,
  StepDescription, Stepper, StepSeparator, ScaleFade, Fade,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRobot, FaEdit, FaInfoCircle, FaGlobe, FaCog, FaCheck,
  FaArrowRight, FaArrowLeft, FaQuestionCircle, FaLightbulb,
  FaPalette, FaPlug, FaDatabase, FaUsers, FaChartLine,
  FaShieldAlt, FaRocket, FaStar, FaCrown, FaMagic,
} from 'react-icons/fa';
import TemplatePreview from '@/components/templates/TemplatePreview';
import DomainConnection from '@/components/domains/DomainConnection';
import WordPressSetup from '@/components/wordpress/WordPressSetup';
import StepProgress from '@/components/StepProgress';
import ModeSelectCard from '@/components/ModeSelectCard';
import TemplatePreviewModal from '@/components/TemplatePreviewModal';
import PlanSelector from '@/components/PlanSelector';
import BusinessTypeSelectorWithPreview from '@/components/BusinessTypeSelectorWithPreview';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const steps = [
  { 
    id: 1, 
    title: 'Choose Mode',
    description: 'Select how you want to build your website',
    icon: FaRobot,
    tips: [
      'AI Mode is perfect for quick launches',
      'Classic Mode gives you full control',
    ],
  },
  { 
    id: 2, 
    title: 'Choose Template',
    description: 'Pick a design that matches your brand',
    icon: FaPalette,
    tips: [
      'Templates are fully customizable',
      'Preview before selecting',
    ],
  },
  { 
    id: 3, 
    title: 'Business Info',
    description: 'Tell us about your business',
    icon: FaInfoCircle,
    tips: [
      'Be specific about your business type',
      'This helps us customize your site',
    ],
  },
  { 
    id: 4, 
    title: 'Choose Plan',
    description: 'Select the right plan for your needs',
    icon: FaCrown,
    tips: [
      'Compare features between plans',
      'You can upgrade anytime',
    ],
  },
  { 
    id: 5, 
    title: 'Connect Domain',
    description: 'Link your domain to your website',
    icon: FaGlobe,
    tips: [
      'Use your existing domain or get a new one',
      'Free SSL certificate included',
    ],
  },
  { 
    id: 6, 
    title: 'Setup',
    description: 'Final configuration and launch',
    icon: FaCog,
    tips: [
      'We handle the technical setup',
      'Your site will be ready in minutes',
    ],
  },
  { 
    id: 7, 
    title: 'Complete',
    description: 'Your website is ready!',
    icon: FaCheck,
    tips: [
      'Access your dashboard',
      'Start customizing your site',
    ],
  },
];

const demoTemplates = [
  {
    id: '1',
    name: 'Business Starter',
    type: 'business',
    image: '/templates/business-starter.png',
    thumbnail: '/templates/business-starter.png',
    features: ['Responsive', 'SEO Ready', 'Contact Form'],
    plugins: ['Contact Form', 'SEO'],
  },
  {
    id: '2',
    name: 'Portfolio Pro',
    type: 'portfolio',
    image: '/templates/portfolio-pro.png',
    thumbnail: '/templates/portfolio-pro.png',
    features: ['Gallery', 'Blog', 'Contact'],
    plugins: ['Gallery', 'Blog'],
  },
  {
    id: '3',
    name: 'E-Commerce Basic',
    type: 'ecommerce',
    image: '/templates/ecommerce-basic.png',
    thumbnail: '/templates/ecommerce-basic.png',
    features: ['Shop', 'Cart', 'Checkout'],
    plugins: ['Shop', 'Cart'],
  },
];

export default function CreateWebsite() {
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<'ai' | 'classic' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [websiteId, setWebsiteId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // AI/Classic info state
  const [aiInfo, setAiInfo] = useState({ name: '', type: '', description: '' });
  const [classicInfo, setClassicInfo] = useState({ name: '', type: '' });
  const [adminEmail, setAdminEmail] = useState('');

  // Preview state
  const [previewedTemplate, setPreviewedTemplate] = useState(null);

  // Plan state
  const [selectedPlan, setSelectedPlan] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
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

  // Step handlers with animations and feedback
  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    toast({
      title: 'Mode Selected',
      description: `You've chosen ${selectedMode === 'ai' ? 'AI' : 'Classic'} Mode`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    setCurrentStep(2);
  };

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template);
    toast({
      title: 'Template Selected',
      description: `You've chosen the ${template.name} template`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    setCurrentStep(3);
  };

  const handleAiInfoSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    toast({
      title: 'Generating Website',
      description: 'Our AI is creating your perfect website...',
      status: 'info',
      duration: null,
      isClosable: true,
    });

    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setWebsiteId('ai-demo-id');
      setCurrentStep(4);
      toast({
        title: 'Website Generated!',
        description: 'Your AI-powered website is ready for customization',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Please try again or contact support',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClassicInfoSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    toast({
      title: 'Creating Website',
      description: 'Setting up your website...',
      status: 'info',
      duration: null,
      isClosable: true,
    });

    try {
      // Simulate manual website creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setWebsiteId('classic-demo-id');
      setCurrentStep(4);
      toast({
        title: 'Website Created!',
        description: 'Your website is ready for customization',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: 'Please try again or contact support',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDomainComplete = () => {
    toast({
      title: 'Domain Connected',
      description: 'Your domain has been successfully connected',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    setCurrentStep(6);
  };

  const handleWordPressComplete = () => {
    toast({
      title: 'Setup Complete',
      description: 'Your WordPress site is ready to use',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    setCurrentStep(7);
  };

  // Render current step content with animations
  const renderStepContent = () => {
    const currentStepData = steps[currentStep - 1];

    return (
      <MotionBox
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="stretch">
          {/* Step Header */}
          <VStack spacing={2} align="center" mb={6}>
            <HStack spacing={3}>
              <Icon as={currentStepData.icon} boxSize={6} color="blue.500" />
              <Heading size="lg">{currentStepData.title}</Heading>
            </HStack>
            <Text color="gray.600" textAlign="center">
              {currentStepData.description}
            </Text>
            {showTips && (
              <Alert status="info" variant="subtle" borderRadius="md" mt={2}>
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <AlertTitle>Pro Tip</AlertTitle>
                  <AlertDescription>
                    {currentStepData.tips[Math.floor(Math.random() * currentStepData.tips.length)]}
                  </AlertDescription>
                </VStack>
              </Alert>
            )}
          </VStack>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <MotionVStack
                key="mode-select"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                spacing={6}
                align="center"
              >
                <Heading size="md">How do you want to build your website?</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <ModeSelectCard
                    icon={<FaRobot />}
                    title="AI Mode"
                    description="Let AI generate your content and structure. Fastest way to launch."
                    selected={mode === 'ai'}
                    onClick={() => handleModeSelect('ai')}
                    tooltip="AI Mode: Answer a few questions and let our AI build your site."
                  />
                  <ModeSelectCard
                    icon={<FaEdit />}
                    title="Classic Mode"
                    description="Manual setup for full control. Build your site step by step."
                    selected={mode === 'classic'}
                    onClick={() => handleModeSelect('classic')}
                    tooltip="Classic Mode: You choose everything yourself."
                  />
                </SimpleGrid>
              </MotionVStack>
            )}

            {currentStep === 2 && (
              <MotionVStack
                key="template-select"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                spacing={6}
                align="center"
              >
                <BusinessTypeSelectorWithPreview />
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {demoTemplates.map((template) => (
                    <MotionBox
                      key={template.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        borderWidth={selectedTemplate?.id === template.id ? '2px' : '1px'}
                        borderColor={selectedTemplate?.id === template.id ? 'blue.500' : 'gray.200'}
                        borderRadius="xl"
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() => handleTemplateSelect(template)}
                        position="relative"
                      >
                        <AspectRatio ratio={16/9}>
                          <Image
                            src={template.image}
                            alt={template.name}
                            objectFit="cover"
                          />
                        </AspectRatio>
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <Heading size="md">{template.name}</Heading>
                            <Text color="gray.500">{template.type}</Text>
                            <HStack spacing={1} flexWrap="wrap">
                              {template.features.map((feature) => (
                                <Badge key={feature} colorScheme="purple">{feature}</Badge>
                              ))}
                            </HStack>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              w="full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewedTemplate(template);
                                onOpen();
                              }}
                            >
                              Preview
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </MotionVStack>
            )}

            {currentStep === 3 && mode === 'ai' && (
              <Box as="form" onSubmit={handleAiInfoSubmit}>
                <Heading size="md" display="flex" alignItems="center" gap={2} mb={4}>
                  {aiInfo.name ? `Let's set up ${aiInfo.name}!` : 'Tell us about your business'}
                  <InfoOutlineIcon color="blue.400" title="This info helps us generate your site." />
                </Heading>
                <VStack spacing={4} align="stretch">
                  <Input
                    placeholder="Business Name"
                    value={aiInfo.name}
                    onChange={e => setAiInfo({ ...aiInfo, name: e.target.value })}
                    required
                    focusBorderColor="blue.400"
                    aria-label="Business Name"
                  />
                  <Text color="gray.500" fontSize="sm" ml={2} mb={-2}>This will appear as your site's title.</Text>
                  <Input
                    placeholder="Business Type (e.g. Restaurant, Agency)"
                    value={aiInfo.type}
                    onChange={e => setAiInfo({ ...aiInfo, type: e.target.value })}
                    required
                    focusBorderColor="blue.400"
                    aria-label="Business Type"
                  />
                  <Text color="gray.500" fontSize="sm" ml={2} mb={-2}>Helps us pick the right template and features.</Text>
                  <Input
                    placeholder="Short Description"
                    value={aiInfo.description}
                    onChange={e => setAiInfo({ ...aiInfo, description: e.target.value })}
                    required
                    focusBorderColor="blue.400"
                    aria-label="Short Description"
                  />
                  <Text color="gray.500" fontSize="sm" ml={2} mb={-2}>A short tagline or summary for your homepage.</Text>
                  <Input
                    placeholder="Admin Email"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    required
                    type="email"
                    focusBorderColor="blue.400"
                    aria-label="Admin Email"
                  />
                  <Text color="gray.500" fontSize="sm" ml={2} mb={-2}>For login and notifications. We never share your email.</Text>
                  {/* Business Card Preview */}
                  <Box
                    mt={6}
                    mb={2}
                    p={4}
                    borderRadius="lg"
                    boxShadow="md"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    maxW="xs"
                    mx="auto"
                  >
                    <Text fontWeight="bold" fontSize="lg" color="blue.600">{aiInfo.name || 'Business Name'}</Text>
                    <Text color="gray.500" fontSize="sm">{aiInfo.type || 'Business Type'}</Text>
                    <Text color="gray.600" fontSize="sm" mt={2}>{aiInfo.description || 'A short description will appear here.'}</Text>
                  </Box>
                  <Button colorScheme="blue" type="submit" size="lg" _hover={{ boxShadow: 'md' }}>
                    Generate My Website
                  </Button>
                </VStack>
              </Box>
            )}
            {currentStep === 3 && mode === 'classic' && (
              <Box as="form" onSubmit={handleClassicInfoSubmit}>
                <Heading size="md" display="flex" alignItems="center" gap={2} mb={4}>
                  {classicInfo.name ? `Let's set up ${classicInfo.name}!` : 'Manual Website Setup'}
                  <InfoOutlineIcon color="blue.400" title="You control every detail." />
                </Heading>
                <VStack spacing={4} align="stretch">
                  <Input
                    placeholder="Website Name"
                    value={classicInfo.name}
                    onChange={e => setClassicInfo({ ...classicInfo, name: e.target.value })}
                    required
                    focusBorderColor="blue.400"
                    aria-label="Website Name"
                  />
                  <Text color="gray.500" fontSize="sm" ml={2} mb={-2}>This will appear as your site's title.</Text>
                  <Input
                    placeholder="Business Type"
                    value={classicInfo.type}
                    onChange={e => setClassicInfo({ ...classicInfo, type: e.target.value })}
                    required
                    focusBorderColor="blue.400"
                    aria-label="Business Type"
                  />
                  <Text color="gray.500" fontSize="sm" ml={2} mb={-2}>Helps us pick the right template and features.</Text>
                  <Input
                    placeholder="Admin Email"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    required
                    type="email"
                    focusBorderColor="blue.400"
                    aria-label="Admin Email"
                  />
                  <Text color="gray.500" fontSize="sm" ml={2} mb={-2}>For login and notifications. We never share your email.</Text>
                  {/* Business Card Preview */}
                  <Box
                    mt={6}
                    mb={2}
                    p={4}
                    borderRadius="lg"
                    boxShadow="md"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    maxW="xs"
                    mx="auto"
                  >
                    <Text fontWeight="bold" fontSize="lg" color="blue.600">{classicInfo.name || 'Website Name'}</Text>
                    <Text color="gray.500" fontSize="sm">{classicInfo.type || 'Business Type'}</Text>
                  </Box>
                  <Button colorScheme="blue" type="submit" size="lg" _hover={{ boxShadow: 'md' }}>
                    Create Website
                  </Button>
                </VStack>
              </Box>
            )}

            {currentStep === 4 && (
              <VStack spacing={6} align="center">
                <Heading size="md">Choose Your Plan</Heading>
                <PlanSelector
                  businessType={(mode === 'ai' ? aiInfo.type : classicInfo.type)?.toLowerCase() || ''}
                  onSelect={(planId) => setSelectedPlan(planId)}
                />
                <Button
                  colorScheme="blue"
                  size="lg"
                  mt={4}
                  isDisabled={!selectedPlan}
                  onClick={() => setCurrentStep(5)}
                >
                  Continue
                </Button>
              </VStack>
            )}

            {currentStep === 5 && websiteId && (
              <DomainConnection
                websiteId={websiteId}
                onComplete={handleDomainComplete}
              />
            )}

            {currentStep === 6 && websiteId && (
              <WordPressSetup
                websiteId={websiteId}
                businessName={mode === 'ai' ? aiInfo.name : classicInfo.name}
                businessType={mode === 'ai' ? aiInfo.type : classicInfo.type}
                adminEmail={adminEmail}
                onComplete={handleWordPressComplete}
              />
            )}

            {currentStep === 7 && (
              <VStack spacing={6} align="center">
                <Heading size="lg">Website Created Successfully!</Heading>
                <Text>Your website is now ready to use.</Text>
                <Button
                  colorScheme="blue"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Go to Dashboard
                </Button>
              </VStack>
            )}
          </AnimatePresence>
        </VStack>
      </MotionBox>
    );
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, white 60%, purple.50)" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading
              size="xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
            >
              Create Your Website
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Follow these steps to set up your perfect website
            </Text>
          </VStack>

          {/* Step Progress */}
          <StepProgress
            steps={steps}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step < currentStep) {
                setCurrentStep(step);
              }
            }}
          />

          {/* Navigation */}
          <HStack justify="space-between" w="full">
            {currentStep > 1 && (
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                colorScheme="blue"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => setShowTips(!showTips)}
              ml="auto"
            >
              {showTips ? 'Hide Tips' : 'Show Tips'}
            </Button>
          </HStack>

          {/* Step Content */}
          {renderStepContent()}

          {/* Template Preview Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent>
              <ModalHeader>Template Preview</ModalHeader>
              <ModalCloseButton />
              <ModalBody p={0}>
                <TemplatePreviewModal
                  isOpen={!!previewedTemplate}
                  onClose={() => {
                    setPreviewedTemplate(null);
                    onClose();
                  }}
                  template={previewedTemplate}
                  onSelect={handleTemplateSelect}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  );
} 