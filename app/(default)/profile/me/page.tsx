'use client';

import { useCurrentUser } from '@/lib/auth/current-user';
import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { Logout } from '@/components/profile';
import { NotificationList } from '@/components/notification';

export default function ProfileMePage() {
  const { currentUser } = useCurrentUser();

  return (
    <PageIntro>
      <div className="flex flex-col md:flex-row gap-sm justify-between">
        <Text variant="pageTitle">{`Welcome ${currentUser!.username}!`}</Text>
        <Logout/>
      </div>
      <Text variant="p">Here you'll find updates regarding your stories, forests and anything relevant to you.</Text>
      <NotificationList/>
    </PageIntro>
  );
}
