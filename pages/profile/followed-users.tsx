import { ProfileLayout } from 'components/layout';
import { Text } from 'components/ui';
import { PageIntro } from 'components/common';
import Head from 'next/head';
import { useState } from 'react';
import { UserList } from 'components/user';
import type { NextPageWithLayout } from 'lib/types/next';

const FollowedUsersPage: NextPageWithLayout = () => {
  const [usersCount, setUsersCount] = useState<number>();

  return (
    <>
      <PageIntro>
        <Head>
          <title>Followed users - Treefingers</title>
        </Head>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Users you follow</Text>
        </div>
        <Text variant="p">
          Here is a list of the users you're following.
        </Text>
      </PageIntro>
      {usersCount === 0 &&
        <Text>You haven't followed any user yet. What are you waiting for?</Text>
      }
      <UserList className="grid md:grid-cols-2 grid-cols-1 gap-md" filter={{ followed: true }} setTotalCount={setUsersCount}/>
    </>
  );
};

FollowedUsersPage.Layout = ProfileLayout;

export default FollowedUsersPage;
