import { Spinner, Text } from 'components/ui';
import { formatDate } from 'lib/helper/date';
import { gql, useQuery } from '@apollo/client';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { TagList } from 'components/tag';

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


const StoryView = ({ id, titleVariant = 'pageTitle' }) => {

  const { data, loading, error } = useQuery(QUERY_STORY, { variables: { id } });

  return (
    <div className="">
      {loading && <Spinner />}

      {error && <Text variant="span" className="text-error">{error}</Text>}

      {data &&
        <div className="">
          <div>
            <Text variant={titleVariant}>{data.story.title}</Text>
            <Text variant="span">Written by {data.story.author.username} on {formatDate(data.story.createdAt)}</Text>
          </div>
          <div>
            <Text variant="p">{data.story.content}</Text>
          </div>
          <div>
            <TagList tags={data.story.tags} />
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

