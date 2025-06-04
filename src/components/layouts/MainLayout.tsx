'use client';

import { ReactNode, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerContent,
  useColorMode,
  Container,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { usePathname } from 'next/navigation';

const MotionBox = motion(Box);

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const pathname = usePathname();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => setIsPageTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  const pageTransitionVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
      />

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Box
        ml={{ base: 0, md: 60 }}
        transition=".3s ease"
        position="relative"
      >
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          borderBottomWidth="1px"
          borderColor={borderColor}
          h="14"
          bg={headerBg}
          position="fixed"
          top="0"
          zIndex="1000"
          transition="all 0.3s"
          _after={{
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: 0,
            right: 0,
            height: '10px',
            background: `linear-gradient(to bottom, ${headerBg}, transparent)`,
            pointerEvents: 'none',
          }}
        >
          <IconButton
            aria-label="Menu"
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={onOpen}
            icon={<FiMenu />}
            size="md"
            variant="ghost"
            colorScheme="blue"
          />
          <Header />
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="blue"
            size="md"
          />
        </Flex>

        <Container
          maxW="container.xl"
          pt="20"
          pb="8"
          px={{ base: 4, md: 8 }}
        >
          <AnimatePresence mode="wait">
            <MotionBox
              key={pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageTransitionVariants}
            >
              {children}
            </MotionBox>
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  );
} 