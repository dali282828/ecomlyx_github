import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
  },
  fonts: {
    heading: 'var(--font-inter), system-ui, sans-serif',
    body: 'var(--font-inter), system-ui, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        solid: (props: any) => ({
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
          },
          _disabled: {
            bg: 'gray.300',
            color: 'gray.500',
            cursor: 'not-allowed',
            _hover: {
              bg: 'gray.300',
              transform: 'none',
              boxShadow: 'none',
            },
          },
        }),
        outline: {
          border: '2px solid',
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
          _active: {
            bg: 'brand.100',
            transform: 'translateY(0)',
          },
          _disabled: {
            borderColor: 'gray.300',
            color: 'gray.500',
            cursor: 'not-allowed',
            _hover: {
              bg: 'transparent',
              transform: 'none',
              boxShadow: 'none',
            },
          },
        },
        ghost: {
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
            transform: 'translateY(-1px)',
          },
          _active: {
            bg: 'brand.100',
            transform: 'translateY(0)',
          },
          _disabled: {
            color: 'gray.500',
            cursor: 'not-allowed',
            _hover: {
              bg: 'transparent',
              transform: 'none',
            },
          },
        },
        link: {
          color: 'brand.500',
          _hover: {
            textDecoration: 'none',
            color: 'brand.600',
          },
          _active: {
            color: 'brand.700',
          },
          _disabled: {
            color: 'gray.500',
            cursor: 'not-allowed',
            _hover: {
              color: 'gray.500',
            },
          },
        },
      },
      sizes: {
        sm: {
          px: 4,
          py: 2,
          fontSize: 'sm',
        },
        md: {
          px: 6,
          py: 3,
          fontSize: 'md',
        },
        lg: {
          px: 8,
          py: 4,
          fontSize: 'lg',
        },
      },
      defaultProps: {
        variant: 'solid',
        size: 'md',
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'lg',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
          },
        },
        header: {
          padding: '6',
          borderBottom: '1px solid',
          borderColor: 'gray.100',
        },
        body: {
          padding: '6',
        },
        footer: {
          padding: '6',
          borderTop: '1px solid',
          borderColor: 'gray.100',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: 'xl',
          boxShadow: '2xl',
        },
        header: {
          padding: '6',
          borderBottom: '1px solid',
          borderColor: 'gray.100',
        },
        body: {
          padding: '6',
        },
        footer: {
          padding: '6',
          borderTop: '1px solid',
          borderColor: 'gray.100',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
      'button:focus': {
        boxShadow: '0 0 0 2px var(--chakra-colors-brand-500)',
      },
    },
  },
});

export default theme; 