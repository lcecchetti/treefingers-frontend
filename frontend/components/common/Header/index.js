import { Container, Link, Button } from 'components/ui';
import { Logo } from 'components/common';
import { gql, useQuery } from '@apollo/client';

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
    <Container>
      <div className="flex flex-row items-center justify-between my-md">
        <Logo main className="bold" />
        <ul className="flex flex-row">
          <li className="mx-xs">
            <Button as={Link} href={data ? '/profile/me' : '/auth/login'}>
              {data &&
                `Welcome, ${data.self?.username}!`
              }

              {!data &&
                'Login'
              }
            </Button>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default Header;