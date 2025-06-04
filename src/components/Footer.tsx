'use client';

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Heading,
  Link,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import NextLink from 'next/link';

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bg}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTopWidth={1}
      borderStyle={'solid'}
      borderColor={borderColor}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <ListHeader>Company</ListHeader>
            <Link as={NextLink} href={'#'}>About Us</Link>
            <Link as={NextLink} href={'#'}>Blog</Link>
            <Link as={NextLink} href={'#'}>Careers</Link>
            <Link as={NextLink} href={'#'}>Contact Us</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Support</ListHeader>
            <Link as={NextLink} href={'#'}>Help Center</Link>
            <Link as={NextLink} href={'#'}>Safety Center</Link>
            <Link as={NextLink} href={'#'}>Community Guidelines</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Legal</ListHeader>
            <Link as={NextLink} href={'#'}>Cookies Policy</Link>
            <Link as={NextLink} href={'#'}>Privacy Policy</Link>
            <Link as={NextLink} href={'#'}>Terms of Service</Link>
            <Link as={NextLink} href={'#'}>Law Enforcement</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Stay up to date</ListHeader>
            <Stack direction={'row'} spacing={6}>
              <Link href={'#'}>
                <Icon as={FaFacebook} w={6} h={6} />
              </Link>
              <Link href={'#'}>
                <Icon as={FaInstagram} w={6} h={6} />
              </Link>
              <Link href={'#'}>
                <Icon as={FaTwitter} w={6} h={6} />
              </Link>
              <Link href={'#'}>
                <Icon as={FaLinkedin} w={6} h={6} />
              </Link>
              <Link href={'#'}>
                <Icon as={FaGithub} w={6} h={6} />
              </Link>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box py={10}>
        <Flex
          align={'center'}
          _before={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            ml: 8,
          }}>
          <Heading
            as={NextLink}
            href="/"
            fontSize={'2xl'}
            fontWeight={'bold'}
            color={useColorModeValue('blue.500', 'blue.200')}
          >
            Ecomlyx
          </Heading>
        </Flex>
        <Text pt={6} fontSize={'sm'} textAlign={'center'}>
          © {new Date().getFullYear()} Ecomlyx. All rights reserved
        </Text>
      </Box>
    </Box>
  );
} 