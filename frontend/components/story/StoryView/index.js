import { Link, Spinner, Text } from 'components/ui';
import { getStoryUrl } from 'lib/helper/story';
import { formatDate } from 'lib/helper/date';
import { gql, useQuery } from '@apollo/client';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

/**
 * Single story query
 * @type {gql}
 */
export const QUERY_STORY = gql`
  query story($id: ID!) {
    story(id: $id) {
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
  }
`;

/**
 * Single story by slug query
 * @type {gql}
 */
export const QUERY_STORY_BY_SLUG = gql`
  query storyBySlug($slug: String!) {
    storyBySlug(slug: $slug) {
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
  }
`;


const StoryView = ({ id }) => {

  const { data, loading, error } = useQuery(QUERY_STORY, { variables: { id } });

  //@todo it should load the story from cache and not from network. Apparently it works only if using the very same query
  console.log(data);

  const story = data?.story;

  return (
    <div className="">
      {loading && <Spinner />}

      {error && <Text variant="span" className="text-error">{error}</Text>}

      {story &&
        <div className="">
          <div>
            <Text variant="h3"><Link href={getStoryUrl(story)} underline={false}>{story.title}</Link></Text>
            <Text variant="span">Written by {story.author.username} on {formatDate(story.createdAt)}</Text>
          </div>
          <div>
            <Text variant="p">{story.content}</Text>
          </div>
          <div>
            <FaRegHeart className="text-xl" />
          </div>
        </div>
      }
    </div>
  );
};

export default StoryView;

