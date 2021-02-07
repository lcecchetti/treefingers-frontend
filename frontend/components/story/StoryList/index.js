import { Link, Spinner, Text } from 'components/ui';
import { getExcerpt, getStoryUrl } from 'lib/helper/story';
import { formatDate } from 'lib/helper/date';
import { gql, useQuery } from '@apollo/client';
import { FaHeart, FaRegHeart } from 'react-icons/fa';


/**
 * Story fields fragment
 * @type {gql}
 */
export const FRAGMENT_STORIES_STORY = gql`
  fragment StoryFields on Story {
    id
      title
      content
      slug
      createdAt
      author {
        id
        username
      }
  }
`;

/**
 * Story list query
 * @type {gql}
 */
export const QUERY_STORIES = gql`
  query stories($author: ID) {
    stories(where: { author: $author }) {
      ...StoryFields
    }
  }
  ${FRAGMENT_STORIES_STORY}
`;


const StoryList = ({ titleVariant = 'pageTitle', variables }) => {
  const { data, loading, error } = useQuery(QUERY_STORIES, { variables });

  return (
    <div className="">
      <Text variant={titleVariant}>Stories</Text>

      {loading && <Spinner />}

      {error && <Text variant="span" className="text-error">{error}</Text>}

      {data?.stories && data.stories.map((story) => (
        <div key={story.id} className="">
          <div>
            <Text variant="h3"><Link href={getStoryUrl(story)} underline={false}>{story.title}</Link></Text>
            <Text variant="span">Written by {story.author.username} on {formatDate(story.createdAt)}</Text>
          </div>
          <div>
            <Text variant="p">{getExcerpt(story)}</Text>
          </div>
          <div>
            <FaRegHeart className="text-xl" />
            <Link href={getStoryUrl(story)}>Read more</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryList;

