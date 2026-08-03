'use client';

import { Spinner, Text, Button, Link } from '@/components/ui';
import { useQuery } from '@apollo/client';
import { StoryList } from '@/components/story';
import { ApiError, PageIntro } from '@/components/common';
import { Pencil, Sprout, X } from 'lucide-react';
import { ForestActions } from '@/components/forest/forest-actions';
import { getStoryNewUrl } from '@/lib/helper/story';
import { useCurrentUser } from '@/lib/auth/current-user';
import { useState } from 'react';
import { ForestNew } from './forest-new';
import { QUERY_FOREST } from './forest-view.query';

interface ForestViewProps {
  className?: string;
  forest: { id: string; storiesCount: number };
}

export const ForestView = ({ className, forest }: ForestViewProps) => {
  const { currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  const { data, loading, error } = useQuery(QUERY_FOREST, {
    variables: {
      filter: { id: { eq: forest.id } },
    },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  return (
    <div className={className}>
      <Spinner loading={loading}/>
      <ApiError error={error ?? false}/>

      {data?.forest &&
        <>
          {!isEditing &&
            <>
              <PageIntro>
                <div className="flex justify-between gap-sm flex-col md:flex-row md:items-center">
                  <div className="flex gap-md justify-start items-center">
                    <Text variant="pageTitle" className="break-words">{data.forest.name}</Text>
                    {data.forest.isEditable &&
                      <Pencil className="w-5 h-5 cursor-pointer" onClick={() => setIsEditing(true)} />
                    }
                  </div>

                  <div className="flex gap-md justify-between">
                    <Button as={Link} icon={Sprout} href={getStoryNewUrl(data.forest)}>Plant</Button>
                    <ForestActions forest={data.forest} />
                  </div>
                </div>
                <Text variant="p" className="whitespace-pre-wrap break-words w-full">{data.forest.about}</Text>
              </PageIntro>
              {forest.storiesCount === 0 &&
                <Text>I see too much blank space on this page, let's plant some stories!</Text>
              }
              <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ forest: { eq: data.forest.id } }} sort={{ likesCount: 'DESC' }} setTotalCount={undefined} />
            </>
          }

          {isEditing &&
            <div className="flex flex-col gap-md w-full my-md">
              <div className="flex gap-md justify-between items-center">
                <Text variant="h2">Edit your forest</Text>
                <X className="w-5 h-5 cursor-pointer" onClick={() => setIsEditing(false)} />
              </div>
              <ForestNew className="w-full" forest={data.forest} callback={() => setIsEditing(false)} />
            </div>
          }
        </>
      }
    </div>
  );
};
