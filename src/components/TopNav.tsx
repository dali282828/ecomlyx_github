'use client';

import { Box, Flex, HStack, Link as ChakraLink, Button, Spacer, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export default function TopNav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');
  // Placeholder for session logic
  const session = true; // Set to true to show Profile/Logout, false to hide

  return (
    <Box as="nav" bg={bg} borderBottomWidth={1} borderColor={border} px={4} py={2} position="sticky" top={0} zIndex={10}>
      <Flex align="center">
        <Link href="/dashboard" passHref legacyBehavior>
          <ChakraLink fontWeight="bold" fontSize="xl" color="blue.600">
            Ecomlyx
          </ChakraLink>
        </Link>
        <HStack spacing={6} ml={8} display={{ base: 'none', md: 'flex' }}>
          <Link href="/dashboard" passHref legacyBehavior>
            <ChakraLink>Dashboard</ChakraLink>
          </Link>
          <Link href="/create" passHref legacyBehavior>
            <ChakraLink>Create Website</ChakraLink>
          </Link>
        </HStack>
        <Spacer />
        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
          {session && (
            <>
              <Button variant="outline" size="sm" colorScheme="brand">
                Profile
              </Button>
              <Button colorScheme="brand" size="sm">
                Logout
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
} 