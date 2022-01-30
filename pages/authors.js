import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { AuthorList } from 'components/author';
import { QUERY_AUTHORS } from 'components/author/AuthorList';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';

const AuthorsPage = () => {
  return (
    <Container>
      <PageIntro>
        <Text variant="pageTitle">Authors</Text>
        <Text variant="p">Looking for the next Hemingway? Getting warmer...</Text>
      </PageIntro>
      <AuthorList />
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_AUTHORS,
  },);

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

AuthorsPage.Layout = DefaultLayout;

export default AuthorsPage;