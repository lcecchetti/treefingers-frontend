import { Logout } from '@/components/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logout | Treefingers',
};

export default function LogoutPage() {
  return <Logout />;
}
