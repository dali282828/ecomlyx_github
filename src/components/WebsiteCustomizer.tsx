import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  SimpleGrid,
  Image,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Switch,
  Select,
  IconButton,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaPlus, FaTrash, FaUpload, FaPalette, FaCog, FaImages, FaFont, FaLink } from 'react-icons/fa';

interface WebsiteCustomizerProps {
  businessType: string;
  templateId: string;
  onSave: (customization: any) => void;
}

interface CustomizationSection {
  id: string;
  title: string;
  icon: any;
  fields: CustomizationField[];
}

interface CustomizationField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'select' | 'toggle' | 'link';
  options?: { label: string; value: string }[];
  defaultValue?: any;
}

const customizationSections: Record<string, CustomizationSection[]> = {
  hotel: [
    {
      id: 'general',
      title: 'General Information',
      icon: FaCog,
      fields: [
        { id: 'hotelName', label: 'Hotel Name', type: 'text' },
        { id: 'description', label: 'Description', type: 'textarea' },
        { id: 'address', label: 'Address', type: 'textarea' },
        { id: 'phone', label: 'Phone Number', type: 'text' },
        { id: 'email', label: 'Email Address', type: 'text' },
        { id: 'website', label: 'Website URL', type: 'link' },
      ]
    },
    {
      id: 'booking',
      title: 'Booking Settings',
      icon: FaLink,
      fields: [
        { id: 'enableBooking', label: 'Enable Online Booking', type: 'toggle', defaultValue: true },
        { id: 'minStay', label: 'Minimum Stay (nights)', type: 'text' },
        { id: 'checkInTime', label: 'Check-in Time', type: 'text' },
        { id: 'checkOutTime', label: 'Check-out Time', type: 'text' },
        { id: 'cancellationPolicy', label: 'Cancellation Policy', type: 'textarea' },
      ]
    },
    {
      id: 'design',
      title: 'Design & Branding',
      icon: FaPalette,
      fields: [
        { id: 'primaryColor', label: 'Primary Color', type: 'color', defaultValue: '#0967D2' },
        { id: 'secondaryColor', label: 'Secondary Color', type: 'color', defaultValue: '#47A3F3' },
        { id: 'logo', label: 'Logo', type: 'image' },
        { id: 'heroImage', label: 'Hero Image', type: 'image' },
        { id: 'fontFamily', label: 'Font Family', type: 'select', options: [
          { label: 'Modern Sans', value: 'modern-sans' },
          { label: 'Classic Serif', value: 'classic-serif' },
          { label: 'Elegant Script', value: 'elegant-script' },
        ]},
      ]
    },
    {
      id: 'rooms',
      title: 'Room Management',
      icon: FaImages,
      fields: [
        { id: 'enableRoomTypes', label: 'Enable Room Types', type: 'toggle', defaultValue: true },
        { id: 'roomCategories', label: 'Room Categories', type: 'textarea' },
        { id: 'amenities', label: 'Room Amenities', type: 'textarea' },
      ]
    }
  ],
  restaurant: [
    {
      id: 'general',
      title: 'General Information',
      icon: FaCog,
      fields: [
        { id: 'restaurantName', label: 'Restaurant Name', type: 'text' },
        { id: 'description', label: 'Description', type: 'textarea' },
        { id: 'cuisine', label: 'Cuisine Type', type: 'text' },
        { id: 'address', label: 'Address', type: 'textarea' },
        { id: 'phone', label: 'Phone Number', type: 'text' },
        { id: 'email', label: 'Email Address', type: 'text' },
      ]
    },
    {
      id: 'menu',
      title: 'Menu Management',
      icon: FaLink,
      fields: [
        { id: 'enableOnlineMenu', label: 'Enable Online Menu', type: 'toggle', defaultValue: true },
        { id: 'menuCategories', label: 'Menu Categories', type: 'textarea' },
        { id: 'specialDietary', label: 'Special Dietary Options', type: 'textarea' },
        { id: 'priceRange', label: 'Price Range', type: 'select', options: [
          { label: '$', value: 'budget' },
          { label: '$$', value: 'moderate' },
          { label: '$$$', value: 'expensive' },
        ]},
      ]
    },
    {
      id: 'reservations',
      title: 'Reservation Settings',
      icon: FaCog,
      fields: [
        { id: 'enableReservations', label: 'Enable Online Reservations', type: 'toggle', defaultValue: true },
        { id: 'maxPartySize', label: 'Maximum Party Size', type: 'text' },
        { id: 'reservationPolicy', label: 'Reservation Policy', type: 'textarea' },
        { id: 'openingHours', label: 'Opening Hours', type: 'textarea' },
      ]
    },
    {
      id: 'design',
      title: 'Design & Branding',
      icon: FaPalette,
      fields: [
        { id: 'primaryColor', label: 'Primary Color', type: 'color', defaultValue: '#E53E3E' },
        { id: 'secondaryColor', label: 'Secondary Color', type: 'color', defaultValue: '#F56565' },
        { id: 'logo', label: 'Logo', type: 'image' },
        { id: 'heroImage', label: 'Hero Image', type: 'image' },
        { id: 'gallery', label: 'Photo Gallery', type: 'image' },
      ]
    }
  ]
  // Add more business types here...
};

export default function WebsiteCustomizer({ businessType, templateId, onSave }: WebsiteCustomizerProps) {
  const [customization, setCustomization] = useState<Record<string, any>>({});
  const toast = useToast();

  const handleFieldChange = (fieldId: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSave = () => {
    onSave(customization);
    toast({
      title: 'Customization saved!',
      description: 'Your website customization has been saved successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const renderField = (field: CustomizationField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={customization[field.id] || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={customization[field.id] || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      case 'toggle':
        return (
          <Switch
            isChecked={customization[field.id] ?? field.defaultValue}
            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
          />
        );
      case 'select':
        return (
          <Select
            value={customization[field.id] || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case 'color':
        return (
          <HStack>
            <Input
              type="color"
              value={customization[field.id] || field.defaultValue || '#000000'}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              width="100px"
            />
            <Input
              value={customization[field.id] || field.defaultValue || '#000000'}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder="Color code"
            />
          </HStack>
        );
      case 'image':
        return (
          <Box>
            {customization[field.id] ? (
              <VStack>
                <Image src={customization[field.id]} alt={field.label} maxH="200px" />
                <Button
                  leftIcon={<FaTrash />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFieldChange(field.id, '')}
                >
                  Remove Image
                </Button>
              </VStack>
            ) : (
              <Button
                leftIcon={<FaUpload />}
                onClick={() => {
                  // Implement image upload logic here
                  toast({
                    title: 'Image upload',
                    description: 'Image upload functionality will be implemented here.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                Upload Image
              </Button>
            )}
          </Box>
        );
      case 'link':
        return (
          <Input
            value={customization[field.id] || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder="https://"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Customize Your Website</Heading>
          <Text color="gray.600">
            Customize your website's content, design, and features to match your business needs.
          </Text>
        </Box>

        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            {customizationSections[businessType]?.map((section) => (
              <Tab key={section.id}>
                <Icon as={section.icon} mr={2} />
                {section.title}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {customizationSections[businessType]?.map((section) => (
              <TabPanel key={section.id}>
                <Accordion allowMultiple>
                  {section.fields.map((field) => (
                    <AccordionItem key={field.id}>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="medium">{field.label}</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <FormControl>
                          <FormLabel>{field.label}</FormLabel>
                          {renderField(field)}
                        </FormControl>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        <Box>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleSave}
            leftIcon={<FaCog />}
          >
            Save Customization
          </Button>
        </Box>
      </VStack>
    </Container>
  );
} 