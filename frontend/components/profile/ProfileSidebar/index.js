import navData from './navData';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';

/**
 * Self query
 * @type {gql}
 */
const QUERY_SELF = gql`
  query self {
    self {
      id
      firstName
      lastName
    }
  }
`;

const ProfileSidebar = () => {
  const { data } = useQuery(QUERY_SELF);

  return (
    <div>
      <h6>Welcome, {data?.self?.firstName} {data?.self?.lastName}!</h6>
      <div>
        <nav>
          <ul>
            {navData.map((item, index) => (
              <li key={index}>
                <Link href={item.href}><a>{item.label}</a></Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProfileSidebar;