'use client';

import { Inter } from 'next/font/google';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { CacheProvider } from '@chakra-ui/next-js';
import React from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const theme = extendTheme({
  fonts: {
    heading: inter.style.fontFamily,
    body: inter.style.fontFamily,
  },
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Drawer: {
      defaultProps: {
        size: 'full',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900',
        _dark: {
          bg: 'gray.900',
          color: 'white',
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme} resetCSS>
        <MainLayout>{children}</MainLayout>
      </ChakraProvider>
    </CacheProvider>
  );
} 