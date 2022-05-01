import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { UserList, QUERY_USERS } from 'components/user';

const AuthorsPage = () => {
  return (
    <Container>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Authors</Text>
        </div>
        <Text variant="p">
          Here is a list of popular authors.
        </Text>
      </PageIntro>
      <UserList className="grid gap-md xl:grid-cols-3 md:grid-cols-2" filter={{ storiesCount: { gt: 0 } }}  sort={{ followersCount: 'DESC' }} />
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_USERS,
    variables: { filter: { storiesCount: { gt: 0 } }, first: 10, sort: { followersCount: 'DESC' } },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

AuthorsPage.Layout = DefaultLayout;

export default AuthorsPage;