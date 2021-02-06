import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { AuthorList, QUERY_AUTHORS } from 'components/author';
import { initializeApollo, addApolloState } from 'lib/apollo/client';

const AuthorsPage = () => {
  return (
    <Container>
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