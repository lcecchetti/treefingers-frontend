'use client';

import { Text } from '@/components/ui';
import { useSuspenseQuery } from '@apollo/client/react';
import { StoryList } from '@/components/story';
import { ApiError } from '@/components/common';
import { X } from 'lucide-react';
import { useCurrentUser } from '@/lib/auth/current-user';
import { useState } from 'react';
import { ForestNew } from './forest-new';
import { ForestContent, ForestContent_ForestFragment } from './forest-content';
import { QUERY_FOREST } from './forest-view.query';
import { useFragment } from '@/lib/graphql/generated';

interface ForestViewProps {
  className?: string;
  forestId: string;
}

export const ForestView = ({ className, forestId }: ForestViewProps) => {
  const { currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  const { data, error } = useSuspenseQuery(QUERY_FOREST, {
    variables: {
      filter: { id: { eq: forestId } },
    },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    errorPolicy: 'all',
  });

  const forest = useFragment(ForestContent_ForestFragment, data?.forest);

  return (
    <div className={className}>
      <ApiError error={error ?? false}/>

      {forest &&
        <>
          {!isEditing &&
            <>
              <ForestContent forest={forest} onEdit={() => setIsEditing(true)} />
              <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ forest: { eq: forest.id } }} sort={{ likesCount: 'DESC' }} setTotalCount={undefined} />
            </>
          }

          {isEditing &&
            <div className="flex flex-col gap-md w-full my-md">
              <div className="flex gap-md justify-between items-center">
                <Text variant="h2">Edit your forest</Text>
                <X className="w-5 h-5 cursor-pointer" onClick={() => setIsEditing(false)} />
              </div>
              <ForestNew className="w-full" forest={forest} callback={() => setIsEditing(false)} />
            </div>
          }
        </>
      }
    </div>
  );
};
