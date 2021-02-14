import { Spinner, Text } from 'components/ui';
import { DATE_LONG, formatDate } from 'lib/helper/date';
import { gql, useQuery } from '@apollo/client';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { TagList } from 'components/tag';
import { Avatar } from 'components/user';

/**
 * Story fragment
 * @type {gql}
 */
const FRAGMENT_STORY = gql`
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
    tags {
      id
      label
      slug
    }
    root {
      id
      slug
    }
    parent {
      id
      slug
    }
    children {
      id
      action
      slug
    }
  }
`;

/**
 * Single story query
 * @type {gql}
 */
export const QUERY_STORY = gql`
  query story($id: ID!) {
    story(id: $id) {
      ...StoryFields
    }
  }
  ${FRAGMENT_STORY}
`;

/**
 * Get stories by slug query
 * @type {gql}
 */
export const QUERY_STORIES_BY_SLUG = gql`
  query stories($slug: String!) {
    stories(where: { slug: $slug }) {
      ...StoryFields
    }
  }
  ${FRAGMENT_STORY}
`;


const StoryView = ({ id }) => {

  const { data, loading, error } = useQuery(QUERY_STORY, { variables: { id } });

  return (
    <div>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data &&
        <div className="md:my-md">
          <div className="flex justify-between items-center mb-xs">
            <Text variant="span">{formatDate(data.story.createdAt, DATE_LONG)}</Text>
            <Avatar user={data.story.author} showName={true} />
          </div>
          <div className="mb-md">
            <Text variant="storyViewTitle">{data.story.title}</Text>
            <Text variant="p">{data.story.content}</Text>
          </div>
          <div className="flex justify-between">
            <FaRegHeart className="text-xl" />
            <TagList tags={data.story.tags} />
          </div>
        </div>
      }
    </div>
  );
};

export default StoryView;

