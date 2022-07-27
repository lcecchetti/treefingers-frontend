import { ProfileLayout } from 'components/layout';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';
import { UserEditForm } from 'components/user';
import Head from 'next/head';

const ProfileDetailsPage = () => {
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