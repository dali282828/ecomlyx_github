'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useColorModeValue,
  Spinner,
  Center,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
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
  Select,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
  Divider,
  Flex,
  Avatar,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Progress as ChakraProgress,
  List,
  ListItem,
  ListIcon,
  Image,
} from '@chakra-ui/react';
import {
  FiUsers,
  FiActivity,
  FiCreditCard,
  FiHelpCircle,
  FiGlobe,
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiUpload,
  FiSettings,
  FiRefreshCw,
  FiPieChart,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiTrash2,
  FiEye,
  FiExternalLink,
  FiShare2,
  FiLock,
  FiUnlock,
  FiServer,
  FiDatabase,
  FiCpu,
  FiHardDrive,
  FiWifi,
  FiShield,
  FiDollarSign,
  FiClock,
  FiCalendar,
  FiMail,
  FiMessageSquare,
  FiStar,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiMinus,
  FiMaximize2,
  FiMinimize2,
  FiGrid,
  FiList,
  FiColumns,
  FiLayers,
  FiPackage,
  FiShoppingCart,
  FiShoppingBag,
  FiBox,
  FiTruck,
  FiUser,
  FiUserPlus,
  FiUserMinus,
  FiUserCheck,
  FiUserX,
  FiUsers as FiUsers2,
  FiUser as FiUser2,
  FiUserPlus as FiUserPlus2,
  FiUserMinus as FiUserMinus2,
  FiUserCheck as FiUserCheck2,
  FiUserX as FiUserX2,
  FiUsers as FiUsers3,
  FiUser as FiUser3,
  FiUserPlus as FiUserPlus3,
  FiUserMinus as FiUserMinus3,
  FiUserCheck as FiUserCheck3,
  FiUserX as FiUserX3,
} from 'react-icons/fi';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardContent } from '@/components/DashboardContent';
import { Website, Domain } from '@prisma/client';
import Link from 'next/link';
import { AddIcon, ViewIcon, EditIcon, DeleteIcon, LinkIcon, SettingsIcon } from '@chakra-ui/icons';
import { FiBarChart2 } from 'react-icons/fi';

const mockWebsites = [
  {
    id: '1',
    name: 'Business Starter',
    status: 'Published',
    createdAt: '2024-06-01',
    domain: 'mybusiness.com',
    plan: 'Pro',
    thumbnail: '/templates/business-starter.png',
    lastUpdated: '2024-06-10',
  },
  {
    id: '2',
    name: 'Portfolio Pro',
    status: 'Draft',
    createdAt: '2024-06-02',
    domain: '',
    plan: 'Free',
    thumbnail: '/templates/portfolio-pro.png',
    lastUpdated: '2024-06-09',
  },
  {
    id: '3',
    name: 'E-Commerce Basic',
    status: 'Pending',
    createdAt: '2024-06-03',
    domain: 'shopdemo.com',
    plan: 'Pro',
    thumbnail: '/templates/ecommerce-basic.png',
    lastUpdated: '2024-06-08',
  },
];

const mockMetrics = {
  total: 3,
  published: 1,
  drafts: 1,
  pending: 1,
};

const mockActivity = [
  { id: 1, action: 'Published', website: 'Business Starter', time: '2 hours ago' },
  { id: 2, action: 'Edited', website: 'Portfolio Pro', time: '1 day ago' },
  { id: 3, action: 'Domain Connected', website: 'E-Commerce Basic', time: '3 days ago' },
];

export default function DashboardPage() {
  const { analytics, billing, support, system, loading, error, refreshData, createSupportTicket, updateTicketStatus, addTicketComment } = useDashboard();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const { isOpen: isCreateTicketOpen, onOpen: onCreateTicketOpen, onClose: onCreateTicketClose } = useDisclosure();
  const [newTicket, setNewTicket] = useState({ subject: '', description: '', priority: 'Medium' as const, category: '' });

  if (loading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading dashboard data...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Text color="red.500">{error}</Text>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </VStack>
      </Center>
    );
  }

  if (!analytics || !billing || !support || !system) {
    return (
      <Center h="100vh">
        <Text>No data available</Text>
      </Center>
    );
  }

  const handleCreateTicket = async () => {
    try {
      await createSupportTicket(newTicket);
      onCreateTicketClose();
      setNewTicket({ subject: '', description: '', priority: 'Medium', category: '' });
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  return (
    <Box maxW="7xl" mx="auto" py={10} px={2}>
      {/* Metrics Summary */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        <Stat>
          <StatLabel>Total Websites</StatLabel>
          <StatNumber>{mockMetrics.total}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Published</StatLabel>
          <StatNumber>{mockMetrics.published}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />+1 this week
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Drafts</StatLabel>
          <StatNumber>{mockMetrics.drafts}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Pending</StatLabel>
          <StatNumber>{mockMetrics.pending}</StatNumber>
        </Stat>
      </SimpleGrid>

      {/* Website Cards */}
      <HStack justify="space-between" mb={6}>
        <Heading size="md">Your Websites</Heading>
        <Link href="/create">
          <Button colorScheme="blue" leftIcon={<AddIcon />}>Create New Website</Button>
        </Link>
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={10}>
        {mockWebsites.map((site) => (
          <Box key={site.id} bg={cardBg} borderWidth={1} borderColor={borderColor} rounded="lg" shadow="md" p={4}>
            <Image src={site.thumbnail} alt={site.name} rounded="md" mb={3} w="100%" h="120px" objectFit="cover" />
            <HStack justify="space-between" mb={2}>
              <Heading size="sm">{site.name}</Heading>
              <Badge colorScheme={site.status === 'Published' ? 'green' : site.status === 'Draft' ? 'gray' : 'orange'}>{site.status}</Badge>
            </HStack>
            <Text color="gray.500" fontSize="sm">Plan: {site.plan}</Text>
            <Text color="gray.500" fontSize="sm">Domain: {site.domain || 'Not connected'}</Text>
            <Text color="gray.400" fontSize="xs" mt={1}>Last updated: {site.lastUpdated}</Text>
            <Divider my={3} />
            <HStack spacing={2}>
              <IconButton as={Link} href={`/websites/${site.id}`} aria-label="View" icon={<ViewIcon />} size="sm" />
              <IconButton as={Link} href={`/websites/${site.id}/edit`} aria-label="Edit" icon={<EditIcon />} size="sm" />
              <IconButton as={Link} href={`/websites/${site.id}/domain`} aria-label="Domain" icon={<LinkIcon />} size="sm" />
              <IconButton as={Link} href={`/websites/${site.id}/analytics`} aria-label="Analytics" icon={<FiBarChart2 />} size="sm" />
              <IconButton as={Link} href={`/websites/${site.id}/settings`} aria-label="Settings" icon={<SettingsIcon />} size="sm" />
              <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" colorScheme="red" />
            </HStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Recent Activity */}
      <Box bg={cardBg} borderWidth={1} borderColor={borderColor} rounded="lg" shadow="md" p={6}>
        <Heading size="sm" mb={4}>Recent Activity</Heading>
        <VStack align="stretch" spacing={3}>
          {mockActivity.map((act) => (
            <HStack key={act.id} justify="space-between">
              <Text><b>{act.action}</b> on <b>{act.website}</b></Text>
              <Text color="gray.500" fontSize="sm">{act.time}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
} 