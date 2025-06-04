import { Metadata } from 'next';
import SignInForm from '@/components/auth/SignInForm';

export const metadata: Metadata = {
  title: 'Sign In - Website Builder',
  description: 'Sign in to your account',
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  return (
    <div className="flex flex-col justify-center items-center h-full min-h-[60vh] w-full">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/auth/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </a>
          </p>
        </div>
        <SignInForm callbackUrl={searchParams.from} />
      </div>
    </div>
  );
} 