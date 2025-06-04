export const BUSINESS_TYPE_PRESETS = {
  restaurant: {
    theme: 'gourmet',
    plugins: ['booking', 'menu', 'reviews', 'seoTools', 'analytics'],
    pages: ['home', 'menu', 'booking', 'about', 'contact'],
  },
  ecommerce: {
    theme: 'modernShop',
    plugins: ['cart', 'payments', 'seoTools', 'analytics'],
    pages: ['home', 'shop', 'cart', 'checkout', 'contact'],
  },
  portfolio: {
    theme: 'creativePortfolio',
    plugins: ['gallery', 'contactForm', 'seoTools', 'analytics'],
    pages: ['home', 'portfolio', 'about', 'contact'],
  },
}; 