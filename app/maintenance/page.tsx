import { Logo } from '@/components/common';
import { Text } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance | Treefingers',
};

export default function MaintenancePage() {
  return (
    <div className="flex flex-col gap-md p-lg justify-center items-center fixed h-full w-full">
      <Logo />
      <Text variant="h2">Hey, we are watering your stories!</Text>
      <Text variant="p">No worries, we'll be back soon</Text>
    </div>
  );
}
