import { ProfileLayout } from '@/components/layout';
import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { UserEditForm } from '@/components/user';
import Head from 'next/head';
import type { NextPageWithLayout } from '@/lib/types/next';

const ProfileDetailsPage: NextPageWithLayout = () => {
  return (
    <>
      <PageIntro>
        <Head>
          <title>My details - Treefingers</title>
        </Head>
        <Text variant="pageTitle">My details</Text>
        <Text variant="p">Here you can edit your profile details.</Text>
      </PageIntro>
      <UserEditForm/>
    </>
  );
};

ProfileDetailsPage.Layout = ProfileLayout;

export default ProfileDetailsPage;
