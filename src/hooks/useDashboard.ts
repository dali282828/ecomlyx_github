import { useState, useEffect, useCallback } from 'react';

interface Analytics {
  totalVisitors: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: string;
  performance: {
    pageSpeed: number;
    mobileScore: number;
    desktopScore: number;
    seoScore: number;
    accessibilityScore: number;
  }[];
  trafficSources: {
    source: string;
    visitors: number;
    percentage: number;
  }[];
  topPages: {
    url: string;
    visitors: number;
    avgTimeOnPage: string;
  }[];
  recentActivity: {
    id: number;
    action: string;
    website: string;
    time: string;
    details?: string;
  }[];
  conversionRate: number;
  revenue: number;
}

interface Billing {
  currentPlan: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
  status: 'active' | 'past_due' | 'canceled';
  usage: {
    storage: number;
    storageLimit: number;
    bandwidth: number;
    bandwidthLimit: number;
    domains: number;
    domainsLimit: number;
    emailAccounts: number;
    emailAccountsLimit: number;
  };
  invoices: {
    id: string;
    date: string;
    amount: number;
    status: string;
    items: {
      description: string;
      amount: number;
    }[];
  }[];
  paymentMethods: {
    id: string;
    type: string;
    last4: string;
    expiryDate: string;
    isDefault: boolean;
  }[];
}

interface TicketComment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  category: string;
  assignedTo?: string;
  lastUpdated: string;
  createdAt: string;
  attachments?: {
    name: string;
    url: string;
    size: string;
  }[];
  comments?: TicketComment[];
}

interface SystemStatus {
  server: {
    status: 'operational' | 'degraded' | 'down';
    uptime: string;
    responseTime: number;
  };
  database: {
    status: 'connected' | 'disconnected';
    size: string;
    lastBackup: string;
  };
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: {
      in: number;
      out: number;
    };
  };
  security: {
    sslStatus: 'valid' | 'expiring' | 'expired';
    sslExpiryDate: string;
    firewallStatus: 'active' | 'inactive';
    lastScan: string;
    threatsBlocked: number;
  };
  apiServices: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    responseTime: number;
    uptime: number;
    lastChecked: string;
    endpoints: {
      path: string;
      method: string;
      status: 'operational' | 'degraded' | 'down';
      responseTime: number;
    }[];
  }[];
  performanceAlerts: {
    id: string;
    type: 'error' | 'warning' | 'info';
    metric: string;
    value: number;
    threshold: number;
    timestamp: string;
    status: 'active' | 'resolved';
  }[];
  metrics: {
    cpu: TimeSeriesData[];
    memory: TimeSeriesData[];
    disk: TimeSeriesData[];
    network: {
      in: TimeSeriesData[];
      out: TimeSeriesData[];
    };
  };
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

interface UserActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
  type: 'login' | 'action' | 'system' | 'security';
  ipAddress: string;
  location: string;
  device: string;
}

interface ResourceForecast {
  metric: string;
  current: number;
  predicted: number[];
  confidence: number;
  timestamp: string;
}

interface CustomWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'status';
  title: string;
  data: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  refreshInterval: number;
}

interface AdvancedAnalytics {
  userBehavior: {
    newUsers: number;
    returningUsers: number;
    userRetention: number;
    averagePagesPerSession: number;
  };
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geographicData: {
    country: string;
    visitors: number;
    percentage: number;
  }[];
  conversionFunnel: {
    stage: string;
    visitors: number;
    conversionRate: number;
  }[];
  userActivity: UserActivity[];
  resourceForecasts: ResourceForecast[];
  customWidgets: CustomWidget[];
  heatmap: Array<{
    hour: string;
    value: number;
  }>;
  userSegments: {
    segment: string;
    users: number;
    growth: number;
    engagement: number;
  }[];
  conversionPaths: {
    path: string[];
    users: number;
    conversionRate: number;
  }[];
  performance: {
    pageSpeed: number;
    mobileScore: number;
    desktopScore: number;
    seoScore: number;
    accessibilityScore: number;
  }[];
  trafficSources: {
    source: string;
    visitors: number;
    percentage: number;
  }[];
  topPages: {
    url: string;
    visitors: number;
    avgTimeOnPage: string;
  }[];
  recentActivity: {
    id: number;
    action: string;
    website: string;
    time: string;
    details?: string;
  }[];
  conversionRate: number;
  revenue: number;
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    systemAlerts: boolean;
    billingAlerts: boolean;
  };
  dashboardLayout: {
    showAnalytics: boolean;
    showBilling: boolean;
    showSupport: boolean;
    showSystem: boolean;
  };
  dataRefreshInterval: number;
  defaultTimeRange: string;
}

interface DashboardData {
  analytics: Analytics;
  advancedAnalytics: AdvancedAnalytics;
  billing: Billing;
  support: SupportTicket[];
  system: SystemStatus;
  notifications: Notification[];
  settings: UserSettings;
}

interface PerformanceAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  metric: string;
  value: number;
  threshold: number;
  timestamp: string;
  status: 'active' | 'resolved';
}

interface APIService {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastChecked: string;
  endpoints: {
    path: string;
    method: string;
    status: 'operational' | 'degraded' | 'down';
    responseTime: number;
  }[];
}

interface TimeSeriesData {
  timestamp: string;
  value: number;
}

interface EnhancedSystemStatus extends SystemStatus {
  apiServices: APIService[];
  performanceAlerts: PerformanceAlert[];
  metrics: {
    cpu: TimeSeriesData[];
    memory: TimeSeriesData[];
    disk: TimeSeriesData[];
    network: {
      in: TimeSeriesData[];
      out: TimeSeriesData[];
    };
  };
}

interface EnhancedDashboardData extends Omit<DashboardData, 'analytics'> {
  analytics: AdvancedAnalytics;
}

export function useDashboard() {
  const [data, setData] = useState<EnhancedDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(false);

  // Enhanced mock data
  const mockData: DashboardData = {
    analytics: {
      totalVisitors: 1250,
      uniqueVisitors: 850,
      bounceRate: 35.5,
      avgSessionDuration: '3m 45s',
      performance: [
        {
          pageSpeed: 92,
          mobileScore: 88,
          desktopScore: 95,
          seoScore: 90,
          accessibilityScore: 85,
        },
      ],
      trafficSources: [
        { source: 'Direct', visitors: 450, percentage: 36 },
        { source: 'Organic Search', visitors: 380, percentage: 30.4 },
        { source: 'Social', visitors: 250, percentage: 20 },
        { source: 'Referral', visitors: 170, percentage: 13.6 },
      ],
      topPages: [
        { url: '/home', visitors: 450, avgTimeOnPage: '2m 30s' },
        { url: '/products', visitors: 380, avgTimeOnPage: '3m 15s' },
        { url: '/about', visitors: 250, avgTimeOnPage: '1m 45s' },
      ],
      recentActivity: [
        { 
          id: 1, 
          action: 'Page Updated', 
          website: 'My Hotel Website', 
          time: '2 hours ago',
          details: 'Updated homepage content and images'
        },
        { 
          id: 2, 
          action: 'Plugin Installed', 
          website: 'Restaurant Site', 
          time: '5 hours ago',
          details: 'Installed WooCommerce plugin'
        },
        { 
          id: 3, 
          action: 'Website Published', 
          website: 'My Hotel Website', 
          time: '1 day ago',
          details: 'Published new booking system'
        },
      ],
      conversionRate: 2.5,
      revenue: 12500,
    },
    advancedAnalytics: {
      userBehavior: {
        newUsers: 450,
        returningUsers: 800,
        userRetention: 65,
        averagePagesPerSession: 3.2,
      },
      deviceStats: {
        desktop: 55,
        mobile: 40,
        tablet: 5,
      },
      geographicData: [
        { country: 'United States', visitors: 500, percentage: 40 },
        { country: 'United Kingdom', visitors: 200, percentage: 16 },
        { country: 'Germany', visitors: 150, percentage: 12 },
        { country: 'France', visitors: 100, percentage: 8 },
        { country: 'Others', visitors: 300, percentage: 24 },
      ],
      conversionFunnel: [
        { stage: 'Visitors', visitors: 1250, conversionRate: 100 },
        { stage: 'Product Views', visitors: 800, conversionRate: 64 },
        { stage: 'Add to Cart', visitors: 400, conversionRate: 32 },
        { stage: 'Checkout', visitors: 200, conversionRate: 16 },
        { stage: 'Purchase', visitors: 100, conversionRate: 8 },
      ],
      userActivity: [
        {
          id: 'ua1',
          user: 'john.doe@example.com',
          action: 'Login',
          timestamp: '2024-03-20 12:00',
          details: 'Successful login from Chrome browser',
          type: 'login',
          ipAddress: '192.168.1.1',
          location: 'New York, US',
          device: 'Chrome on Windows',
        },
        {
          id: 'ua2',
          user: 'admin@example.com',
          action: 'System Update',
          timestamp: '2024-03-20 11:45',
          details: 'Applied security patch v2.1.0',
          type: 'system',
          ipAddress: '192.168.1.2',
          location: 'London, UK',
          device: 'Firefox on Linux',
        },
      ],
      resourceForecasts: [
        {
          metric: 'CPU Usage',
          current: 45,
          predicted: [48, 52, 55, 58],
          confidence: 0.85,
          timestamp: '2024-03-20 12:00',
        },
        {
          metric: 'Memory Usage',
          current: 60,
          predicted: [62, 65, 68, 70],
          confidence: 0.92,
          timestamp: '2024-03-20 12:00',
        },
      ],
      customWidgets: [
        {
          id: 'w1',
          type: 'metric',
          title: 'Active Users',
          data: { value: 1250, change: 12.5 },
          position: { x: 0, y: 0 },
          size: { width: 2, height: 1 },
          refreshInterval: 300,
        },
        {
          id: 'w2',
          type: 'chart',
          title: 'Revenue Trend',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            values: [1000, 1200, 1500, 1800, 2000],
          },
          position: { x: 2, y: 0 },
          size: { width: 4, height: 2 },
          refreshInterval: 600,
        },
      ],
      heatmap: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        value: Math.floor(Math.random() * 100)
      })),
      userSegments: [
        {
          segment: 'Power Users',
          users: 250,
          growth: 15.5,
          engagement: 85,
        },
        {
          segment: 'Regular Users',
          users: 500,
          growth: 8.2,
          engagement: 65,
        },
      ],
      conversionPaths: [
        {
          path: ['Home', 'Products', 'Cart', 'Checkout'],
          users: 150,
          conversionRate: 12.5,
        },
        {
          path: ['Search', 'Product', 'Cart', 'Checkout'],
          users: 200,
          conversionRate: 15.8,
        },
      ],
      performance: [
        {
          pageSpeed: 92,
          mobileScore: 88,
          desktopScore: 95,
          seoScore: 90,
          accessibilityScore: 85,
        },
      ],
      trafficSources: [
        { source: 'Direct', visitors: 450, percentage: 36 },
        { source: 'Organic Search', visitors: 380, percentage: 30.4 },
        { source: 'Social', visitors: 250, percentage: 20 },
        { source: 'Referral', visitors: 170, percentage: 13.6 },
      ],
      topPages: [
        { url: '/home', visitors: 450, avgTimeOnPage: '2m 30s' },
        { url: '/products', visitors: 380, avgTimeOnPage: '3m 15s' },
        { url: '/about', visitors: 250, avgTimeOnPage: '1m 45s' },
      ],
      recentActivity: [
        { 
          id: 1, 
          action: 'Page Updated', 
          website: 'My Hotel Website', 
          time: '2 hours ago',
          details: 'Updated homepage content and images'
        },
        { 
          id: 2, 
          action: 'Plugin Installed', 
          website: 'Restaurant Site', 
          time: '5 hours ago',
          details: 'Installed WooCommerce plugin'
        },
        { 
          id: 3, 
          action: 'Website Published', 
          website: 'My Hotel Website', 
          time: '1 day ago',
          details: 'Published new booking system'
        },
      ],
      conversionRate: 2.5,
      revenue: 12500,
    },
    billing: {
      currentPlan: 'Business',
      nextBillingDate: '2024-04-20',
      amount: 49.99,
      currency: 'USD',
      status: 'active',
      usage: {
        storage: 2.5,
        storageLimit: 10,
        bandwidth: 15,
        bandwidthLimit: 50,
        domains: 3,
        domainsLimit: 5,
        emailAccounts: 10,
        emailAccountsLimit: 20,
      },
      invoices: [
        { 
          id: 'INV-001', 
          date: '2024-03-20', 
          amount: 49.99, 
          status: 'Paid',
          items: [
            { description: 'Business Plan Subscription', amount: 49.99 }
          ]
        },
        { 
          id: 'INV-002', 
          date: '2024-02-20', 
          amount: 49.99, 
          status: 'Paid',
          items: [
            { description: 'Business Plan Subscription', amount: 49.99 }
          ]
        },
      ],
      paymentMethods: [
        {
          id: 'pm_1',
          type: 'Visa',
          last4: '4242',
          expiryDate: '12/25',
          isDefault: true,
        },
      ],
    },
    support: [
      { 
        id: 'TKT-001', 
        subject: 'Website Performance Issue', 
        description: 'Website loading time is slow on mobile devices',
        status: 'Open', 
        priority: 'High', 
        category: 'Performance',
        lastUpdated: '2 hours ago',
        createdAt: '2024-03-20 10:00',
        comments: [
          {
            id: 'c1',
            user: 'John Doe',
            content: 'Investigating the issue',
            timestamp: '2024-03-20 10:30',
          },
        ],
      },
      { 
        id: 'TKT-002', 
        subject: 'SSL Certificate Renewal', 
        description: 'SSL certificate is expiring soon',
        status: 'In Progress', 
        priority: 'Medium', 
        category: 'Security',
        lastUpdated: '1 day ago',
        createdAt: '2024-03-19 15:00',
      },
    ],
    system: {
      server: {
        status: 'operational',
        uptime: '99.99%',
        responseTime: 150,
      },
      database: {
        status: 'connected',
        size: '2.5GB',
        lastBackup: '2024-03-20 00:00',
      },
      resources: {
        cpu: 45,
        memory: 60,
        disk: 75,
        network: {
          in: 25,
          out: 15,
        },
      },
      security: {
        sslStatus: 'valid',
        sslExpiryDate: '2024-12-31',
        firewallStatus: 'active',
        lastScan: '2024-03-20 12:00',
        threatsBlocked: 150,
      },
      apiServices: [],
      performanceAlerts: [],
      metrics: {
        cpu: [],
        memory: [],
        disk: [],
        network: {
          in: [],
          out: [],
        },
      },
    },
    notifications: [
      {
        id: 'n1',
        type: 'warning',
        title: 'SSL Certificate Expiring',
        message: 'Your SSL certificate will expire in 30 days',
        timestamp: '2024-03-20 10:00',
        read: false,
        action: {
          label: 'Renew Now',
          url: '/billing/ssl',
        },
      },
      {
        id: 'n2',
        type: 'info',
        title: 'System Update Available',
        message: 'A new system update is available for installation',
        timestamp: '2024-03-19 15:00',
        read: true,
      },
      {
        id: 'n3',
        type: 'success',
        title: 'Backup Completed',
        message: 'System backup completed successfully',
        timestamp: '2024-03-19 00:00',
        read: true,
      },
    ],
    settings: {
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        systemAlerts: true,
        billingAlerts: true,
      },
      dashboardLayout: {
        showAnalytics: true,
        showBilling: true,
        showSupport: true,
        showSystem: true,
      },
      dataRefreshInterval: 300,
      defaultTimeRange: '7d',
    },
  };

  const enhancedMockData: EnhancedDashboardData = {
    ...mockData,
    analytics: {
      userBehavior: {
        newUsers: 450,
        returningUsers: 800,
        userRetention: 65,
        averagePagesPerSession: 3.2,
      },
      deviceStats: {
        desktop: 55,
        mobile: 40,
        tablet: 5,
      },
      geographicData: [
        { country: 'United States', visitors: 500, percentage: 40 },
        { country: 'United Kingdom', visitors: 200, percentage: 16 },
        { country: 'Germany', visitors: 150, percentage: 12 },
        { country: 'France', visitors: 100, percentage: 8 },
        { country: 'Others', visitors: 300, percentage: 24 },
      ],
      conversionFunnel: [
        { stage: 'Visitors', visitors: 1250, conversionRate: 100 },
        { stage: 'Product Views', visitors: 800, conversionRate: 64 },
        { stage: 'Add to Cart', visitors: 400, conversionRate: 32 },
        { stage: 'Checkout', visitors: 200, conversionRate: 16 },
        { stage: 'Purchase', visitors: 100, conversionRate: 8 },
      ],
      userActivity: [
        {
          id: 'ua1',
          user: 'john.doe@example.com',
          action: 'Login',
          timestamp: '2024-03-20 12:00',
          details: 'Successful login from Chrome browser',
          type: 'login',
          ipAddress: '192.168.1.1',
          location: 'New York, US',
          device: 'Chrome on Windows',
        },
        {
          id: 'ua2',
          user: 'admin@example.com',
          action: 'System Update',
          timestamp: '2024-03-20 11:45',
          details: 'Applied security patch v2.1.0',
          type: 'system',
          ipAddress: '192.168.1.2',
          location: 'London, UK',
          device: 'Firefox on Linux',
        },
      ],
      resourceForecasts: [
        {
          metric: 'CPU Usage',
          current: 45,
          predicted: [48, 52, 55, 58],
          confidence: 0.85,
          timestamp: '2024-03-20 12:00',
        },
        {
          metric: 'Memory Usage',
          current: 60,
          predicted: [62, 65, 68, 70],
          confidence: 0.92,
          timestamp: '2024-03-20 12:00',
        },
      ],
      customWidgets: [
        {
          id: 'w1',
          type: 'metric',
          title: 'Active Users',
          data: { value: 1250, change: 12.5 },
          position: { x: 0, y: 0 },
          size: { width: 2, height: 1 },
          refreshInterval: 300,
        },
        {
          id: 'w2',
          type: 'chart',
          title: 'Revenue Trend',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            values: [1000, 1200, 1500, 1800, 2000],
          },
          position: { x: 2, y: 0 },
          size: { width: 4, height: 2 },
          refreshInterval: 600,
        },
      ],
      heatmap: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        value: Math.floor(Math.random() * 100)
      })),
      userSegments: [
        {
          segment: 'Power Users',
          users: 250,
          growth: 15.5,
          engagement: 85,
        },
        {
          segment: 'Regular Users',
          users: 500,
          growth: 8.2,
          engagement: 65,
        },
      ],
      conversionPaths: [
        {
          path: ['Home', 'Products', 'Cart', 'Checkout'],
          users: 150,
          conversionRate: 12.5,
        },
        {
          path: ['Search', 'Product', 'Cart', 'Checkout'],
          users: 200,
          conversionRate: 15.8,
        },
      ],
      performance: [
        {
          pageSpeed: 92,
          mobileScore: 88,
          desktopScore: 95,
          seoScore: 90,
          accessibilityScore: 85,
        },
      ],
      trafficSources: [
        { source: 'Direct', visitors: 450, percentage: 36 },
        { source: 'Organic Search', visitors: 380, percentage: 30.4 },
        { source: 'Social', visitors: 250, percentage: 20 },
        { source: 'Referral', visitors: 170, percentage: 13.6 },
      ],
      topPages: [
        { url: '/home', visitors: 450, avgTimeOnPage: '2m 30s' },
        { url: '/products', visitors: 380, avgTimeOnPage: '3m 15s' },
        { url: '/about', visitors: 250, avgTimeOnPage: '1m 45s' },
      ],
      recentActivity: [
        { 
          id: 1, 
          action: 'Page Updated', 
          website: 'My Hotel Website', 
          time: '2 hours ago',
          details: 'Updated homepage content and images'
        },
        { 
          id: 2, 
          action: 'Plugin Installed', 
          website: 'Restaurant Site', 
          time: '5 hours ago',
          details: 'Installed WooCommerce plugin'
        },
        { 
          id: 3, 
          action: 'Website Published', 
          website: 'My Hotel Website', 
          time: '1 day ago',
          details: 'Published new booking system'
        },
      ],
      conversionRate: 2.5,
      revenue: 12500,
    },
    system: {
      ...mockData.system,
      apiServices: [
        {
          name: 'Authentication API',
          status: 'operational',
          responseTime: 120,
          uptime: 99.99,
          lastChecked: '2024-03-20 12:00',
          endpoints: [
            { path: '/auth/login', method: 'POST', status: 'operational', responseTime: 80 },
            { path: '/auth/register', method: 'POST', status: 'operational', responseTime: 90 },
            { path: '/auth/refresh', method: 'POST', status: 'operational', responseTime: 70 },
          ],
        },
        {
          name: 'Analytics API',
          status: 'operational',
          responseTime: 150,
          uptime: 99.95,
          lastChecked: '2024-03-20 12:00',
          endpoints: [
            { path: '/analytics/visitors', method: 'GET', status: 'operational', responseTime: 100 },
            { path: '/analytics/conversion', method: 'GET', status: 'operational', responseTime: 120 },
          ],
        },
      ],
      performanceAlerts: [
        {
          id: 'pa1',
          type: 'warning',
          metric: 'CPU Usage',
          value: 85,
          threshold: 80,
          timestamp: '2024-03-20 11:45',
          status: 'active',
        },
        {
          id: 'pa2',
          type: 'error',
          metric: 'Memory Usage',
          value: 95,
          threshold: 90,
          timestamp: '2024-03-20 11:30',
          status: 'active',
        },
      ],
      metrics: {
        cpu: Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
          value: Math.floor(Math.random() * 30) + 40,
        })),
        memory: Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
          value: Math.floor(Math.random() * 20) + 50,
        })),
        disk: Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
          value: Math.floor(Math.random() * 10) + 70,
        })),
        network: {
          in: Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
            value: Math.floor(Math.random() * 20) + 15,
          })),
          out: Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
            value: Math.floor(Math.random() * 15) + 10,
          })),
        },
      },
    },
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData(enhancedMockData);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateMetrics = useCallback(() => {
    if (!data || !realTimeUpdates) return;

    setData((prev) => {
      if (!prev) return null;

      const now = new Date().toISOString();
      const newMetrics = {
        ...prev.system.metrics,
        cpu: [
          ...prev.system.metrics.cpu.slice(1),
          { timestamp: now, value: Math.floor(Math.random() * 30) + 40 },
        ],
        memory: [
          ...prev.system.metrics.memory.slice(1),
          { timestamp: now, value: Math.floor(Math.random() * 20) + 50 },
        ],
        disk: [
          ...prev.system.metrics.disk.slice(1),
          { timestamp: now, value: Math.floor(Math.random() * 10) + 70 },
        ],
        network: {
          in: [
            ...prev.system.metrics.network.in.slice(1),
            { timestamp: now, value: Math.floor(Math.random() * 20) + 15 },
          ],
          out: [
            ...prev.system.metrics.network.out.slice(1),
            { timestamp: now, value: Math.floor(Math.random() * 15) + 10 },
          ],
        },
      };

      return {
        ...prev,
        system: {
          ...prev.system,
          metrics: newMetrics,
        },
      };
    });
  }, [data, realTimeUpdates]);

  const toggleRealTimeUpdates = () => {
    setRealTimeUpdates((prev) => !prev);
  };

  const resolvePerformanceAlert = async (alertId: string) => {
    try {
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          system: {
            ...prev.system,
            performanceAlerts: prev.system.performanceAlerts.map((alert) =>
              alert.id === alertId ? { ...alert, status: 'resolved' } : alert
            ),
          },
        };
      });
    } catch (err) {
      throw new Error('Failed to resolve performance alert');
    }
  };

  const checkAPIStatus = async () => {
    try {
      // Simulate API status check
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          system: {
            ...prev.system,
            apiServices: prev.system.apiServices.map((service) => ({
              ...service,
              lastChecked: new Date().toISOString(),
              responseTime: Math.floor(Math.random() * 50) + 100,
              endpoints: service.endpoints.map((endpoint) => ({
                ...endpoint,
                responseTime: Math.floor(Math.random() * 30) + 50,
              })),
            })),
          },
        };
      });
    } catch (err) {
      throw new Error('Failed to check API status');
    }
  };

  const refreshData = () => {
    return fetchData();
  };

  const createSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'lastUpdated' | 'createdAt'>) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newTicket: SupportTicket = {
        ...ticket,
        id: `TKT-${Math.floor(Math.random() * 1000)}`,
        lastUpdated: 'Just now',
        createdAt: new Date().toISOString(),
      };
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          support: [newTicket, ...prev.support],
        };
      });
      return newTicket;
    } catch (err) {
      throw new Error('Failed to create support ticket');
    }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicket['status']) => {
    try {
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          support: prev.support.map((ticket) =>
            ticket.id === ticketId
              ? { ...ticket, status, lastUpdated: 'Just now' }
              : ticket
          ),
        };
      });
    } catch (err) {
      throw new Error('Failed to update ticket status');
    }
  };

  const addTicketComment = async (ticketId: string, comment: Omit<TicketComment, 'id' | 'timestamp'>) => {
    try {
      const newComment: TicketComment = {
        ...comment,
        id: `c${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
      };
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          support: prev.support.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  comments: [...(ticket.comments || []), newComment],
                  lastUpdated: 'Just now',
                }
              : ticket
          ),
        };
      });
    } catch (err) {
      throw new Error('Failed to add comment');
    }
  };

  const updateSettings = async (settings: Partial<UserSettings>) => {
    try {
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          settings: {
            ...prev.settings,
            ...settings,
          },
        };
      });
    } catch (err) {
      throw new Error('Failed to update settings');
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          notifications: prev.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          ),
        };
      });
    } catch (err) {
      throw new Error('Failed to mark notification as read');
    }
  };

  const exportReport = async (type: 'analytics' | 'billing' | 'support' | 'system', format: 'csv' | 'pdf') => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return `Report exported successfully in ${format} format`;
    } catch (err) {
      throw new Error('Failed to export report');
    }
  };

  const updateCustomWidget = async (widgetId: string, data: any) => {
    try {
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          analytics: {
            ...prev.analytics,
            customWidgets: prev.analytics.customWidgets.map((widget) =>
              widget.id === widgetId ? { ...widget, data } : widget
            ),
          },
        };
      });
    } catch (err) {
      throw new Error('Failed to update custom widget');
    }
  };

  const addCustomWidget = async (widget: Omit<CustomWidget, 'id'>) => {
    try {
      const newWidget: CustomWidget = {
        ...widget,
        id: `w${Math.floor(Math.random() * 1000)}`,
      };
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          analytics: {
            ...prev.analytics,
            customWidgets: [...prev.analytics.customWidgets, newWidget],
          },
        };
      });
      return newWidget;
    } catch (err) {
      throw new Error('Failed to add custom widget');
    }
  };

  const removeCustomWidget = async (widgetId: string) => {
    try {
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          analytics: {
            ...prev.analytics,
            customWidgets: prev.analytics.customWidgets.filter(
              (widget) => widget.id !== widgetId
            ),
          },
        };
      });
    } catch (err) {
      throw new Error('Failed to remove custom widget');
    }
  };

  const updateWidgetPosition = async (widgetId: string, position: { x: number; y: number }) => {
    try {
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          analytics: {
            ...prev.analytics,
            customWidgets: prev.analytics.customWidgets.map((widget) =>
              widget.id === widgetId ? { ...widget, position } : widget
            ),
          },
        };
      });
    } catch (err) {
      throw new Error('Failed to update widget position');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (realTimeUpdates) {
      const interval = setInterval(updateMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [realTimeUpdates, updateMetrics]);

  useEffect(() => {
    const interval = setInterval(checkAPIStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    analytics: data?.analytics,
    advancedAnalytics: data?.advancedAnalytics,
    billing: data?.billing,
    support: data?.support,
    system: data?.system,
    notifications: data?.notifications,
    settings: data?.settings,
    loading,
    error,
    realTimeUpdates,
    refreshData,
    createSupportTicket,
    updateTicketStatus,
    addTicketComment,
    updateSettings,
    markNotificationAsRead,
    exportReport,
    toggleRealTimeUpdates,
    resolvePerformanceAlert,
    checkAPIStatus,
    updateCustomWidget,
    addCustomWidget,
    removeCustomWidget,
    updateWidgetPosition,
  };
} 