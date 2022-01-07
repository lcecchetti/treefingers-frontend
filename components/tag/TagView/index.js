import { Spinner, Text } from 'components/ui';
import { ApiError, PageIntro } from 'components/common';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import clsx from 'clsx';

/**
 * Author fragment
 * @type {gql}
 */
const FRAGMENT_TAG = gql`
  fragment TagFields on Tag {
    _id
    label
    slug
  }
`;

/**
 * Single tag query
 * @type {gql}
 */
export const QUERY_TAG = gql`
  query tag($_id: ID!) {
    tag(filter: { _id: { eq: $_id } }) {
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
    tags(filter: { slug: { eq: $slug } }) {
      ...TagFields
    }
  }
  ${FRAGMENT_TAG}
`;

const TagView = ({ className, _id }) => {

  const { data, loading, error } = useQuery(QUERY_TAG, { variables: { _id } });

  return (
    <div className={clsx(className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {data &&
        <div>
          <PageIntro title={data.tag.label}>
          <Text variant="p">Into {data.tag.label}? This might be the place you are looking for.</Text>
          </PageIntro>
          <StoryList filter={{ tags: tag._id, root: { eq: null } }} />
        </div>
      }
    </div>
  );
};

export default TagView;

