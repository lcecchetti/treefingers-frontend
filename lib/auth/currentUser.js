import { useQuery, gql } from '@apollo/client';

export const QUERY_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      email
      username
    }
  }
`;

export const useCurrentUser = () => {
  const { data, loading } = useQuery(QUERY_CURRENT_USER);
  return { currentUser: data?.currentUser, loading };
}
