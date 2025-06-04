import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Icon,
  Flex,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const MotionBox = motion(Box);

const testimonials = [
  {
    content: "Ecomlyx transformed our online presence. The AI-powered templates and easy customization made launching our restaurant website a breeze. Our online orders have increased by 200%!",
    author: "Sarah Johnson",
    role: "Owner",
    company: "The Gourmet Kitchen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80",
    rating: 5,
  },
  {
    content: "As a small business owner, I needed a professional website without the technical hassle. Ecomlyx delivered exactly what I needed. The support team is incredible!",
    author: "Michael Chen",
    role: "CEO",
    company: "TechStart Solutions",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80",
    rating: 5,
  },
  {
    content: "The e-commerce features are outstanding. We were able to set up our online store in a day, and the sales have been phenomenal. The analytics dashboard is a game-changer!",
    author: "Emma Rodriguez",
    role: "Marketing Director",
    company: "Fashion Forward",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80",
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      py={20}
      id="testimonials"
    >
      <Container maxW={'7xl'}>
        <Stack spacing={12}>
          <Stack spacing={4} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="bold"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
            >
              What Our Customers Say
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="lg">
              Join thousands of satisfied businesses who trust Ecomlyx
            </Text>
          </Stack>

          <Box position="relative" h="400px">
            {testimonials.map((testimonial, index) => (
              <MotionBox
                key={index}
                position="absolute"
                w="full"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: currentIndex === index ? 1 : 0,
                  x: currentIndex === index ? 0 : 100,
                }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                display={currentIndex === index ? 'block' : 'none'}
              >
                <Stack
                  spacing={8}
                  bg={useColorModeValue('white', 'gray.800')}
                  p={8}
                  borderRadius="xl"
                  boxShadow="xl"
                  position="relative"
                >
                  <Icon
                    as={FaQuoteLeft}
                    w={10}
                    h={10}
                    color="brand.400"
                    opacity={0.2}
                    position="absolute"
                    top={4}
                    left={4}
                  />
                  <Text
                    fontSize="lg"
                    color={useColorModeValue('gray.600', 'gray.300')}
                    position="relative"
                    zIndex={1}
                  >
                    {testimonial.content}
                  </Text>
                  <HStack spacing={4}>
                    <Avatar
                      src={testimonial.avatar}
                      name={testimonial.author}
                      size="lg"
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold" fontSize="lg">
                        {testimonial.author}
                      </Text>
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        {testimonial.role} at {testimonial.company}
                      </Text>
                      <HStack>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Badge
                            key={i}
                            colorScheme="brand"
                            variant="solid"
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            ★
                          </Badge>
                        ))}
                      </HStack>
                    </VStack>
                  </HStack>
                </Stack>
              </MotionBox>
            ))}
          </Box>

          <Flex justify="center" gap={2}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                w={3}
                h={3}
                borderRadius="full"
                bg={currentIndex === index ? 'brand.500' : 'gray.300'}
                cursor="pointer"
                onClick={() => setCurrentIndex(index)}
                transition="all 0.2s"
                _hover={{ bg: 'brand.400' }}
              />
            ))}
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
} 