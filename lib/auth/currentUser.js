import { useQuery, gql } from '@apollo/client';

/**
 * Self query
 * @type {gql}
 */
const QUERY_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      _id
      email
    }
  }
`;

/**
 * Use current user
 * @return {User}
 */
const useCurrentUser = () => {
  const { data } = useQuery(QUERY_CURRENT_USER);

  return data?.currentUser;
}

export { useCurrentUser };