import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Providers } from './providers';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopNav from '@/components/TopNav';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ecomlyx - Create Your Business Website',
  description: 'Create a professional business website in minutes with our easy-to-use platform. No coding required.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use a hook to get the current path
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <ChakraProvider>
            <Box minH="100vh" display="flex" flexDirection="column">
              {/* Only show TopNav on dashboard pages, Header on public/auth pages */}
              {isDashboard ? <TopNav /> : null}
              <Box flex="1">
                {children}
              </Box>
              {/* Only show Footer on non-auth pages */}
              {!isAuthPage && <Footer />}
            </Box>
          </ChakraProvider>
        </Providers>
      </body>
    </html>
  );
} 