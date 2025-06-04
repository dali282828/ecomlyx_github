'use client';

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSun, FaMoon, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionFlex = motion(Flex);

export function Navbar() {
  const { data: session } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Container maxW="container.xl" py={4}>
        <MotionFlex
          justify="space-between"
          align="center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HStack spacing={8}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => router.push('/')}
              bgGradient="linear(to-r, brand.500, purple.500)"
              bgClip="text"
            >
              WebBuilder
            </Text>
          </HStack>

          <HStack spacing={4}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme="brand"
            />

            {session ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rightIcon={<FaUserCircle />}
                >
                  <Avatar
                    size="sm"
                    name={session.user?.name || 'User'}
                    src={session.user?.image || undefined}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    icon={<FaUserCircle />}
                    onClick={() => router.push('/profile')}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    icon={<FaCog />}
                    onClick={() => router.push('/settings')}
                  >
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    icon={<FaSignOutAlt />}
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                colorScheme="brand"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
            )}
          </HStack>
        </MotionFlex>
      </Container>
    </Box>
  );
} 