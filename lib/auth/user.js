import { useQuery, gql } from '@apollo/client';

/**
 * Self query
 * @type {gql}
 */
const QUERY_SELF = gql`
  query self {
    self {
      id
      username
    }
  }
`;

/**
 * Use current user
 * @return {User}
 */
const useUser = () => {
  const { data } = useQuery(QUERY_SELF);

  return data?.self;
}

export { useUser };