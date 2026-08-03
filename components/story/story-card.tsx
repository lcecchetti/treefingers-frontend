'use client';

import { Link, Text, Button } from '@/components/ui';
import { useFormattedDate, DATE_SHORT } from '@/lib/helper/date';
import { getStoryUrl } from '@/lib/helper/story';
import { Avatar } from '@/components/user';
import { StoryActions, type StoryActionsStory } from '@/components/story/story-actions';
import { cn } from '@/lib/utils';
import { TagList } from '@/components/tag';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface StoryCardStory extends StoryActionsStory {
  parent?: { id: string } | null;
  createdAt: string;
  author: { id: string; username: string };
  excerpt: string;
  tags: string[];
}

interface StoryCardProps {
  className?: string;
  story: StoryCardStory;
}

export const StoryCard = ({ className, story }: StoryCardProps) => {
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
