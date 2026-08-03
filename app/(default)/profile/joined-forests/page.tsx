'use client';

import { Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { useState } from 'react';
import { ForestList } from '@/components/forest';

export default function JoinedForestsPage() {
  const [forestsCount, setForestsCount] = useState<number>();

  return (
    <>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Forests you've joined</Text>
        </div>
        <Text variant="p">
          Here is a list of the forests you're member of.
        </Text>
      </PageIntro>
      {forestsCount === 0 &&
        <Text>You haven't joined any forest yet. What are you waiting for?</Text>
      }
      <ForestList className="grid md:grid-cols-2 grid-cols-1 gap-md" filter={{ joined: true }} setTotalCount={setForestsCount}/>
    </>
  );
}
