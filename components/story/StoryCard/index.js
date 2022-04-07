import { Link, Text, Button } from 'components/ui';
import { formatDate, DATE_SHORT } from 'lib/helper/date';
import { getStoryUrl } from 'lib/helper/story';
import { Avatar } from 'components/user';
import StoryActions from 'components/story/StoryActions';
import clsx from 'clsx';
import { TagList } from 'components/tag';

const StoryCard = ({ className, story, isChapterChoice }) => {
  return (
    <div className={clsx('rounded-2xl p-md bg-primary text-primary-contrast flex flex-col gap-md justify-between', className)}>
      <div className="flex justify-between items-center">
        <Text variant="span" className="text-sm">
          {formatDate(story.createdAt, DATE_SHORT)}
        </Text>
        <Avatar className="justify-end" user={story.author} showName={true} />
      </div>

      <div className={clsx(
        'flex flex-col items-center gap-md grow',
        {
          ['px-lg']: isChapterChoice,
        })
      }>
        <Text variant="title">{story.title}</Text>
        {!isChapterChoice &&
          <Text variant="p">{story.excerpt}</Text>
        }
        <Button as={Link} href={getStoryUrl(story)} variant="primary-contrast">{isChapterChoice ? 'Select' : 'Read More'}</Button>
      </div>

      <div className="flex justify-between items-center gap-md">
        <TagList className="flex-wrap" tags={story.tags} buttonVariant="primary-contrast" />
        <StoryActions story={story} disabledActions={{ tree: isChapterChoice }} />
      </div>
    </div>
  );
};

export default StoryCard;

