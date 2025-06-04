import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - 10Web Clone',
  description: 'Login to your account to manage your websites',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 