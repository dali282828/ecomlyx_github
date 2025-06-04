'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  Badge,
  HStack,
  VStack,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaGlobe, 
  FaRocket, 
  FaCog, 
  FaChartLine, 
  FaUsers, 
  FaShoppingCart,
  FaCalendarAlt,
  FaWordpress,
  FaRedo
} from 'react-icons/fa';
import { 
  FiEdit2, 
  FiTrash2, 
  FiExternalLink, 
  FiSettings, 
  FiBarChart2,
  FiTrendingUp 
} from 'react-icons/fi';
import { Website, Domain } from '@prisma/client';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { CreateWebsiteForm } from './CreateWebsiteForm';
import PlanSummary from './PlanSummary';

const MotionGrid = motion(Grid);
const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface DashboardContentProps {
  websites: (Website & { domain: Domain | null })[];
}

export function DashboardContent({ websites: initialWebsites }: DashboardContentProps) {
  const [websites, setWebsites] = useState(initialWebsites);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newWebsiteName, setNewWebsiteName] = useState('');
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.500, purple.500)',
    'linear(to-r, brand.200, purple.200)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const [planId, setPlanId] = useState('starter');
  const [usage, setUsage] = useState();
  const [nextBillingDate, setNextBillingDate] = useState();
  const { isOpen: isUpgradeOpen, onOpen: onUpgradeOpen, onClose: onUpgradeClose } = useDisclosure();

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

  useEffect(() => {
    fetchWebsites();
    fetchPlan();
  }, []);

  const fetchWebsites = async () => {
    try {
      const response = await fetch('/api/websites');
      if (!response.ok) {
        throw new Error('Failed to fetch websites');
      }
      const data = await response.json();
      setWebsites(data);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlan = async () => {
    try {
      const response = await fetch('/api/billing');
      if (!response.ok) return;
      const data = await response.json();
      setPlanId((data.currentPlan || 'starter').toLowerCase());
      setUsage(data.usage);
      setNextBillingDate(data.nextBillingDate);
    } catch (e) {
      // fallback to starter
    }
  };

  const handleCreateWebsite = async () => {
    if (!newWebsiteName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a website name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newWebsiteName,
          businessType: 'hotel', // Default to hotel for now
          templateId: 'hotel-1', // Default template
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create website');
      }

      const newWebsite = await response.json();
      setWebsites([newWebsite, ...websites]);
      toast({
        title: 'Success',
        description: 'Website created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setNewWebsiteName('');
      router.push(`/create?websiteId=${newWebsite.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create website',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    if (!confirm('Are you sure you want to delete this website?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/websites/${websiteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete website');
      }

      setWebsites(websites.filter((w) => w.id !== websiteId));
      toast({
        title: 'Success',
        description: 'Website deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete website',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'green';
      case 'DRAFT':
        return 'yellow';
      case 'ARCHIVED':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const handleCreateSuccess = (newWebsite: Website) => {
    setWebsites([...websites, newWebsite]);
  };

  const stats = [
    {
      label: 'Total Websites',
      value: websites.length,
      icon: FaGlobe,
      color: 'blue.500',
      change: '+12%',
    },
    {
      label: 'Active Users',
      value: '1,234',
      icon: FaUsers,
      color: 'green.500',
      change: '+8%',
    },
    {
      label: 'Monthly Revenue',
      value: '$12,345',
      icon: FaChartLine,
      color: 'purple.500',
      change: '+15%',
    },
    {
      label: 'Conversion Rate',
      value: '3.2%',
      icon: FiTrendingUp,
      color: 'orange.500',
      change: '+5%',
    },
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <PlanSummary planId={planId} usage={usage} nextBillingDate={nextBillingDate} onUpgrade={onUpgradeOpen} />
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading size="lg" fontWeight="bold" bgGradient="linear(to-r, brand.500, accent.500)" bgClip="text">
              Welcome Back!
            </Heading>
            <Text color="gray.600">Manage your websites and monitor performance</Text>
          </VStack>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="brand"
            size="lg"
            onClick={onOpen}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          >
            Create Website
          </Button>
        </Flex>

        {/* Stats Grid */}
        <MotionGrid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={6}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {stats.map((stat, index) => (
            <MotionCard
              key={stat.label}
              variants={itemVariants}
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
              transition="all 0.2s"
            >
              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                  <Text color="gray.600" fontSize="sm" fontWeight="medium">
                    {stat.label}
                  </Text>
                  <Heading size="lg" fontWeight="bold">
                    {stat.value}
                  </Heading>
                  <HStack spacing={1}>
                    <Text color={stat.change.startsWith('+') ? 'green.500' : 'red.500'} fontSize="sm">
                      {stat.change}
                    </Text>
                    <Text color="gray.500" fontSize="sm">vs last month</Text>
                  </HStack>
                </VStack>
                <Box
                  p={3}
                  borderRadius="lg"
                  bg={`${stat.color}10`}
                  color={stat.color}
                >
                  <stat.icon size={24} />
                </Box>
              </Flex>
            </MotionCard>
          ))}
        </MotionGrid>

        {/* Websites Grid */}
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="md">Your Websites</Heading>
            <HStack spacing={4}>
              <Button
                leftIcon={<FiBarChart2 />}
                variant="outline"
                size="sm"
              >
                Analytics
              </Button>
              <Button
                leftIcon={<FaCalendarAlt />}
                variant="outline"
                size="sm"
              >
                Schedule
              </Button>
            </HStack>
          </Flex>

          <MotionGrid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={6}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {websites.map((website) => (
                <MotionCard
                  key={website.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  bg="white"
                  overflow="hidden"
                >
                  <Box
                    h="200px"
                    bgGradient="linear(to-br, brand.500, accent.500)"
                    position="relative"
                  >
                    <Image
                      src={`/templates/${website.templateId}.jpg`}
                      alt={website.name}
                      objectFit="cover"
                      w="full"
                      h="full"
                      opacity={0.8}
                    />
                    <Badge
                      position="absolute"
                      top={4}
                      right={4}
                      colorScheme={getStatusColor(website.status)}
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {website.status}
                    </Badge>
                  </Box>

                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Heading size="md">{website.name}</Heading>
                      <Text color="gray.600" noOfLines={2}>
                        {website.businessType} website with advanced features
                      </Text>
                      <HStack spacing={2} wrap="wrap">
                        {website.domain && (
                          <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
                            {website.domain.name}
                          </Badge>
                        )}
                        <Badge colorScheme="purple" px={2} py={1} borderRadius="full">
                          {website.templateId}
                        </Badge>
                      </HStack>
                      {/* WordPress status and actions */}
                      {website.wordPressConfig && (
                        <HStack spacing={3} mt={2}>
                          <Badge
                            colorScheme={
                              website.wordPressConfig.status === 'READY' ? 'green' :
                              website.wordPressConfig.status === 'INSTALLING' ? 'yellow' :
                              website.wordPressConfig.status === 'ERROR' ? 'red' : 'gray'
                            }
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            {website.wordPressConfig.status === 'READY' && 'WordPress Ready'}
                            {website.wordPressConfig.status === 'INSTALLING' && 'Installing...'}
                            {website.wordPressConfig.status === 'ERROR' && 'Install Error'}
                            {!['READY','INSTALLING','ERROR'].includes(website.wordPressConfig.status) && website.wordPressConfig.status}
                          </Badge>
                          {website.wordPressConfig.status === 'READY' && website.wordPressConfig.adminUrl && (
                            <Button
                              leftIcon={<FaWordpress />}
                              colorScheme="blue"
                              size="sm"
                              onClick={() => window.open(website.wordPressConfig.adminUrl, '_blank')}
                              variant="outline"
                            >
                              Open Admin
                            </Button>
                          )}
                          {website.wordPressConfig.status === 'ERROR' && (
                            <Button
                              leftIcon={<FaRedo />}
                              colorScheme="red"
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                await fetch(`/api/websites/${website.id}/wordpress`, { method: 'POST' });
                                toast({ title: 'Retrying WordPress install...', status: 'info' });
                                fetchWebsites();
                              }}
                            >
                              Retry Install
                            </Button>
                          )}
                        </HStack>
                      )}
                    </VStack>
                  </CardBody>

                  <CardFooter borderTop="1px solid" borderColor="gray.100">
                    <HStack spacing={4} w="full" justify="space-between">
                      <Button
                        leftIcon={<FiEdit2 />}
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/edit/${website.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        leftIcon={<FiExternalLink />}
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://${website.domain?.name}`, '_blank')}
                      >
                        Visit
                      </Button>
                      <IconButton
                        aria-label="Delete website"
                        icon={<FiTrash2 />}
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteWebsite(website.id)}
                      />
                    </HStack>
                  </CardFooter>
                </MotionCard>
              ))}
            </AnimatePresence>
          </MotionGrid>
        </VStack>
      </VStack>

      {/* Create Website Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Create New Website</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateWebsiteForm
              onSubmit={handleCreateWebsite}
              isLoading={isLoading}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isUpgradeOpen} onClose={onUpgradeClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upgrade Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Upgrade flow coming soon! Here you can let users select a new plan and handle payment.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onUpgradeClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
} 