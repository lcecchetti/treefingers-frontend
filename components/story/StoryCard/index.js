import { Link, Text, Button } from 'components/ui';
import { formatDate, DATE_SHORT } from 'lib/helper/date';
import { getStoryUrl } from 'lib/helper/story';
import { Avatar } from 'components/user';
import StoryActions from 'components/story/StoryActions';
import clsx from 'clsx';
import { TagList } from 'components/tag';

const StoryCard = ({ className, story }) => {
  return (
    <div className={clsx('rounded-xl p-md bg-primary text-primary-contrast flex flex-col gap-lg justify-between', className)}>
      <div className="flex justify-between items-center">
        <Text variant="span" className="text-sm">
          {formatDate(story.createdAt, DATE_SHORT)}
        </Text>
        <Avatar className="justify-end" user={story.author} showName={true} />
      </div>

      <div className="flex flex-col items-center gap-xs px-lg grow">
        <Link href={getStoryUrl(story)}>
          <Text variant="title">{story.title}</Text>
        </Link>
        {!story.root &&
          <Text variant="p">{story.excerpt}</Text>
        }
        <Button as={Link} href={getStoryUrl(story)} variant="primary-contrast">Read more</Button>
      </div>

      <div className="flex justify-between items-center gap-md">
        <TagList className="flex-wrap my-xs md:my-sm" tags={story.tags} buttonVariant="primary-contrast" />
        <StoryActions story={story} />
      </div>
    </div>
  );
};

export default StoryCard;

