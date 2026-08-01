import { ProfileLayout } from '@/components/layout';
import { useCurrentUser } from '@/lib/auth/current-user';
import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { Logout } from '@/components/profile';
import Head from 'next/head';
import { NotificationList } from '@/components/notification';
import type { NextPageWithLayout } from '@/lib/types/next';

const ProfileMePage: NextPageWithLayout = () => {
  const { currentUser } = useCurrentUser();

  return (
    <>
      <PageIntro>
        <Head>
          <title>My profile - Treefingers</title>
        </Head>
        <div className="flex flex-col md:flex-row gap-sm justify-between">
          <Text variant="pageTitle">{`Welcome ${currentUser!.username}!`}</Text>
          <Logout/>
        </div>
        <Text variant="p">Here you'll find updates regarding your stories, forests and anything relevant to you.</Text>
      </PageIntro>

      <NotificationList/>
    </>
  );
};

ProfileMePage.Layout = ProfileLayout;

export default ProfileMePage;
