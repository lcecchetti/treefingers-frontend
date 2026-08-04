'use client';

import { Text, Link, Container, Button } from '@/components/ui';
import { useFormattedDate, DATE_LONG } from '@/lib/helper/date';
import { getStoryUrl, isStoryRoot } from '@/lib/helper/story';
import { useSuspenseQuery } from '@apollo/client/react';
import { ChevronUp, ChevronsUp, X, Pencil } from 'lucide-react';
import { Avatar } from '@/components/user';
import { StoryChapters } from '@/components/story/story-chapters';
import { StoryActions } from '@/components/story/story-actions';
import { ApiError } from '@/components/common';
import { TagList } from '@/components/tag';
import { StoryTree, type StoryTreeStory } from './story-tree';
import { cn } from '@/lib/utils';
import { getForestUrl } from '@/lib/helper/forest';
import { useCurrentUser } from '@/lib/auth/current-user';
import { useState } from 'react';
import { StoryNew } from '@/components/story/story-new';
import { QUERY_STORY } from './story-view.query';

interface StoryViewProps {
  className?: string;
  story: { id: string };
}

export const StoryView = ({ className, story }: StoryViewProps) => {
  const { currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  const { data, error } = useSuspenseQuery(QUERY_STORY, {
    variables: {
      filter: { id: { eq: story.id } },
    },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    errorPolicy: 'all',
  });

  // useFormattedDate must run every render regardless of data presence (rules of hooks);
  // feed it a valid placeholder date rather than '' (which date-fns throws on) — the
  // formatted result is only ever rendered inside the `data?.story &&` guard below.
  const createdAt = useFormattedDate(data?.story?.createdAt ?? new Date(0).toISOString(), DATE_LONG);

  return (
    <div className={cn('flex flex-col gap-md', className)}>
        <ApiError error={error ?? false}/>

        <div className="relative flex flex-col gap-md lg:min-h-screen overflow-hidden">
          <Container className="flex justify-end">
            <div className="w-full lg:w-1/2 z-10 mb-xl">
              {isEditing && data?.story &&
                <div className="flex flex-col gap-md w-full">
                  <div className="flex gap-md justify-between items-center">
                    <Text variant="h2">Edit your story</Text>
                    <X className="w-5 h-5 cursor-pointer" onClick={() => setIsEditing(false)} />
                  </div>
                  <StoryNew className="w-full" story={data.story} callback={() => setIsEditing(false)} />
                </div>
              }

              {!isEditing &&
                <div className="flex flex-col gap-md">
                  {data?.story &&
                    <>
                      <div className="text-center flex justify-around items-center">
                        {!isStoryRoot(data.story) &&
                          <>
                            <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(data.story.parent!)} icon={ChevronUp}>Prev chapter</Button>
                            <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(data.story.root!)} icon={ChevronsUp}>Back to root</Button>
                          </>
                        }
                        {data.story.forest &&
                          <Button as={Link} variant="outlined" size="sm" href={getForestUrl(data.story.forest)} icon={ChevronsUp}>Back to forest</Button>
                        }
                      </div>

                      <div className="flex flex-col gap-md">
                        <div className="flex justify-between items-center">
                          <Text variant="span">{createdAt}</Text>
                          <Avatar user={data.story.author} showName={true} />
                        </div>

                        <div className="flex gap-md justify-start items-center">
                          <Text variant="storyTitle" className="break-words">{data.story.title}</Text>
                          {data.story.isEditable &&
                            <Pencil className="w-5 h-5 cursor-pointer" onClick={() => setIsEditing(true)} />
                          }
                        </div>
                        <Text variant="p" className="whitespace-pre-wrap break-words w-full">{data.story.content}</Text>

                        <div className="flex justify-between items-center">
                          <TagList tags={data.story.tags} />
                          <StoryActions className="lg:hidden" story={data.story} />
                          <StoryActions className="hidden lg:flex" story={data.story} disabledActions={{ tree: true }} />
                        </div>
                      </div>

                      <StoryChapters parent={data.story} />
                    </>
                  }
                </div>
              }
            </div>
          </Container>

          <StoryTree story={(data?.story ?? undefined) as StoryTreeStory | undefined} className="hidden lg:block h-screen w-full lg:fixed top-0 left-0 lg:-left-1/4" />
        </div>
    </div>
  );
};
