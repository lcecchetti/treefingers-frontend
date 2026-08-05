'use client';

import { Text, Container } from '@/components/ui';
import { DATE_LONG } from '@/lib/helper/date';
import { useFormattedDate } from '@/lib/helper/use-formatted-date';
import { useSuspenseQuery } from '@apollo/client/react';
import { X } from 'lucide-react';
import { StoryChapters } from '@/components/story/story-chapters';
import { ApiError } from '@/components/common';
import { StoryTree, type StoryTreeStory } from './story-tree';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/lib/auth/current-user';
import { useState } from 'react';
import { StoryNew } from '@/components/story/story-new';
import { StoryContent, StoryContent_StoryFragment } from './story-content';
import { QUERY_STORY } from './story-view.query';
import { useFragment } from '@/lib/graphql/generated';

interface StoryViewProps {
  className?: string;
  storyId: string;
}

export const StoryView = ({ className, storyId }: StoryViewProps) => {
  const { currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  const { data, error } = useSuspenseQuery(QUERY_STORY, {
    variables: {
      filter: { id: { eq: storyId } },
    },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    errorPolicy: 'all',
  });

  const story = useFragment(StoryContent_StoryFragment, data?.story);

  // useFormattedDate must run every render regardless of data presence (rules of hooks);
  // feed it a valid placeholder date rather than '' (which date-fns throws on) — the
  // formatted result is only ever rendered inside the `story &&` guard below.
  const createdAt = useFormattedDate(story?.createdAt ?? new Date(0).toISOString(), DATE_LONG);

  return (
    <div className={cn('flex flex-col gap-md', className)}>
        <ApiError error={error ?? false}/>

        <div className="relative flex flex-col gap-md lg:min-h-screen overflow-hidden">
          <Container className="flex justify-end">
            <div className="w-full lg:w-1/2 z-10 mb-xl">
              {isEditing && story &&
                <div className="flex flex-col gap-md w-full">
                  <div className="flex gap-md justify-between items-center">
                    <Text variant="h2">Edit your story</Text>
                    <X className="w-5 h-5 cursor-pointer" onClick={() => setIsEditing(false)} />
                  </div>
                  <StoryNew className="w-full" story={story} callback={() => setIsEditing(false)} />
                </div>
              }

              {!isEditing &&
                <div className="flex flex-col gap-md">
                  {story &&
                    <>
                      <StoryContent story={story} createdAt={createdAt} onEdit={() => setIsEditing(true)} />
                      <StoryChapters parent={story} />
                    </>
                  }
                </div>
              }
            </div>
          </Container>

          <StoryTree story={(story ?? undefined) as StoryTreeStory | undefined} className="hidden lg:block h-screen w-full lg:fixed top-0 left-0 lg:-left-1/4" />
        </div>
    </div>
  );
};
