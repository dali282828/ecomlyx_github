export const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 9,
    currency: 'USD',
    storageLimitMB: 2048, // 2GB
    trafficLimitGB: 50,   // 50GB
    sites: 1,
    users: 1,
    features: [
      '1 WordPress site',
      '2GB storage',
      '50GB traffic/month',
      'Basic support',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    currency: 'USD',
    storageLimitMB: 10240, // 10GB
    trafficLimitGB: 200,   // 200GB
    sites: 3,
    users: 5,
    features: [
      'Up to 3 WordPress sites',
      '10GB storage',
      '200GB traffic/month',
      'Priority support',
      'Custom domains',
    ],
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 99,
    currency: 'USD',
    storageLimitMB: 51200, // 50GB
    trafficLimitGB: 1000,  // 1TB
    sites: 10,
    users: 20,
    features: [
      'Up to 10 WordPress sites',
      '50GB storage',
      '1TB traffic/month',
      '24/7 support',
      'Custom domains',
      'White-label',
    ],
  },
}; 