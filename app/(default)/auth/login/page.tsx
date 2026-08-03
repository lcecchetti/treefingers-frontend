import { LoginForm } from '@/components/auth';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login | Treefingers',
};

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
      <Suspense fallback={null}>
        <LoginForm/>
      </Suspense>
    </div>
  );
}
