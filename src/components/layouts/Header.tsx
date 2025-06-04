'use client';

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Text,
  Avatar,
  Badge,
  Button,
  VStack,
  Portal,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiBell,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiPlus,
} from 'react-icons/fi';

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

const notifications = [
  {
    id: 1,
    title: 'WordPress installed successfully',
    time: '5 min ago',
    isRead: false,
  },
  {
    id: 2,
    title: 'Backup completed',
    time: '1 hour ago',
    isRead: true,
  },
  {
    id: 3,
    title: 'Security scan completed',
    time: '2 hours ago',
    isRead: true,
  },
];

export function Header() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const notificationBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Flex flex={1} justify="flex-end" align="center">
      <HStack spacing={4}>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          size="sm"
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Website
        </Button>

        <Menu>
          <MenuButton
            as={IconButton}
            size="lg"
            variant="ghost"
            aria-label="Notifications"
            icon={
              <MotionBox position="relative" whileHover={{ scale: 1.1 }}>
                <FiBell size={20} />
                <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  colorScheme="red"
                  variant="solid"
                  fontSize="xs"
                  borderRadius="full"
                  w="4"
                  h="4"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  2
                </Badge>
              </MotionBox>
            }
          />
          <Portal>
            <MenuList
              py={2}
              border="1px solid"
              borderColor={borderColor}
              boxShadow="lg"
              width="320px"
            >
              <Text fontWeight="medium" px={4} mb={2}>
                Notifications
              </Text>
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  py={3}
                  px={4}
                  _hover={{ bg: notificationBg }}
                  bg={!notification.isRead ? notificationBg : undefined}
                >
                  <VStack align="start" spacing={0}>
                    <Text fontWeight={!notification.isRead ? 'medium' : 'normal'}>
                      {notification.title}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {notification.time}
                    </Text>
                  </VStack>
                </MenuItem>
              ))}
            </MenuList>
          </Portal>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            size="sm"
            px={2}
            py={2}
            _hover={{ bg: 'transparent' }}
          >
            <HStack spacing={3}>
              <Avatar
                size="sm"
                name="John Doe"
                src="https://bit.ly/dan-abramov"
                as={motion.div}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <VStack
                display={{ base: 'none', md: 'flex' }}
                alignItems="flex-start"
                spacing={0}
                ml="2"
              >
                <Text fontSize="sm" fontWeight="medium">
                  John Doe
                </Text>
                <Text fontSize="xs" color={textColor}>
                  Administrator
                </Text>
              </VStack>
            </HStack>
          </MenuButton>
          <Portal>
            <MenuList
              py={2}
              border="1px solid"
              borderColor={borderColor}
              boxShadow="lg"
            >
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem icon={<FiHelpCircle />}>Help</MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} color="red.400">
                Sign Out
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </HStack>
    </Flex>
  );
} 