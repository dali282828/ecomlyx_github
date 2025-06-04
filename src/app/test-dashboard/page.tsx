'use client';

import { useState, useCallback, useEffect } from 'react';
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
  useColorMode,
  useColorModeValue,
  Spinner,
  Center,
  VStack,
  HStack,
  Icon,
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
  Checkbox,
  Switch,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
  Skeleton,
  SkeletonText,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
  FiBarChart2,
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
  FiBell,
  FiTrendingDown,
  FiMenu,
  FiLayout,
  FiCode,
  FiImage,
  FiFileText,
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiFolder,
  FiGitBranch,
  FiGitCommit,
  FiGitPullRequest,
  FiGitMerge,
  FiGithub,
  FiGitlab,
  FiTerminal,
  FiCommand,
  FiCloud,
  FiCloudOff,
  FiCloudRain,
  FiCloudLightning,
  FiCloudSnow,
  FiCloudDrizzle,
  FiMoreVertical,
  FiMoon,
  FiSun,
  FiBookOpen,
  FiMessageCircle,
} from 'react-icons/fi';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useDashboard } from '@/hooks/useDashboard';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { ResponsiveSankey } from '@nivo/sankey';
import { ResponsiveRadar } from '@nivo/radar';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -5, transition: { duration: 0.2 } }
};

export default function TestDashboard() {
  const { 
    analytics, 
    billing, 
    support, 
    system, 
    notifications, 
    settings,
    loading, 
    error, 
    realTimeUpdates,
    refreshData, 
    createSupportTicket, 
    updateTicketStatus, 
    addTicketComment,
    updateSettings,
    markNotificationAsRead,
    exportReport,
    toggleRealTimeUpdates,
    resolvePerformanceAlert,
    checkAPIStatus,
  } = useDashboard();
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: isCreateTicketOpen, onOpen: onCreateTicketOpen, onClose: onCreateTicketClose } = useDisclosure();
  type TicketPriority = 'Low' | 'Medium' | 'High';
  type TicketStatus = 'Open' | 'Closed' | 'In Progress';
  const [newTicket, setNewTicket] = useState<{ subject: string; description: string; priority: TicketPriority; category: string; status: TicketStatus; }>({ subject: '', description: '', priority: 'Medium', category: '', status: 'Open' });
  const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose } = useDisclosure();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarWidth = isSidebarCollapsed ? '96px' : '240px';
  
  // Define color mode values at the component level
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('white', 'gray.800');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const tableBg = useColorModeValue('white', 'gray.800');
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.700');
  const tableBorderColor = useColorModeValue('gray.200', 'gray.600');
  const statLabelColor = useColorModeValue('gray.600', 'gray.400');
  const statNumberColor = useColorModeValue('blue.600', 'blue.400');
  const progressBg = useColorModeValue('gray.100', 'gray.700');

  const handleAction = useCallback(async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
      toast({
        title: "Success",
        description: "Action completed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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

  // Navigation items
  const clientCenterNavItem = { id: 'clientcenter', label: 'Client Center', icon: FiUserCheck };
  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiLayout },
    { id: 'websites', label: 'Websites', icon: FiGlobe },
    { id: 'analytics', label: 'Analytics', icon: FiActivity },
    { id: 'projects', label: 'Projects', icon: FiFolder },
    { id: 'team', label: 'Team', icon: FiUsers },
    { id: 'resources', label: 'Resources', icon: FiServer },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'support', label: 'Support', icon: FiHelpCircle },
    { id: 'settings', label: 'Settings', icon: FiSettings },
    clientCenterNavItem,
  ];

  // Website templates
  const websiteTemplates = [
    { id: 1, name: 'Business Template', category: 'Business', image: '/templates/business.jpg' },
    { id: 2, name: 'E-commerce Template', category: 'E-commerce', image: '/templates/ecommerce.jpg' },
    { id: 3, name: 'Portfolio Template', category: 'Portfolio', image: '/templates/portfolio.jpg' },
    { id: 4, name: 'Blog Template', category: 'Blog', image: '/templates/blog.jpg' },
  ];

  // Render different sections based on activeSection
  const renderSection = () => {
    return (
      <AnimatePresence mode="wait">
        <MotionBox
          key={activeSection}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <Center h="400px">
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" />
                <Text color={textColor}>Loading...</Text>
              </VStack>
            </Center>
          ) : (
            <MotionBox variants={pageVariants}>
              {(() => {
                switch (activeSection) {
                  case 'overview':
                    return (
                      <>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                          {[
                            { label: 'Total Websites', value: '12', change: '+23.36%', icon: FiGlobe },
                            { label: 'Active Users', value: analytics?.userBehavior?.returningUsers ?? 0, change: '+9.05%', icon: FiUsers },
                            { label: 'Storage Used', value: '45.2 GB', change: '-2.3%', icon: FiHardDrive },
                            { label: 'Bandwidth', value: '1.2 TB', change: '+12.5%', icon: FiWifi },
                          ].map((stat, index) => (
                            <MotionCard
                              key={stat.label}
                              variants={cardVariants}
                              initial="initial"
                              animate="animate"
                              whileHover="hover"
                              bg={cardBg}
                              boxShadow="sm"
                              borderWidth="1px"
                              borderColor={borderColor}
                              custom={index}
                            >
                              <CardBody>
                                <Stat>
                                  <HStack spacing={2} mb={2}>
                                    <Icon as={stat.icon} color={statNumberColor} />
                                    <StatLabel color={statLabelColor}>{stat.label}</StatLabel>
                                  </HStack>
                                  <StatNumber color={statNumberColor}>{stat.value}</StatNumber>
                                  <StatHelpText color={stat.change.startsWith('+') ? 'green.500' : 'orange.500'}>
                                    <StatArrow type={stat.change.startsWith('+') ? 'increase' : 'decrease'} />
                                    {stat.change}
                                  </StatHelpText>
                                </Stat>
                              </CardBody>
                            </MotionCard>
                          ))}
                        </SimpleGrid>

                        <Card bg={cardBg} boxShadow="sm" mb={8} borderWidth="1px" borderColor={borderColor}>
                          <CardHeader>
                            <Heading size="md" color={textColor}>Recent Websites</Heading>
                          </CardHeader>
                          <CardBody>
                            <Table variant="simple" bg={tableBg}>
                              <Thead bg={tableHeaderBg}>
                                <Tr>
                                  <Th color={textColor}>Name</Th>
                                  <Th color={textColor}>Status</Th>
                                  <Th color={textColor}>Last Updated</Th>
                                  <Th color={textColor}>Actions</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {[
                                  { name: 'My Business Site', status: 'Active', lastUpdated: '2 hours ago' },
                                  { name: 'E-commerce Store', status: 'Maintenance', lastUpdated: '1 day ago' },
                                ].map((site) => (
                                  <Tr key={site.name} borderBottomColor={tableBorderColor}>
                                    <Td color={textColor}>{site.name}</Td>
                                    <Td>
                                      <Badge colorScheme={site.status === 'Active' ? 'green' : 'yellow'}>
                                        {site.status}
                                      </Badge>
                                    </Td>
                                    <Td color={textColor}>{site.lastUpdated}</Td>
                                    <Td>
                                      <HStack spacing={2}>
                                        <Tooltip label="Edit website">
                                          <IconButton
                                            aria-label="Edit"
                                            icon={<FiEdit />}
                                            size="sm"
                                            color={textColor}
                                            onClick={() => handleAction(async () => {
                                              // Edit action
                                            })}
                                          />
                                        </Tooltip>
                                        <Tooltip label="View website">
                                          <IconButton
                                            aria-label="View"
                                            icon={<FiEye />}
                                            size="sm"
                                            color={textColor}
                                            onClick={() => handleAction(async () => {
                                              // View action
                                            })}
                                          />
                                        </Tooltip>
                                        <Tooltip label="Website settings">
                                          <IconButton
                                            aria-label="Settings"
                                            icon={<FiSettings />}
                                            size="sm"
                                            color={textColor}
                                            onClick={() => handleAction(async () => {
                                              // Settings action
                                            })}
                                          />
                                        </Tooltip>
                                      </HStack>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </CardBody>
                        </Card>

                        <Card bg={cardBg} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                          <CardHeader>
                            <Heading size="md" color={textColor}>System Status</Heading>
                          </CardHeader>
                          <CardBody>
                            <Stack spacing={4}>
                              {[
                                { label: 'CPU Usage', value: 45, color: 'blue' },
                                { label: 'Memory Usage', value: 60, color: 'green' },
                                { label: 'Storage Usage', value: 75, color: 'orange' },
                              ].map((status) => (
                                <Box key={status.label}>
                                  <HStack justify="space-between" mb={2}>
                                    <Text color={textColor}>{status.label}</Text>
                                    <Text color={textColor}>{status.value}%</Text>
                                  </HStack>
                                  <Progress
                                    value={status.value}
                                    colorScheme={status.color}
                                    bg={progressBg}
                                    borderRadius="full"
                                    transition="all 0.3s"
                                  />
                                </Box>
                              ))}
                            </Stack>
                          </CardBody>
                        </Card>
                      </>
                    );

                  case 'websites':
                    return (
                      <>
                        <HStack justify="space-between" mb={8}>
                          <Heading size="lg" color="gray.700">Your Websites</Heading>
                          <Button leftIcon={<FiPlus />} colorScheme="blue">
                            Create New Website
                          </Button>
                        </HStack>

                        {/* Website Templates */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                          {websiteTemplates.map((template) => (
                            <Card key={template.id} bg="white" boxShadow="sm" _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}>
                              <CardBody>
                                <VStack align="start" spacing={4}>
                                  <Box w="100%" h="200px" bg="gray.100" borderRadius="md" />
                                  <VStack align="start" spacing={1}>
                                    <Text fontWeight="bold" color="gray.700">{template.name}</Text>
                                    <Text color="gray.500">{template.category}</Text>
                                  </VStack>
                                  <Button size="sm" colorScheme="blue" w="100%">
                                    Use Template
                                  </Button>
                                </VStack>
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>

                        {/* Website List */}
                        <Card bg="white" boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color="gray.700">All Websites</Heading>
                          </CardHeader>
                          <CardBody>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>Name</Th>
                                  <Th>Domain</Th>
                                  <Th>Status</Th>
                                  <Th>Last Updated</Th>
                                  <Th>Actions</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                <Tr>
                                  <Td>My Business Site</Td>
                                  <Td>business.com</Td>
                                  <Td><Badge colorScheme="green">Active</Badge></Td>
                                  <Td>2 hours ago</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton aria-label="Edit" icon={<FiEdit />} size="sm" />
                                      <IconButton aria-label="View" icon={<FiEye />} size="sm" />
                                      <IconButton aria-label="Settings" icon={<FiSettings />} size="sm" />
                                    </HStack>
                                  </Td>
                                </Tr>
                                <Tr>
                                  <Td>E-commerce Store</Td>
                                  <Td>store.com</Td>
                                  <Td><Badge colorScheme="yellow">Maintenance</Badge></Td>
                                  <Td>1 day ago</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton aria-label="Edit" icon={<FiEdit />} size="sm" />
                                      <IconButton aria-label="View" icon={<FiEye />} size="sm" />
                                      <IconButton aria-label="Settings" icon={<FiSettings />} size="sm" />
                                    </HStack>
                                  </Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </CardBody>
                        </Card>
                      </>
                    );

                  case 'analytics':
                    return (
                      <>
                        <HStack justify="space-between" mb={8}>
                          <Heading size="lg" color="gray.700">Analytics</Heading>
                          <HStack spacing={4}>
                            <Button leftIcon={<FiDownload />} variant="outline">
                              Export Report
                            </Button>
                            <Button leftIcon={<FiRefreshCw />} onClick={refreshData}>
                              Refresh Data
                            </Button>
                          </HStack>
                        </HStack>

                        {/* Analytics Overview */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Total Visitors</StatLabel>
                                <StatNumber color="blue.600">{analytics?.userBehavior?.newUsers ?? 0}</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="increase" />
                                  23.36%
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Page Views</StatLabel>
                                <StatNumber color="blue.600">45.2K</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="increase" />
                                  12.5%
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Bounce Rate</StatLabel>
                                <StatNumber color="blue.600">32.4%</StatNumber>
                                <StatHelpText color="red.500">
                                  <StatArrow type="decrease" />
                                  2.3%
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Avg. Session</StatLabel>
                                <StatNumber color="blue.600">4m 32s</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="increase" />
                                  8.1%
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Analytics Charts */}
                        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={8}>
                          <GridItem>
                            <Card bg="white" boxShadow="sm">
                              <CardHeader>
                                <Heading size="md" color="gray.700">Visitor Trends</Heading>
                              </CardHeader>
                              <CardBody>
                                <Box h="300px">
                                  <ResponsiveLine
                                    data={[
                                      {
                                        id: 'visitors',
                                        data: [
                                          { x: 'Mon', y: 100 },
                                          { x: 'Tue', y: 120 },
                                          { x: 'Wed', y: 90 },
                                          { x: 'Thu', y: 140 },
                                          { x: 'Fri', y: 160 },
                                          { x: 'Sat', y: 180 },
                                          { x: 'Sun', y: 150 },
                                        ],
                                      },
                                    ]}
                                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                                    xScale={{ type: 'point' }}
                                    yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                      tickSize: 5,
                                      tickPadding: 5,
                                      tickRotation: 0,
                                      legend: 'Day',
                                      legendOffset: 36,
                                      legendPosition: 'middle',
                                    }}
                                    axisLeft={{
                                      tickSize: 5,
                                      tickPadding: 5,
                                      tickRotation: 0,
                                      legend: 'Visitors',
                                      legendOffset: -40,
                                      legendPosition: 'middle',
                                    }}
                                    pointSize={10}
                                    pointColor={{ theme: 'background' }}
                                    pointBorderWidth={2}
                                    pointBorderColor={{ from: 'serieColor' }}
                                    pointLabelYOffset={-12}
                                    useMesh={true}
                                    theme={{
                                      background: 'transparent',
                                      text: {
                                        fill: '#000',
                                      },
                                      grid: {
                                        line: {
                                          stroke: '#000',
                                          strokeWidth: 0.5,
                                        },
                                      },
                                    }}
                                  />
                                </Box>
                              </CardBody>
                            </Card>
                          </GridItem>
                          <GridItem>
                            <Card bg="white" boxShadow="sm">
                              <CardHeader>
                                <Heading size="md" color="gray.700">Device Distribution</Heading>
                              </CardHeader>
                              <CardBody>
                                <Box h="300px">
                                  <ResponsivePie
                                    data={[
                                      { id: 'Desktop', value: 60 },
                                      { id: 'Mobile', value: 30 },
                                      { id: 'Tablet', value: 10 },
                                    ]}
                                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                    innerRadius={0.5}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    activeOuterRadiusOffset={8}
                                    colors={{ scheme: 'nivo' }}
                                    borderWidth={1}
                                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                                    enableArcLinkLabels={true}
                                    arcLinkLabelsSkipAngle={10}
                                    arcLinkLabelsTextColor="#000"
                                    arcLinkLabelsThickness={2}
                                    arcLinkLabelsColor={{ from: 'color' }}
                                    arcLabelsSkipAngle={10}
                                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                    theme={{
                                      background: 'transparent',
                                      text: {
                                        fill: '#000',
                                      },
                                    }}
                                  />
                                </Box>
                              </CardBody>
                            </Card>
                          </GridItem>
                        </Grid>
                      </>
                    );

                  case 'projects':
                    return (
                      <>
                        <HStack justify="space-between" mb={8}>
                          <Heading size="lg" color="gray.700">Projects</Heading>
                          <HStack spacing={4}>
                            <Button leftIcon={<FiPlus />} colorScheme="blue">
                              New Project
                            </Button>
                            <Button leftIcon={<FiFilter />} variant="outline">
                              Filter
                            </Button>
                          </HStack>
                        </HStack>

                        {/* Project Stats */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Active Projects</StatLabel>
                                <StatNumber color="blue.600">12</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="increase" />
                                  3 new this month
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Tasks Completed</StatLabel>
                                <StatNumber color="blue.600">85%</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="increase" />
                                  5% from last week
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Team Members</StatLabel>
                                <StatNumber color="blue.600">8</StatNumber>
                                <StatHelpText color="gray.500">
                                  Across all projects
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Project Health</StatLabel>
                                <StatNumber color="blue.600">92%</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="increase" />
                                  2% from last week
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Project List */}
                        <Card bg="white" boxShadow="sm" mb={8}>
                          <CardHeader>
                            <Heading size="md" color="gray.700">Active Projects</Heading>
                          </CardHeader>
                          <CardBody>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>Project Name</Th>
                                  <Th>Status</Th>
                                  <Th>Progress</Th>
                                  <Th>Team</Th>
                                  <Th>Due Date</Th>
                                  <Th>Actions</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                <Tr>
                                  <Td>E-commerce Platform</Td>
                                  <Td><Badge colorScheme="green">Active</Badge></Td>
                                  <Td>
                                    <Progress value={75} colorScheme="blue" size="sm" />
                                  </Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <Avatar size="xs" name="John Doe" />
                                      <Avatar size="xs" name="Jane Smith" />
                                      <Avatar size="xs" name="+2" />
                                    </HStack>
                                  </Td>
                                  <Td>Mar 15, 2024</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton aria-label="View" icon={<FiEye />} size="sm" />
                                      <IconButton aria-label="Edit" icon={<FiEdit />} size="sm" />
                                      <IconButton aria-label="Settings" icon={<FiSettings />} size="sm" />
                                    </HStack>
                                  </Td>
                                </Tr>
                                <Tr>
                                  <Td>Blog Redesign</Td>
                                  <Td><Badge colorScheme="yellow">In Progress</Badge></Td>
                                  <Td>
                                    <Progress value={45} colorScheme="yellow" size="sm" />
                                  </Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <Avatar size="xs" name="Mike Johnson" />
                                      <Avatar size="xs" name="Sarah Wilson" />
                                    </HStack>
                                  </Td>
                                  <Td>Apr 1, 2024</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton aria-label="View" icon={<FiEye />} size="sm" />
                                      <IconButton aria-label="Edit" icon={<FiEdit />} size="sm" />
                                      <IconButton aria-label="Settings" icon={<FiSettings />} size="sm" />
                                    </HStack>
                                  </Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </CardBody>
                        </Card>

                        {/* Project Timeline */}
                        <Card bg="white" boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color="gray.700">Project Timeline</Heading>
                          </CardHeader>
                          <CardBody>
                            <Box h="300px">
                              <ResponsiveBar
                                data={[
                                  { phase: 'Planning', start: 0, end: 20 },
                                  { phase: 'Design', start: 20, end: 40 },
                                  { phase: 'Development', start: 40, end: 70 },
                                  { phase: 'Testing', start: 70, end: 85 },
                                  { phase: 'Deployment', start: 85, end: 100 },
                                ]}
                                keys={['start', 'end']}
                                indexBy="phase"
                                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                colors={{ scheme: 'nivo' }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                  tickSize: 5,
                                  tickPadding: 5,
                                  tickRotation: 0,
                                  legend: 'Project Phase',
                                  legendPosition: 'middle',
                                  legendOffset: 32,
                                }}
                                axisLeft={{
                                  tickSize: 5,
                                  tickPadding: 5,
                                  tickRotation: 0,
                                  legend: 'Progress (%)',
                                  legendPosition: 'middle',
                                  legendOffset: -40,
                                }}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                legends={[
                                  {
                                    dataFrom: 'keys',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 120,
                                    translateY: 0,
                                    itemsSpacing: 2,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 20,
                                    effects: [
                                      {
                                        on: 'hover',
                                        style: {
                                          itemOpacity: 1,
                                        },
                                      },
                                    ],
                                  },
                                ]}
                                animate={true}
                              />
                            </Box>
                          </CardBody>
                        </Card>
                      </>
                    );

                  case 'team':
                    return (
                      <>
                        <HStack justify="space-between" mb={8}>
                          <Heading size="lg" color="gray.700">Team Management</Heading>
                          <Button leftIcon={<FiUserPlus />} colorScheme="blue">
                            Add Team Member
                          </Button>
                        </HStack>

                        {/* Team Overview */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Total Members</StatLabel>
                                <StatNumber color="blue.600">12</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="increase" />
                                  2 new this month
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Active Now</StatLabel>
                                <StatNumber color="blue.600">8</StatNumber>
                                <StatHelpText color="gray.500">
                                  Online team members
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Tasks Assigned</StatLabel>
                                <StatNumber color="blue.600">45</StatNumber>
                                <StatHelpText color="gray.500">
                                  Across all projects
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Productivity</StatLabel>
                                <StatNumber color="blue.600">92%</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="increase" />
                                  5% from last week
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Team Members */}
                        <Card bg="white" boxShadow="sm" mb={8}>
                          <CardHeader>
                            <Heading size="md" color="gray.700">Team Members</Heading>
                          </CardHeader>
                          <CardBody>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>Member</Th>
                                  <Th>Role</Th>
                                  <Th>Projects</Th>
                                  <Th>Status</Th>
                                  <Th>Last Active</Th>
                                  <Th>Actions</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                <Tr>
                                  <Td>
                                    <HStack spacing={3}>
                                      <Avatar name="John Doe" size="sm" />
                                      <VStack align="start" spacing={0}>
                                        <Text fontWeight="medium">John Doe</Text>
                                        <Text fontSize="sm" color="gray.500">john@example.com</Text>
                                      </VStack>
                                    </HStack>
                                  </Td>
                                  <Td>Project Manager</Td>
                                  <Td>4</Td>
                                  <Td><Badge colorScheme="green">Online</Badge></Td>
                                  <Td>2 minutes ago</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton aria-label="Message" icon={<FiMessageSquare />} size="sm" />
                                      <IconButton aria-label="Edit" icon={<FiEdit />} size="sm" />
                                      <IconButton aria-label="More" icon={<FiMoreVertical />} size="sm" />
                                    </HStack>
                                  </Td>
                                </Tr>
                                <Tr>
                                  <Td>
                                    <HStack spacing={3}>
                                      <Avatar name="Jane Smith" size="sm" />
                                      <VStack align="start" spacing={0}>
                                        <Text fontWeight="medium">Jane Smith</Text>
                                        <Text fontSize="sm" color="gray.500">jane@example.com</Text>
                                      </VStack>
                                    </HStack>
                                  </Td>
                                  <Td>Developer</Td>
                                  <Td>3</Td>
                                  <Td><Badge colorScheme="yellow">Away</Badge></Td>
                                  <Td>15 minutes ago</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton aria-label="Message" icon={<FiMessageSquare />} size="sm" />
                                      <IconButton aria-label="Edit" icon={<FiEdit />} size="sm" />
                                      <IconButton aria-label="More" icon={<FiMoreVertical />} size="sm" />
                                    </HStack>
                                  </Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </CardBody>
                        </Card>

                        {/* Team Activity */}
                        <Card bg="white" boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color="gray.700">Recent Activity</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack align="stretch" spacing={4}>
                              <HStack spacing={4}>
                                <Avatar name="John Doe" size="sm" />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium">John Doe completed a task</Text>
                                  <Text fontSize="sm" color="gray.500">2 minutes ago</Text>
                                </VStack>
                              </HStack>
                              <HStack spacing={4}>
                                <Avatar name="Jane Smith" size="sm" />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium">Jane Smith commented on a project</Text>
                                  <Text fontSize="sm" color="gray.500">15 minutes ago</Text>
                                </VStack>
                              </HStack>
                              <HStack spacing={4}>
                                <Avatar name="Mike Johnson" size="sm" />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium">Mike Johnson started a new project</Text>
                                  <Text fontSize="sm" color="gray.500">1 hour ago</Text>
                                </VStack>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      </>
                    );

                  case 'resources':
                    return (
                      <>
                        <HStack justify="space-between" mb={8}>
                          <Heading size="lg" color="gray.700">Resource Management</Heading>
                          <HStack spacing={4}>
                            <Button leftIcon={<FiRefreshCw />} onClick={refreshData}>
                              Refresh
                            </Button>
                            <Button leftIcon={<FiDownload />} variant="outline">
                              Export Report
                            </Button>
                          </HStack>
                        </HStack>

                        {/* Resource Overview */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">CPU Usage</StatLabel>
                                <StatNumber color="blue.600">45%</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="decrease" />
                                  5% from last hour
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Memory Usage</StatLabel>
                                <StatNumber color="blue.600">60%</StatNumber>
                                <StatHelpText color="orange.500">
                                  <StatArrow type="increase" />
                                  10% from last hour
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Storage Usage</StatLabel>
                                <StatNumber color="blue.600">75%</StatNumber>
                                <StatHelpText color="red.500">
                                  <StatArrow type="increase" />
                                  15% from last hour
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Network Usage</StatLabel>
                                <StatNumber color="blue.600">30%</StatNumber>
                                <StatHelpText color="green.500">
                                  <StatArrow type="decrease" />
                                  5% from last hour
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Resource Monitoring */}
                        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={8}>
                          <GridItem>
                            <Card bg="white" boxShadow="sm">
                              <CardHeader>
                                <Heading size="md" color="gray.700">CPU & Memory Usage</Heading>
                              </CardHeader>
                              <CardBody>
                                <Box h="300px">
                                  <ResponsiveLine
                                    data={[
                                      {
                                        id: 'CPU',
                                        data: [
                                          { x: '00:00', y: 45 },
                                          { x: '01:00', y: 50 },
                                          { x: '02:00', y: 40 },
                                          { x: '03:00', y: 55 },
                                          { x: '04:00', y: 45 },
                                        ],
                                      },
                                      {
                                        id: 'Memory',
                                        data: [
                                          { x: '00:00', y: 60 },
                                          { x: '01:00', y: 65 },
                                          { x: '02:00', y: 55 },
                                          { x: '03:00', y: 70 },
                                          { x: '04:00', y: 60 },
                                        ],
                                      },
                                    ]}
                                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                                    xScale={{ type: 'point' }}
                                    yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                      tickSize: 5,
                                      tickPadding: 5,
                                      tickRotation: 0,
                                      legend: 'Time',
                                      legendOffset: 36,
                                      legendPosition: 'middle',
                                    }}
                                    axisLeft={{
                                      tickSize: 5,
                                      tickPadding: 5,
                                      tickRotation: 0,
                                      legend: 'Usage (%)',
                                      legendOffset: -40,
                                      legendPosition: 'middle',
                                    }}
                                    pointSize={10}
                                    pointColor={{ theme: 'background' }}
                                    pointBorderWidth={2}
                                    pointBorderColor={{ from: 'serieColor' }}
                                    pointLabelYOffset={-12}
                                    useMesh={true}
                                    theme={{
                                      background: 'transparent',
                                      text: {
                                        fill: '#000',
                                      },
                                      grid: {
                                        line: {
                                          stroke: '#000',
                                          strokeWidth: 0.5,
                                        },
                                      },
                                    }}
                                  />
                                </Box>
                              </CardBody>
                            </Card>
                          </GridItem>
                          <GridItem>
                            <Card bg="white" boxShadow="sm">
                              <CardHeader>
                                <Heading size="md" color="gray.700">Storage Distribution</Heading>
                              </CardHeader>
                              <CardBody>
                                <Box h="300px">
                                  <ResponsivePie
                                    data={[
                                      { id: 'Websites', value: 40 },
                                      { id: 'Databases', value: 30 },
                                      { id: 'Backups', value: 20 },
                                      { id: 'Other', value: 10 },
                                    ]}
                                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                    innerRadius={0.5}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    activeOuterRadiusOffset={8}
                                    colors={{ scheme: 'nivo' }}
                                    borderWidth={1}
                                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                                    enableArcLinkLabels={true}
                                    arcLinkLabelsSkipAngle={10}
                                    arcLinkLabelsTextColor="#000"
                                    arcLinkLabelsThickness={2}
                                    arcLinkLabelsColor={{ from: 'color' }}
                                    arcLabelsSkipAngle={10}
                                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                    theme={{
                                      background: 'transparent',
                                      text: {
                                        fill: '#000',
                                      },
                                    }}
                                  />
                                </Box>
                              </CardBody>
                            </Card>
                          </GridItem>
                        </Grid>

                        {/* Resource Alerts */}
                        <Card bg="white" boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color="gray.700">Resource Alerts</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack align="stretch" spacing={4}>
                              <Alert status="warning" variant="subtle">
                                <AlertIcon />
                                <Box>
                                  <AlertTitle>High Memory Usage</AlertTitle>
                                  <AlertDescription>
                                    Memory usage is above 80% for the last 30 minutes.
                                  </AlertDescription>
                                </Box>
                              </Alert>
                              <Alert status="error" variant="subtle">
                                <AlertIcon />
                                <Box>
                                  <AlertTitle>Storage Warning</AlertTitle>
                                  <AlertDescription>
                                    Storage usage is approaching the limit (90% used).
                                  </AlertDescription>
                                </Box>
                              </Alert>
                              <Alert status="info" variant="subtle">
                                <AlertIcon />
                                <Box>
                                  <AlertTitle>Backup Required</AlertTitle>
                                  <AlertDescription>
                                    System backup is due in 2 days.
                                  </AlertDescription>
                                </Box>
                              </Alert>
                            </VStack>
                          </CardBody>
                        </Card>
                      </>
                    );

                  case 'billing':
                    return (
                      <>
                        <HStack justify="space-between" mb={8}>
                          <Heading size="lg" color="gray.700">Billing</Heading>
                          <Button leftIcon={<FiDownload />} variant="outline">
                            Download Invoice
                          </Button>
                        </HStack>

                        {/* Billing Overview */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Current Plan</StatLabel>
                                <StatNumber color="blue.600">Pro</StatNumber>
                                <StatHelpText color="gray.500">
                                  $29/month
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Next Billing</StatLabel>
                                <StatNumber color="blue.600">$29.00</StatNumber>
                                <StatHelpText color="gray.500">
                                  Due in 15 days
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Usage</StatLabel>
                                <StatNumber color="blue.600">75%</StatNumber>
                                <StatHelpText color="gray.500">
                                  of plan limit
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Billing History */}
                        <Card bg="white" boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color="gray.700">Billing History</Heading>
                          </CardHeader>
                          <CardBody>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>Date</Th>
                                  <Th>Description</Th>
                                  <Th>Amount</Th>
                                  <Th>Status</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                <Tr>
                                  <Td>Mar 1, 2024</Td>
                                  <Td>Pro Plan - Monthly</Td>
                                  <Td>$29.00</Td>
                                  <Td><Badge colorScheme="green">Paid</Badge></Td>
                                </Tr>
                                <Tr>
                                  <Td>Feb 1, 2024</Td>
                                  <Td>Pro Plan - Monthly</Td>
                                  <Td>$29.00</Td>
                                  <Td><Badge colorScheme="green">Paid</Badge></Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </CardBody>
                        </Card>
                      </>
                    );

                  case 'support':
                    return (
                      <>
                        <HStack justify="space-between" mb={8}>
                          <Heading size="lg" color="gray.700">Support</Heading>
                          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onCreateTicketOpen}>
                            Create Ticket
                          </Button>
                        </HStack>

                        {/* Support Overview */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Open Tickets</StatLabel>
                                <StatNumber color="blue.600">3</StatNumber>
                                <StatHelpText color="gray.500">
                                  Active support requests
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Response Time</StatLabel>
                                <StatNumber color="blue.600">2h</StatNumber>
                                <StatHelpText color="green.500">
                                  Average
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                          <Card bg="white" boxShadow="sm">
                            <CardBody>
                              <Stat>
                                <StatLabel color="gray.600">Resolved</StatLabel>
                                <StatNumber color="blue.600">24</StatNumber>
                                <StatHelpText color="gray.500">
                                  This month
                                </StatHelpText>
                              </Stat>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Support Tickets */}
                        <Card bg="white" boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color="gray.700">Recent Tickets</Heading>
                          </CardHeader>
                          <CardBody>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>ID</Th>
                                  <Th>Subject</Th>
                                  <Th>Status</Th>
                                  <Th>Created</Th>
                                  <Th>Actions</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                <Tr>
                                  <Td>#1234</Td>
                                  <Td>Website Loading Issue</Td>
                                  <Td><Badge colorScheme="yellow">In Progress</Badge></Td>
                                  <Td>2 hours ago</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton aria-label="View" icon={<FiEye />} size="sm" />
                                      <IconButton aria-label="Reply" icon={<FiMessageSquare />} size="sm" />
                                    </HStack>
                                  </Td>
                                </Tr>
                                <Tr>
                                  <Td>#1233</Td>
                                  <Td>Domain Configuration</Td>
                                  <Td><Badge colorScheme="green">Resolved</Badge></Td>
                                  <Td>1 day ago</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <IconButton aria-label="View" icon={<FiEye />} size="sm" />
                                      <IconButton aria-label="Reply" icon={<FiMessageSquare />} size="sm" />
                                    </HStack>
                                  </Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </CardBody>
                        </Card>
                      </>
                    );

                  case 'settings':
                    return (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {/* Account Settings */}
                        <Card bg={cardBg} boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color={textColor}>Account</Heading>
                          </CardHeader>
                          <CardBody>
                            <Stack spacing={4}>
                              <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" defaultValue="user@example.com" />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Change Password</FormLabel>
                                <Input type="password" placeholder="New password" />
                              </FormControl>
                              <Button colorScheme="blue">Save Account</Button>
                            </Stack>
                          </CardBody>
                        </Card>
                        {/* Security Settings */}
                        <Card bg={cardBg} boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color={textColor}>Security</Heading>
                          </CardHeader>
                          <CardBody>
                            <Stack spacing={4}>
                              <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Two-Factor Authentication</FormLabel>
                                <Switch />
                              </FormControl>
                              <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Login Alerts</FormLabel>
                                <Switch defaultChecked />
                              </FormControl>
                              <Button colorScheme="blue">Save Security</Button>
                            </Stack>
                          </CardBody>
                        </Card>
                        {/* Notifications Settings */}
                        <Card bg={cardBg} boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color={textColor}>Notifications</Heading>
                          </CardHeader>
                          <CardBody>
                            <Stack spacing={4}>
                              <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Email Notifications</FormLabel>
                                <Switch defaultChecked />
                              </FormControl>
                              <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">SMS Notifications</FormLabel>
                                <Switch />
                              </FormControl>
                              <Button colorScheme="blue">Save Notifications</Button>
                            </Stack>
                          </CardBody>
                        </Card>
                        {/* Appearance Settings */}
                        <Card bg={cardBg} boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color={textColor}>Appearance</Heading>
                          </CardHeader>
                          <CardBody>
                            <Stack spacing={4}>
                              <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Dark Mode</FormLabel>
                                <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Theme Color</FormLabel>
                                <Select defaultValue="blue">
                                  <option value="blue">Blue</option>
                                  <option value="green">Green</option>
                                  <option value="purple">Purple</option>
                                  <option value="orange">Orange</option>
                                </Select>
                              </FormControl>
                              <Button colorScheme="blue">Save Appearance</Button>
                            </Stack>
                          </CardBody>
                        </Card>
                        {/* Integrations Settings */}
                        <Card bg={cardBg} boxShadow="sm">
                          <CardHeader>
                            <Heading size="md" color={textColor}>Integrations</Heading>
                          </CardHeader>
                          <CardBody>
                            <Stack spacing={4}>
                              <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Google Analytics</FormLabel>
                                <Switch />
                              </FormControl>
                              <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Mailchimp</FormLabel>
                                <Switch />
                              </FormControl>
                              <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Zapier</FormLabel>
                                <Switch />
                              </FormControl>
                              <Button colorScheme="blue">Save Integrations</Button>
                            </Stack>
                          </CardBody>
                        </Card>
                        {/* Advanced Settings */}
                        <Card bg={cardBg} boxShadow="sm" gridColumn={{ base: 'span 1', md: 'span 2' }}>
                          <CardHeader>
                            <Heading size="md" color={textColor}>Advanced Settings</Heading>
                          </CardHeader>
                          <CardBody>
                            <Stack spacing={4}>
                              <Accordion allowMultiple>
                                {/* Custom Domain & Branding */}
                                <AccordionItem>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">Custom Domain & Branding</Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                  <AccordionPanel pb={4}>
                                    <FormControl mb={3}>
                                      <FormLabel>Custom Domain</FormLabel>
                                      <Input placeholder="yourdomain.com" />
                                      <Button mt={2} size="sm" colorScheme="blue">Add Domain</Button>
                                    </FormControl>
                                    <FormControl mb={3}>
                                      <FormLabel>Logo</FormLabel>
                                      <Input type="file" />
                                    </FormControl>
                                    <FormControl mb={3}>
                                      <FormLabel>Brand Color</FormLabel>
                                      <Input type="color" w="40px" h="40px" p={0} border="none" />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel>Favicon</FormLabel>
                                      <Input type="file" />
                                    </FormControl>
                                  </AccordionPanel>
                                </AccordionItem>
                                {/* Team Management */}
                                <AccordionItem>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">Team Management</Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                  <AccordionPanel pb={4}>
                                    <FormControl mb={3}>
                                      <FormLabel>Invite Team Member</FormLabel>
                                      <Input placeholder="Email address" />
                                      <Select mt={2} placeholder="Select role">
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                      </Select>
                                      <Button mt={2} size="sm" colorScheme="blue">Send Invite</Button>
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel>Activity Log</FormLabel>
                                      <Button size="sm" leftIcon={<FiList />}>View Log</Button>
                                    </FormControl>
                                  </AccordionPanel>
                                </AccordionItem>
                                {/* Security & Privacy */}
                                <AccordionItem>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">Security & Privacy</Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                  <AccordionPanel pb={4}>
                                    <FormControl mb={3}>
                                      <FormLabel>Active Sessions</FormLabel>
                                      <Button size="sm" colorScheme="red">Revoke All Sessions</Button>
                                    </FormControl>
                                    <FormControl mb={3}>
                                      <FormLabel>IP Whitelisting</FormLabel>
                                      <Input placeholder="Add IP address" />
                                      <Button mt={2} size="sm" colorScheme="blue">Add IP</Button>
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel>Export Data (GDPR)</FormLabel>
                                      <Button size="sm" leftIcon={<FiDownload />}>Export Data</Button>
                                    </FormControl>
                                  </AccordionPanel>
                                </AccordionItem>
                                {/* API & Integrations */}
                                <AccordionItem>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">API & Integrations</Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                  <AccordionPanel pb={4}>
                                    <FormControl mb={3}>
                                      <FormLabel>API Keys</FormLabel>
                                      <Button size="sm" colorScheme="blue">Generate API Key</Button>
                                    </FormControl>
                                    <FormControl mb={3}>
                                      <FormLabel>Webhooks</FormLabel>
                                      <Input placeholder="Webhook URL" />
                                      <Button mt={2} size="sm" colorScheme="blue">Add Webhook</Button>
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel>Third-party Integrations</FormLabel>
                                      <Checkbox>Slack</Checkbox>
                                      <Checkbox>Discord</Checkbox>
                                      <Checkbox>Trello</Checkbox>
                                    </FormControl>
                                  </AccordionPanel>
                                </AccordionItem>
                                {/* Accessibility & Language */}
                                <AccordionItem>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left">Accessibility & Language</Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                  <AccordionPanel pb={4}>
                                    <FormControl mb={3}>
                                      <FormLabel>Language</FormLabel>
                                      <Select defaultValue="en">
                                        <option value="en">English</option>
                                        <option value="fr">French</option>
                                        <option value="es">Spanish</option>
                                        <option value="de">German</option>
                                      </Select>
                                    </FormControl>
                                    <FormControl mb={3} display="flex" alignItems="center">
                                      <FormLabel mb="0">High Contrast Mode</FormLabel>
                                      <Switch />
                                    </FormControl>
                                    <FormControl display="flex" alignItems="center">
                                      <FormLabel mb="0">Large Font</FormLabel>
                                      <Switch />
                                    </FormControl>
                                  </AccordionPanel>
                                </AccordionItem>
                              </Accordion>
                            </Stack>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    );

                  case 'clientcenter':
                    return (
                      <>
                        <HStack justify="space-between" mb={8}>
                          <Heading size="lg" color="gray.700">Client Center</Heading>
                        </HStack>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
                          {/* Domain Management */}
                          <Card bg={cardBg} boxShadow="sm">
                            <CardHeader>
                              <HStack><Icon as={FiGlobe} /><Heading size="sm" color={textColor}>Domain Management</Heading></HStack>
                            </CardHeader>
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <Text color={textColor}>Primary Domain: <b>business.com</b></Text>
                                <Badge colorScheme="green">SSL Active</Badge>
                                <Button size="sm" leftIcon={<FiRefreshCw />}>Renew Domain</Button>
                                <Button size="sm" leftIcon={<FiPlus />}>Connect New Domain</Button>
                              </VStack>
                            </CardBody>
                          </Card>
                          {/* Performance & Security */}
                          <Card bg={cardBg} boxShadow="sm">
                            <CardHeader>
                              <HStack><Icon as={FiShield} /><Heading size="sm" color={textColor}>Performance & Security</Heading></HStack>
                            </CardHeader>
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <Text color={textColor}>Uptime: <b>99.99%</b></Text>
                                <Text color={textColor}>Speed Score: <b>92</b></Text>
                                <Badge colorScheme="green">Malware Scan: Clean</Badge>
                                <Badge colorScheme="green">SSL: Valid</Badge>
                              </VStack>
                            </CardBody>
                          </Card>
                          {/* Backups & Restore */}
                          <Card bg={cardBg} boxShadow="sm">
                            <CardHeader>
                              <HStack><Icon as={FiDatabase} /><Heading size="sm" color={textColor}>Backups & Restore</Heading></HStack>
                            </CardHeader>
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <Text color={textColor}>Last Backup: <b>Today, 03:00 AM</b></Text>
                                <Button size="sm" leftIcon={<FiDownload />}>Download Backup</Button>
                                <Button size="sm" leftIcon={<FiUpload />}>Restore</Button>
                                <Button size="sm" leftIcon={<FiPlus />}>Create Backup</Button>
                              </VStack>
                            </CardBody>
                          </Card>
                          {/* Team Management */}
                          <Card bg={cardBg} boxShadow="sm">
                            <CardHeader>
                              <HStack><Icon as={FiUsers} /><Heading size="sm" color={textColor}>Team Management</Heading></HStack>
                            </CardHeader>
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <Text color={textColor}>Members: <b>5</b></Text>
                                <Button size="sm" leftIcon={<FiUserPlus />}>Invite Member</Button>
                                <Button size="sm" leftIcon={<FiList />}>View Activity Log</Button>
                              </VStack>
                            </CardBody>
                          </Card>
                          {/* Support & Help */}
                          <Card bg={cardBg} boxShadow="sm">
                            <CardHeader>
                              <HStack><Icon as={FiHelpCircle} /><Heading size="sm" color={textColor}>Support & Help</Heading></HStack>
                            </CardHeader>
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <Button size="sm" leftIcon={<FiMessageSquare />}>Open Ticket</Button>
                                <Button size="sm" leftIcon={<FiBookOpen />}>Knowledge Base</Button>
                                <Button size="sm" leftIcon={<FiMessageCircle />}>Live Chat</Button>
                              </VStack>
                            </CardBody>
                          </Card>
                          {/* Billing & Subscription */}
                          <Card bg={cardBg} boxShadow="sm">
                            <CardHeader>
                              <HStack><Icon as={FiCreditCard} /><Heading size="sm" color={textColor}>Billing & Subscription</Heading></HStack>
                            </CardHeader>
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <Text color={textColor}>Plan: <b>Pro</b></Text>
                                <Text color={textColor}>Next Invoice: <b>Apr 1, 2024</b></Text>
                                <Button size="sm" leftIcon={<FiDownload />}>Download Invoice</Button>
                                <Button size="sm" leftIcon={<FiSettings />}>Manage Plan</Button>
                              </VStack>
                            </CardBody>
                          </Card>
                          {/* Feedback Widget */}
                          <Card bg={cardBg} boxShadow="sm">
                            <CardHeader>
                              <HStack><Icon as={FiStar} /><Heading size="sm" color={textColor}>Feedback</Heading></HStack>
                            </CardHeader>
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <Button size="sm" leftIcon={<FiMessageCircle />}>Suggest a Feature</Button>
                                <Button size="sm" leftIcon={<FiAlertCircle />}>Report a Bug</Button>
                              </VStack>
                            </CardBody>
                          </Card>
                        </SimpleGrid>
                      </>
                    );

                  default:
                    return (
                      <Center h="400px">
                        <Text color="gray.500">Select a section from the sidebar</Text>
                      </Center>
                    );
                }
              })()}
            </MotionBox>
          )}
        </MotionBox>
      </AnimatePresence>
    );
  };

  // Create Ticket Modal
  const CreateTicketModal = () => (
    <Modal isOpen={isCreateTicketOpen} onClose={onCreateTicketClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Support Ticket</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Subject</FormLabel>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Enter ticket subject"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Describe your issue"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                value={newTicket.category}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
              >
                <option value="">Select a category</option>
                <option value="Technical">Technical</option>
                <option value="Billing">Billing</option>
                <option value="General">General</option>
              </Select>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onCreateTicketClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={() => {
            createSupportTicket(newTicket);
            onCreateTicketClose();
          }}>
            Create Ticket
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  // Add this function to handle sidebar collapse
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box
        as="header"
        pos="sticky"
        top={0}
        zIndex={99}
        bg={headerBg}
        borderBottomWidth="1px"
        borderColor={borderColor}
        px={4}
        py={3}
      >
        <Flex justify="space-between" align="center">
          <HStack spacing={4}>
            <IconButton
              display={{ base: 'inline-flex', md: 'none' }}
              icon={<FiMenu />}
              aria-label="Open menu"
              variant="ghost"
              onClick={onSidebarOpen}
              color={textColor}
            />
            <Heading size="md" letterSpacing="tight" color={statNumberColor}>10Web</Heading>
          </HStack>
          <HStack spacing={4}>
            <IconButton
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              aria-label="Toggle color mode"
              variant="ghost"
              onClick={toggleColorMode}
              color={textColor}
            />
            <IconButton
              icon={<FiBell />}
              aria-label="Notifications"
              variant="ghost"
              color={textColor}
            />
            <Avatar name="User" size="sm" />
          </HStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Flex>
        {/* Sidebar */}
        <Box
          as="nav"
          pos="fixed"
          left={0}
          top="60px"
          h="calc(100vh - 60px)"
          w={{ base: '0', md: sidebarWidth }}
          bg={sidebarBg}
          borderRightWidth="1px"
          borderColor={borderColor}
          display={{ base: 'none', md: 'flex' }}
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          transition="width 0.3s ease"
          zIndex={10}
          py={4}
        >
          {/* Navigation Items */}
          <VStack align="stretch" spacing={isSidebarCollapsed ? 4 : 1} w="100%" flex={1}>
            {navItems.map((item) => (
              <MotionBox
                key={item.id}
                whileHover={{ x: isSidebarCollapsed ? 0 : 5 }}
                transition={{ duration: 0.2 }}
                display="flex"
                justifyContent="center"
              >
                <Tooltip label={item.label} placement="right" isDisabled={!isSidebarCollapsed} openDelay={200}>
                  <Button
                    leftIcon={!isSidebarCollapsed ? <Icon as={item.icon} /> : undefined}
                    iconSpacing={isSidebarCollapsed ? 0 : 2}
                    variant={activeSection === item.id ? 'solid' : 'ghost'}
                    colorScheme={activeSection === item.id ? 'blue' : 'gray'}
                    justifyContent={isSidebarCollapsed ? 'center' : 'flex-start'}
                    fontWeight="medium"
                    fontSize="md"
                    borderRadius="md"
                    px={isSidebarCollapsed ? 0 : 3}
                    py={2}
                    onClick={() => {
                      setActiveSection(item.id);
                      onSidebarClose();
                    }}
                    w="100%"
                    h="48px"
                    minW={0}
                    minH={0}
                    display="flex"
                    alignItems="center"
                    transition="background 0.2s"
                  >
                    {isSidebarCollapsed ? <Icon as={item.icon} boxSize={6} /> : item.label}
                  </Button>
                </Tooltip>
              </MotionBox>
            ))}
          </VStack>
          {/* Toggle Button at the bottom */}
          <Box mb={2}>
            <IconButton
              aria-label="Toggle sidebar"
              icon={isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              size="md"
              onClick={toggleSidebar}
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              display={{ base: 'none', md: 'flex' }}
              alignSelf="center"
            />
          </Box>
        </Box>

        {/* Mobile Sidebar */}
        <Drawer isOpen={isSidebarOpen} placement="left" onClose={onSidebarClose}>
          <DrawerOverlay />
          <DrawerContent bg={sidebarBg}>
            <DrawerCloseButton color={textColor} />
            <DrawerHeader color={textColor}>10Web</DrawerHeader>
            <DrawerBody>
              <VStack align="stretch" spacing={1}>
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    leftIcon={<Icon as={item.icon} />}
                    variant={activeSection === item.id ? 'solid' : 'ghost'}
                    colorScheme={activeSection === item.id ? 'blue' : 'gray'}
                    justifyContent="flex-start"
                    fontWeight="medium"
                    fontSize="md"
                    borderRadius="md"
                    px={3}
                    py={2}
                    onClick={() => {
                      setActiveSection(item.id);
                      onSidebarClose();
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content Area */}
        <Box
          ml={{ base: 0, md: sidebarWidth }}
          w={{ base: '100%', md: `calc(100% - ${sidebarWidth})` }}
          p={8}
          transition="margin-left 0.3s ease, width 0.3s ease"
        >
          {renderSection()}
        </Box>
      </Flex>

      {/* Modals */}
      <CreateTicketModal />
    </Box>
  );
} 