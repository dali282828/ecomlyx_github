import { prisma } from '@/lib/prisma';

interface WordPressPlugin {
  name: string;
  slug: string;
  required: boolean;
  description: string;
}

interface WordPressTheme {
  name: string;
  slug: string;
  description: string;
}

interface BusinessTypeConfig {
  plugins: WordPressPlugin[];
  theme: WordPressTheme;
  settings: {
    title: string;
    description: string;
    features: string[];
  };
}

export const wordpressConfigs: Record<string, BusinessTypeConfig> = {
  hotel: {
    plugins: [
      {
        name: 'Hotel Booking',
        slug: 'motopress-hotel-booking-lite',
        required: true,
        description: 'Complete hotel booking and property management system'
      },
      {
        name: 'WooCommerce',
        slug: 'woocommerce',
        required: true,
        description: 'Payment processing and booking management'
      },
      {
        name: 'Yoast SEO',
        slug: 'wordpress-seo',
        required: true,
        description: 'Search engine optimization'
      },
      {
        name: 'WP Super Cache',
        slug: 'wp-super-cache',
        required: true,
        description: 'Performance optimization'
      },
      {
        name: 'Contact Form 7',
        slug: 'contact-form-7',
        required: true,
        description: 'Contact form and inquiries'
      }
    ],
    theme: {
      name: 'Hotel Luxury',
      slug: 'hotel-luxury',
      description: 'Professional hotel theme with booking capabilities'
    },
    settings: {
      title: 'Hotel Website',
      description: 'Luxury hotel booking website',
      features: ['Room Booking', 'Property Management', 'Payment Processing']
    }
  },
  restaurant: {
    plugins: [
      {
        name: 'Restaurant Reservations',
        slug: 'restaurant-reservations',
        required: true,
        description: 'Table booking and reservation management'
      },
      {
        name: 'WooCommerce',
        slug: 'woocommerce',
        required: true,
        description: 'Online ordering and payment processing'
      },
      {
        name: 'Menu Management',
        slug: 'food-menu-pro',
        required: true,
        description: 'Digital menu management system'
      },
      {
        name: 'Yoast SEO',
        slug: 'wordpress-seo',
        required: true,
        description: 'Search engine optimization'
      },
      {
        name: 'WP Super Cache',
        slug: 'wp-super-cache',
        required: true,
        description: 'Performance optimization'
      }
    ],
    theme: {
      name: 'Restaurant Hub',
      slug: 'restaurant-hub',
      description: 'Modern restaurant theme with menu and booking features'
    },
    settings: {
      title: 'Restaurant Website',
      description: 'Professional restaurant website with online ordering',
      features: ['Online Ordering', 'Table Reservations', 'Digital Menu']
    }
  },
  fitness: {
    plugins: [
      {
        name: 'Gym Management',
        slug: 'gym-management',
        required: true,
        description: 'Complete gym and fitness center management'
      },
      {
        name: 'WooCommerce',
        slug: 'woocommerce',
        required: true,
        description: 'Membership and payment processing'
      },
      {
        name: 'Booking Calendar',
        slug: 'booking',
        required: true,
        description: 'Class scheduling and booking'
      },
      {
        name: 'Yoast SEO',
        slug: 'wordpress-seo',
        required: true,
        description: 'Search engine optimization'
      },
      {
        name: 'WP Super Cache',
        slug: 'wp-super-cache',
        required: true,
        description: 'Performance optimization'
      }
    ],
    theme: {
      name: 'Fitness Pro',
      slug: 'fitness-pro',
      description: 'Dynamic fitness center theme with class booking'
    },
    settings: {
      title: 'Fitness Center Website',
      description: 'Professional fitness center with online booking',
      features: ['Class Booking', 'Membership Management', 'Trainer Profiles']
    }
  }
};

export const commonPlugins: WordPressPlugin[] = [
  {
    name: 'Wordfence Security',
    slug: 'wordfence',
    required: true,
    description: 'Security and firewall protection'
  },
  {
    name: 'UpdraftPlus',
    slug: 'updraftplus',
    required: true,
    description: 'Backup and restoration'
  },
  {
    name: 'Google Analytics',
    slug: 'google-analytics-for-wordpress',
    required: true,
    description: 'Website analytics and tracking'
  },
  {
    name: 'Really Simple SSL',
    slug: 'really-simple-ssl',
    required: true,
    description: 'SSL certificate management'
  }
];

export const getBusinessTypeConfig = (businessType: string): BusinessTypeConfig => {
  const config = wordpressConfigs[businessType];
  if (!config) {
    throw new Error(`No configuration found for business type: ${businessType}`);
  }
  
  // Merge common plugins with business-specific plugins
  return {
    ...config,
    plugins: [...config.plugins, ...commonPlugins]
  };
};

// Theme configurations for different business types
const businessThemes = {
  HOTEL: {
    name: 'hotel-booking',
    version: '1.0.0',
    settings: {
      primary_color: '#2B6CB0',
      secondary_color: '#4299E1',
      font_family: 'Inter',
      layout: 'full-width',
    },
  },
  RESTAURANT: {
    name: 'restaurant-reservation',
    version: '1.0.0',
    settings: {
      primary_color: '#C53030',
      secondary_color: '#E53E3E',
      font_family: 'Playfair Display',
      layout: 'boxed',
    },
  },
  RETAIL: {
    name: 'ecommerce-store',
    version: '1.0.0',
    settings: {
      primary_color: '#2F855A',
      secondary_color: '#48BB78',
      font_family: 'Roboto',
      layout: 'full-width',
    },
  },
  SERVICE: {
    name: 'business-service',
    version: '1.0.0',
    settings: {
      primary_color: '#2C5282',
      secondary_color: '#4299E1',
      font_family: 'Open Sans',
      layout: 'boxed',
    },
  },
};

// Plugin configurations for different business types
const businessPlugins = {
  HOTEL: [
    {
      name: 'wp-hotel-booking',
      version: '1.0.0',
      settings: {
        currency: 'USD',
        date_format: 'Y-m-d',
        enable_coupon: true,
        enable_tax: true,
      },
    },
    {
      name: 'wp-hotel-booking-extra',
      version: '1.0.0',
      settings: {
        enable_room_services: true,
        enable_room_amenities: true,
      },
    },
    {
      name: 'wp-hotel-booking-currency',
      version: '1.0.0',
      settings: {
        default_currency: 'USD',
        exchange_rate: 1,
      },
    },
    {
      name: 'wp-hotel-booking-stripe',
      version: '1.0.0',
      settings: {
        test_mode: true,
        enable_refund: true,
      },
    },
  ],
  RESTAURANT: [
    {
      name: 'restaurant-reservations',
      version: '1.0.0',
      settings: {
        enable_online_ordering: true,
        enable_table_reservations: true,
        enable_delivery: true,
      },
    },
    {
      name: 'food-menu',
      version: '1.0.0',
      settings: {
        enable_categories: true,
        enable_nutrition_info: true,
        enable_allergen_info: true,
      },
    },
    {
      name: 'woocommerce',
      version: '8.0.0',
      settings: {
        enable_online_ordering: true,
        enable_delivery: true,
        enable_pickup: true,
      },
    },
    {
      name: 'stripe-payments',
      version: '1.0.0',
      settings: {
        test_mode: true,
        enable_refund: true,
      },
    },
  ],
  RETAIL: [
    {
      name: 'woocommerce',
      version: '8.0.0',
      settings: {
        enable_cart: true,
        enable_checkout: true,
        enable_accounts: true,
      },
    },
    {
      name: 'woocommerce-product-bundles',
      version: '1.0.0',
      settings: {
        enable_bundles: true,
        enable_discounts: true,
      },
    },
    {
      name: 'woocommerce-subscriptions',
      version: '1.0.0',
      settings: {
        enable_subscriptions: true,
        enable_recurring_payments: true,
      },
    },
    {
      name: 'stripe-payments',
      version: '1.0.0',
      settings: {
        test_mode: true,
        enable_refund: true,
      },
    },
  ],
  SERVICE: [
    {
      name: 'appointment-booking',
      version: '1.0.0',
      settings: {
        enable_online_booking: true,
        enable_calendar: true,
        enable_notifications: true,
      },
    },
    {
      name: 'contact-form-7',
      version: '1.0.0',
      settings: {
        enable_forms: true,
        enable_mail: true,
      },
    },
    {
      name: 'stripe-payments',
      version: '1.0.0',
      settings: {
        test_mode: true,
        enable_refund: true,
      },
    },
  ],
};

export async function configureWordPress(websiteId: string, businessType: string) {
  try {
    // Get website data
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: { wordPressConfig: true },
    });

    if (!website) {
      throw new Error('Website not found');
    }

    // Get theme and plugins for business type
    const theme = businessThemes[businessType] || businessThemes.SERVICE;
    const plugins = [
      ...commonPlugins,
      ...(businessPlugins[businessType] || []),
    ];

    // Update WordPress configuration
    await prisma.wordPressConfig.update({
      where: { websiteId },
      data: {
        theme: {
          name: theme.name,
          version: theme.version,
          settings: theme.settings,
        },
        installedPlugins: {
          plugins: plugins.map(plugin => ({
            name: plugin.name,
            version: plugin.version,
            settings: plugin.settings,
          })),
        },
        status: 'CONFIGURING',
      },
    });

    // Simulate WordPress installation and configuration
    await simulateWordPressSetup(websiteId);

    return {
      success: true,
      message: 'WordPress configured successfully',
      theme,
      plugins,
    };
  } catch (error) {
    console.error('WordPress configuration error:', error);
    throw error;
  }
}

async function simulateWordPressSetup(websiteId: string) {
  // Simulate installation steps
  const steps = [
    'Installing WordPress core...',
    'Configuring database...',
    'Installing theme...',
    'Installing plugins...',
    'Configuring settings...',
    'Setting up security...',
    'Optimizing performance...',
  ];

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(step);
  }

  // Update status to ready
  await prisma.wordPressConfig.update({
    where: { websiteId },
    data: {
      status: 'READY',
    },
  });
} 