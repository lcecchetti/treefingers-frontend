import { Spinner, Text, Link, Container, Button } from '@/components/ui';
import { useFormattedDate, DATE_LONG } from '@/lib/helper/date';
import { getStoryUrl, isStoryRoot } from '@/lib/helper/story';
import { useQuery } from '@apollo/client';
import { graphql } from '@/lib/graphql/generated';
import { FaAngleUp, FaAngleDoubleUp, FaTimes } from 'react-icons/fa';
import { Avatar } from '@/components/user';
import { StoryChapters } from '@/components/story/story-chapters';
import { StoryActions } from '@/components/story/story-actions';
import { ApiError } from '@/components/common';
import { TagList } from '@/components/tag';
import { StoryTree, type StoryTreeStory } from './story-tree';
import clsx from 'clsx';
import { getForestUrl } from '@/lib/helper/forest';
import { useCurrentUser } from '@/lib/auth/current-user';
import { FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import { StoryNew } from '@/components/story/story-new';

export const QUERY_STORY = graphql(`
  query story($filter: FilterStoryInput!) {
    story(filter: $filter) {
      __typename
      id
      title
      content
      excerpt
      createdAt
      author {
        id
        username
      }
      tags
      parent {
        id
      }
      root {
        id
        title
        likesCount
        descendentsCount
      }
      forest {
        id
        name
      }
      likesCount
      commentsCount
      descendentsCount
      childrenCount
      currentUserLike {
        id
      }
      isEditable
    }
  }
`);

interface StoryViewProps {
  className?: string;
  story: { id: string };
}

export const StoryView = ({ className, story }: StoryViewProps) => {
  const { currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  const { data, loading, error } = useQuery(QUERY_STORY, {
    variables: {
      filter: { id: { eq: story.id } },
    },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  const createdAt = useFormattedDate(data!.story!.createdAt, DATE_LONG);

  return (
    <div className={clsx('flex flex-col gap-md', className)}>
        <Spinner loading={loading}/>
        <ApiError error={error ?? false}/>

        <div className="relative flex flex-col gap-md lg:min-h-screen overflow-hidden">
          <Container className="flex justify-end">
            <div className="w-full lg:w-1/2 z-10 mb-xl">
              {isEditing &&
                <div className="flex flex-col gap-md w-full">
                  <div className="flex gap-md justify-between items-center">
                    <Text variant="h2">Edit your story</Text>
                    <FaTimes className="text-xl cursor-pointer" onClick={() => setIsEditing(false)} />
                  </div>
                  <StoryNew className="w-full" story={data!.story!} callback={() => setIsEditing(false)} />
                </div>
              }

              {!isEditing &&
                <div className="flex flex-col gap-md">
                  {data!.story &&
                    <div className="text-center flex justify-around items-center">
                      {!isStoryRoot(data!.story!) &&
                        <>
                          <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(data!.story!.parent!)} icon={FaAngleUp}>Prev chapter</Button>
                          <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(data!.story!.root!)} icon={FaAngleDoubleUp}>Back to root</Button>
                        </>
                      }
                      {data!.story!.forest &&
                        <Button as={Link} variant="outlined" size="sm" href={getForestUrl(data!.story!.forest)} icon={FaAngleDoubleUp}>Back to forest</Button>
                      }
                    </div>
                  }

                  <div className="flex flex-col gap-md">
                    <div className="flex justify-between items-center">
                      <Text variant="span">{createdAt}</Text>
                      <Avatar user={data!.story!.author} showName={true} />
                    </div>

                    <div className="flex gap-md justify-start items-center">
                      <Text variant="storyTitle" className="break-words">{data!.story!.title}</Text>
                      {data!.story!.isEditable &&
                        <FaEdit className="text-lg cursor-pointer" onClick={() => setIsEditing(true)} />
                      }
                    </div>
                    <Text variant="p" className="whitespace-pre-wrap break-words w-full">{data!.story!.content}</Text>

                    <div className="flex justify-between items-center">
                      <TagList tags={data!.story!.tags} />
                      <StoryActions className="lg:hidden" story={data!.story!} />
                      <StoryActions className="hidden lg:flex" story={data!.story!} disabledActions={{ tree: true }} />
                    </div>
                  </div>

                  <StoryChapters parent={data!.story!} />
                </div>
              }
            </div>
          </Container>

          <StoryTree story={(data?.story ?? undefined) as StoryTreeStory | undefined} className="hidden lg:block h-screen w-full lg:fixed top-0 left-0 lg:-left-1/4" />
        </div>
    </div>
  );
};
