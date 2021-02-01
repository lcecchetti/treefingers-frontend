import { Container, Link, Text } from 'components/ui';
import { Logo } from 'components/common';
import { gql, useQuery } from '@apollo/client';
import { FaSearch, FaPenFancy, FaUserCircle } from 'react-icons/fa';

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

const Header = () => {

  const { data } = useQuery(QUERY_SELF);

  return (
    <div className="absolute w-full h-header bg-base">
      <Container>
        <div className="flex items-center justify-between my-md">
          <Logo main className="font-bold" />

          <ul className="hidden sm:flex flex-row gap-xl">
            <li>
              <Link href="/stories" underline={false}><Text variant="span" className="font-bold text-lg">ALL STORIES</Text></Link>
            </li>
            <li>
              <Link href="/stories/pop" underline={false}><Text variant="span" className="font-bold text-lg">POP</Text></Link>
            </li>
            <li>
              <Link href="/stories/new" underline={false}><Text variant="span" className="font-bold text-lg">NEW</Text></Link>
            </li>
          </ul>

          <ul className="flex flex-row gap-sm sm:gap-md">
            <li>
              <Link href="/story/search"><FaSearch className="text-xl md:text-2xl"/></Link>
            </li>
            <li>
              <Link href="/story/create"><FaPenFancy className="text-xl md:text-2xl"/></Link>
            </li>
            <li>
              <Link href={data ? '/profile/me' : '/auth/login'}><FaUserCircle className="text-xl md:text-2xl"/></Link>
            </li>
          </ul>
        </div>
      </Container>
    </div>

  );
};

export default Header;