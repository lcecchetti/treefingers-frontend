import { ForgotPasswordForm } from '@/components/auth';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Forgot password | Treefingers',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
      <Suspense fallback={null}>
        <ForgotPasswordForm/>
      </Suspense>
    </div>
  );
}
