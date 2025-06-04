import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Heading,
  Input,
  Button,
  useColorModeValue,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt={20}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <ListHeader>Product</ListHeader>
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/templates">Templates</Link>
            <Link href="/updates">Updates</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Company</ListHeader>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/contact">Contact</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Support</ListHeader>
            <Link href="/help">Help Center</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/status">Status</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Stay up to date</ListHeader>
            <Stack direction={'row'}>
              <Input
                placeholder={'Your email address'}
                bg={useColorModeValue('white', 'gray.700')}
                border={0}
                _focus={{
                  bg: 'whiteAlpha.300',
                }}
              />
              <Button
                bg={useColorModeValue('brand.500', 'brand.400')}
                color={'white'}
                _hover={{
                  bg: 'brand.600',
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>

      <Divider borderColor={useColorModeValue('gray.200', 'gray.700')} />

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
          }}
        >
          <Heading
            as="h2"
            size="md"
            textAlign="center"
            color={useColorModeValue('brand.500', 'brand.400')}
          >
            Ecomlyx
          </Heading>
        </Flex>
        <Text pt={6} fontSize={'sm'} textAlign={'center'}>
          © {currentYear} Ecomlyx. All rights reserved
        </Text>
        <Stack
          direction={'row'}
          spacing={6}
          align={'center'}
          justify={'center'}
          mt={4}
        >
          <IconButton
            aria-label="Twitter"
            icon={<FaTwitter />}
            size="sm"
            variant="ghost"
            _hover={{ bg: 'brand.500', color: 'white' }}
          />
          <IconButton
            aria-label="Facebook"
            icon={<FaFacebook />}
            size="sm"
            variant="ghost"
            _hover={{ bg: 'brand.500', color: 'white' }}
          />
          <IconButton
            aria-label="LinkedIn"
            icon={<FaLinkedin />}
            size="sm"
            variant="ghost"
            _hover={{ bg: 'brand.500', color: 'white' }}
          />
          <IconButton
            aria-label="Instagram"
            icon={<FaInstagram />}
            size="sm"
            variant="ghost"
            _hover={{ bg: 'brand.500', color: 'white' }}
          />
          <IconButton
            aria-label="GitHub"
            icon={<FaGithub />}
            size="sm"
            variant="ghost"
            _hover={{ bg: 'brand.500', color: 'white' }}
          />
        </Stack>
      </Box>
    </Box>
  );
} 