import { Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import clsx from 'clsx';

/**
 * Author fragment
 * @type {gql}
 */
const FRAGMENT_TAG = gql`
  fragment TagFields on Tag {
    id
    label
    slug
    stories {
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
  }
`;

/**
 * Single tag query
 * @type {gql}
 */
export const QUERY_TAG = gql`
  query tag($id: ID!) {
    tag(id: $id) {
      ...TagFields
    }
  }
  ${FRAGMENT_TAG}
`;

/**
 * Get authors by username query
 * @type {gql}
 */
export const QUERY_TAGS_BY_SLUG = gql`
  query tags($slug: String!) {
    tags(where: { slug: $slug }) {
      ...TagFields
    }
  }
  ${FRAGMENT_TAG}
`;

const TagView = ({ className, id }) => {

  const { data, loading, error } = useQuery(QUERY_TAG, { variables: { id } });

  return (
    <div className={clsx(className)}>
      {loading && <Spinner />}

      {error && <Text variant="span" className="text-error">{error}</Text>}

      {data &&
        <div className="">
          <StoryList queryVariables={{ tag: data.tag.id }} />
        </div>
      }
    </div>
  );
};

export default TagView;

