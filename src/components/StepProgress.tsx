import { HStack, VStack, Text, Box, Circle, useColorModeValue, Progress } from '@chakra-ui/react';
import { FaCheck, FaRobot, FaList, FaInfoCircle, FaGlobe, FaCogs, FaFlagCheckered, FaSmile } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const stepIcons = [FaRobot, FaList, FaInfoCircle, FaGlobe, FaCogs, FaFlagCheckered];

const checkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
};

export default function StepProgress({ steps, currentStep, onStepClick }) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  const [imgError, setImgError] = useState(false);
  const [mascotBounce, setMascotBounce] = useState(false);

  useEffect(() => {
    setMascotBounce(true);
    const timeout = setTimeout(() => setMascotBounce(false), 500);
    return () => clearTimeout(timeout);
  }, [currentStep]);

  return (
    <Box
      bg={useColorModeValue('rgba(255,255,255,0.7)', 'rgba(26,32,44,0.7)')}
      style={{ backdropFilter: 'blur(12px)' }}
      borderRadius="2xl"
      boxShadow="0 8px 32px rgba(0,0,0,0.14), 0 1.5px 8px rgba(66,153,225,0.10)"
      px={{ base: 2, md: 8 }}
      py={8}
      mb={10}
      mx="auto"
      maxW="5xl"
      overflowX="auto"
      position="relative"
      css={{
        '::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        scrollSnapType: 'x mandatory',
      }}
      aria-label="Progress through website creation steps"
    >
      <HStack spacing={6} align="center" w="full" minW="600px">
        {/* Mascot/Illustration with circular background, animated glow, and bounce animation */}
        <Circle
          as={motion.div}
          size="64px"
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow="0 4px 24px rgba(66,153,225,0.18), 0 1.5px 8px rgba(66,153,225,0.10)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr={2}
          position="relative"
          animate={mascotBounce ? { y: [-8, 0, -4, 0] } : { y: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
        >
          {/* Animated soft glow */}
          <Box
            as={motion.div}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="80px"
            h="80px"
            borderRadius="full"
            bgGradient="radial(ellipse at center, #90cdf4 0%, #4299e1 40%, transparent 100%)"
            filter="blur(12px)"
            opacity={0.5}
            zIndex={0}
            animate={{ opacity: mascotBounce ? 0.7 : 0.5, scale: mascotBounce ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          />
          {!imgError ? (
            <img
              src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f680.svg"
              alt="Mascot"
              style={{ width: 44, height: 44, objectFit: 'contain', display: 'block', zIndex: 1 }}
              onError={() => setImgError(true)}
            />
          ) : (
            <FaSmile size={36} color={useColorModeValue('#3182ce', '#90cdf4')} style={{ zIndex: 1 }} />
          )}
        </Circle>
        <HStack spacing={0} justify="center" flex={1} w="full">
          {steps.map((step, idx) => {
            const isActive = currentStep === idx + 1;
            const isCompleted = currentStep > idx + 1;
            const label = idx === 4 ? 'Website Setup' : step.title;
            const Icon = stepIcons[idx] || FaCheck;
            const clickable = !!onStepClick && isCompleted;
            return (
              <HStack key={step.id} spacing={0} flex={1} scrollSnapAlign="center">
                <VStack spacing={1} flex={1}>
                  <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                    {isActive && (
                      <Box
                        as={motion.div}
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        borderRadius="full"
                        w="64px"
                        h="64px"
                        zIndex={0}
                        pointerEvents="none"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 0.35, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        bgGradient="radial(ellipse at center, #4299e1 0%, #4299e1 40%, transparent 100%)"
                        filter="blur(4px)"
                      />
                    )}
                    <Box
                      as={motion.div}
                      animate={isActive ? { scale: 1.18 } : { scale: 1 }}
                      transition="all 0.3s"
                      whileHover={clickable ? { scale: 1.08 } : {}}
                      zIndex={1}
                      cursor={clickable ? 'pointer' : 'default'}
                      tabIndex={clickable ? 0 : -1}
                      aria-label={label + (isActive ? ' (current step)' : '')}
                      aria-current={isActive ? 'step' : undefined}
                      onClick={clickable ? () => onStepClick(idx + 1) : undefined}
                      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onStepClick(idx + 1); } : undefined}
                      role={clickable ? 'button' : 'presentation'}
                    >
                      <Circle
                        size="44px"
                        bg={isCompleted ? 'blue.500' : isActive ? 'blue.400' : useColorModeValue('gray.200', 'gray.700')}
                        color={isCompleted || isActive ? 'white' : 'gray.500'}
                        border={isActive ? '2.5px solid #3182ce' : 'none'}
                        fontSize="xl"
                        fontWeight="bold"
                        boxShadow={isActive ? 'md' : undefined}
                        transition="all 0.3s"
                      >
                        {isCompleted ? (
                          <motion.span
                            initial="hidden"
                            animate="visible"
                            variants={checkVariants}
                            style={{ display: 'inline-block' }}
                          >
                            <FaCheck />
                          </motion.span>
                        ) : (
                          <Icon />
                        )}
                      </Circle>
                    </Box>
                  </Box>
                  <Text fontSize="sm" color={isActive ? 'blue.600' : 'gray.500'} fontWeight={isActive ? 'bold' : 'normal'} textAlign="center" maxW="90px" transition="color 0.3s">
                    {label}
                  </Text>
                </VStack>
                {idx < steps.length - 1 && (
                  <Box h="2.5px" flex={1} bg={isCompleted ? 'blue.400' : useColorModeValue('gray.200', 'gray.700')} mx={1} transition="background 0.3s" />
                )}
              </HStack>
            );
          })}
        </HStack>
      </HStack>
      {/* Gradient progress bar under stepper */}
      <Box mt={6} mb={2} w="full" h="6px" borderRadius="md" boxShadow="sm" bg={useColorModeValue('gray.200', 'gray.700')} position="relative">
        <Box
          as={motion.div}
          position="absolute"
          left={0}
          top={0}
          h="100%"
          borderRadius="md"
          bgGradient="linear(to-r, blue.400, purple.400)"
          initial={{ width: 0 }}
          animate={{ width: progress + '%' }}
          transition={{ duration: 0.5 }}
        />
      </Box>
      {/* Soft divider/shadow */}
      <Box w="full" h="12px" mt={2} bgGradient="linear(to-b, rgba(66,153,225,0.08), transparent)" borderBottomRadius="2xl" />
    </Box>
  );
} 