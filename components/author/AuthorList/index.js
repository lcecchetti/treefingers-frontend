import { useEffect } from 'react';
import { Spinner } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { ApiError } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { FRAGMENT_AUTHOR_CARD_FIELDS } from 'components/author/AuthorCard';
import { AuthorCard } from 'components/author';

/**
 * Authors list query
 * @type {gql}
 */
export const QUERY_AUTHORS = gql`
  query users($filter: FilterUserInput) {
    users (filter: $filter) {
      edges {
        node {
          ...AuthorCardFields
        }
      }
    }
  }
  ${FRAGMENT_AUTHOR_CARD_FIELDS}
`;

const AuthorList = ({ className }) => {
  const currentUser = useCurrentUser();
  const { data, loading, error, refetch } = useQuery(QUERY_AUTHORS);

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser !== null) {
      refetch();
    }
  }, [currentUser]);

  return (
    <div className={clsx('grid md:grid-cols-4 gap-md', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {data?.users && data.users.edges.map(({ node }) => (
        <AuthorCard key={node._id} author={node} />
      ))}
    </div>
  );
};

export default AuthorList;

