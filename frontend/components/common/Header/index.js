import { Container, Link, Text } from 'components/ui';
import { Logo } from 'components/common';
import { gql, useQuery } from '@apollo/client';
import { FaMoon, FaSun, FaSearch, FaPenFancy, FaUserCircle } from 'react-icons/fa';
import { useTheme } from 'next-themes';

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

  const { theme, setTheme } = useTheme();
  const { data } = useQuery(QUERY_SELF);

  return (
    <div className="absolute w-full h-header bg-base">
      <Container>
        <div className="flex items-center justify-between my-md">
          <Logo main className="font-bold" />

          <ul className="hidden sm:flex flex-row gap-xl">
            <li>
              <Link href="/stories" underline={false}><Text variant="span" className="font-bold text-lg">STORIES</Text></Link>
            </li>
            <li>
              <Link href="/authors" underline={false}><Text variant="span" className="font-bold text-lg">AUTHORS</Text></Link>
            </li>
          </ul>

          <ul className="flex flex-row gap-sm sm:gap-md">
            <li>
              <Link href="/#"><FaSearch className="text-xl md:text-2xl"/></Link>
            </li>
            <li>
              <Link href="/story/new"><FaPenFancy className="text-xl md:text-2xl"/></Link>
            </li>
            <li>
              <a href="#" className="hover:text-primary-light" onClick={() => {console.log('clicked'); theme === 'dark' ? setTheme('light') : setTheme('dark'); }}>
                {theme === 'dark' && <FaMoon className="text-xl md:text-2xl"/>}
                {theme !== 'dark' && <FaSun className="text-xl md:text-2xl"/>}
              </a>
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