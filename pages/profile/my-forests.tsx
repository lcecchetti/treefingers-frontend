import { ProfileLayout } from 'components/layout';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';
import { ForestList } from 'components/forest';
import { useCurrentUser } from 'lib/auth/currentUser';
import Head from 'next/head';
import { useState } from 'react';
import type { NextPageWithLayout } from 'lib/types/next';

const ProfileMyForestsPage: NextPageWithLayout = () => {
  const { currentUser } = useCurrentUser();
  const [forestsCount, setForestsCount] = useState<number>();

  return (
    <>
      <PageIntro>
        <Head>
          <title>My forests - Treefingers</title>
        </Head>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">My forests</Text>
        </div>
        <Text variant="p">
          Here is a list of the forests you've created.
        </Text>
      </PageIntro>
      {forestsCount === 0 &&
        <Text>You haven't created any forest yet. What are you waiting for?</Text>
      }
      <ForestList className="grid md:grid-cols-2 grid-cols-1 gap-md" filter={{ founder: { eq: currentUser!.id } }} setTotalCount={setForestsCount}/>
    </>
  );
};

ProfileMyForestsPage.Layout = ProfileLayout;

export default ProfileMyForestsPage;
