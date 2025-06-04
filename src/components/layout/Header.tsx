import {
  Box,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  useDisclosure,
  IconButton,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const NavLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <Link href={href} passHref>
    <Text
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      fontWeight="medium"
    >
      {children}
    </Text>
  </Link>
);

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  const navItems = [
    { label: 'Features', href: '/#features' },
    { label: 'Templates', href: '/#templates' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <Box
      as="header"
      position="fixed"
      w="100%"
      zIndex={1000}
      bg={useColorModeValue('white', 'gray.800')}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      backdropFilter="blur(10px)"
      bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')}
    >
      <Flex
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4, md: 8 }}
        align={'center'}
        justify={'space-between'}
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link href="/" passHref>
            <Text
              textAlign={useColorModeValue('left', 'center')}
              fontFamily={'heading'}
              fontWeight="bold"
              fontSize="xl"
              color={useColorModeValue('brand.500', 'white')}
              cursor="pointer"
            >
              Ecomlyx
            </Text>
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Stack direction={'row'} spacing={4}>
              {navItems.map((navItem) => (
                <NavLink key={navItem.label} href={navItem.href}>
                  {navItem.label}
                </NavLink>
              ))}
            </Stack>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          align="center"
        >
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />

          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            colorScheme="brand"
            onClick={() => router.push('/login')}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
          >
            Sign In
          </Button>

          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            colorScheme="brand"
            variant="outline"
            onClick={() => router.push('/register')}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
          >
            Get Started
          </Button>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Stack>
      </Flex>

      {/* Mobile menu */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
        display={{ base: isOpen ? 'block' : 'none', md: 'none' }}
        position="absolute"
        w="100%"
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Stack as={'nav'} spacing={4}>
          {navItems.map((navItem) => (
            <NavLink key={navItem.label} href={navItem.href}>
              {navItem.label}
            </NavLink>
          ))}
          <Button
            w="full"
            colorScheme="brand"
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
          <Button
            w="full"
            colorScheme="brand"
            variant="outline"
            onClick={() => router.push('/register')}
          >
            Get Started
          </Button>
        </Stack>
      </MotionBox>
    </Box>
  );
} 