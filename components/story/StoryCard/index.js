import { Link, Text } from 'components/ui';
import { formatDate, DATE_SHORT } from 'lib/helper/date';
import { getStoryUrl } from 'lib/helper/story';
import { Avatar } from 'components/user';
import { StoryActions } from 'components/story';
import clsx from 'clsx';
import { gql } from '@apollo/client';
import { TagList } from 'components/tag';

/**
 * Story card fields
 * @type gql
 */
 export const FRAGMENT_STORY_CARD_FIELDS = gql`
  fragment StoryCardFields on Story {
    _id
    title
    excerpt
    createdAt
    root {
      _id
    }
    author {
      _id
      email
      username
    }
    tags
    likesCount
    commentsCount
    currentUserLike {
      _id
    }  
  }
`;

const StoryCard = ({ className, story }) => {  
  return (
    <div className={clsx('rounded-xl p-md bg-primary text-primary-contrast flex flex-col gap-xs', className)}>
      <div className="flex justify-between items-center">
        <Text variant="span" className="text-sm">
          {formatDate(story.createdAt, DATE_SHORT)}
        </Text>
        <Avatar className="justify-end" user={story.author} showName={true} />
      </div>

      <div>
        <Text variant="title">
          <Link href={getStoryUrl(story)}>{story.title}</Link>
        </Text>
        <Text variant="p">{story.excerpt}</Text>
        <Link href={getStoryUrl(story)}>Read more</Link>
      </div>

      <div className="flex justify-between items-center gap-md">
        <TagList className="flex-wrap my-xs md:my-sm" tags={story.tags} buttonVariant="primary-contrast" />
        <StoryActions story={story} />
      </div>
    </div>
  );
};

export default StoryCard;

