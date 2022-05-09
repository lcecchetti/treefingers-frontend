import { Link, Text, Button } from 'components/ui';
import { formatDate, DATE_SHORT } from 'lib/helper/date';
import { getStoryUrl } from 'lib/helper/story';
import { Avatar } from 'components/user';
import StoryActions from 'components/story/StoryActions';
import clsx from 'clsx';
import { TagList } from 'components/tag';
import { Card, CardBody, CardFooter, CardHeader } from 'components/common';

const StoryCard = ({ className, story }) => {
  const isChapter = !!story.root;
  return (
    <Card className={clsx('bg-primary text-primary-contrast', className)}>
      <CardHeader>
        <Text variant="span" className="text-sm">
          {formatDate(story.createdAt, DATE_SHORT)}
        </Text>
        <Avatar className="justify-end" user={story.author} showName={true} />
      </CardHeader>

      <CardBody className={clsx({
          ['px-lg']: isChapter,
        })
      }>
        <Text variant="title">{story.title}</Text>
        {!isChapter &&
          <Text variant="p">{story.excerpt}</Text>
        }
        <Button as={Link} href={getStoryUrl(story)} variant="primary-contrast">{isChapter ? 'Select' : 'Read More'}</Button>
        <TagList className="flex-wrap" tags={story.tags} buttonVariant="primary-contrast" />
      </CardBody>

      <CardFooter>
        <div></div>
        <StoryActions story={story} disabledActions={{ tree: isChapter }} />
      </CardFooter>
    </Card>
  );
};

export default StoryCard;

