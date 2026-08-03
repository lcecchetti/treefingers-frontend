import { RegisterForm } from '@/components/auth';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Register | Treefingers',
};

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
      <Suspense fallback={null}>
        <RegisterForm/>
      </Suspense>
    </div>
  );
}
