import { ProfileLayout } from 'components/layout';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';
import { ForestList } from 'components/forest';
import { useCurrentUser } from 'lib/auth/currentUser';
import Head from 'next/head';
import { useState } from 'react';

const ProfileMyForestsPage = () => {
  const { currentUser } = useCurrentUser();
  const [forestsCount, setForestsCount] = useState();

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
        <Text>You haven't create any forest yet. What are you waiting for?</Text>
      }
      <ForestList className="grid md:grid-cols-2 gap-md" filter={{ founderId: { eq: currentUser.id } }} setTotalCount={setForestsCount}/>
    </>
  );
};

ProfileMyForestsPage.Layout = ProfileLayout;

export default ProfileMyForestsPage;