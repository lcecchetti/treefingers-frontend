import { ProfileLayout } from 'components/layout';
import { gql, useQuery } from '@apollo/client';

/**
 * Self query
 * @type {gql}
 */
const QUERY_DATA = gql`
  query self {
    self {
      id
      username
    }
  }
`;

const ProfileMePage = () => {
  const { data, loading } = useQuery(QUERY_DATA);

  return (
    <div>
      Profile me
    </div>
  );
};

ProfileMePage.Layout = ProfileLayout;

export default ProfileMePage;