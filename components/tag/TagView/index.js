import { Spinner, Text } from 'components/ui';
import { ApiError, PageIntro } from 'components/common';
import { gql, useQuery } from '@apollo/client';
import { StoryList } from 'components/story';
import clsx from 'clsx';

/**
 * Single tag query
 * @type {gql}
 */
export const QUERY_TAG = gql`
  query tag($filter: FilterTagInput!) {
    tag(filter: $filter) {
      _id
      label
      slug
      storiesCount
    }
  }
`;

const TagView = ({ className, _id }) => {

  const { data, loading, error } = useQuery(QUERY_TAG, { variables: { filter: { _id: { eq: _id } } } });

  return (
    <div className={clsx(className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {data &&
        <div>
          <PageIntro title={data.tag.label}>
          <Text variant="p">Into {data.tag.label}? This might be the place you are looking for.</Text>
          </PageIntro>
          <StoryList filter={{ tags: { in: [data.tag._id] } }} />
        </div>
      }
    </div>
  );
};

export default TagView;

