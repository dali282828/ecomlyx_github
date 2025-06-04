import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, Text, Badge, VStack, HStack } from '@chakra-ui/react';

export default function TemplatePreviewModal({ isOpen, onClose, template, onSelect }) {
  if (!template) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{template.name}</ModalHeader>
        <ModalBody>
          <Image src={template.image} alt={template.name} borderRadius="lg" mb={4} w="100%" maxH="320px" objectFit="cover" />
          <HStack spacing={2} mb={2} flexWrap="wrap">
            <Badge colorScheme="blue">{template.type.charAt(0).toUpperCase() + template.type.slice(1)}</Badge>
            {template.features.map((feature) => (
              <Badge key={feature} colorScheme="purple">{feature}</Badge>
            ))}
          </HStack>
          <Text color="gray.600" fontSize="md" mb={2}>Plugins: {template.plugins.join(', ')}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => { onSelect(template); onClose(); }}>
            Use this template
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 