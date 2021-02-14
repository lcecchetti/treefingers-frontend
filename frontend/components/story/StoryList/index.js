import { Link, Spinner, Text } from 'components/ui';
import { getStoryUrl } from 'lib/helper/story';
import { formatDate, DATE_SHORT } from 'lib/helper/date';
import { gql, useQuery } from '@apollo/client';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { TagList } from 'components/tag';
import { Avatar } from 'components/user';
import clsx from 'clsx';

/**
 * Story list query
 * @type {gql}
 */
export const QUERY_STORIES = gql`
  query stories($where: JSON) {
    stories(where: $where) {
      id
      title
      excerpt
      slug
      createdAt
      author {
        id
        username
      }
      tags {
        id
        label
        slug
      }
      root {
        id 
        slug
      }
    }
  }
`;

/**
 * Default query variables
 * @type {Object}
 */
export const defaultQueryStoriesVariables = {
  where: {
    parent_null: true,
  }
}


const StoryList = ({ className, queryVariables }) => {
  const { data, loading, error } = useQuery(QUERY_STORIES, { variables: { ...defaultQueryStoriesVariables, ...queryVariables } });

  return (
    <div className={clsx('grid md:grid-cols-2 gap-md', className)}>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data?.stories && data.stories.map((story) => (
        <div key={story.id} className="rounded-xl p-md bg-primary text-primary-contrast">
          
          <div className="flex justify-between mb-md">
            <Text variant="span" className="text-sm">
              {formatDate(story.createdAt, DATE_SHORT)}
            </Text>
            <FaRegHeart className="text-xl" />
          </div>

          <div className="mb-md md:mb-sm">
            <Text variant="title">
              <Link href={getStoryUrl(story)} underline={false}>{story.title}</Link>
            </Text>
            <Text variant="p">{story.excerpt}</Text>
            <Link href={getStoryUrl(story)}>Read more</Link>
          </div>
        
          <div className="flex flex-col md:flex-row md:justify-between gap-sm md:gap-md">
            <TagList className="flex-wrap my-xs md:my-sm" tags={story.tags} buttonVariant="primary-contrast" />
            <Avatar className="justify-end" user={story.author} showName={true} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryList;

