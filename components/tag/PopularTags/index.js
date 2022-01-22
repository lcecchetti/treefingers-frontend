import { Spinner } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { ApiError } from 'components/common';
import { Text } from 'components/ui';
import { TagList } from 'components/tag';

/**
 * Authors list query
 * @type {gql}
 */
export const QUERY_TAGS_POPULAR = gql`
  query tags {
    tags (sort: { storiesCount: DESC }, pagination: { pageSize: 10 }) {
      edges {
        node {
          _id
          label
          slug
        }
      }
    }
  }
`;

const PopularTags = ({ className }) => {
  const { data, loading, error } = useQuery(QUERY_TAGS_POPULAR);

  return (
    <div className={clsx('flex flex-col gap-sm', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      <TagList tags={data?.tags.edges.map(({ node }) => node)} />
    </div>
  );
};

export default PopularTags;

