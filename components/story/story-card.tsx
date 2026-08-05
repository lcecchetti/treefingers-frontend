'use client';

import { Link, Text, Button } from '@/components/ui';
import { DATE_SHORT } from '@/lib/helper/date';
import { useFormattedDate } from '@/lib/helper/use-formatted-date';
import { getStoryUrl } from '@/lib/helper/story';
import { Avatar } from '@/components/user';
import { StoryActions } from '@/components/story/story-actions';
import { cn } from '@/lib/utils';
import { TagList } from '@/components/tag';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { graphql, useFragment, type FragmentType } from '@/lib/graphql/generated';

// colocated with the component that owns it - see components/forest/forest-card.tsx
// for why `useFragment` here is safe to call from either a Server or Client Component
export const StoryCard_StoryFragment = graphql(`
  fragment StoryCard_story on Story {
    __typename
    id
    title
    excerpt
    createdAt
    depth
    parent {
      id
      likesCount
      descendantsCount
    }
    author {
      id
      username
    }
    tags
    likesCount
    commentsCount
    descendantsCount
    childrenCount
    currentUserLike {
      id
    }
  }
`);

interface StoryCardProps {
  className?: string;
  story: FragmentType<typeof StoryCard_StoryFragment>;
}

export const StoryCard = ({ className, story: storyRef }: StoryCardProps) => {
  const story = useFragment(StoryCard_StoryFragment, storyRef);
  const isChapter = !!story.parent;
  const createdAt = useFormattedDate(story.createdAt, DATE_SHORT);

  return (
    <Card className={cn('bg-primary text-primary-contrast', className)}>
      <CardHeader>
        <Text variant="span" className="text-sm">{createdAt}</Text>
        <Avatar className="justify-end" size="sm" user={story.author} showName={true} />
      </CardHeader>

      <CardContent className={cn({
          ['px-lg']: isChapter,
        })
      }>
        <Link href={getStoryUrl(story)} className="w-full">
          <Text variant="title" className="break-words text-center">{story.title}</Text>
        </Link>
        {!isChapter &&
          <Text variant="p" className="break-words w-full text-center">{story.excerpt}</Text>
        }
        <Button as={Link} href={getStoryUrl(story)} variant="primary-contrast">{isChapter ? 'Select' : 'Read More'}</Button>
      </CardContent>

      <CardFooter>
        <TagList className="max-h-[36px] overflow-hidden" tags={story.tags} buttonVariant="primary-contrast" />
        <StoryActions story={story} disabledActions={{ tree: isChapter }} />
      </CardFooter>
    </Card>
  );
};
