import { useEffect } from 'react';
import { Spinner } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { ApiError } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { FRAGMENT_FOREST_CARD_FIELDS } from 'components/forest/ForestCard';
import ForestCard from '../ForestCard';

/**
 * Forests list query
 * @type {gql}
 */
export const QUERY_FORESTS = gql`
  query forests($filter: FilterForestInput) {
    forests(filter: $filter) {
      edges {
        node {
          ...ForestCardFields
        }
      }
    }
  }
  ${FRAGMENT_FOREST_CARD_FIELDS}
`;

const ForestList = ({ className }) => {
  const currentUser = useCurrentUser();
  const { data, loading, error, refetch } = useQuery(QUERY_FORESTS);

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  return (
    <div className={clsx('grid md:grid-cols-4 gap-md', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {data?.forests && data.forests.edges.map(({ node }) => (
        <ForestCard key={node._id} forest={node} />
      ))}
    </div>
  );
};

export default ForestList;

