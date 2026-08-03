'use client';

import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { ForestList } from '@/components/forest';
import { useCurrentUser } from '@/lib/auth/current-user';
import { useState } from 'react';

export default function ProfileMyForestsPage() {
  const { currentUser } = useCurrentUser();
  const [forestsCount, setForestsCount] = useState<number>();

  return (
    <>
      <PageIntro>
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
}
