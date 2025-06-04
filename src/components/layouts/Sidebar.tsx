'use client';

import { ReactNode } from 'react';
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  BoxProps,
  VStack,
  HStack,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FiHome,
  FiGrid,
  FiSettings,
  FiDatabase,
  FiLayers,
  FiGlobe,
  FiShield,
  FiTrendingUp,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { name: 'Websites', icon: FiGrid, path: '/websites' },
  { name: 'Databases', icon: FiDatabase, path: '/databases' },
  { name: 'Domains', icon: FiGlobe, path: '/domains' },
  { name: 'SSL', icon: FiShield, path: '/ssl' },
  { name: 'Analytics', icon: FiTrendingUp, path: '/analytics' },
  { name: 'Settings', icon: FiSettings, path: '/settings' },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export function Sidebar({ onClose, ...rest }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <MotionFlex
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          alignItems="center"
          whileHover={{ scale: 1.02 }}
        >
          <Icon as={FiLayers} boxSize="8" color="blue.500" />
          <Text
            fontSize="2xl"
            fontFamily="monospace"
            fontWeight="bold"
            ml="2"
            bgGradient="linear(to-r, blue.400, teal.400)"
            bgClip="text"
          >
            10Web
          </Text>
        </MotionFlex>
        <CloseButton 
          display={{ base: 'flex', md: 'none' }} 
          onClick={onClose}
          size="md"
          color="gray.500"
          _hover={{ color: 'blue.500' }}
        />
      </Flex>
      <VStack spacing={2} align="stretch" px="4">
        {LinkItems.map((link, index) => (
          <MotionBox
            key={link.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavItem
              icon={link.icon}
              path={link.path}
              isActive={pathname === link.path}
            >
              {link.name}
            </NavItem>
          </MotionBox>
        ))}
      </VStack>
    </Box>
  );
}

interface NavItemProps extends BoxProps {
  icon: IconType;
  path: string;
  isActive?: boolean;
  children: ReactNode;
}

const NavItem = ({ icon, path, isActive, children, ...rest }: NavItemProps) => {
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const hoverBg = useColorModeValue('blue.50', 'gray.700');
  const activeBg = useColorModeValue('blue.100', 'blue.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Link href={path} style={{ textDecoration: 'none' }}>
      <MotionBox
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Tooltip label={children} placement="right" hasArrow>
          <HStack
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            bg={isActive ? activeBg : 'transparent'}
            color={isActive ? activeColor : textColor}
            _hover={{
              bg: hoverBg,
              color: activeColor,
            }}
            transition="all 0.2s"
            {...rest}
          >
            <Icon
              as={icon}
              boxSize="5"
              transition="all 0.2s"
              _groupHover={{ color: activeColor }}
            />
            <Text
              fontWeight={isActive ? 'medium' : 'normal'}
              transition="all 0.2s"
            >
              {children}
            </Text>
          </HStack>
        </Tooltip>
      </MotionBox>
    </Link>
  );
}; 