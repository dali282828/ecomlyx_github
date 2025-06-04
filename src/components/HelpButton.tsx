import { Box, IconButton, Tooltip, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Text } from '@chakra-ui/react';
import { FaQuestionCircle } from 'react-icons/fa';

export default function HelpButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box position="fixed" bottom={6} right={6} zIndex={1000}>
      <Tooltip label="Need help?" aria-label="Help tooltip">
        <IconButton
          icon={<FaQuestionCircle />}
          colorScheme="blue"
          aria-label="Open help"
          borderRadius="full"
          boxShadow="lg"
          size="lg"
          onClick={onOpen}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How can we help?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Contact our support team or check our help center for answers.</Text>
            <Button colorScheme="blue" w="full" mb={2} as="a" href="/support">Go to Help Center</Button>
            <Button w="full" as="a" href="mailto:support@ecomlyx.com" variant="outline">Email Support</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 