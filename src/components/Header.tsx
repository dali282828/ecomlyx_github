'use client';

import { Box, Flex, HStack, Link, Button, Spacer, useColorMode, IconButton, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaMoon, FaSun } from 'react-icons/fa';
// import { signOut, useSession } from 'next-auth/react'; // Uncomment if using next-auth

export default function Header() {
  // const { data: session } = useSession(); // Uncomment if using next-auth
  const session = null; // Placeholder: replace with real session logic
  const router = useRouter();
  const pathname = usePathname();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.900');
  const border = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box as="header" bg={bg} borderBottomWidth="1px" borderColor={border} px={4} py={2} position="sticky" top={0} zIndex={10} boxShadow="sm">
      <Flex align="center" maxW="container.xl" mx="auto">
        <HStack spacing={4}>
          <Link as={NextLink} href="/" fontWeight="bold" fontSize="xl" color="blue.500">
            Ecomlyx
          </Link>
          <Link as={NextLink} href="/" color={pathname === '/' ? 'blue.600' : undefined}>
            Home
          </Link>
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          {/* Show these if NOT logged in */}
          {!session && (
            <>
              <Button as={NextLink} href="/login" variant="ghost" colorScheme="blue" size="sm">
                Login
              </Button>
              <Button as={NextLink} href="/register" colorScheme="blue" size="sm">
                Register
              </Button>
            </>
          )}
          {/* Show these if logged in */}
          {session && (
            <>
              <Button as={NextLink} href="/dashboard" colorScheme="blue" variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                // onClick={() => signOut()}
                onClick={() => {}}
              >
                Logout
              </Button>
            </>
          )}
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />
        </HStack>
      </Flex>
    </Box>
  );
} 