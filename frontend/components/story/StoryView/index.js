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

  return (
    <div className="">
      {loading && <Spinner />}

      {error && <Text variant="span" className="text-error">{error}</Text>}

      {data &&
        <div className="">
          <div>
            <Text variant="pageTitle">{data.story.title}</Text>
            <Text variant="span">Written by {data.story.author.username} on {formatDate(data.story.createdAt)}</Text>
          </div>
          <div>
            <Text variant="p">{data.story.content}</Text>
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

