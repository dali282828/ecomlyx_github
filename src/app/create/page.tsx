'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Progress,
  SimpleGrid,
  Input,
} from '@chakra-ui/react';
import TemplatePreview from '@/components/templates/TemplatePreview';
import DomainConnection from '@/components/domains/DomainConnection';
import WordPressSetup from '@/components/wordpress/WordPressSetup';

const steps = [
  { id: 1, title: 'Choose Mode' },
  { id: 2, title: 'Choose Template' },
  { id: 3, title: 'Business Info' },
  { id: 4, title: 'Connect Domain' },
  { id: 5, title: 'WordPress Setup' },
  { id: 6, title: 'Complete' },
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
  const toast = useToast();

  // AI/Classic info state
  const [aiInfo, setAiInfo] = useState({ name: '', type: '', description: '' });
  const [classicInfo, setClassicInfo] = useState({ name: '', type: '' });
  const [adminEmail, setAdminEmail] = useState('');

  // Step handlers
  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setCurrentStep(2);
  };

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template);
    setCurrentStep(3);
  };

  const handleAiInfoSubmit = (e) => {
    e.preventDefault();
    // Simulate AI generation and website creation
    setTimeout(() => {
      setWebsiteId('ai-demo-id');
      setCurrentStep(4);
    }, 1000);
  };

  const handleClassicInfoSubmit = (e) => {
    e.preventDefault();
    // Simulate manual website creation
    setTimeout(() => {
      setWebsiteId('classic-demo-id');
      setCurrentStep(4);
    }, 1000);
  };

  const handleDomainComplete = () => {
    setCurrentStep(5);
  };

  const handleWordPressComplete = () => {
    setCurrentStep(6);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg">Create Your Website</Heading>
          <Text color="gray.600">Follow these steps to set up your website</Text>
        </Box>

        <Progress
          value={(currentStep / steps.length) * 100}
          size="sm"
          colorScheme="blue"
        />

        <Box>
          {/* Step 1: Choose Mode */}
          {currentStep === 1 && (
            <VStack spacing={6} align="center">
              <Heading size="md">How do you want to build your website?</Heading>
              <Button colorScheme="blue" size="lg" onClick={() => handleModeSelect('ai')}>
                AI Mode (Let AI generate content)
              </Button>
              <Button colorScheme="gray" size="lg" onClick={() => handleModeSelect('classic')}>
                Classic Mode (Manual setup)
              </Button>
            </VStack>
          )}

          {/* Step 2: Choose Template */}
          {currentStep === 2 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {demoTemplates.map((template) => (
                <TemplatePreview
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  onSelect={() => handleTemplateSelect(template)}
                />
              ))}
            </SimpleGrid>
          )}

          {/* Step 3: AI or Classic Info */}
          {currentStep === 3 && mode === 'ai' && (
            <Box as="form" onSubmit={handleAiInfoSubmit} maxW="md" mx="auto" p={6} bg="white" rounded="lg" shadow="md">
              <Heading size="md" mb={4}>Tell us about your business</Heading>
              <VStack spacing={4} align="stretch">
                <Input
                  placeholder="Business Name"
                  value={aiInfo.name}
                  onChange={e => setAiInfo({ ...aiInfo, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Business Type (e.g. Restaurant, Agency)"
                  value={aiInfo.type}
                  onChange={e => setAiInfo({ ...aiInfo, type: e.target.value })}
                  required
                />
                <Input
                  placeholder="Short Description"
                  value={aiInfo.description}
                  onChange={e => setAiInfo({ ...aiInfo, description: e.target.value })}
                  required
                />
                <Input
                  placeholder="Admin Email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  required
                  type="email"
                />
                <Button colorScheme="blue" type="submit">Generate My Website</Button>
              </VStack>
            </Box>
          )}
          {currentStep === 3 && mode === 'classic' && (
            <Box as="form" onSubmit={handleClassicInfoSubmit} maxW="md" mx="auto" p={6} bg="white" rounded="lg" shadow="md">
              <Heading size="md" mb={4}>Manual Website Setup</Heading>
              <VStack spacing={4} align="stretch">
                <Input
                  placeholder="Website Name"
                  value={classicInfo.name}
                  onChange={e => setClassicInfo({ ...classicInfo, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Business Type"
                  value={classicInfo.type}
                  onChange={e => setClassicInfo({ ...classicInfo, type: e.target.value })}
                  required
                />
                <Input
                  placeholder="Admin Email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  required
                  type="email"
                />
                <Button colorScheme="blue" type="submit">Create Website</Button>
              </VStack>
            </Box>
          )}

          {/* Step 4: Connect Domain */}
          {currentStep === 4 && websiteId && (
            <DomainConnection
              websiteId={websiteId}
              onComplete={handleDomainComplete}
            />
          )}

          {/* Step 5: WordPress Setup */}
          {currentStep === 5 && websiteId && (
            <WordPressSetup
              websiteId={websiteId}
              businessName={mode === 'ai' ? aiInfo.name : classicInfo.name}
              businessType={mode === 'ai' ? aiInfo.type : classicInfo.type}
              adminEmail={adminEmail}
              onComplete={handleWordPressComplete}
            />
          )}

          {/* Step 6: Complete */}
          {currentStep === 6 && (
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
        </Box>
      </VStack>
    </Container>
  );
} 