import { notFound } from 'next/navigation';
import { ChangePasswordForm } from '@/components/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change password | Treefingers',
};

interface ChangePasswordPageProps {
  params: Promise<{ token?: string }>;
}

export default async function ChangePasswordPage({ params }: ChangePasswordPageProps) {
  const { token } = await params;
  if (!token) notFound();

  return (
    <div className="flex justify-center items-center min-h-screen-no-header">
      <ChangePasswordForm token={token} />
    </div>
  );
}
