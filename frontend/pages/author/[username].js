import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { AuthorView, QUERY_AUTHORS, QUERY_AUTHOR, QUERY_AUTHORS_BY_USERNAME } from 'components/author';
import { QUERY_STORIES } from 'components/story';

const AuthorPage = ({ author }) => {
  return (
    <Container>
      <AuthorView id={author.id} />
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load author by username
  const { data } = await apolloClient.query({
    query: QUERY_AUTHORS_BY_USERNAME,
    variables: { username: params.username },
  });

  // check if author exists
  if (!data.users.length) {
    return {
      notFound: true,
    }
  }

  const author = data.users[0];

  // add author by id query to the cache
  apolloClient.writeQuery({
    query: QUERY_AUTHOR,
    data: { user: author },
    variables: { id: author.id },
  });

  // add author stories query to the cache
  apolloClient.writeQuery({
    query: QUERY_STORIES,
    data: { stories: author.stories },
    variables: { author: author.id },
  });

  return addApolloState(apolloClient, {
    props: { author },
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({ query: QUERY_AUTHORS });

  return {
    paths: data.users.map((user) => ({ params: { username: user.username } })) || [],
    fallback: 'blocking',
  };
}

AuthorPage.Layout = DefaultLayout;

export default AuthorPage;