import { z } from 'zod';

// User validations
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number and special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
});

// Website validations
export const createWebsiteSchema = z.object({
  name: z.string().min(1, 'Website name is required').max(100, 'Name too long'),
  businessType: z.string().min(1, 'Business type is required'),
  templateId: z.string().min(1, 'Template is required'),
  domain: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 
                          'Invalid domain format').optional(),
});

export const updateWebsiteSchema = z.object({
  name: z.string().min(1, 'Website name is required').max(100, 'Name too long').optional(),
  businessType: z.string().min(1, 'Business type is required').optional(),
  customization: z.record(z.any()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

// Page validations
export const createPageSchema = z.object({
  title: z.string().min(1, 'Page title is required').max(200, 'Title too long'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  content: z.record(z.any()),
  order: z.number().int().min(0).optional(),
});

export const updatePageSchema = z.object({
  title: z.string().min(1, 'Page title is required').max(200, 'Title too long').optional(),
  content: z.record(z.any()).optional(),
  isPublished: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

// Support ticket validations
export const createTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description too long'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

export const updateTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

// Domain validations
export const domainSchema = z.object({
  name: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 
                         'Invalid domain format'),
  websiteId: z.string().cuid('Invalid website ID'),
});

// File upload validations
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(file => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
                           'application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return allowedTypes.includes(file.type);
    }, 'Invalid file type'),
});

// Subscription validations
export const subscriptionSchema = z.object({
  plan: z.enum(['BASIC', 'PRO', 'BUSINESS', 'ENTERPRISE']),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
});

// Analytics query validations
export const analyticsQuerySchema = z.object({
  websiteId: z.string().cuid('Invalid website ID'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  metric: z.enum(['visitors', 'pageViews', 'bandwidth', 'pageSpeed']).optional(),
});

// WordPress configuration validations
export const wordpressConfigSchema = z.object({
  adminUsername: z.string().min(3, 'Username must be at least 3 characters').max(60),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
  siteTitle: z.string().min(1, 'Site title is required').max(100),
  siteDescription: z.string().max(200).optional(),
  theme: z.string().optional(),
  plugins: z.array(z.string()).optional(),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.object({
    message: z.string(),
    code: z.string(),
    details: z.any().optional(),
  }).optional(),
  meta: z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    total: z.number().optional(),
  }).optional(),
});

// Query parameter validations
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100),
  type: z.enum(['websites', 'users', 'pages', 'tickets']).optional(),
}); 