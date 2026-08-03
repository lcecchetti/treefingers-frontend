import { notFound } from 'next/navigation';
import { ActivateAccount } from '@/components/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activate account | Treefingers',
};

interface ActivateAccountPageProps {
  params: Promise<{ token?: string }>;
}

export default async function ActivateAccountPage({ params }: ActivateAccountPageProps) {
  const { token } = await params;
  if (!token) notFound();

  return <ActivateAccount token={token} />;
}
