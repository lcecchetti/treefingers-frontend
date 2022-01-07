import { useQuery, gql } from '@apollo/client';

/**
 * Self query
 * @type {gql}
 */
export const QUERY_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      email
      username
    }
  }
`;

/**
 * Use current user
 * @return {User}
 */
export const useCurrentUser = () => {
  const { data } = useQuery(QUERY_CURRENT_USER);
  return data?.currentUser;
}
