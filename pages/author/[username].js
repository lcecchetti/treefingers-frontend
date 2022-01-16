import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { AuthorView, QUERY_AUTHORS, QUERY_AUTHOR } from 'components/author';
import { QUERY_STORIES } from 'components/story';

const AuthorPage = ({ author }) => {
  return (
    <Container>
      <AuthorView _id={author._id} />
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();
  
  // load author by username
  const { data } = await apolloClient.query({
    query: QUERY_AUTHOR,
    variables: { filter: { username: { eq: params.username } } },
  });

  // check if author exists
  if (!data?.user) {
    return {
      notFound: true,
    }
  }

  // add author by id query to the cache
  apolloClient.writeQuery({
    query: QUERY_AUTHOR,
    data: { user: data.user },
    variables: { filter: { _id: { eq: data.user._id } } },
  });

  // load author stories
  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { author: { eq: data.user._id }, root: null } },
  });

  return addApolloState(apolloClient, {
    props: { author: data.user },
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({ query: QUERY_AUTHORS });

  return {
    paths: data?.users?.edges.map(({ node }) => ({ params: { username: node.username } })) || [],
    fallback: 'blocking',
  };
}

AuthorPage.Layout = DefaultLayout;

export default AuthorPage;