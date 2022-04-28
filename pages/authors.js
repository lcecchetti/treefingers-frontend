import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { AuthorList, QUERY_AUTHORS } from 'components/user';

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
      <AuthorList sort={{ followersCount: 'DESC' }} />
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_AUTHORS,
    variables: { first: 10, sort: { followersCount: 'DESC' } },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

AuthorsPage.Layout = DefaultLayout;

export default AuthorsPage;