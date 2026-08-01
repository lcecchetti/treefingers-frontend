import { useQuery } from '@apollo/client';
import { graphql } from '@/lib/graphql/generated';

export const QUERY_CURRENT_USER = graphql(`
  query currentUser {
    currentUser {
      id
      email
      username
    }
  }
`);

export const useCurrentUser = () => {
  const { data, loading } = useQuery(QUERY_CURRENT_USER);
  return { currentUser: data?.currentUser, loading };
};
